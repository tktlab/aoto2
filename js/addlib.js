/* AOTO2 教材追加ヘルパー(content3〜7で使う)。
 * S(unit, 教科, id, なまえ, タイトル, いみ, [れい], [てじゅん], [[確かめ: 問い,[正解,まちがい,まちがい],解説]], [[問題: 問い,[正解,まちがい×3],ヒント,解説]], [前提のconcept id])
 * 正解は先頭に書き、表示用に位置をずらして並べる。 */
(function () {
  "use strict";
  var D = window.AOTO_DATA, C = window.AOTO_CURRICULUM;
  function rot(arr, k) { var a = arr.slice(), n = a.length, r = ((k % n) + n) % n; return a.slice(r).concat(a.slice(0, r)); }
  function addProblems(skill, prefix, probs, seed) {
    probs.forEach(function (p, i) {
      var ans = p[1][0], ch = rot(p[1], (i * 3 + seed + 1) % p[1].length);
      D.problems.push({ id: prefix + skill + "-" + (i + 1), skill: skill, question: p[0], choices: ch, answer: ans, hints: [p[2], p[3] || p[2]], explanation: p[3] || p[2] });
    });
  }
  var n = 0;
  window.AOTO_ADD = {
    S: function (unit, subject, id, name, title, meaning, examples, steps, checks, probs, prereq) {
      n++;
      D.skills.push({ id: id, subject: subject, name: name, prerequisites: [], stage: 6 });
      D.concepts.push({ subject: subject, id: id, title: title, meaning: meaning, examples: examples, steps: steps, prerequisites: prereq || [],
        checks: checks.map(function (c, i) { return { question: c[0], choices: rot(c[1], (i + n) % c[1].length), answer: c[1][0], explanation: c[2] }; }) });
      D.skillConcept[id] = id;
      addProblems(id, "n3-", probs, n);
      var u = C.units.filter(function (x) { return x.id === unit; })[0];
      if (u) u.skills.push(id); else throw new Error("unit? " + unit);
    },
    more: function (skill, probs, pfx) { n++; addProblems(skill, pfx || "m3-", probs, n); },
  };
})();
