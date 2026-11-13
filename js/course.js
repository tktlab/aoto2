/* どこから始める / テストはんい */
(function () {
  "use strict";
  var A = window.A, h = A.h, C = window.AOTO_CURRICULUM, K = A.core;
  var S = function () { return A.S; };
  var sel = {}; // テスト範囲の選択中ユニット
  A.course = { courseHome: courseHome, rangeHome: rangeHome };

  function color(sub) { var i = K.subjectInfo(sub); return i ? i.color : "#8a93b0"; }
  function emoji(sub) { var i = K.subjectInfo(sub); return i ? i.emoji : { 音楽: "🎵", 美術: "🎨", 保健体育: "🏃", 技術家庭: "🔧", 道徳: "🤝" }[sub] || "📘"; }
  function unitsOf(sub, g) { return C.units.filter(function (u) { return u.sub === sub && (g === undefined || u.g === g); }); }
  function gradesOf(sub) { var o = []; unitsOf(sub).forEach(function (u) { if (o.indexOf(u.g) < 0) o.push(u.g); }); return o.sort(); }
  function pool(units) {
    var seen = {}, out = [];
    units.forEach(function (u) { u.skills.forEach(function (id) { if (K.skillMap[id] && !seen[id]) { seen[id] = 1; out.push(K.skillMap[id]); } }); });
    return out;
  }
  function unitStars(u) {
    var got = 0, max = 0;
    u.skills.forEach(function (id) { if (K.skillMap[id]) { max += 3; got += K.stars(id); } });
    return { got: got, max: max };
  }
  function tag(u) {
    var s = unitStars(u);
    return s.max ? h("span", { class: "u-tag ok" }, "⭐ " + s.got + "/" + s.max) : h("span", { class: "u-tag" }, "じゅんびちゅう");
  }
  function play(sub, units, label) {
    var p = pool(units);
    if (!p.length) { A.toast("この はんいは まだ もんだいが ないよ"); return; }
    A.sfx("tap");
    K.startMission(sub, null, { pool: p, label: label });
  }

  /* ---------- どこから ---------- */
  function courseHome() {
    var subs = C.subjects.map(function (sub) {
      var n = pool(unitsOf(sub)).length;
      return h("button", { class: "pick-btn", style: { color: color(sub) }, onclick: function () { A.sfx("tap"); gradePick(sub); } },
        emoji(sub) + " " + sub, h("small", null, n ? "もんだい あり" : "じゅんびちゅう"));
    });
    K.view(K.topbar("どこから はじめる?", K.home),
      h("p", { class: "note" }, "きょうかを えらんで、1ねんの さいしょからでも、とちゅうからでも はじめられるよ。"),
      h("div", { class: "pick-grid" }, subs),
      h("p", { class: "note" }, "「じゅんびちゅう」は、がくしゅうする ないようは きまっているけど、もんだいは これから つくるよ。"));
  }
  function gradePick(sub) {
    var chips = gradesOf(sub).map(function (g) {
      var us = unitsOf(sub, g), n = us.filter(function (u) { return u.skills.length; }).length;
      return h("button", { class: "pick-btn", onclick: function () { A.sfx("tap"); unitList(sub, g); } },
        C.gradeLabel[g], h("small", null, "もんだい あり " + n + " / " + us.length));
    });
    K.view(K.topbar(sub, courseHome), h("div", { class: "pick-grid" }, chips));
  }
  function unitList(sub, g) {
    var cur = S().course && S().course[sub];
    var items = unitsOf(sub, g).map(function (u) {
      return h("button", { class: "unit" + (cur === u.id ? " sel" : ""), onclick: function () { unitDetail(u); } },
        h("span", { class: "u-main" }, u.name, h("span", { class: "u-sub" }, u.area || "")), tag(u));
    });
    K.view(K.topbar(sub + " ・ " + C.gradeLabel[g], function () { gradePick(sub); }),
      cur ? h("p", { class: "note" }, "▶ いまの スタート: " + (C.units.filter(function (u) { return u.id === cur; })[0] || {}).name) : null,
      items,
      g !== 0 && g !== 4 && sub !== "数学" ? null : null,
      h("p", { class: "note" }, g === 3 || g === 2 ? "※ 学年ごとの ならびは がっこうの きょうかしょと ちがう ことが あるよ。" : ""));
  }
  function unitDetail(u) {
    var has = u.skills.length > 0;
    var back = function () { unitList(u.sub, u.g); };
    K.view(K.topbar(u.name, back),
      h("div", { class: "card" },
        h("div", { class: "note" }, C.gradeLabel[u.g] + " ・ " + u.sub + (u.area ? " ・ " + u.area : "")),
        h("ul", null, u.topics.map(function (t) { return h("li", null, t); })),
        u.conf === "typical" ? h("p", { class: "note" }, "※ この学年の ならびは 一般的な ものだよ(がっこうの きょうかしょで かくにん)。") : null),
      has ? h("button", { class: "btn big go", onclick: function () { play(u.sub, [u], u.name); } }, "この たんげんで あそぶ ▶") : h("p", { class: "note" }, "まだ もんだいが ないよ(じゅんびちゅう)。"),
      h("button", { class: "btn alt", onclick: function () {
        S().course = S().course || {}; S().course[u.sub] = u.id; A.save(); A.sfx("good");
        A.toast("ここから はじめるよ: " + u.name); back();
      } }, "ここから はじめる(これいこうを じゅんばんに)"),
      S().course && S().course[u.sub] ? h("button", { class: "btn-ghost", onclick: function () { delete S().course[u.sub]; A.save(); A.toast("はじめの じゅんばんに もどしたよ"); back(); } }, "スタートを リセット") : null);
  }

  /* ---------- テストはんい ---------- */
  function rangeHome() {
    var rs = S().ranges || [];
    var saved = rs.map(function (r, i) {
      return h("div", { class: "nav-row" },
        h("button", { class: "unit", onclick: function () { sel = {}; r.units.forEach(function (id) { sel[id] = 1; }); rangePick(r.sub, r.name); } },
          h("span", { class: "u-main" }, "📝 " + r.name, h("span", { class: "u-sub" }, r.sub + " ・ " + r.units.length + "たんげん"))),
        h("button", { class: "btn-ghost", "aria-label": "さくじょ", onclick: function () { S().ranges.splice(i, 1); A.save(); rangeHome(); } }, "🗑️"));
    });
    var subs = C.subjects.map(function (sub) {
      return h("button", { class: "pick-btn", style: { color: color(sub) }, onclick: function () { sel = {}; rangePick(sub, ""); } }, emoji(sub) + " " + sub);
    });
    K.view(K.topbar("テストはんい", K.home),
      saved.length ? h("div", null, h("p", { class: "note" }, "ほぞんした はんい"), saved) : null,
      h("p", { class: "note" }, "きょうかを えらんで、テストに でる たんげんに チェックを つけてね。"),
      h("div", { class: "pick-grid" }, subs));
  }
  function rangePick(sub, name) {
    var nameIn = h("input", { class: "name-input", maxlength: "12", placeholder: "なまえ(れい: 1がっき ちゅうかん)", value: name || "", "aria-label": "はんいの なまえ" });
    var list = h("div");
    var info = h("p", { class: "note" });
    var go = h("button", { class: "btn big go" }, "この はんいで あそぶ ▶");
    var saveBtn = h("button", { class: "btn alt" }, "この はんいを ほぞん");
    function chosen() { return unitsOf(sub).filter(function (u) { return sel[u.id]; }); }
    function refresh() {
      var c = chosen(), withQ = c.filter(function (u) { return u.skills.length; }).length;
      A.clear(info);
      info.appendChild(document.createTextNode("えらんだ: " + c.length + "こ ・ もんだい あり: " + withQ + "こ" + (c.length && !withQ ? "(まだ もんだいが ないよ)" : "")));
      go.disabled = !withQ; saveBtn.disabled = !c.length;
      Array.prototype.forEach.call(list.querySelectorAll(".unit[data-id]"), function (el) { el.classList.toggle("sel", !!sel[el.dataset.id]); el.querySelector("input").checked = !!sel[el.dataset.id]; });
    }
    var mode = "unit", csel = {};
    var chs = (C.chapters || []).filter(function (c) { return c.sub === sub; });
    var modeRow = h("div", { class: "chip-row" });
    function chapterStars(c) {
      var got = 0, max = 0;
      c.units.forEach(function (id) { var u = C.units.filter(function (x) { return x.id === id; })[0]; var st = unitStars(u); got += st.got; max += st.max; });
      return max ? h("span", { class: "u-tag ok" }, "⭐ " + got + "/" + max) : h("span", { class: "u-tag" }, "じゅんびちゅう");
    }
    function buildList() {
      A.clear(list);
      if (mode === "unit") {
        gradesOf(sub).forEach(function (g) {
          list.appendChild(h("div", { class: "note" }, C.gradeLabel[g]));
          unitsOf(sub, g).forEach(function (u) {
            var cb = h("input", { type: "checkbox", "aria-label": u.name });
            var el = h("label", { class: "unit", "data-id": u.id }, cb, h("span", { class: "u-main" }, u.name), tag(u));
            cb.addEventListener("change", function () { if (cb.checked) sel[u.id] = 1; else delete sel[u.id]; refresh(); });
            list.appendChild(el);
          });
        });
      } else {
        var lastKey = null;
        chs.forEach(function (c) {
          var key = (c.part || "") + c.g;
          if (key !== lastKey) { lastKey = key; list.appendChild(h("div", { class: "note" }, (c.part ? c.part + " ・ " : "") + c.pub + "の きょうかしょ ・ " + C.gradeLabel[c.g])); }
          var cb = h("input", { type: "checkbox", "aria-label": c.title });
          cb.checked = !!csel[c.id];
          var el = h("label", { class: "unit" + (csel[c.id] ? " sel" : "") }, cb, h("span", { class: "u-main" }, (c.no ? c.no + " " : "") + c.title), chapterStars(c));
          cb.addEventListener("change", function () {
            if (cb.checked) csel[c.id] = 1; else delete csel[c.id];
            sel = {}; chs.forEach(function (x) { if (csel[x.id]) x.units.forEach(function (id) { sel[id] = 1; }); });
            el.classList.toggle("sel", cb.checked); refresh();
          });
          list.appendChild(el);
        });
      }
      refresh();
    }
    function buildModes() {
      A.clear(modeRow);
      modeRow.appendChild(h("button", { class: "chip" + (mode === "unit" ? " on" : ""), onclick: function () { mode = "unit"; buildModes(); buildList(); } }, "たんげんで えらぶ"));
      if (chs.length) modeRow.appendChild(h("button", { class: "chip" + (mode === "chap" ? " on" : ""), onclick: function () { mode = "chap"; csel = {}; sel = {}; buildModes(); buildList(); } }, "きょうかしょで えらぶ"));
    }
    var quick = h("div", { class: "chip-row", id: "quick" }, gradesOf(sub).map(function (g) {
      return h("button", { class: "chip", onclick: function () {
        var us = unitsOf(sub, g), all = us.every(function (u) { return sel[u.id]; });
        us.forEach(function (u) { if (all) delete sel[u.id]; else sel[u.id] = 1; }); mode = "unit"; buildModes(); buildList();
      } }, C.gradeLabel[g] + " ぜんぶ");
    }));
    go.onclick = function () { play(sub, chosen(), nameIn.value.trim() || "テストはんい"); };
    saveBtn.onclick = function () {
      var rs = S().ranges = S().ranges || [], nm = nameIn.value.trim() || (sub + "の はんい");
      rs = rs.filter(function (r) { return r.name !== nm || r.sub !== sub; });
      rs.unshift({ name: nm, sub: sub, units: chosen().map(function (u) { return u.id; }) });
      S().ranges = rs.slice(0, 5); A.save(); A.sfx("good"); A.toast("ほぞんしたよ");
    };
    K.view(K.topbar("テストはんい ・ " + sub, rangeHome), nameIn, modeRow, quick, list, info, go, saveBtn);
    buildModes(); buildList();
  }
})();
