/* AOTO2 共通部品: DOM作成・保存・音・読み上げ */
(function () {
  "use strict";
  var A = (window.A = {});
  var SVGNS = "http://www.w3.org/2000/svg";

  /* h("div", {class:"x", onclick:fn}, "text", child) / h("svg:circle", {...}) */
  A.h = function h(tag, attrs) {
    var svg = tag.indexOf("svg:") === 0;
    var el = svg
      ? document.createElementNS(SVGNS, tag.slice(4))
      : document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k.indexOf("on") === 0 && typeof v === "function") {
          el.addEventListener(k.slice(2), v);
        } else if (k === "style" && typeof v === "object") {
          Object.keys(v).forEach(function (s) {
            el.style.setProperty(s, v[s]);
          });
        } else if (k === "class") {
          el.setAttribute("class", v);
        } else {
          el.setAttribute(k, v === true ? "" : String(v));
        }
      });
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  };
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) return c.forEach(function (x) { add(el, x); });
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  A.clear = function (el) {
    while (el.firstChild) el.removeChild(el.firstChild);
    return el;
  };

  /* ---------- 保存 ---------- */
  var KEY = "aoto2:v1";
  function defaults() {
    return {
      v: 1,
      name: "",
      pets: [{ kind: 0, name: "", food: 0, done: false }],
      active: 0,
      streak: { n: 0, last: null },
      days: {},
      skills: {},
      log: [],
      settings: { voice: true, sound: true },
      course: {},
      ranges: [],
      write: {},
      bag: 0,
      foes: {},
      first: true,
    };
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var o = JSON.parse(raw);
        var d = defaults();
        Object.keys(d).forEach(function (k) {
          if (o[k] === undefined) o[k] = d[k];
        });
        return o;
      }
    } catch (e) {}
    return defaults();
  }
  A.S = load();
  A.save = function () {
    try {
      localStorage.setItem(KEY, JSON.stringify(A.S));
    } catch (e) {}
  };
  /* 記録がブラウザに消されにくいよう お願いし、閉じる直前にも保存する */
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
  try {
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") A.save(); });
    window.addEventListener("pagehide", function () { A.save(); });
  } catch (e) {}
  A.reset = function () {
    A.S = defaults();
    A.save();
  };
  A.dayKey = function (d) {
    d = d || new Date();
    var m = d.getMonth() + 1,
      day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  };
  A.daysBetween = function (a, b) {
    var pa = a.split("-"), pb = b.split("-");
    var da = Date.UTC(+pa[0], +pa[1] - 1, +pa[2]);
    var db = Date.UTC(+pb[0], +pb[1] - 1, +pb[2]);
    return Math.round((db - da) / 86400000);
  };

  /* ---------- 乱数 ---------- */
  A.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  /* ---------- 効果音 (WebAudio。外部ファイルなし) ---------- */
  var ctx = null;
  function audio() {
    if (!ctx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      try { ctx = new C(); } catch (e) { return null; }
    }
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    return ctx;
  }
  function tone(freq, start, dur, type, gain) {
    var c = audio();
    if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    var t0 = c.currentTime + start;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.18, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  var SFX = {
    tap: [[660, 0, 0.07, "triangle"]],
    ok: [[523, 0, 0.12], [659, 0.1, 0.12], [784, 0.2, 0.22]],
    ng: [[330, 0, 0.16, "triangle"], [294, 0.14, 0.22, "triangle"]],
    good: [[523, 0, 0.1], [659, 0.09, 0.1], [784, 0.18, 0.1], [1047, 0.27, 0.3]],
    levelup: [[523, 0, 0.12], [659, 0.12, 0.12], [784, 0.24, 0.12], [1047, 0.36, 0.12], [1319, 0.5, 0.4]],
    pop: [[880, 0, 0.05, "square", 0.08], [1175, 0.05, 0.08, "square", 0.08]],
  };
  A.sfx = function (name) {
    if (!A.S.settings.sound) return;
    (SFX[name] || []).forEach(function (n) { tone(n[0], n[1], n[2], n[3], n[4]); });
    if (navigator.vibrate && (name === "ok" || name === "good" || name === "levelup")) {
      try { navigator.vibrate(30); } catch (e) {}
    }
  };

  /* ---------- 読み上げ ---------- */
  A.reading = function (t) {
    return String(t)
      .replace(/[●■◆○□▲▼★☆]+/g, " ")
      .replace(/(\d+)\s*\/\s*(\d+)/g, function (_, a, b) { return b + "ぶんの" + a; })
      .replace(/×/g, " かける ")
      .replace(/÷/g, " わる ")
      .replace(/[＝=]/g, " イコール ")
      .replace(/[＋+]/g, " たす ")
      .replace(/(^|[\s(（×÷＝=＋+、,])\s*[−－-]\s*(?=\d)/g, function (_, p) { return p + "マイナス"; })
      .replace(/[−－-]/g, " ひく ")
      .replace(/→/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };
  var voiceCache = null;
  function jaVoice() {
    if (!window.speechSynthesis) return null;
    if (voiceCache) return voiceCache;
    var vs = speechSynthesis.getVoices() || [];
    for (var i = 0; i < vs.length; i++) {
      if (/^ja/i.test(vs[i].lang)) { voiceCache = vs[i]; break; }
    }
    return voiceCache;
  }
  if (window.speechSynthesis && speechSynthesis.addEventListener) {
    speechSynthesis.addEventListener("voiceschanged", function () { voiceCache = null; });
  }
  A.canSpeak = function () { return !!window.speechSynthesis && !!window.SpeechSynthesisUtterance; };
  var keep = null; // 読み上げ中の utterance を保持(消えて止まるのを防ぐ)
  function say(text, lang, rate, pitch, voice) {
    var ss = window.speechSynthesis;
    try {
      if (ss.speaking || ss.pending) ss.cancel();
      if (ss.paused) ss.resume();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang; u.rate = rate;
      if (pitch) u.pitch = pitch;
      if (voice) u.voice = voice;
      keep = u;
      u.onend = u.onerror = function () { if (keep === u) keep = null; };
      // cancel 直後の speak は Android で無音になることがあるので、少し待つ
      setTimeout(function () { try { ss.speak(u); if (ss.paused) ss.resume(); } catch (e) {} }, 80);
      return true;
    } catch (e) { return false; }
  }
  A.speak = function (text, force) {
    if (!A.canSpeak()) return false;
    if (!A.S.settings.voice && !force) return false;
    var t = A.reading(text);
    if (!t) return false;
    return say(t, "ja-JP", 0.92, 1.1, jaVoice());
  };
  A.speakEn = function (text) {
    if (!A.canSpeak()) return false;
    var vs = speechSynthesis.getVoices() || [], v = null;
    for (var i = 0; i < vs.length; i++) { if (/^en/i.test(vs[i].lang)) { v = vs[i]; break; } }
    return say(text, "en-US", 0.8, 0, v);
  };
  /* タップ取りこぼし対策: 指がちょっと動くと click が来ないことがあるので、ボタンの上で指を離したのに
     click が来なかったときは、こちらで押したことにする */
  (function () {
    var down = null;
    document.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") { down = null; return; }
      var b = e.target.closest && e.target.closest("button");
      down = b ? { b: b, x: e.clientX, y: e.clientY, clicked: false } : null;
    }, true);
    document.addEventListener("click", function () { if (down) down.clicked = true; }, true);
    document.addEventListener("pointerup", function (e) {
      var d = down;
      if (!d || e.pointerType === "mouse") return;
      var near = Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) < 60;
      if (!near || d.b.disabled) return;
      setTimeout(function () { if (!d.clicked && d.b.isConnected && !d.b.disabled) { d.clicked = true; d.b.click(); } }, 300);
    }, true);
  })();
  A.stopSpeak = function () {
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
  };
})();
