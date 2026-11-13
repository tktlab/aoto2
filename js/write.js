/* AOTO2 かいて こたえる: 手書きパッド・漢字/英単語れんしゅう */
(function () {
  "use strict";
  var A = window.A, h = A.h, W = window.AOTO_WRITE;
  var FONT_JA = '"UD デジタル 教科書体 N-R","Klee One","Hiragino Mincho ProN","Yu Mincho",serif';
  var FONT_EN = '"Comic Sans MS","Segoe UI",Arial,sans-serif';

  /* ================= 手書きパッド ================= */
  /* o: {text, kind:'kanji'|'lines'|'free', trace} */
  function pad(o) {
    var kind = o.kind || "free", text = o.text || "";
    var maxW = Math.min(window.innerWidth - 56, 420), w, hgt, box = 0, n = 1;
    if (kind === "kanji") {
      n = Math.max(1, Array.from(text).length);
      box = Math.min(150, Math.floor(maxW / n)); w = box * n; hgt = box;
    } else { w = maxW; hgt = kind === "lines" ? 170 : 170; }
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    function mk(cls) {
      var c = h("canvas", { class: cls });
      c.width = Math.round(w * dpr); c.height = Math.round(hgt * dpr);
      c.style.width = w + "px"; c.style.height = hgt + "px";
      var g = c.getContext("2d"); g.scale(dpr, dpr);
      return { c: c, g: g };
    }
    var bg = mk("pad-bg"), fg = mk("pad-fg");
    var trace = !!o.trace, strokes = [], cur = null;

    function drawBg() {
      var g = bg.g; g.clearRect(0, 0, w, hgt);
      g.fillStyle = "#fff"; g.fillRect(0, 0, w, hgt);
      if (kind === "kanji") {
        var chars = Array.from(text);
        for (var i = 0; i < n; i++) {
          var x = i * box;
          g.strokeStyle = "#e86ab0"; g.lineWidth = 2; g.setLineDash([]);
          g.strokeRect(x + 1, 1, box - 2, box - 2);
          g.strokeStyle = "#f3b6d6"; g.lineWidth = 1; g.setLineDash([5, 4]);
          g.beginPath(); g.moveTo(x + box / 2, 3); g.lineTo(x + box / 2, box - 3);
          g.moveTo(x + 3, box / 2); g.lineTo(x + box - 3, box / 2); g.stroke();
          if (trace) {
            g.setLineDash([]); g.fillStyle = "rgba(47,58,102,0.22)";
            g.font = "400 " + Math.round(box * 0.78) + "px " + FONT_JA;
            g.textAlign = "center"; g.textBaseline = "middle";
            g.fillText(chars[i], x + box / 2, box / 2 + box * 0.04);
          }
        }
      } else if (kind === "lines") {
        [0.2, 0.4, 0.6, 0.8].forEach(function (r, i) {
          g.strokeStyle = r === 0.6 ? "#e86a6a" : "#9db6f0"; g.lineWidth = r === 0.6 ? 2 : 1.5;
          g.setLineDash(r === 0.4 ? [6, 4] : []);
          g.beginPath(); g.moveTo(6, hgt * r); g.lineTo(w - 6, hgt * r); g.stroke();
        });
        if (trace) {
          var fs = hgt * 0.4; g.font = "400 " + fs + "px " + FONT_EN;
          var tw = g.measureText(text).width;
          if (tw > w - 24) { fs = fs * (w - 24) / tw; g.font = "400 " + fs + "px " + FONT_EN; tw = g.measureText(text).width; }
          g.setLineDash([]); g.fillStyle = "rgba(47,58,102,0.22)";
          g.textAlign = "left"; g.textBaseline = "alphabetic";
          g.fillText(text, Math.max(10, (w - tw) / 2), hgt * 0.6);
        }
      } else {
        g.strokeStyle = "#e3e8f7"; g.lineWidth = 1; g.setLineDash([4, 6]);
        for (var y = 38; y < hgt; y += 38) { g.beginPath(); g.moveTo(8, y); g.lineTo(w - 8, y); g.stroke(); }
      }
      g.setLineDash([]);
    }
    function lw() { return kind === "kanji" ? Math.max(4, box / 16) : kind === "lines" ? 5 : 6; }
    function redraw() {
      var g = fg.g; g.clearRect(0, 0, w, hgt);
      g.strokeStyle = "#2f3a66"; g.lineWidth = lw(); g.lineCap = "round"; g.lineJoin = "round";
      strokes.forEach(function (s) {
        g.beginPath();
        if (s.length === 1) { g.arc(s[0].x, s[0].y, lw() / 2, 0, 7); g.fillStyle = "#2f3a66"; g.fill(); return; }
        g.moveTo(s[0].x, s[0].y);
        for (var i = 1; i < s.length - 1; i++) {
          var mx = (s[i].x + s[i + 1].x) / 2, my = (s[i].y + s[i + 1].y) / 2;
          g.quadraticCurveTo(s[i].x, s[i].y, mx, my);
        }
        var l = s[s.length - 1]; g.lineTo(l.x, l.y); g.stroke();
      });
    }
    function pt(e) {
      var r = fg.c.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (w / r.width), y: (e.clientY - r.top) * (hgt / r.height) };
    }
    var locked = false, activeId = null;
    function endStroke(e) {
      if (e && activeId !== null && e.pointerId !== activeId) return;
      cur = null; activeId = null;
    }
    fg.c.addEventListener("pointerdown", function (e) {
      if (locked) return;
      e.preventDefault();
      if (activeId !== null) return; // 手のひらや2本目の指は むし
      activeId = e.pointerId;
      try { fg.c.setPointerCapture(e.pointerId); } catch (x) {}
      cur = [pt(e)]; strokes.push(cur); redraw();
    });
    fg.c.addEventListener("pointermove", function (e) {
      if (!cur || e.pointerId !== activeId) return;
      e.preventDefault();
      var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
      (evs && evs.length ? evs : [e]).forEach(function (ev) {
        var p = pt(ev), l = cur[cur.length - 1];
        if (Math.abs(p.x - l.x) + Math.abs(p.y - l.y) >= 1.5) cur.push(p);
      });
      redraw();
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) {
      fg.c.addEventListener(ev, endStroke);
    });
    ["touchstart", "touchmove"].forEach(function (ev) {
      fg.c.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false });
    });
    fg.c.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    drawBg();
    var el = h("div", { class: "pad-wrap", style: { width: w + "px", height: hgt + "px" } }, bg.c, fg.c);
    return {
      el: el,
      undo: function () { strokes.pop(); redraw(); },
      clear: function () { strokes = []; redraw(); },
      hasInk: function () { return strokes.length > 0; },
      setTrace: function (t) { trace = !!t; drawBg(); },
      lock: function () { locked = true; },
      unlock: function () { locked = false; },
    };
  }

  /* ================= かいて こたえる(共通の1問) ================= */
  /* o: {kind, text(こたえ), padText, trace, speakEn, hint, onJudge(ok), onStuck, judgeLabel} */
  function answerCard(o) {
    var P = pad({ kind: o.kind, text: o.text, trace: o.trace });
    var revealed = false;
    var tools = h("div", { class: "pad-tools" },
      h("button", { class: "btn small", onclick: function () { P.undo(); A.sfx("tap"); } }, "↩ ひとつ けす"),
      h("button", { class: "btn small", onclick: function () { P.clear(); A.sfx("tap"); } }, "🗑 ぜんぶ けす"));
    var below = h("div", { class: "pad-below" });
    var hintBox = h("div", { class: "hintbox", style: { display: "none" } });
    var hints = (o.hints || (o.hint ? [o.hint] : [])).slice(), shown = (o.shown || []).slice();
    function paintHints() {
      A.clear(hintBox); hintBox.style.display = shown.length ? "" : "none";
      shown.forEach(function (t, i) { hintBox.appendChild(h("p", null, "💡 ヒント" + (i + 1) + ": " + t)); });
    }
    paintHints();
    function showActions() {
      A.clear(below);
      if (o.trace) {
        below.appendChild(h("div", { class: "note good" }, "うすい じを なぞって かいてみよう"));
        below.appendChild(h("button", { class: "btn big go", onclick: function () {
          if (!P.hasInk()) { A.toast("なぞって かいてみよう!"); return; }
          A.sfx("good"); o.onJudge && o.onJudge("traced");
        } }, "かけた! ▶"));
        return;
      }
      if (hints.length) below.appendChild(h("button", { class: "btn big alt", onclick: function () {
        shown.push(hints.shift()); paintHints(); A.sfx("pop"); o.onHint && o.onHint(); showActions();
      } }, "💡 ヒント"));
      below.appendChild(h("button", { class: "btn big go", onclick: reveal }, "こたえあわせ ▶"));
      if (o.onStuck) below.appendChild(h("button", { class: "btn big help", onclick: function () { A.sfx("pop"); o.onStuck(); } }, "😵 わからない"));
    }
    function reveal() {
      if (!P.hasInk()) { A.toast("まず ゆびで かいてみよう!"); return; }
      revealed = true; P.lock(); A.sfx("pop");
      A.clear(below); tools.style.display = "none";
      if (o.speakEn) A.speakEn(o.speakEn);
      below.appendChild(h("div", { class: "answer-reveal" },
        h("div", { class: "ar-label" }, "せいかいは…"),
        h("div", { class: "ar-text" + (o.kind === "lines" ? " en" : "") + (String(o.text).length > 8 ? " long" : "") }, o.text)));
      below.appendChild(h("p", { class: "muted center" }, "じぶんの じと くらべてね"));
      below.appendChild(h("div", { class: "judge-row" },
        h("button", { class: "btn big good", onclick: function () { A.sfx("good"); o.onJudge && o.onJudge(true); } }, "⭕ かけた!"),
        h("button", { class: "btn big alt", onclick: function () { A.sfx("ng"); o.onJudge && o.onJudge(false); } }, "❌ ちがった")));
    }
    showActions();
    return h("div", { class: "answer-card" }, P.el, o.trace ? null : tools, hintBox, below);
  }

  /* ================= れんしゅうモード ================= */
  var R = null;
  function rec(id) { var s = A.S.write; return s[id] || (s[id] = { n: 0, ng: 0 }); }
  function peek(id) { return A.S.write[id] || { n: 0, ng: 0 }; }
  function allItems(kind) {
    return W[kind].map(function (it, i) { return { id: (kind === "kanji" ? "k" : "e") + i, it: it, kind: kind }; });
  }
  function mastered(kind) { return allItems(kind).filter(function (x) { return peek(x.id).n >= 2; }).length; }
  function pickItems(kind, n) {
    var items = allItems(kind).map(function (x, i) { x.i = i; x.r = peek(x.id); return x; });
    var todo = items.filter(function (x) { return x.r.n < 2; }); // 順番どおり(やさしい順)
    var done = items.filter(function (x) { return x.r.n >= 2; });
    // まちがえたことがある物を先に、あとは順番どおり
    todo.sort(function (a, b) { return (b.r.ng > b.r.n ? 1 : 0) - (a.r.ng > a.r.n ? 1 : 0) || a.i - b.i; });
    return todo.concat(A.shuffle(done)).slice(0, n);
  }
  function home() {
    var C = A.core;
    function card(kind, emoji, name, sub, color) {
      var tot = W[kind].length, got = mastered(kind);
      return h("button", { class: "subject-card", style: { "--c": color }, onclick: function () { A.sfx("tap"); practice(kind); } },
        h("div", { class: "subject-emoji" }, emoji), h("div", { class: "subject-name" }, name),
        h("div", { class: "subject-stars" }, "✅ " + got + " / " + tot), h("small", null, sub));
    }
    C.view(C.topbar("✍️ かく れんしゅう", C.home),
      h("p", { class: "muted center" }, "ゆびで じを かいて おぼえよう。わからない ときは なぞれるよ!"),
      h("div", { class: "subject-grid" },
        card("kanji", "🈶", "かんじ", "よみから かく", "#ff9f43"),
        card("english", "🔤", "えいたんご", "いみから かく", "#e86ab0")),
      h("p", { class: "muted center" }, "ふつうの もんだいでも「✍️ かいて こたえる」が つかえるよ"));
  }
  function practice(kind) {
    R = { kind: kind, items: pickItems(kind, 5), i: 0, food: 0, ok: 0, events: [] };
    item();
  }
  function promptNodes(x) {
    var it = x.it;
    if (x.kind === "kanji") {
      var parts = it[2].split("{}");
      return h("p", { class: "qtext" }, parts[0], h("span", { class: "blank" }, it[1]), parts[1] || "");
    }
    return h("div", null,
      h("div", { class: "en-emoji" }, it[2]),
      h("p", { class: "qtext" }, it[1], " を えいごで?"),
      h("button", { class: "btn small", onclick: function () { if (!A.speakEn(it[0])) A.toast("このたんまつは こえが でないよ"); } }, "🔊 えいごで きく"));
  }
  function item() {
    var C = A.core, x = R.items[R.i], kind = R.kind, st = { helped: false, missed: false };
    var traceOnly = peek(x.id).n === 0; // はじめての じは まずなぞる
    var C_ = C.SUBJECTS;
    function show(trace) {
      var pr = [];
      for (var i = 0; i < R.items.length; i++) pr.push(h("span", { class: "mdot small" + (i < R.i ? " on" : i === R.i ? " now" : "") }));
      var padKind = kind === "kanji" ? "kanji" : "lines";
      var card = answerCard({
        kind: padKind, text: x.it[0], trace: trace, speakEn: kind === "english" ? x.it[0] : null,
        hint: !trace ? (kind === "kanji" ? "さいしょの もじは「" + Array.from(x.it[0])[0] + "」" : "さいしょの もじは「" + x.it[0][0] + "」で " + x.it[0].length + "もじ") : null,
        onHint: function () { st.helped = true; },
        onStuck: function () { st.helped = true; show(true); },
        onJudge: function (res) {
          if (res === "traced") { show(false); return; }
          if (res) return good();
          if (!st.missed) { st.missed = true; rec(x.id).ng++; A.core.touchDay(false); A.save(); }
          st.helped = true; show(true);
        },
      });
      C.view(
        h("div", { class: "quiz-head" },
          h("button", { class: "btn-ghost", onclick: function () { A.stopSpeak(); home(); } }, "× やめる"),
          h("div", { class: "mdots" }, pr), h("div", { class: "quiz-pet" }, A.petEmoji())),
        h("section", { class: "qcard", style: { "--c": kind === "kanji" ? "#ff9f43" : "#e86ab0" } },
          h("div", { class: "qtag" }, kind === "kanji" ? "🈶 かんじを かこう" : "🔤 えいたんごを かこう"),
          promptNodes(x)),
        card);
      if (trace && kind === "english") A.speakEn(x.it[0]);
    }
    function good() {
      var r = rec(x.id), indep = !st.helped && !st.missed;
      if (indep) r.n++; else if (r.n === 0) r.n = 0;
      r.last = Date.now();
      var food = indep ? 2 : 1; R.food += food; if (indep) R.ok++;
      A.core.touchDay(true);
      A.core.logEvent({ t: Date.now(), pid: (kind === "kanji" ? "かんじ " : "えいご ") + x.it[0], skill: "write-" + kind, subject: kind === "kanji" ? "国語" : "英語", ok: true, help: st.helped, wrong: st.missed ? 1 : 0 });
      var ev = A.core.feed(food);
      A.save(); A.confetti(indep ? 20 : 8);
      R.i++;
      A.core.showEvents(ev, function () { if (R.i >= R.items.length) done(); else item(); });
    }
    show(traceOnly);
  }
  function done() {
    var C = A.core, kind = R.kind;
    var tot = W[kind].length;
    C.view(h("section", { class: "result" },
      h("div", { class: "result-face jump" }, A.petEmoji()),
      h("h1", null, "れんしゅう クリア!"),
      h("p", null, R.items.length + "もじ かけたよ。ごはん +" + R.food),
      h("p", { class: "muted" }, "おぼえた " + mastered(kind) + " / " + tot),
      h("div", { class: "choice-col" },
        h("button", { class: "btn big go", onclick: function () { practice(kind); } }, "つづけて かく ▶"),
        h("button", { class: "btn big alt", onclick: home }, "もどる"))));
    A.sfx("levelup"); A.confetti(30); A.speak("れんしゅう クリア! よくがんばったね");
  }

  A.write = { pad: pad, answerCard: answerCard, home: home, practice: practice };
})();
