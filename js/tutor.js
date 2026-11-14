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

  /* もんだい文と どれだけ かかわるか(漢字・カタカナの ことばが いくつ かさなるか) */
  var STOP = {}; ["意味", "答え", "問題", "正しい", "説明", "英語", "日本語", "空欄", "簡単", "文字", "近い", "表す", "合う", "選ぶ", "次の", "どれ", "記号", "言葉", "部分", "方法", "理由", "場合", "データ"].forEach(function (w) { STOP[w] = 1; });
  function relScore(q, text) {
    var words = String(q || "").match(/[一-龥ァ-ヶー]{2,}/g) || [], s = 0;
    words.forEach(function (w) { if (STOP[w]) return; if (String(text || "").indexOf(w) >= 0) s += w.length; });
    return s;
  }
  function bestIndex(q, arr, get) {
    var best = 0, bs = -1;
    (arr || []).forEach(function (x, i) { var sc = relScore(q, get(x)); if (sc > bs) { bs = sc; best = i; } });
    return bs > 0 ? best : 0;
  }
  function pieces(c, ex, tip) {
    var n = c.examples.length || 1;
    var i = ex % n;
    var list = [
      { head: "まず、ことばの いみ", text: c.meaning, visual: null },
      { head: "ちいさな れいで 見よう", text: c.examples[i] || c.meaning, visual: c.visuals ? c.visuals[i] || c.visuals[0] : null },
    ];
    c.steps.forEach(function (s, k) {
      list.push({ head: "ひとつずつ " + (k + 1), text: s, visual: c.visuals ? c.visuals[i] || c.visuals[0] : null });
    });
    if (tip) list.unshift({ head: "この もんだいの ポイント", text: tip, visual: null });
    return list;
  }

  /* けいさんの こたえは さいごだけ「？」に して、じぶんで できるように */
  function maskAnswer(text, ans) {
    text = String(text || ""); ans = String(ans || "");
    if (!/[0-9]/.test(ans) || !ans) return text;
    var vars = [ans, ans.replace(/−/g, "-"), ans.replace(/-/g, "−"), ans.replace(/\s+/g, "")];
    vars.forEach(function (v) {
      if (!v) return;
      var out = "", i = 0;
      while (true) {
        var k = text.indexOf(v, i);
        if (k < 0) { out += text.slice(i); break; }
        var before = text[k - 1] || "", after = text[k + v.length] || "";
        var pre = text.slice(0, k).replace(/\s+$/, ""), lastc = pre.slice(-1);
        var isResult = /[=＝]/.test(lastc) || pre === "";
        var glued = /[0-9.a-z]/.test(after) && /[0-9a-z]$/.test(v);
        out += text.slice(i, k) + (isResult && !glued ? "？" : v);
        i = k + v.length;
      }
      text = out;
    });
    return text;
  }
  function focusPanels(problem, c0, qtext) {
    var list = [];
    var tip = (problem.hints || []).filter(function (x) { return x && x.indexOf("問題文の条件") < 0 && x !== problem.explanation && x.indexOf(problem.answer) < 0; })[0];
    if (tip) list.push({ head: "この もんだいの ポイント", text: tip });
    var way = maskAnswer(problem.explanation, problem.answer);
    if (way && way !== tip) list.push({ head: /[0-9]/.test(problem.answer) && way !== problem.explanation ? "とき方の みちすじ(さいごの「？」を かんがえよう)" : "とき方", text: way });
    if (c0 && c0.examples) {
      var bi = -1, bs = 0;
      c0.examples.forEach(function (x, i) { var sc = relScore(qtext, x); if (sc > bs) { bs = sc; bi = i; } });
      if (bi >= 0) {
        var exT = c0.examples[bi], same = /[0-9]/.test(problem.answer) && exT.indexOf(problem.answer) >= 0 && maskAnswer(exT, problem.answer) !== exT;
        if (!same) list.push({ head: "にた れいで 見よう", text: exT, visual: c0.visuals ? c0.visuals[bi] : null });
      }
    }
    return list;
  }

  /* opts: { subject, skill, onPass(conceptId), onExit({done,closed,passed,reveal}) } */
  A.tutorStart = function (root, problem, opts) {
    var first = D.skillConcept[problem.skill] || FOUNDATION[opts.subject] || "m-int";
    if (!concepts[first]) first = FOUNDATION[opts.subject] || "m-int";
    var c0 = concepts[first], qtext = problem.question;
    var ex0 = bestIndex(qtext, c0.examples, function (x) { return x; });
    var chk0 = bestIndex(qtext, c0.checks, function (x) { return x.question; });
    var tip = (problem.hints || []).filter(function (x) { return x && x.indexOf("問題文の条件") < 0 && x !== problem.explanation && x.indexOf(problem.answer) < 0; })[0] || null;
    var frames = [{ cid: first, piece: 0, ex: ex0, ex0: ex0, chk0: chk0 }];
    var fp = focusPanels(problem, c0, qtext), focus = fp.length > 0, fstep = 0;
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
      var qbox = h("div", { class: "tq" }, h("small", null, "いま といている もんだい"), h("div", null, problem.question));

      if (focus) {
        var fpn = fp[fstep], lastF = fstep === fp.length - 1;
        var fnav = [h("button", { class: "btn small", "aria-label": "もういちど きく", onclick: function () { if (!A.speak(fpn.text, true)) A.toast("このたんまつは こえが でないよ"); } }, "🔊"),
          h("button", { class: "btn small", disabled: fstep === 0 ? true : null, onclick: function () { fstep--; render(true); } }, "◀")];
        if (!lastF) fnav.push(h("button", { class: "btn big grow", onclick: function () { fstep++; render(true); } }, "つぎ ▶"));
        var facts = [h("div", { class: "nav-row" }, fnav)];
        if (lastF) facts.push(h("button", { class: "btn big good", onclick: function () { A.stopSpeak(); passed++; opts.onExit({ done: true, passed: passed, focus: true }); } }, "😊 わかった! もんだいに もどる"));
        facts.push(h("button", { class: "btn big alt", onclick: function () { focus = false; rev++; render(true); } }, "🪜 まだ わからない → きほんから せつめい"));
        facts.push(h("button", { class: "btn-ghost", onclick: function () { A.stopSpeak(); opts.onExit({ reveal: true, passed: passed }); } }, "📖 こたえを 見て つぎへ(まちがいノートに いれるよ)"));
        body = h("section", { class: "card" },
          h("div", { class: "dots" }, fp.map(function (_, i) { return h("span", { class: "dot-i" + (i === fstep ? " on" : i < fstep ? " past" : "") }); })),
          guide(fpn.head), h("p", { class: "big-text" }, fpn.text), fpn.visual ? A.renderVisual(fpn.visual) : null, facts);
        root.appendChild(top); root.appendChild(qbox); root.appendChild(body);
        if (autoSpeak !== false) speakPanel(fpn);
        return;
      }

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

      var list = pieces(c, f.ex, !fp.length && f === frames[0] && f.ex === f.ex0 ? tip : null);
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
          check = { variant: f.chk0 != null ? (f.chk0 + f.ex - f.ex0) % c.checks.length : f.ex % c.checks.length, answer: null, correct: null, submitted: false };
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
      root.appendChild(top); root.appendChild(qbox); root.appendChild(ladder()); root.appendChild(body);
      if (autoSpeak !== false) speakPanel(p);
    }

    render();
  };

  A.tutorPanels = function (pr) { var c = concepts[D.skillConcept[pr.skill]]; return focusPanels(pr, c, pr.question); };
  A.tutorConceptTitle = function (id) { return concepts[id] ? concepts[id].title : id; };
})();
