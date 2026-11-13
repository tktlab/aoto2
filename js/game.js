/* AOTO2 ゲーム本体: ホーム(育成)・ステージ・クイズ・ずかん・おとなのへや */
(function () {
  "use strict";
  var A = window.A, h = A.h, S = function () { return A.S; };
  var D = window.AOTO_DATA;
  var app = document.getElementById("app");

  /* ================= データ索引 ================= */
  var SUBJECTS = [
    { id: "数学", emoji: "🧮", color: "#5b8def", icons: ["🔢", "🍕", "➕", "➖", "✖️", "🔠", "🧮", "📐"] },
    { id: "英語", emoji: "🗣️", color: "#e86ab0", icons: ["🍎", "🙋", "🅱️", "🚫", "🏃", "❓", "📝", "💬"] },
    { id: "国語", emoji: "📚", color: "#ff9f43", icons: ["💬", "🧩", "🔗", "📖", "👉", "🔍", "💗", "📌"] },
    { id: "理科", emoji: "🔬", color: "#34c38f", icons: ["👀", "🌱", "🍃", "🧪", "🌰", "🌿", "🐾", "🗂️"] },
    { id: "社会", emoji: "🌏", color: "#9b72e8", icons: ["🧭", "🌍", "🌡️", "🗾", "🔭", "📍", "🏝️", "🗺️"] },
    { id: "音楽", emoji: "🎵", color: "#f06a6a", icons: ["🎼", "🥁", "🎻", "🎹", "🎺", "🎤", "🎧", "🪕"] },
    { id: "美術", emoji: "🎨", color: "#b06ae8", icons: ["🖌️", "🎨", "🖼️", "✂️", "📐", "🗿", "🌈", "🖍️"] },
    { id: "保健体育", emoji: "🏃", color: "#2fb5c7", icons: ["🏃", "🏊", "⚽", "🥋", "💤", "🩹", "🍚", "🏅"] },
    { id: "技術家庭", emoji: "🔧", color: "#8a9a3a", icons: ["🔨", "💻", "🍳", "🧵", "🪚", "🔑", "🥕", "🏠"] },
  ];
  var skillMap = {}, bySubject = {}, probsBySkill = {};
  D.skills.forEach(function (s, i) { s._i = i; skillMap[s.id] = s; });
  SUBJECTS.forEach(function (sub) {
    bySubject[sub.id] = D.skills.filter(function (s) { return s.subject === sub.id; })
      .sort(function (a, b) { return a.stage - b.stage || a._i - b._i; });
    bySubject[sub.id].forEach(function (s, i) { s._icon = sub.icons[i % sub.icons.length]; });
  });
  D.problems.forEach(function (p) { (probsBySkill[p.skill] = probsBySkill[p.skill] || []).push(p); });
  function subjectInfo(id) { return SUBJECTS.filter(function (s) { return s.id === id; })[0]; }
  var GOAL = 3; // 1日のミッション問題数

  /* ================= スキル進捗 ================= */
  function rec(id) {
    var s = S().skills;
    if (!s[id]) s[id] = { ok: 0, ng: 0, help: 0, probs: {} };
    return s[id];
  }
  function stars(id) {
    var r = S().skills[id];
    if (!r || !r.ok) return 0;
    var indep = Object.keys(r.probs).filter(function (k) { return r.probs[k].indep; }).length;
    return indep >= 2 ? 3 : indep >= 1 ? 2 : 1;
  }
  function prereqsOk(skill) {
    return (skill.prerequisites || []).every(function (id) { return !skillMap[id] || stars(id) >= 1; });
  }
  function totalStars(sub) {
    return bySubject[sub].reduce(function (n, s) { return n + stars(s.id); }, 0);
  }
  function recommendedFromList(list, ignorePrereq) {
    var i, r;
    for (i = 0; i < list.length; i++) {
      r = S().skills[list[i].id];
      if (stars(list[i].id) < 2 && (!r || r.ok < 3) && (ignorePrereq || prereqsOk(list[i]))) return list[i];
    }
    for (i = 0; i < list.length; i++) if (stars(list[i].id) < 3) return list[i];
    return list[Math.floor(Math.random() * list.length)];
  }
  /* 「ここから始める」を選んだ教科は、その単元以降の教材を順番に出す */
  function courseList(sub) {
    var C = window.AOTO_CURRICULUM, cs = S().course && S().course[sub];
    if (!C || !cs) return null;
    var start = C.units.filter(function (u) { return u.id === cs; })[0];
    if (!start) return null;
    var seen = {}, out = [];
    C.units.forEach(function (u) {
      if (u.sub !== sub || u.order < start.order || u.g === 0 && start.g !== 0) return;
      u.skills.forEach(function (id) { if (skillMap[id] && !seen[id]) { seen[id] = 1; out.push(skillMap[id]); } });
    });
    return out.length ? out : null;
  }
  function recommendedSkill(sub) {
    var cl = courseList(sub);
    if (cl) return recommendedFromList(cl, true);
    var list = bySubject[sub], i, r;
    for (i = 0; i < list.length; i++) {
      r = S().skills[list[i].id];
      if (stars(list[i].id) < 2 && (!r || r.ok < 3) && prereqsOk(list[i])) return list[i];
    }
    for (i = 0; i < list.length; i++) if (stars(list[i].id) < 3) return list[i];
    return list[Math.floor(Math.random() * list.length)];
  }
  function pickProblem(skill, seen) {
    var list = probsBySkill[skill.id] || [];
    var r = S().skills[skill.id];
    var scored = list.map(function (p) {
      var pr = r && r.probs[p.id];
      var score = pr ? (pr.indep ? 3 : 1) + (pr.last || 0) / 1e13 : 0;
      if (seen && seen[p.id]) score += 10;
      return { p: p, s: score + Math.random() * 0.01 };
    }).sort(function (a, b) { return a.s - b.s; });
    return scored[0].p;
  }

  /* ================= なかま(育成) ================= */
  var CREATURES = A.creatures.list;
  var EVO = 11; // この ごはんの かずで しんか
  var THRESH = [0, 3, 8, 14]; // たまご / ひび / こども / おとな(そつぎょう)
  function activePet() {
    var s = S();
    if (!s.pets[s.active]) s.active = s.pets.length - 1;
    return s.pets[s.active];
  }
  function stageOf(p) {
    if (p.done) return 3;
    var st = 0;
    for (var i = 0; i < THRESH.length - 1; i++) if (p.food >= THRESH[i]) st = i;
    return st;
  }
  /* すがた: 0=たまご 1=ひび 2=こども 3=おとな(しんかごのすがた) */
  function formOf(p) {
    if (p.done || p.food >= EVO) return 3;
    return p.food >= THRESH[2] ? 2 : p.food >= THRESH[1] ? 1 : 0;
  }
  var FORM_BOUNDS = [0, THRESH[1], THRESH[2], EVO, THRESH[3]];
  var FORM_NEXT = ["ひびが はいるまで", "うまれるまで", "しんかまで", "そつぎょうまで"];
  function petArt(p, form) { return A.creatures.el(p.kind, form == null ? formOf(p) : form); }
  A.petEmoji = function () { var p = activePet(); return petArt(p); };
  function petName(p) {
    return p.name || CREATURES[p.kind % CREATURES.length].n;
  }
  /* つぎの たまごの しゅるい: まだ ずかんに ない子から えらぶ(レアは出にくい) */
  function nextKind() {
    var got = {};
    S().pets.forEach(function (q) { if (q.done) got[q.kind] = true; });
    var pool = CREATURES.filter(function (c) { return !got[c.kind]; });
    if (!pool.length) pool = CREATURES;
    var wsum = 0, ws = pool.map(function (c) { var w = c.r === 1 ? 4 : c.r === 2 ? 3 : 2; wsum += w; return w; });
    var x = Math.random() * wsum, i = 0;
    while (i < pool.length - 1 && x >= ws[i]) { x -= ws[i]; i++; }
    return pool[i].kind;
  }
  /* もんだいで ごはんを ゲット(ふくろに ためる) */
  function earn(n) {
    S().bag = (S().bag || 0) + n;
    return [];
  }
  /* ごはんを 1こ あげて、成長イベントを返す */
  function growBy(n) {
    var p = activePet(), fb = formOf(p), events = [];
    p.food += n;
    if (p.food >= THRESH[3]) {
      p.done = true;
      events.push({ t: "graduate", kind: p.kind, name: petName(p) });
      S().pets.push({ kind: nextKind(), name: "", food: 0, done: false });
      S().active = S().pets.length - 1;
      events.push({ t: "newegg" });
    } else {
      var fa = formOf(p);
      if (fa > fb) events.push({ t: fa === 1 ? "crack" : fa === 2 ? "hatch" : "evolve", kind: p.kind, name: petName(p), first: fa === 2 && !S().battleSeen });
    }
    return events;
  }
  function pet(size, cls) {
    var p = activePet(), f = formOf(p);
    return h("div", { class: "pet st" + f + " " + (cls || ""), style: { "font-size": (size || 96) + "px" }, role: "img", "aria-label": petName(p) },
      petArt(p, f));
  }

  /* ================= バトル(もんだい=てき。なかまが たおす) ================= */
  var ATTACK = {
    cute: { 2: ["ぽよぽよ たいあたり", ["⭐", "✨"]], 3: ["キラキラ ビーム", ["💖", "✨", "🌈"]] },
    cool: { 2: ["ガブッと こうげき", ["💥", "💢"]], 3: ["ひっさつ ほのお斬り", ["🔥", "⚡", "💥"]] },
  };
  var TAUNTS = ["とけるかな〜?", "ふふふ…", "わかるかな?", "かかってこい!", "この もんだい むずかしいぞ〜"];
  /* たたかう なかま: いま育てている子が うまれていれば その子、まだ たまごなら さいごに そつぎょうした子。だれも いなければ バトルなし */
  function fighterPet() {
    var pm = S().mates && S().mates[S().partner];
    if (pm) return pm;
    var a = activePet();
    if (formOf(a) >= 2) return a;
    var ps = S().pets;
    for (var i = ps.length - 1; i >= 0; i--) if (ps[i].done) return ps[i];
    return null;
  }
  function burst(stage, emojis, n, rect) {
    var sr = stage.getBoundingClientRect();
    var cx = rect.left + rect.width / 2 - sr.left, cy = rect.top + rect.height / 2 - sr.top;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * 6.28 + Math.random(), d = 40 + Math.random() * 40;
      var sp = h("span", { class: "fx-spark", style: { left: cx + "px", top: cy + "px", "--dx": Math.cos(a) * d + "px", "--dy": Math.sin(a) * d + "px" } }, emojis[i % emojis.length]);
      stage.appendChild(sp);
      setTimeout(function (x) { return function () { if (x.parentNode) x.parentNode.removeChild(x); }; }(sp), 1000);
    }
  }
  function runFx(stage, fighter, foe, talk, fx, c, form) {
    if (!stage.parentNode) return;
    var fr = fighter.getBoundingClientRect(), er = foe.getBoundingClientRect();
    if (fx === "counter") {
      fighter.classList.add("hurt"); foe.classList.add("jeer");
      burst(stage, ["💢"], 3, fr);
      return;
    }
    fighter.style.setProperty("--dx", Math.max(40, er.left - fr.left - fr.width * 0.4) + "px");
    fighter.classList.add("lunge");
    var atk = ATTACK[c.type === "cool" ? "cool" : "cute"][form >= 3 ? 3 : 2];
    var label = fx === "special" ? "💡 ひらめき " + atk[0] + "!" : fx === "crit" ? "かいしん! " + atk[0] : atk[0];
    setTimeout(function () {
      foe.classList.add("hit");
      burst(stage, fx === "special" ? atk[1].concat(["💡", "🌟"]) : atk[1], fx === "attack" ? 6 : 12, er);
      stage.appendChild(h("div", { class: "fx-banner" }, label));
      A.sfx("pop");
    }, 330);
    setTimeout(function () { foe.classList.remove("hit"); foe.classList.add("dead"); talk.textContent = "やられた〜!"; burst(stage, ["💨"], 4, er); }, 760);
  }
  function battleStage() {
    var f = fighterPet();
    if (!f || !Q || !Q.foe) { Q && (Q.fx = null); return null; }
    var fx = Q.fx; Q.fx = null;
    var form = formOf(f), c = CREATURES[f.kind % CREATURES.length];
    var fighter = h("div", { class: "fighter", style: f.v ? { filter: TINT[f.v].f } : null }, A.creatures.el(f.kind, form));
    var foe = h("div", { class: "foe" + (fx === "appear" ? " appear" : "") + (Q.done && !fx ? " gone" : "") }, A.enemies.el(Q.foe.e.id, Q.foe.hue));
    var talk = h("div", { class: "taunt" }, Q.done && !fx ? "やられた〜!" : Q.taunt);
    var stage = h("div", { class: "battle", "aria-label": Q.foe.e.n + "が あらわれた" }, fighter, foe, talk);
    var wrap = h("div", { class: "battle-wrap" }, stage);
    if (!S().battleSeen) {
      S().battleSeen = true; A.save();
      wrap.appendChild(h("div", { class: "note good" }, "⚔️ ここから なかまが たたかうよ! もんだいを とくと、てきを やっつけて ごはんを おとすよ!"));
    }
    if (fx && fx !== "appear") setTimeout(function () { runFx(stage, fighter, foe, talk, fx, c, form); }, 40);
    return wrap;
  }

  /* ================= ストリーク・記録 ================= */
  function touchDay(correct) {
    var s = S(), today = A.dayKey();
    if (!s.days[today]) s.days[today] = { n: 0, ok: 0 };
    s.days[today].n++;
    if (correct) s.days[today].ok++;
    var st = s.streak;
    if (st.last !== today) {
      var gap = st.last ? A.daysBetween(st.last, today) : 99;
      A._news = A._news || [];
      if (gap >= 1 && gap <= 2) st.n = st.n + 1; // 1日おやすみまでは続く
      else if (gap >= 3 && gap <= 4 && st.n > 0 && (s.pass || 0) > 0) {
        s.pass--; st.n = st.n + 1;
        A._news.push("🎫 おやすみ券を つかって、つづけた きろくを まもったよ!");
      } else st.n = 1;
      st.last = today;
      if (st.n > 0 && st.n % 7 === 0) {
        if ((s.pass || 0) < 3) { s.pass = (s.pass || 0) + 1; A._news.push("🎫 7日つづけたごほうびに おやすみ券を 1まい ゲット!"); }
      }
    }
  }
  function todayCount() { var d = S().days[A.dayKey()]; return d ? d.n : 0; }
  function logEvent(e) {
    var s = S();
    s.log.push(e);
    if (s.log.length > 300) s.log = s.log.slice(-300);
  }

  /* ================= 画面部品 ================= */
  function view() {
    A.clear(app);
    (function put(list) {
      for (var i = 0; i < list.length; i++) {
        if (Array.isArray(list[i])) put(list[i]);
        else if (list[i]) app.appendChild(list[i]);
      }
    })(arguments);
    window.scrollTo(0, 0);
  }
  A.toast = function (text) {
    var t = h("div", { class: "toast", role: "status" }, text);
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2400);
  };
  A.confetti = function (n) {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var bits = ["✨", "⭐", "🎉", "🍙", "💖", "🌟"];
    var wrap = h("div", { class: "confetti", "aria-hidden": "true" });
    for (var i = 0; i < (n || 18); i++) {
      wrap.appendChild(h("span", { style: { left: Math.random() * 100 + "%", "animation-delay": Math.random() * 0.6 + "s", "font-size": 18 + Math.random() * 18 + "px" } }, bits[i % bits.length]));
    }
    document.body.appendChild(wrap);
    setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 2800);
  };
  function topbar(title, onBack) {
    return h("div", { class: "topbar" },
      onBack ? h("button", { class: "btn-ghost", onclick: onBack }, "← もどる") : h("span"),
      title ? h("div", { class: "topbar-title" }, title) : null,
      h("span"));
  }
  function overlay(face, title, text, btn, onClose) {
    A.sfx("levelup"); A.confetti(26);
    var box = h("div", { class: "overlay", role: "dialog", "aria-modal": "true" },
      h("div", { class: "overlay-card" },
        h("div", { class: "overlay-face" }, face),
        h("h2", null, title),
        h("p", null, text),
        h("button", { class: "btn big good", onclick: function () {
          if (box.parentNode) box.parentNode.removeChild(box);
          if (onClose) onClose();
        } }, btn || "やったー!")));
    document.body.appendChild(box);
    if (S().settings.voice) A.speak(title + "。" + text);
  }
  function showEvents(events, after) {
    if (!events.length) return after && after();
    var e = events.shift();
    var next = function () { showEvents(events, after); };
    var c = CREATURES[e.kind % CREATURES.length];
    var cool = c && c.type === "cool";
    if (e.t === "crack") overlay(A.creatures.el(e.kind, 1), "たまごに ひびが!", "もうすぐ うまれるよ!", "どきどき!", next);
    else if (e.t === "hatch") overlay(A.creatures.el(e.kind, 2), "うまれたよ!", e.name + "が なかまに なった! (" + c.n + ")" + (e.first ? " これから もんだいの てきが でてくるよ。なかまと いっしょに やっつけよう!" : ""), "よろしくね!", next);
    else if (e.t === "evolve") overlay(A.creatures.el(e.kind, 3), "しんかしたよ!", e.name + "が " + (cool ? "かっこよく" : "かわいく") + " しんかした!", "すごーい!", next);
    else if (e.t === "graduate") overlay(A.creatures.el(e.kind, 3), "りっぱに そだったよ!", e.name + "は ずかんに のったよ!", "すごい!", next);
    else if (e.t === "newegg") overlay(A.creatures.el(S().pets[S().active].kind, 0), "あたらしい たまご!", "つぎの なかまが やってきたよ", "わーい!", next);
    else next();
  }
  function petNameFor(e) { return e.name; }
  function renameDialog(p) {
    var input = h("input", { class: "name-input", maxlength: "8", placeholder: "あたらしい なまえ", "aria-label": "なまえ", value: p.name || "" });
    var box = h("div", { class: "overlay", role: "dialog", "aria-modal": "true" },
      h("div", { class: "overlay-card" },
        h("h2", null, "なまえを かえる"), input,
        h("button", { class: "btn big good", onclick: function () {
          p.name = (input.value || "").trim().slice(0, 8); A.save(); A.sfx("good");
          if (box.parentNode) box.parentNode.removeChild(box); home();
        } }, "これに する!"),
        h("button", { class: "btn-ghost", onclick: function () { if (box.parentNode) box.parentNode.removeChild(box); } }, "やめる")));
    document.body.appendChild(box);
  }

  /* ================= ガチャ・なかまの へや ================= */
  var TINT = [
    { n: "ノーマル", f: "" },
    { n: "ひかりカラー", f: "hue-rotate(150deg) saturate(1.15)" },
    { n: "ゆめカラー", f: "hue-rotate(-75deg) saturate(1.25)" },
    { n: "ゴールド", f: "sepia(.85) saturate(2.8) hue-rotate(-12deg) brightness(1.08) drop-shadow(0 0 8px #ffd54a)" },
  ];
  var TINT_W = [60, 25, 10, 5];
  var MATE_MAX = EVO + 10; // おとなになってから +10 まで なかよしアップ
  function mateArt(m, form) {
    return h("div", { class: "mate-art", style: m.v ? { filter: TINT[m.v].f } : null }, A.creatures.el(m.kind, form == null ? formOf(m) : form));
  }
  function mateLove(m) { return Math.max(0, Math.min(10, m.food - EVO)); }
  function rollMate() {
    var s = S(), x = Math.random() * 100, v = 0, acc = 0;
    for (var i = 0; i < TINT_W.length; i++) { acc += TINT_W[i]; if (x < acc) { v = i; break; } }
    if (v === 0 && (s.pity || 0) >= 9) v = 1; // 10回に1回は レアカラー いじょう
    s.pity = v >= 1 ? 0 : (s.pity || 0) + 1;
    var ws = CREATURES.map(function (c) { return c.r === 1 ? 4 : c.r === 2 ? 3 : 2; }), tot = 0;
    ws.forEach(function (w) { tot += w; });
    var y = Math.random() * tot, k = 0;
    while (k < ws.length - 1 && y >= ws[k]) { y -= ws[k]; k++; }
    return { kind: CREATURES[k].kind, v: v };
  }
  function pullGacha() {
    var s = S();
    if ((s.tickets || 0) < 1) return null;
    s.tickets--;
    var r = rollMate(), mates = s.mates || (s.mates = []);
    var ex = mates.filter(function (m) { return m.kind === r.kind && m.v === r.v; })[0];
    var out;
    if (ex) { s.bag = (s.bag || 0) + 2; out = { dup: true, mate: ex }; }
    else { var m = { kind: r.kind, v: r.v, name: "", food: THRESH[2] }; mates.push(m); out = { dup: false, mate: m }; }
    A.save();
    return out;
  }
  var MACHINE_SVG = '<svg viewBox="0 0 160 190" width="150" height="178" aria-hidden="true"><defs><linearGradient id="gm1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#ff7a3d"/></linearGradient></defs><rect x="22" y="96" width="116" height="84" rx="16" fill="url(#gm1)"/><circle cx="80" cy="60" r="52" fill="#e8f7ff" stroke="#9ad4f5" stroke-width="5"/><circle cx="58" cy="44" r="12" fill="#ff7aa8"/><circle cx="92" cy="36" r="12" fill="#ffd23a"/><circle cx="104" cy="66" r="12" fill="#6fd6a4"/><circle cx="66" cy="76" r="12" fill="#7ab4ff"/><circle cx="82" cy="58" r="12" fill="#c58bff"/><rect x="56" y="124" width="48" height="36" rx="10" fill="#fff4dc"/><circle cx="80" cy="142" r="11" fill="#ff9f3d"/><rect x="40" y="108" width="80" height="8" rx="4" fill="#fff" opacity=".5"/></svg>';
  function gachaScreen() {
    var s = S(), busy = false;
    var machine = h("div", { class: "gacha-machine", role: "img", "aria-label": "ガチャのきかい" });
    machine.innerHTML = MACHINE_SVG;
    var meterFill = h("div", { class: "g-meter-fill" });
    var meter = h("div", { class: "g-meter" }, meterFill);
    var holding = false, t0 = 0, noTicket = (s.tickets || 0) < 1;
    function startHold(e) {
      if (busy || (S().tickets || 0) < 1) return;
      if (e && e.preventDefault) e.preventDefault();
      holding = true; t0 = Date.now();
      machine.classList.add("charging");
      meterFill.style.transition = "width 1.2s linear"; meterFill.style.width = "100%";
      A.sfx("charge");
    }
    function endHold() {
      if (!holding) return;
      holding = false; busy = true;
      var power = Math.min(1, (Date.now() - t0) / 1200);
      machine.classList.remove("charging"); meterFill.style.transition = "none"; meterFill.style.width = "0";
      machine.classList.add("shake");
      if (navigator.vibrate) { try { navigator.vibrate(power >= 1 ? [30, 40, 60] : 30); } catch (e) {} }
      setTimeout(function () {
        machine.classList.remove("shake");
        var o = pullGacha();
        if (!o) { gachaScreen(); return; }
        playGacha(o, power);
      }, 420);
    }
    ["pointerdown"].forEach(function (ev) { machine.addEventListener(ev, startHold); });
    ["pointerup", "pointercancel"].forEach(function (ev) { machine.addEventListener(ev, endHold); });
    var pull = h("button", { class: "btn big go g-pull", disabled: noTicket ? true : null }, "🎟️ ぐーっと おして、はなす!");
    ["pointerdown"].forEach(function (ev) { pull.addEventListener(ev, startHold); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) { pull.addEventListener(ev, endHold); });
    pull.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    view(topbar("ガチャ", home),
      h("section", { class: "gacha-card" },
        machine,
        h("div", { class: "ticket-line" }, "🎟️ ガチャチケット ×" + (s.tickets || 0)),
        meter, pull,
        (s.tickets || 0) < 1 ? null : h("div", { class: "mission-sub" }, "ガチャの きかいを ながおししても OK。はなすと カプセルが でてくるよ!"),
        (s.tickets || 0) < 1 ? h("div", { class: "note" }, "チケットは まいにち ひらくと 1まい、ミッション(3もん)クリアで 1まい もらえるよ!") : null,
        h("div", { class: "mission-sub" }, "12しゅるいの なかま × 4つの いろ。ゴールドは 5%、10かいに 1かいは レアカラー いじょう!"),
        h("button", { class: "btn alt", onclick: function () { A.sfx("tap"); roomScreen(); } }, "🐾 なかまの へやへ")));
  }
  var CAP = ["#5fb8ff", "#c58bff", "#ff8ac8", "#ffd54a"];
  function playGacha(o, power) {
    var m = o.mate, c = CREATURES[m.kind % CREATURES.length], v = m.v, timers = [], closed = false, fin = false, opened = false;
    var T = function (fn, ms) { timers.push(setTimeout(function () { if (!closed && !fin) fn(); }, ms)); };
    var vib = function (p) { if (navigator.vibrate) { try { navigator.vibrate(p); } catch (e) {} } };
    var cap = h("div", { class: "capsule drop" }, h("div", { class: "cap-top", style: { background: CAP[v] } }), h("div", { class: "cap-bot" }), h("div", { class: "cap-shine" }));
    var capWrap = h("div", { class: "g-capwrap" }, cap);
    var hint = h("div", { class: "g-hint" }, "");
    var rays = h("div", { class: "g-rays" });
    var art = h("div", { class: "g-art" });
    var title = h("div", { class: "g-title" }), nameEl = h("div", { class: "g-name" }), starsEl = h("div", { class: "g-stars" }), sub = h("div", { class: "g-sub" });
    var actions = h("div", { class: "g-actions" });
    var flash = h("div", { class: "g-flash" });
    var stage;
    function close() { closed = true; timers.forEach(clearTimeout); if (stage.parentNode) stage.parentNode.removeChild(stage); }
    var skip = h("button", { class: "g-skip", onclick: function () { showFinal(); } }, "スキップ ▶");
    stage = h("div", { class: "gstage t" + v }, rays, capWrap, hint, art, title, nameEl, starsEl, sub, actions, flash, skip);
    document.body.appendChild(stage);
    A.sfx("drop"); vib(40);
    function colored(el) { el.style.filter = v ? TINT[v].f : "none"; }
    function showActions() {
      A.clear(actions);
      var left = S().tickets || 0;
      actions.appendChild(h("button", { class: "btn big go", disabled: left < 1 ? true : null, onclick: function () { close(); gachaScreen(); } }, "🎟️ もういっかい(のこり " + left + ")"));
      actions.appendChild(h("button", { class: "btn big alt", onclick: function () { close(); roomScreen(); } }, "🐾 なかまの へやへ"));
      actions.appendChild(h("button", { class: "btn-ghost", onclick: function () { close(); gachaScreen(); } }, "とじる"));
      skip.style.display = "none";
    }
    function titleText() { return o.dup ? "ダブりだったよ" : v >= 3 ? "ゴールドだー!!" : v >= 2 ? "スーパーレア!" : v >= 1 ? "レアだよ!" : "なかまが きたよ!"; }
    function fillTexts() {
      title.textContent = titleText(); title.classList.add("show");
      nameEl.textContent = c.n + "(" + TINT[v].n + ")";
      starsEl.textContent = "★".repeat(v + 1);
      sub.textContent = o.dup ? "おなじ子だったから ごはん +2 に かえたよ" : "なかまの へやに あそびに きたよ! ごはんで しんかできるよ";
    }
    function showFinal() {
      if (fin) return; fin = true; timers.forEach(clearTimeout);
      capWrap.style.display = "none"; hint.textContent = ""; flash.classList.remove("on");
      stage.classList.add("revealed");
      A.clear(art);
      var el = h("div", { class: "g-sil color" }, A.creatures.el(m.kind, 2)); colored(el);
      art.appendChild(el); art.classList.add("pop");
      fillTexts(); showActions();
    }
    function reveal() {
      capWrap.style.display = "none"; hint.textContent = "";
      stage.classList.add("revealed");
      var sil = h("div", { class: "g-sil" }, A.creatures.el(m.kind, 2));
      art.appendChild(sil); art.classList.add("pop");
      flash.classList.remove("on");
      title.textContent = "だれかな…?"; title.classList.add("show");
      A.sfx("pop"); vib(30);
      T(function () {
        sil.classList.add("color"); colored(sil);
        fillTexts(); title.classList.add("big");
        A.sfx(v >= 1 ? "rare" : "reveal"); A.confetti(v >= 1 ? 54 : 24); vib(v >= 2 ? [60, 40, 90] : 40);
        if (v >= 3) stage.classList.add("goldburst");
        starsEl.textContent = "";
        for (var i = 0; i <= v; i++) (function (k) { T(function () { starsEl.textContent = "★".repeat(k + 1); A.sfx("tick"); }, 250 + k * 280); })(i);
        T(function () { fin = true; showActions(); }, 600 + (v + 1) * 280);
      }, 1200);
    }
    function open() {
      if (opened) return; opened = true;
      hint.textContent = ""; cap.classList.remove("wobble"); cap.classList.add("crack");
      A.sfx("crack"); vib([20, 30, 20]);
      T(function () { flash.classList.add("on"); }, 700);
      T(reveal, 950);
    }
    capWrap.addEventListener("click", open);
    T(function () { cap.classList.remove("drop"); cap.classList.add("wobble"); hint.textContent = "👆 タップして あけよう!"; }, 1000);
    T(open, 9000);
  }
  function mateStatus(m) {
    var f = formOf(m);
    if (f < 3) return "こども ・ しんかまで あと " + (EVO - m.food);
    var lv = mateLove(m);
    return "おとな ・ なかよし " + "💗".repeat(lv) + "🤍".repeat(10 - lv);
  }
  function mateDialog(idx) {
    var s = S(), m = s.mates[idx];
    if (!m) return roomScreen();
    var c = CREATURES[m.kind % CREATURES.length];
    var isPartner = s.partner === idx;
    var box;
    var close = function () { if (box.parentNode) box.parentNode.removeChild(box); };
    var maxed = m.food >= MATE_MAX;
    box = h("div", { class: "overlay", role: "dialog", "aria-modal": "true" },
      h("div", { class: "overlay-card" },
        h("div", { class: "overlay-face mate-face" }, mateArt(m)),
        h("h2", null, (m.name || c.n) + (isPartner ? "  🤝あいぼう" : "")),
        h("p", null, TINT[m.v].n + " " + "★".repeat(m.v + 1) + " ・ " + (c.type === "cool" ? "⚔️かっこいい" : "💗かわいい")),
        h("p", null, mateStatus(m)),
        h("button", { class: "btn big feed" + ((s.bag || 0) && !maxed ? " pulse" : ""), disabled: (s.bag || 0) < 1 || maxed ? true : null, onclick: function () {
          if ((S().bag || 0) < 1 || m.food >= MATE_MAX) return;
          var fb = formOf(m);
          S().bag--; m.food++; A.save(); A.sfx("good"); A.confetti(8);
          close();
          if (fb < 3 && formOf(m) >= 3) overlay(mateArt(m, 3), "しんかしたよ!", (m.name || c.n) + "が " + (c.type === "cool" ? "かっこよく" : "かわいく") + " しんかした!", "すごーい!", function () { mateDialog(idx); });
          else mateDialog(idx);
        } }, maxed ? "もう なかよしマックス!" : "🍙 ごはんを あげる  ×" + (s.bag || 0)),
        h("button", { class: "btn big alt", onclick: function () {
          s.partner = isPartner ? -1 : idx; A.save(); A.sfx("tap"); close(); roomScreen();
        } }, isPartner ? "あいぼうを やめる" : "⚔️ あいぼうに する(バトルに でるよ)"),
        h("button", { class: "btn-ghost", onclick: function () { close(); roomScreen(); } }, "とじる")));
    document.body.appendChild(box);
  }
  function roomScreen() {
    var s = S(), mates = s.mates || [];
    var items = mates.map(function (m, i) {
      var c = CREATURES[m.kind % CREATURES.length];
      return h("button", { class: "z-item on mate-card t" + m.v, onclick: function () { A.sfx("tap"); mateDialog(i); } },
        h("div", { class: "z-face cr-face" }, mateArt(m)),
        h("small", null, (m.name || c.n) + (s.partner === i ? " 🤝" : "")),
        h("div", { class: "z-stars" }, "★".repeat(m.v + 1) + (formOf(m) >= 3 ? " 💗" + mateLove(m) : "")));
    });
    view(topbar("なかまの へや", home),
      h("div", { class: "note good" }, "🍙 ごはん ×" + (s.bag || 0) + "  ・  あつめた " + mates.length + " / " + (CREATURES.length * TINT.length)),
      mates.length ? h("div", { class: "z-grid" }, items) : h("div", { class: "note" }, "まだ なかまが いないよ。ガチャで なかまを ふやそう!"),
      h("div", { class: "choice-col" },
        h("button", { class: "btn big go", onclick: function () { A.sfx("tap"); gachaScreen(); } }, "🎰 ガチャを ひく  🎟️×" + (s.tickets || 0)),
        s.partner >= 0 && mates[s.partner] ? h("div", { class: "mission-sub" }, "あいぼう: " + (mates[s.partner].name || CREATURES[mates[s.partner].kind % CREATURES.length].n) + "(バトルに でるよ。なかよし 3いじょうで ごはんボーナス!)") : h("div", { class: "mission-sub" }, "なかまを タップして「あいぼう」にすると バトルに でるよ"),
        h("button", { class: "btn alt", onclick: home }, "ホームに もどる")));
  }

  /* ================= シール・プレゼント ================= */
  var STICKERS = [
    ["🍓", "いちご", 0], ["🍋", "レモン", 0], ["🌻", "ひまわり", 0], ["🍀", "クローバー", 0], ["🎈", "ふうせん", 0], ["🍩", "ドーナツ", 0], ["🐳", "くじら", 0],
    ["🚀", "ロケット", 0], ["🎸", "ギター", 0], ["🍉", "すいか", 0], ["🦋", "ちょうちょ", 0], ["🌙", "おつきさま", 0], ["🔔", "ベル", 0], ["🍭", "キャンディ", 0],
    ["🌈", "にじ", 1], ["🦄", "ユニコーン", 1], ["🐙", "タコ", 1], ["🎡", "かんらんしゃ", 1], ["🪁", "たこあげ", 1], ["🍨", "アイス", 1], ["🐲", "ドラゴン", 1],
    ["👑", "おうかん", 2], ["🏆", "トロフィー", 2], ["💎", "ダイヤ", 2],
  ];
  var TIER = ["シール", "レアシール!", "スーパーレア!!"];
  function awardSticker(minTier) {
    var s = S(), owned = s.stickers || (s.stickers = []);
    var r = Math.random(), tier = r < 0.7 ? 0 : r < 0.93 ? 1 : 2;
    if (minTier && tier < minTier) tier = minTier;
    var left = STICKERS.map(function (x, i) { return i; }).filter(function (i) { return owned.indexOf(i) < 0; });
    if (!left.length) return null;
    var pool = left.filter(function (i) { return STICKERS[i][2] === tier; });
    if (!pool.length) pool = left;
    var id = pool[Math.floor(Math.random() * pool.length)];
    owned.push(id);
    return id;
  }
  function weekRow() {
    var s = S(), st = s.streak, today = A.dayKey();
    var alive = st.last && A.daysBetween(st.last, today) <= 2 ? st.n : 0;
    var lit = alive > 0 && alive % 7 === 0 ? 7 : alive % 7;
    var dots = [];
    for (var i = 1; i <= 7; i++) dots.push(h("span", { class: "wdot" + (i <= lit ? " on" : "") + (i === 7 ? " last" : "") }, i === 7 ? "🎁" : i <= lit ? "⭐" : String(i)));
    return h("div", { class: "week" }, h("div", { class: "week-title" }, "7日チャレンジ  " + (lit >= 7 ? "コンプリート!" : "あと " + (7 - lit) + "日で おやすみ券!")), h("div", { class: "wdots" }, dots));
  }

  /* ================= ホーム ================= */
  function homeMessage() {
    var s = S(), n = todayCount(), st = s.streak;
    if (s.first) return "たまごを みつけたよ!";
    if (n >= GOAL) return "きょうも ありがとう! ごはん たくさん もらったよ";
    if (n > 0) return "いいね! あと " + (GOAL - n) + "もんで ミッション クリア!";
    if (st.n >= 3) return st.n + "日 つづいてるね! すごい!";
    var talk = ["おなか すいた〜 もんだい ちょうだい!", "いっしょに あそぼう!", "きょうは なにを たべようかな", "ちょっとだけ やってみよう!"];
    return talk[Math.floor(Math.random() * talk.length)];
  }
  function home() {
    var s = S();
    if (s.first) return welcome();
    var giftNow = false, todayK = A.dayKey();
    if (s.gift !== todayK) { s.gift = todayK; s.bag = (s.bag || 0) + 1; s.tickets = (s.tickets || 0) + 1; giftNow = true; A.save(); }
    var p = activePet(), f = formOf(p);
    var b0 = FORM_BOUNDS[f], b1 = FORM_BOUNDS[f + 1];
    var pct = Math.max(0, Math.min(100, Math.round(((p.food - b0) / (b1 - b0)) * 100)));
    var bag = s.bag || 0;
    var n = todayCount();
    var dots = [];
    for (var i = 0; i < GOAL; i++) dots.push(h("span", { class: "mdot" + (i < n ? " on" : "") }, i < n ? "🍙" : ""));
    var petEl = pet(120, "tap");
    if (A._ate) { A._ate = false; petEl.classList.add("jump"); A.confetti(8); }
    var bubble = h("div", { class: "bubble big" }, homeMessage());
    petEl.addEventListener("click", function () {
      A.sfx("pop");
      petEl.classList.remove("jump"); void petEl.offsetWidth; petEl.classList.add("jump");
      var msgs = ["くすぐったい〜!", "だいすき!", "べんきょう たのしいね", "ごはん まってるよ"];
      var m = msgs[Math.floor(Math.random() * msgs.length)];
      A.clear(bubble); bubble.appendChild(document.createTextNode(m));
      A.speak(m);
    });
    var hold = null;
    var adultBtn = h("button", { class: "btn-ghost tiny", "aria-label": "おとなの人へ(長押し)" }, "おとなの人へ");
    var startHold = function () { hold = setTimeout(function () { hold = null; adultRoom(); }, 1500); };
    var endHold = function () {
      if (hold) { clearTimeout(hold); hold = null; A.toast("ながおしで ひらくよ(おとなのひと用)"); }
    };
    adultBtn.addEventListener("pointerdown", startHold);
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { adultBtn.addEventListener(ev, endHold); });

    if (giftNow) setTimeout(function () {
      overlay("🎁", "きょうの プレゼント!", "ごはん 1こ と ガチャチケット 1まい もらったよ! 3もん クリアすると シールと チケットが もらえるよ!", "もらう!", home);
    }, 300);
    view(
      h("header", { class: "home-head" },
        h("div", null, h("div", { class: "hello" }, (s.name ? s.name + "くん、こんにちは!" : "こんにちは!")),
          h("div", { class: "streak" }, "🔥 " + (s.streak.last && A.daysBetween(s.streak.last, todayK) <= 2 ? s.streak.n : 0) + "日つづけてる" + ((s.pass || 0) ? "  🎫×" + s.pass : ""))),
        h("div", { class: "toggles" },
          h("button", { class: "btn-ghost icon", "aria-label": "こえ", onclick: function () { s.settings.voice = !s.settings.voice; A.save(); if (!s.settings.voice) A.stopSpeak(); home(); } }, s.settings.voice ? "🗣️" : "🤐"),
          h("button", { class: "btn-ghost icon", "aria-label": "おと", onclick: function () { s.settings.sound = !s.settings.sound; A.save(); home(); } }, s.settings.sound ? "🔊" : "🔇"),
          h("button", { class: "btn-ghost icon", "aria-label": "BGM", onclick: function () { A.bgm.toggle(); home(); } }, A.bgm.isOn() ? "🎵" : "🔕"))),
      h("section", { class: "pet-card" },
        bubble, petEl,
        h("div", { class: "pet-name" }, petName(p) + (f <= 1 ? "(たまご)" : ""),
          h("button", { class: "btn-ghost icon", "aria-label": "なまえを かえる", onclick: function () { renameDialog(p); } }, "✏️")),
        h("div", { class: "growbar", "aria-label": "せいちょう" }, h("div", { class: "growfill", style: { width: pct + "%" } })),
        h("div", { class: "growtext" }, "ごはん " + p.food + " / " + THRESH[3] + "   " + FORM_NEXT[f] + " あと " + Math.max(0, b1 - p.food)),
        h("button", { class: "btn big feed" + (bag ? " pulse" : ""), disabled: bag ? null : true, onclick: function () {
          if (!(s.bag > 0)) return;
          s.bag--; var ev = growBy(1); A.save(); A.sfx("good"); A._ate = true;
          if (ev.length) showEvents(ev, home); else home();
        } }, "🍙 ごはんを あげる  ×" + bag),
        bag ? null : h("div", { class: "mission-sub" }, "もんだいを とくと ごはんが もらえるよ!")),
      h("section", { class: "gacha-sec" },
        h("button", { class: "btn big gacha-btn" + ((s.tickets || 0) > 0 ? " pulse" : ""), onclick: function () { A.sfx("tap"); gachaScreen(); } }, "🎰 ガチャ  🎟️×" + (s.tickets || 0)),
        h("button", { class: "btn alt", onclick: function () { A.sfx("tap"); roomScreen(); } }, "🐾 なかまの へや (" + (s.mates || []).length + ")")),
      h("section", { class: "mission" },
        h("div", { class: "mission-title" }, "きょうの ミッション"),
        h("div", { class: "mdots" }, dots),
        h("button", { class: "btn big go", onclick: quickStart }, n >= GOAL ? "もっと あそぶ ▶" : "あそぶ ▶"),
        weekRow(),
        h("button", { class: "btn alt", onclick: function () { A.sfx("tap"); zukan("stickers"); } }, "⭐ シールちょう " + (s.stickers || []).length + " / " + STICKERS.length),
        h("div", { class: "mission-sub" }, "ぼうけんは 中1の さいしょから!"),
        h("button", { class: "btn big alt", style: { "margin-top": "10px" }, onclick: function () { A.sfx("tap"); A.write.home(); } }, "✍️ かんじ・えいたんご れんしゅう")),
      h("nav", { class: "bottom-nav" },
        h("button", { class: "nav-btn", onclick: stageSelect }, h("span", null, "🗺️"), "えらぶ"),
        h("button", { class: "nav-btn", onclick: function () { if (A.course) A.course.courseHome(); } }, h("span", null, "🧭"), "とちゅうから"),
        h("button", { class: "nav-btn", onclick: function () { if (A.course) A.course.rangeHome(); } }, h("span", null, "📝"), "テストはんい"),
        h("button", { class: "nav-btn", onclick: function () { zukan("pets"); } }, h("span", null, "📖"), "ずかん")),
      h("div", { class: "foot" }, h("button", { class: "btn alt save-btn", onclick: function () { A.sfx("tap"); saveRoom(); } }, "💾 きろくを ほぞん・ひきつぎ"), adultBtn));
  }

  function welcome() {
    var input = h("input", { class: "name-input", maxlength: "8", placeholder: "なまえ(あとで かえられるよ)", "aria-label": "なまえ" });
    view(
      h("section", { class: "welcome" },
        h("div", { class: "egg wobble", "aria-hidden": "true" }, A.creatures.el(S().pets[0].kind, 0)),
        h("h1", null, "たまごを みつけたよ!"),
        h("p", null, "もんだいを とくと ごはんが もらえるよ。ごはんを あげると、たまごから なかまが うまれるよ!"),
        h("label", null, "なまえを つけてあげよう", input),
        h("button", { class: "btn big good", onclick: function () {
          var p = S().pets[0];
          p.name = (input.value || "").trim().slice(0, 8);
          S().first = false; A.save(); A.sfx("good"); A.confetti(16);
          home();
        } }, "はじめる!"),
        h("button", { class: "btn alt save-btn", onclick: function () { A.sfx("tap"); saveRoom(); } }, "💾 ひきつぎコードで つづきから")));
  }

  /* ================= ステージ(教科マップ) ================= */
  function stageSelect() {
    var cards = SUBJECTS.map(function (sub) {
      var max = bySubject[sub.id].length * 3, got = totalStars(sub.id);
      return h("button", { class: "subject-card", style: { "--c": sub.color }, onclick: function () { A.sfx("tap"); stageMap(sub.id); } },
        h("div", { class: "subject-emoji" }, sub.emoji),
        h("div", { class: "subject-name" }, sub.id),
        h("div", { class: "subject-stars" }, "⭐ " + got + " / " + max));
    });
    view(topbar("どの ぼうけんに いく?", home),
      h("div", { class: "subject-grid" }, cards),
      h("button", { class: "btn big alt", onclick: function () {
        var sub = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)].id;
        startMission(sub, null);
      } }, "🎲 おまかせ"));
  }
  function stageMap(subId) {
    var sub = subjectInfo(subId), rec0 = recommendedSkill(subId);
    var nodes = bySubject[subId].map(function (sk, i) {
      var st = stars(sk.id), isRec = rec0 && rec0.id === sk.id;
      var starTxt = "⭐".repeat(st) + "☆".repeat(3 - st);
      return h("button", { class: "node" + (st ? " got" : "") + (isRec ? " rec" : "") + (i % 2 ? " right" : ""), style: { "--c": sub.color }, onclick: function () { A.sfx("tap"); startMission(subId, sk); } },
        h("span", { class: "node-icon" }, sk._icon),
        h("span", { class: "node-body" }, h("b", null, sk.name), h("small", null, starTxt + (isRec ? "  ← いまここ" : ""))));
    });
    view(topbar(sub.emoji + " " + subId + "ステージ", stageSelect),
      h("div", { class: "path" }, nodes),
      h("button", { class: "btn big go", onclick: function () { startMission(subId, null); } }, "おすすめで すすむ ▶"));
  }

  /* ================= ミッション(クイズ) ================= */
  var Q = null;
  function startMission(subjectId, skill, opts) {
    opts = opts || {};
    Q = { subject: subjectId, focus: skill, pool: opts.pool || null, label: opts.label || null, count: 0, target: GOAL, seen: {}, ok: 0, food: 0, newCards: [], helped: 0, events: [] };
    nextQuestion();
  }
  /* いきなりスタート: 教科をぐるぐる回しながら、中1の最初(または「どこから」で決めた所)から順に出す */
  function quickStart() {
    var n = (S().log || []).length;
    Q = { subject: SUBJECTS[n % SUBJECTS.length].id, mix: true, mixIdx: n, focus: null, pool: null, label: null, count: 0, target: GOAL, seen: {}, ok: 0, food: 0, newCards: [], helped: 0, events: [] };
    A.sfx("tap");
    nextQuestion();
  }
  function nextQuestion() {
    if (Q.mix && Q.count > 0) { Q.mixIdx++; Q.subject = SUBJECTS[Q.mixIdx % SUBJECTS.length].id; }
    var sk = Q.focus || (Q.pool ? recommendedFromList(Q.pool, true) : recommendedSkill(Q.subject));
    var p = pickProblem(sk, Q.seen);
    Q.seen[p.id] = true;
    Q.p = p; Q.skill = sk;
    Q.foe = A.enemies.forSubject(Q.subject, sk._i); Q.fx = "appear"; Q.taunt = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
    Q.choices = A.shuffle(p.choices);
    Q.writing = true; Q.wrong = []; Q.hints = 0; Q.helped = false; Q.done = false; Q.correct = null; Q.afterTutor = false;
    renderQuiz();
  }
  function renderQuiz() {
    var p = Q.p, sub = subjectInfo(Q.subject), pr = [];
    var stage = battleStage();
    for (var i = 0; i < Q.target; i++) pr.push(h("span", { class: "mdot small" + (i < Q.count ? " on" : i === Q.count ? " now" : "") }));
    var head = h("div", { class: "quiz-head" },
      h("button", { class: "btn-ghost", onclick: function () { A.stopSpeak(); home(); } }, "× やめる"),
      h("div", { class: "mdots" }, pr),
      h("div", { class: "quiz-pet" }, A.petEmoji()));
    var qcard = h("section", { class: "qcard", style: { "--c": sub.color } },
      h("div", { class: "qtag" }, sub.emoji + " " + sub.id + " ▸ " + (Q.label ? Q.label + " ▸ " : "") + Q.skill.name),
      h("p", { class: "qtext" }, p.question),
      h("button", { class: "btn small", "aria-label": "よみあげ", onclick: function (e) {
        var b = e.currentTarget;
        if (!A.speak(p.question, true)) { A.toast("このたんまつは こえが でないよ"); return; }
        b.textContent = "🔊 よんでるよ…";
        setTimeout(function () { b.textContent = "🔊 よんで"; }, 1800);
      } }, "🔊 よんで"));
    if (Q.writing && !Q.done) {
      var wcard = A.write.answerCard({
        kind: "free", text: p.answer, shown: p.hints.slice(0, Q.hints), hints: p.hints.slice(Q.hints),
        onHint: function () { Q.hints++; Q.helped = true; },
        onStuck: openTutor,
        onJudge: function (res) {
          if (res === true) { Q.writing = false; answer(p.answer); return; }
          if (Q.wrong.length === 0) rec(Q.skill.id).ng++;
          Q.wrong.push("✍" + Date.now()); Q.helped = true; Q.writing = false; Q.fx = "counter"; A.sfx("ng"); A.save(); renderQuiz();
        },
      });
      var wk = [head, stage, qcard];
      if (Q.afterTutor) wk.push(h("div", { class: "note good" }, "さっき おぼえたことで もういちど ちょうせん!"));
      wk.push(h("button", { class: "btn big choose-btn", onclick: function () { A.sfx("tap"); Q.writing = false; renderQuiz(); } }, "👆 えらんで こたえる"),
        h("div", { class: "note good" }, "✍️ ゆびで かいても OK! かいたら こたえあわせ"), wcard);
      view.apply(null, wk);
      return;
    }
    var choices = h("div", { class: "choice-col" }, Q.choices.map(function (c) {
      var wrong = Q.wrong.indexOf(c) >= 0;
      var isAns = Q.done && c === p.answer;
      return h("button", { class: "btn big choice" + (wrong ? " wrong" : "") + (isAns ? " right" : ""), disabled: wrong || Q.done ? true : null, onclick: function () { answer(c); } }, c);
    }));
    var kids = [head, qcard, choices];

    if (Q.afterTutor && !Q.done) kids.splice(1, 0, h("div", { class: "note good" }, "さっき おぼえたことで もういちど ちょうせん!"));
    if (stage) kids.splice(1, 0, stage);

    if (Q.done) {
      var indep = Q.correct && !Q.helped && Q.wrong.length === 0;
      kids.push(h("div", { class: "feedback good" },
        h("div", { class: "fb-title" }, indep ? "🎉 ばっちり!" : "⭕ できたね!"),
        h("p", null, p.explanation),
        h("p", { class: "gain" }, "🍙 ごはん +" + Q.lastFood + " (ふくろに ゲット!)" + (Q.newCard ? "   🃏 カード ゲット!" : "")),
        h("button", { class: "btn big go", onclick: afterAnswer }, Q.count >= Q.target ? "けっかを 見る ▶" : "つぎへ ▶")));
    } else {
      if (Q.wrong.length) {
        kids.push(h("div", { class: "feedback soft" },
          h("div", { class: "fb-title" }, "おしい! だいじょうぶ"),
          h("p", null, Q.wrong.length >= 2 ? "むずかしいときは「わからない」を おしてね。いっしょに もどって かんがえよう!" : "もういちど えらんでみよう。ヒントも あるよ。")));
      }
      if (Q.hints > 0) {
        kids.push(h("div", { class: "hintbox" }, p.hints.slice(0, Q.hints).map(function (t, i) {
          return h("p", null, "💡 ヒント" + (i + 1) + ": " + t);
        })));
      }
      var tools = [];
      tools.push(h("button", { class: "btn big alt", onclick: function () { A.sfx("tap"); Q.writing = true; renderQuiz(); } }, "✍️ かいて こたえる"));
      if (Q.hints < p.hints.length) {
        tools.push(h("button", { class: "btn big alt", onclick: function () {
          Q.hints++; Q.helped = true; A.sfx("pop"); renderQuiz();
          if (S().settings.voice) A.speak(p.hints[Q.hints - 1]);
        } }, "💡 ヒント"));
      }
      tools.push(h("button", { class: "btn big help" + (Q.wrong.length >= 2 ? " pulse" : ""), onclick: openTutor }, "😵 わからない"));
      kids.push(h("div", { class: "tool-row" }, tools));
    }
    view.apply(null, kids);
  }
  function answer(c) {
    var p = Q.p, ok = c === p.answer, r = rec(Q.skill.id);
    var pr = r.probs[p.id] || (r.probs[p.id] = { indep: false, last: 0 });
    if (ok) {
      var indep = !Q.helped && Q.wrong.length === 0;
      var beforeStars = stars(Q.skill.id);
      r.ok++;
      pr.last = Date.now();
      if (indep) pr.indep = true;
      Q.correct = true; Q.done = true; Q.count++;
      Q.fx = Q.afterTutor ? "special" : indep ? "crit" : "attack";
      var fo = S().foes || (S().foes = {}); fo[Q.foe.e.id] = (fo[Q.foe.e.id] || 0) + 1;
      Q.lastFood = indep ? 2 : 1;
      var pmate = S().mates && S().mates[S().partner];
      if (pmate && pmate.food - EVO >= 3 && Math.random() < 0.3) { Q.lastFood++; A.toast("🤝 あいぼうの ちからで ごはん +1!"); }
      Q.food += Q.lastFood; if (indep) Q.ok++;
      Q.newCard = beforeStars === 0;
      if (Q.newCard) Q.newCards.push(Q.skill.id);
      touchDay(true);
      logEvent({ t: Date.now(), pid: p.id, skill: Q.skill.id, subject: Q.subject, ok: true, help: Q.helped, wrong: Q.wrong.length });
      Q.events = Q.events.concat(earn(Q.lastFood));
      A.save();
      A.sfx("good"); A.confetti(indep ? 22 : 10);
    } else {
      if (Q.wrong.length === 0) r.ng++;
      Q.wrong.push(c);
      Q.fx = "counter";
      A.sfx("ng");
      A.save();
    }
    renderQuiz();
  }
  function afterAnswer() {
    var events = Q.events; Q.events = [];
    var go = function () { if (Q.count >= Q.target) result(); else nextQuestion(); };
    showEvents(events, go);
  }
  function openTutor() {
    A.sfx("tap");
    if (!Q.helped) { Q.helped = true; }
    var r = rec(Q.skill.id);
    r.help++;
    A.save();
    Q.tutorPassed = 0;
    var root = h("div", { class: "tutor" });
    view(root);
    A.tutorStart(root, Q.p, {
      subject: Q.subject,
      onPass: function (cid) {
        var ev = earn(1);
        Q.events = Q.events.concat(ev);
        Q.tutorPassed++;
        logEvent({ t: Date.now(), pid: Q.p.id, skill: Q.skill.id, subject: Q.subject, insight: cid });
        A.save();
      },
      onExit: function (res) {
        Q.wrong = []; // 学んだあとで、もう一度ぜんぶ選べる
        Q.afterTutor = true;
        var events = Q.events; Q.events = [];
        if (res.done) A.confetti(20);
        showEvents(events, renderQuiz);
      },
    });
  }

  /* ================= けっか ================= */
  function result() {
    var cards = Q.newCards.map(function (id) {
      var sk = skillMap[id];
      return h("div", { class: "card-get pop" }, h("div", { class: "card-icon" }, sk._icon), h("small", null, sk.name));
    });
    var p = activePet();
    var sNow = S(), tk = A.dayKey(), stickerBlock = null;
    if (!sNow.days[tk]) sNow.days[tk] = { n: 0, ok: 0 };
    if (todayCount() >= GOAL && !sNow.days[tk].sticker) {
      var sid = awardSticker(sNow.streak.n > 0 && sNow.streak.n % 7 === 0 ? 1 : 0);
      sNow.days[tk].sticker = true;
      sNow.tickets = (sNow.tickets || 0) + 1;
      if (sid === null) { sNow.bag = (sNow.bag || 0) + 1; stickerBlock = h("div", { class: "sticker-new pop" }, h("div", { class: "sticker-big" }, "🌟"), h("b", null, "シールを ぜんぶ あつめたよ!"), h("small", null, "ごはん +1 もらったよ"), h("div", { class: "ticket-get" }, "🎟️ ガチャチケット +1")); }
      else stickerBlock = h("div", { class: "sticker-new pop t" + STICKERS[sid][2] }, h("div", { class: "sticker-big" }, STICKERS[sid][0]), h("b", null, STICKERS[sid][1] + " の " + TIER[STICKERS[sid][2]]), h("small", null, "きょうの ミッション クリアで ゲット!"), h("div", { class: "ticket-get" }, "🎟️ ガチャチケット +1"));
      A.save();
    }
    var news = (A._news || []).map(function (t) { return h("div", { class: "note good" }, t); }); A._news = [];
    view(h("section", { class: "result" },
      h("div", { class: "result-face jump" }, A.petEmoji()),
      h("h1", null, "ミッション クリア!"),
      h("p", null, Q.target + "もん クリア。ごはん +" + Q.food + " もらったよ"),
      h("p", { class: "muted" }, petName(p) + "  ごはん " + p.food + " / " + THRESH[3]),
      stickerBlock, news.length ? h("div", null, news) : null,
      cards.length ? h("div", null, h("h3", null, "あたらしい カード"), h("div", { class: "card-row" }, cards)) : null,
      h("p", { class: "muted" }, "あしたも くると プレゼントが もらえるよ! どんな シールが もらえるかな?"),
      h("div", { class: "choice-col" },
        h("button", { class: "btn big go", onclick: function () { if (Q.mix) quickStart(); else startMission(Q.subject, Q.focus, { pool: Q.pool, label: Q.label }); } }, "つづけて あそぶ ▶"),
        h("button", { class: "btn big alt", onclick: home }, "ホームに もどる"))));
    A.sfx("levelup"); A.confetti(30);
    A.speak("ミッション クリア! よくがんばったね");
  }

  /* ================= ずかん ================= */
  function zukan(tab) {
    var tabs = h("div", { class: "tabs" },
      h("button", { class: "tab" + (tab === "pets" ? " on" : ""), onclick: function () { zukan("pets"); } }, "🐾 なかま"),
      h("button", { class: "tab" + (tab === "foes" ? " on" : ""), onclick: function () { zukan("foes"); } }, "👾 てき"),
      h("button", { class: "tab" + (tab === "cards" ? " on" : ""), onclick: function () { zukan("cards"); } }, "🃏 カード"),
      h("button", { class: "tab" + (tab === "stickers" ? " on" : ""), onclick: function () { zukan("stickers"); } }, "⭐ シール"));
    var body;
    if (tab === "pets") {
      var gotN = 0;
      var items = CREATURES.map(function (c, i) {
        var mine = S().pets.filter(function (p) { return p.kind === i; });
        var done = mine.some(function (p) { return p.done; });
        var growing = !done && mine.some(function (p) { return formOf(p) >= 2; });
        if (done) gotN++;
        var art = done ? A.creatures.el(i, 3) : growing ? A.creatures.el(i, 2) : A.creatures.silhouette(i);
        return h("div", { class: "z-item" + (done || growing ? " on" : "") },
          h("div", { class: "z-face cr-face" }, art),
          h("small", null, done ? c.n : growing ? c.n + "(そだち中)" : "???"),
          h("div", { class: "z-stars" }, done || growing ? (c.type === "cool" ? "⚔️ " : "💗 ") + "★".repeat(c.r) + "☆".repeat(3 - c.r) : ""));
      });
      body = h("div", null, h("p", { class: "muted" }, "あつめた " + gotN + " / " + CREATURES.length + "。そだてあげると ずかんに のるよ。"), h("div", { class: "z-grid" }, items));
    } else if (tab === "stickers") {
      var own = S().stickers || [];
      var sitems = STICKERS.map(function (x, i) {
        var has = own.indexOf(i) >= 0;
        return h("div", { class: "z-item" + (has ? " on" : "") }, h("div", { class: "sticker-cell t" + x[2] }, has ? x[0] : "?"), h("small", null, has ? x[1] : "???"));
      });
      body = h("div", null, h("p", { class: "muted" }, "あつめた " + own.length + " / " + STICKERS.length + "。1日3もん クリアで 1まい もらえるよ。7日つづけると レアが でやすいよ!"), h("div", { class: "z-grid" }, sitems));
    } else if (tab === "foes") {
      var fo = S().foes || {}, total = 0;
      var fitems = A.enemies.list.map(function (e) {
        var n = fo[e.id] || 0; total += n;
        return h("div", { class: "z-item" + (n ? " on" : "") },
          h("div", { class: "z-face cr-face" }, A.enemies.el(e.id, 0, n ? "" : "cr-sil")),
          h("small", null, n ? e.n : "???"),
          h("div", { class: "z-stars" }, n ? e.subject + " ×" + n : ""));
      });
      body = h("div", null, h("p", { class: "muted" }, "たおした てき: " + total + "たい。もんだいを とくと なかまが たおすよ!"), h("div", { class: "z-grid" }, fitems));
    } else {
      body = h("div", null, SUBJECTS.map(function (sub) {
        return h("section", { class: "z-sub" },
          h("h3", { style: { color: sub.color } }, sub.emoji + " " + sub.id),
          h("div", { class: "z-grid cards" }, bySubject[sub.id].map(function (sk) {
            var st = stars(sk.id);
            return h("div", { class: "z-card" + (st ? " on" : "") },
              h("div", { class: "z-face" }, st ? sk._icon : "❓"),
              h("small", null, st ? sk.name : "???"),
              h("div", { class: "z-stars" }, "⭐".repeat(st) + "☆".repeat(3 - st)));
          })));
      }));
    }
    view(topbar("ずかん", home), tabs, body);
  }

  /* ================= きろくの ほぞん・ひきつぎ ================= */
  function encodeSave() { return "AOTO2-" + btoa(unescape(encodeURIComponent(JSON.stringify(A.S)))); }
  function decodeSave(code) {
    var t = String(code || "").replace(/\s+/g, "");
    if (t.indexOf("AOTO2-") === 0) t = t.slice(6);
    var o = JSON.parse(decodeURIComponent(escape(atob(t))));
    if (!o || typeof o !== "object" || !o.pets || !o.skills) throw new Error("bad");
    return o;
  }
  function saveRoom() {
    var out = h("textarea", { class: "export", readonly: "", rows: "4" });
    out.value = encodeSave();
    var inp = h("textarea", { class: "export", rows: "4", placeholder: "ここに ひきつぎコードを はりつけ" });
    view(topbar("きろくの ほぞん", home),
      h("section", { class: "adult" },
        h("p", null, "ブラウザを とじたり、べつの たんまつや ホーム画面から ひらくと、きろくが きえることが あるよ。そんなときのために、ひきつぎコードを とっておこう。"),
        h("h3", null, "① コードを コピーして とっておく"),
        out,
        h("button", { class: "btn big", onclick: function () {
          out.value = encodeSave(); out.select();
          var done = function () { A.toast("コピーしました! メモなどに はりつけて とっておいてね"); };
          try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(out.value).then(done, done); return; } } catch (e) {}
          try { document.execCommand("copy"); } catch (e2) {}
          done();
        } }, "📋 コードを コピー"),
        h("h3", null, "② ひきつぎコードから つづきを よみこむ"),
        inp,
        h("button", { class: "btn big alt", onclick: function () {
          var o;
          try { o = decodeSave(inp.value); } catch (e) { A.toast("コードが ただしくないみたい…"); return; }
          if (!confirm("いまの きろくを コードの きろくに おきかえます。よろしいですか?")) return;
          var d = A.S; A.S = o; Object.keys(d).forEach(function (k) { if (A.S[k] === undefined) A.S[k] = d[k]; });
          A.S.first = false; A.save(); A.sfx("good"); A.toast("つづきから はじめられるよ!"); home();
        } }, "📥 つづきを よみこむ")));
  }

  /* ================= おとなのへや ================= */
  function adultRoom() {
    var s = S();
    var keys = Object.keys(s.days).sort();
    var recent = keys.slice(-14).map(function (k) {
      var d = s.days[k];
      return h("tr", null, h("td", null, k.slice(5)), h("td", null, d.n + "もん"), h("td", null, d.ok + " せいかい"));
    });
    var skillRows = [];
    SUBJECTS.forEach(function (sub) {
      bySubject[sub.id].forEach(function (sk) {
        var r = s.skills[sk.id];
        if (!r) return;
        skillRows.push(h("tr", null, h("td", null, sub.id), h("td", null, sk.name), h("td", null, "⭐".repeat(stars(sk.id)) || "-"), h("td", null, r.ok + "/" + r.ng), h("td", null, r.help)));
      });
    });
    var logRows = s.log.slice(-20).reverse().map(function (e) {
      var p = D.problems.filter(function (x) { return x.id === e.pid; })[0];
      var d = new Date(e.t);
      var when = (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
      var what = e.insight ? "💡 前提を理解: " + A.tutorConceptTitle(e.insight) : (e.ok ? "⭕" : "❌") + (e.help ? "(助けあり)" : "") + " " + (p ? p.question.slice(0, 22) : e.pid);
      return h("tr", null, h("td", null, when), h("td", null, what));
    });
    var total = s.log.filter(function (e) { return e.ok; }).length;
    var insights = s.log.filter(function (e) { return e.insight; }).length;
    var box = h("textarea", { class: "export", readonly: "", rows: "4", style: { display: "none" } });
    view(topbar("おとなのへや", home),
      h("section", { class: "adult" },
        h("p", null, "つづけた日数: " + s.streak.n + "日 / 使った日: " + keys.length + "日 / 正解: " + total + "もん / 前提まで戻って理解: " + insights + "回"),
        h("h3", null, "最近の学習(日ごと)"), h("table", null, recent.length ? recent : h("tr", null, h("td", null, "まだ記録がありません"))),
        h("h3", null, "単元ごと(正解/ミス・助けた回数)"),
        h("table", null, h("tr", null, h("th", null, "教科"), h("th", null, "単元"), h("th", null, "星"), h("th", null, "○/×"), h("th", null, "わからない")), skillRows),
        h("h3", null, "さいきんの記録"), h("table", null, logRows),
        h("div", { class: "choice-col" },
          h("button", { class: "btn alt", onclick: function () {
            box.value = JSON.stringify(s); box.style.display = "block"; box.select();
            try { if (navigator.clipboard) navigator.clipboard.writeText(box.value); A.toast("コピーしました"); } catch (e) {}
          } }, "記録を書き出す(バックアップ)"),
          box,
          h("button", { class: "btn danger", onclick: function () {
            if (confirm("ぜんぶの記録を消して、さいしょからにします。よろしいですか?")) { A.reset(); home(); }
          } }, "記録を ぜんぶ消す"))));
  }

  /* ================= 起動 ================= */
  A.start = function () {
    try { home(); } catch (e) {
      app.appendChild(h("pre", { class: "err" }, "エラー: " + (e && e.message)));
    }
  };
  A.core = { feed: earn, earn: earn, touchDay: touchDay, logEvent: logEvent, showEvents: showEvents, view: view, topbar: topbar, stars: stars, skillMap: skillMap, startMission: startMission, home: home, SUBJECTS: SUBJECTS, subjectInfo: subjectInfo, save: function () { A.save(); } };
  A.debug = { skill: function (id) { return skillMap[id]; }, stars: stars, Q: function () { return Q; }, startMission: startMission, home: home, feed: growBy, view: view };
})();
