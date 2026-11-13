/* AOTO2 「わからない」→ やさしい説明 → 確かめる → ひとつ前へ戻る
   既存AOTOの 82 の説明(前提つき)をそのまま使い、声とアニメで一度に一つずつ見せる。 */
(function () {
  "use strict";
  var A = window.A, h = A.h;
  var D = window.AOTO_DATA;
  var concepts = {};
  D.concepts.forEach(function (c) { concepts[c.id] = c; });
  A.concepts = concepts;

  var FOUNDATION = { 数学: "m-int", 英語: "e-word", 国語: "j-read", 理科: "s-observe", 社会: "h-map" };

  function pieces(c, ex) {
    var n = c.examples.length || 1;
    var i = ex % n;
    var list = [
      { head: "まず、ことばの いみ", text: c.meaning, visual: null },
      { head: "ちいさな れいで 見よう", text: c.examples[i] || c.meaning, visual: c.visuals ? c.visuals[i] || c.visuals[0] : null },
    ];
    c.steps.forEach(function (s, k) {
      list.push({ head: "ひとつずつ " + (k + 1), text: s, visual: c.visuals ? c.visuals[i] || c.visuals[0] : null });
    });
    return list;
  }

  /* opts: { subject, skill, onPass(conceptId), onExit({done,closed,passed}) } */
  A.tutorStart = function (root, problem, opts) {
    var first = D.skillConcept[problem.skill] || FOUNDATION[opts.subject] || "m-int";
    if (!concepts[first]) first = FOUNDATION[opts.subject] || "m-int";
    var frames = [{ cid: first, piece: 0, ex: 0 }];
    var check = null; // {variant, answer, correct, submitted, rev}
    var chooser = false;
    var passed = 0;
    var rev = 0;

    function cur() { return frames[frames.length - 1]; }
    function concept() { return concepts[cur().cid]; }

    function prereqs() {
      var used = {};
      frames.forEach(function (f) { used[f.cid] = true; });
      return (concept().prerequisites || []).filter(function (id) { return concepts[id] && !used[id]; });
    }

    function speakPanel(p) {
      if (A.S.settings.voice) A.speak(p.text);
    }

    function descend(id) {
      A.sfx("pop");
      frames.push({ cid: id, piece: 0, ex: 0 });
      check = null; chooser = false; rev++;
      render();
    }
    function askEasier() {
      var list = prereqs();
      if (!list.length) {
        // いちばん やさしいところ: 別の例でもう一度
        var f = cur();
        f.ex++; f.piece = 1; check = null; rev++;
        render(true);
        return;
      }
      if (list.length === 1) return descend(list[0]);
      chooser = true;
      render();
    }
    function finishOrPop() {
      passed++;
      if (opts.onPass) opts.onPass(cur().cid);
      if (frames.length > 1) {
        frames.pop();
        var f = cur();
        f.ex++; f.piece = 1; check = null; chooser = false; rev++;
        render(true);
      } else {
        A.stopSpeak();
        opts.onExit({ done: true, passed: passed });
      }
    }
    function close() {
      A.stopSpeak();
      opts.onExit({ closed: true, passed: passed });
    }

    function ladder() {
      var chips = [h("span", { class: "rung start" }, "もんだい")];
      frames.forEach(function (f, i) {
        chips.push(h("span", { class: "rung-arrow" }, "▸"));
        chips.push(h("span", { class: "rung" + (i === frames.length - 1 ? " here" : "") }, concepts[f.cid].title));
      });
      return h("div", { class: "ladder", "aria-label": "いま どこまで もどっているか" }, chips);
    }

    function guide(text) {
      return h("div", { class: "guide" },
        h("div", { class: "guide-pet" }, A.petEmoji()),
        h("div", { class: "bubble" }, text));
    }

    function render(autoSpeak) {
      A.clear(root);
      var c = concept(), f = cur();
      var top = h("div", { class: "topbar" },
        h("button", { class: "btn-ghost", onclick: close }, "← もんだいへ"),
        h("button", { class: "btn-ghost icon", "aria-label": "こえ", onclick: function () {
          A.S.settings.voice = !A.S.settings.voice; A.save(); if (!A.S.settings.voice) A.stopSpeak(); render();
        } }, A.S.settings.voice ? "🔊" : "🔇"));
      var body;

      if (chooser) {
        body = h("section", { class: "card" },
          guide("どこが わからないかな? おしえてね"),
          h("div", { class: "choice-col" }, prereqs().map(function (id) {
            return h("button", { class: "btn big alt", onclick: function () { descend(id); } }, "🪜 " + concepts[id].title);
          })),
          h("button", { class: "btn-ghost", onclick: function () { chooser = false; render(); } }, "← やっぱり もどる"));
        root.appendChild(top); root.appendChild(ladder()); root.appendChild(body);
        return;
      }

      if (check) {
        var q = c.checks[check.variant % c.checks.length];
        var choices = q.choices.slice((rev + check.variant) % q.choices.length).concat(q.choices.slice(0, (rev + check.variant) % q.choices.length));
        var cardKids = [guide(check.submitted ? (check.correct ? "せいかい! すごい!" : "おしい! だいじょうぶ、いっしょに") : "たしかめてみよう!"),
          h("p", { class: "big-text" }, q.question)];
        if (!check.submitted) {
          cardKids.push(h("div", { class: "choice-col" }, choices.map(function (ch) {
            return h("button", { class: "btn big choice", onclick: function () {
              check.answer = ch; check.correct = ch === q.answer; check.submitted = true;
              A.sfx(check.correct ? "ok" : "ng");
              if (check.correct) A.confetti(12);
              render();
              if (A.S.settings.voice) A.speak((check.correct ? "せいかい。" : "おしい。") + q.explanation);
            } }, ch);
          })));
          cardKids.push(h("button", { class: "btn-ghost", onclick: function () { check = null; render(); } }, "← もういちど 見る"));
        } else {
          cardKids.push(h("p", { class: "explain " + (check.correct ? "good" : "soft") }, q.explanation));
          var acts = [];
          if (check.correct) {
            acts.push(h("button", { class: "btn big good", onclick: finishOrPop }, frames.length > 1 ? "☑ わかった! ひとつ もどる ▶" : "☑ わかった! もんだいへ ▶"));
          } else {
            acts.push(h("button", { class: "btn big", onclick: function () {
              var ff = cur(); ff.ex++; ff.piece = 1; check = null; rev++; render(true);
            } }, "🔁 べつの れいで もういちど"));
            if (prereqs().length) acts.push(h("button", { class: "btn big alt", onclick: askEasier }, "🪜 もっと やさしく"));
          }
          cardKids.push(h("div", { class: "choice-col" }, acts));
        }
        body = h("section", { class: "card" }, cardKids);
        root.appendChild(top); root.appendChild(ladder()); root.appendChild(body);
        return;
      }

      var list = pieces(c, f.ex);
      if (f.piece >= list.length) f.piece = list.length - 1;
      var p = list[f.piece];
      var last = f.piece === list.length - 1;
      var vis = p.visual ? A.renderVisual(p.visual) : null;
      var dots = h("div", { class: "dots" }, list.map(function (_, i) {
        return h("span", { class: "dot-i" + (i === f.piece ? " on" : i < f.piece ? " past" : "") });
      }));
      var nav = [];
      nav.push(h("button", { class: "btn small", "aria-label": "もういちど きく", onclick: function () {
        if (!A.speak(p.text, true)) A.toast("このたんまつは こえが でないよ");
      } }, "🔊"));
      nav.push(h("button", { class: "btn small", disabled: f.piece === 0 && frames.length === 1 ? true : null, onclick: function () {
        if (f.piece > 0) f.piece--; else if (frames.length > 1) frames.pop();
        rev++; render(true);
      } }, "◀"));
      var actions = [];
      if (!last) {
        nav.push(h("button", { class: "btn big grow", onclick: function () { f.piece++; rev++; render(true); } }, "つぎ ▶"));
      }
      actions.push(h("div", { class: "nav-row" }, nav));
      if (last) {
        actions.push(h("button", { class: "btn big good", onclick: function () {
          check = { variant: f.ex % c.checks.length, answer: null, correct: null, submitted: false };
          rev++; render();
        } }, "😊 わかった! たしかめる"));
      }
      if (prereqs().length) {
        actions.push(h("button", { class: "btn big alt", onclick: askEasier }, "🪜 まだ むずかしい → もっと やさしく"));
      } else if (last) {
        actions.push(h("button", { class: "btn big alt", onclick: function () { f.ex++; f.piece = 1; rev++; render(true); } }, "🔁 べつの れいを 見る"));
      }
      body = h("section", { class: "card" },
        h("div", { class: "concept-title" }, c.title),
        guide(p.head),
        h("p", { class: "big-text" }, p.text),
        vis, dots, actions);
      root.appendChild(top); root.appendChild(ladder()); root.appendChild(body);
      if (autoSpeak !== false) speakPanel(p);
    }

    render();
  };

  A.tutorConceptTitle = function (id) { return concepts[id] ? concepts[id].title : id; };
})();
