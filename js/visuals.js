/* AOTO2 説明の図: 既存AOTOの「登録図」を、少しずつ動くSVG/HTMLで描く */
(function () {
  "use strict";
  var A = window.A, h = A.h;

  var PIC = {
    person: "🧑", dog: "🐶", cat: "🐱", book: "📖", rain: "🌧️", sun: "☀️",
    leaf: "🍃", "leaf-hole": "🍂", "two-leaves": "🌱", "flower-five": "🌸",
    flower: "🌼", water: "💧", fish: "🐟", bird: "🐦", eye: "👀", earth: "🌏",
    house: "🏠", clock: "🕒", insect: "🐞", spider: "🕷️", frog: "🐸",
    tadpole: "🥒", dolphin: "🐬", flame: "🔥", snow: "❄️", run: "🏃", smile: "😊",
  };
  var COLORS = ["#5b8def", "#ff9f43", "#34c38f", "#e86ab0", "#9b72e8", "#2bb5c9"];
  function hue(str) {
    var n = 0;
    for (var i = 0; i < str.length; i++) n = (n * 31 + str.charCodeAt(i)) >>> 0;
    return COLORS[n % COLORS.length];
  }
  function stagger(el, i, step) {
    el.style.animationDelay = (i * (step || 0.28)) + "s";
    return el;
  }
  function box(v, stage) {
    return h("figure", { class: "visual kind-" + v.kind },
      h("figcaption", { class: "visual-title" }, v.title),
      stage,
      h("p", { class: "visual-caption" }, v.caption));
  }

  /* ----- 数直線: 点が動く ----- */
  function numberLine(v) {
    var W = 320, H = 130, pad = 22;
    var min = v.min, max = v.max;
    if (max === min) max = min + 1;
    var span = max - min;
    var x = function (n) { return pad + ((n - min) / span) * (W - pad * 2); };
    var svg = h("svg:svg", { viewBox: "0 0 " + W + " " + H, class: "numline", role: "img", "aria-label": "数の道" });
    svg.appendChild(h("svg:line", { x1: pad - 8, y1: 78, x2: W - pad + 8, y2: 78, stroke: "#9aa7c7", "stroke-width": 4, "stroke-linecap": "round" }));
    var step = span > 16 ? Math.ceil(span / 10) : 1;
    for (var n = Math.ceil(min); n <= max; n += 1) {
      var big = n === 0;
      svg.appendChild(h("svg:line", { x1: x(n), y1: 70, x2: x(n), y2: 86, stroke: big ? "#2f3a66" : "#9aa7c7", "stroke-width": big ? 4 : 2 }));
      if (n % step === 0 || big) svg.appendChild(h("svg:text", { x: x(n), y: 108, "text-anchor": "middle", "font-size": 14, fill: "#2f3a66" }, String(n)));
    }
    var walker = h("svg:g", { class: "walker" },
      h("svg:circle", { cx: 0, cy: 78, r: 11, fill: "#ff9f43", stroke: "#fff", "stroke-width": 3 }),
      h("svg:text", { x: 0, y: 83, "text-anchor": "middle", "font-size": 13 }, "😀"));
    walker.style.transform = "translateX(" + x(v.start) + "px)";
    svg.appendChild(walker);
    svg.appendChild(h("svg:text", { x: (x(v.start) + x(v.end)) / 2, y: 42, "text-anchor": "middle", "font-size": 18, "font-weight": 700, fill: "#e0702f" }, v.move));
    svg.appendChild(h("svg:path", { d: "M" + x(v.start) + " 62 Q" + (x(v.start) + x(v.end)) / 2 + " 20 " + x(v.end) + " 62", fill: "none", stroke: "#e0702f", "stroke-width": 3, "stroke-dasharray": "5 5", opacity: 0.7 }));
    var targets = [v.end];
    if (v.inverseEnd !== undefined) targets.push(v.inverseEnd);
    targets.forEach(function (t, i) {
      setTimeout(function () {
        walker.style.transform = "translateX(" + x(t) + "px)";
      }, 500 + i * 1400);
    });
    return box(v, svg);
  }

  /* ----- ものを並べる ----- */
  function objects(v) {
    var row = h("div", { class: "obj-row" });
    var idx = 0;
    v.groups.forEach(function (g, gi) {
      if (gi > 0) row.appendChild(h("div", { class: "obj-join" }, v.join || "+"));
      var dots = h("div", { class: "obj-dots" });
      for (var i = 0; i < g.count; i++) {
        var gone = g.removed !== undefined && i >= g.count - g.removed;
        dots.appendChild(stagger(h("span", { class: "dot pop" + (gone ? " gone" : ""), style: { background: COLORS[gi % COLORS.length] } }, gone ? "✕" : ""), idx++, 0.12));
      }
      row.appendChild(h("div", { class: "obj-group" }, dots,
        h("div", { class: "obj-label" }, g.label + (g.mark ? " " + g.mark : ""))));
    });
    return box(v, row);
  }

  /* ----- 分数の帯 ----- */
  function fractions(v) {
    var wrap = h("div", { class: "frac-wrap" });
    v.bars.forEach(function (b, bi) {
      if (bi > 0) wrap.appendChild(h("div", { class: "frac-join" }, v.join || "="));
      var bar = h("div", { class: "frac-bar" });
      for (var i = 0; i < b.parts; i++) {
        var taken = i < b.taken;
        bar.appendChild(stagger(h("span", { class: "frac-part" + (taken ? " taken pop" : ""), style: { background: taken ? COLORS[bi % COLORS.length] : "#eef2fb" } }), i, 0.2));
      }
      wrap.appendChild(h("div", { class: "frac-item" }, h("div", { class: "frac-label" }, b.label), bar));
    });
    return box(v, wrap);
  }

  /* ----- 文の役割 ----- */
  function sentence(v) {
    var wrap = h("div", { class: "sent-wrap" });
    var k = 0;
    v.rows.forEach(function (r) {
      var row = h("div", { class: "sent-row" }, h("div", { class: "sent-label" }, r.label));
      var parts = h("div", { class: "sent-parts" });
      r.parts.forEach(function (p) {
        var chip = h("span", { class: "chip pop" + (p.accent ? " accent" : ""), style: { "border-color": hue(p.role), background: p.accent ? hue(p.role) : "#fff", color: p.accent ? "#fff" : "#2f3a66" } },
          h("b", null, p.text), h("small", null, p.role));
        parts.appendChild(stagger(chip, k++, 0.22));
      });
      row.appendChild(parts);
      wrap.appendChild(row);
    });
    return box(v, wrap);
  }

  /* ----- つながり(順番) ----- */
  function flow(v) {
    var wrap = h("div", { class: "flow-wrap" });
    v.nodes.forEach(function (n, i) {
      if (i > 0) wrap.appendChild(stagger(h("div", { class: "flow-join fade" }, v.join || "↓"), i * 2 - 1, 0.18));
      wrap.appendChild(stagger(h("div", { class: "flow-node fade" },
        n.picture ? h("span", { class: "flow-pic" }, PIC[n.picture] || "") : null,
        h("div", null, h("b", null, n.label), n.detail ? h("small", null, n.detail) : null)), i * 2, 0.18));
    });
    return box(v, wrap);
  }

  /* ----- 絵カード ----- */
  function pictures(v) {
    var grid = h("div", { class: "pic-grid" });
    v.items.forEach(function (it, i) {
      grid.appendChild(stagger(h("div", { class: "pic-card pop" },
        h("div", { class: "pic-emoji" }, PIC[it.picture] || "⭐"),
        h("b", null, it.label), h("small", null, it.detail)), i, 0.25));
    });
    return box(v, grid);
  }

  /* ----- 植物 ----- */
  function plant(v) {
    var f = v.focus;
    var on = function (k) { return f === "all" || f === k ? 1 : 0.25; };
    var svg = h("svg:svg", { viewBox: "0 0 240 200", class: "plant-svg", role: "img", "aria-label": "植物のつくり" },
      h("svg:rect", { x: 0, y: 120, width: 240, height: 80, fill: "#d9b48a" }),
      h("svg:g", { opacity: on("root") },
        h("svg:path", { d: "M120 120 L120 170 M120 140 L90 175 M120 140 L150 178 M120 150 L105 190", stroke: "#8a5a2b", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }),
        h("svg:text", { x: 168, y: 176, "font-size": 15, "font-weight": 700, fill: "#5a3a18" }, "根")),
      h("svg:g", { opacity: on("stem") },
        h("svg:line", { x1: 120, y1: 120, x2: 120, y2: 50, stroke: "#3fa66a", "stroke-width": 8, "stroke-linecap": "round" }),
        h("svg:text", { x: 132, y: 100, "font-size": 15, "font-weight": 700, fill: "#1f6b40" }, "くき")),
      h("svg:g", { opacity: on("leaf") },
        h("svg:ellipse", { cx: 90, cy: 70, rx: 28, ry: 13, fill: "#58c47f", transform: "rotate(-25 90 70)" }),
        h("svg:ellipse", { cx: 150, cy: 60, rx: 28, ry: 13, fill: "#58c47f", transform: "rotate(25 150 60)" }),
        h("svg:text", { x: 160, y: 34, "font-size": 15, "font-weight": 700, fill: "#1f6b40" }, "葉")));
    return box(v, svg);
  }

  function leaf(v) {
    var svg = h("svg:svg", { viewBox: "0 0 260 170", class: "plant-svg", role: "img", "aria-label": "葉のはたらき" },
      h("svg:ellipse", { cx: 130, cy: 85, rx: 70, ry: 34, fill: "#58c47f", transform: "rotate(-15 130 85)" }),
      h("svg:text", { x: 18, y: 28, "font-size": 24 }, "☀️"),
      h("svg:text", { x: 52, y: 32, "font-size": 13, fill: "#e0702f", "font-weight": 700 }, "光 →"),
      h("svg:text", { x: 190, y: 28, "font-size": 13, fill: "#2f3a66", "font-weight": 700 }, "二酸化炭素 ↓"),
      h("svg:text", { x: 200, y: 130, "font-size": 13, fill: "#1f6b40", "font-weight": 700 }, "酸素 →"));
    if (v.roots) {
      svg.appendChild(h("svg:text", { x: 20, y: 150, "font-size": 13, fill: "#2b7bd6", "font-weight": 700 }, "💧 水 ↑（根から）"));
    }
    return box(v, svg);
  }

  function flower(v) {
    var svg = h("svg:svg", { viewBox: "0 0 240 200", class: "plant-svg", role: "img", "aria-label": "花のつくり" });
    for (var i = 0; i < 5; i++) {
      svg.appendChild(h("svg:ellipse", { cx: 120, cy: 55, rx: 18, ry: 30, fill: "#ff9ac1", transform: "rotate(" + i * 72 + " 120 90)" }));
    }
    svg.appendChild(h("svg:circle", { cx: 120, cy: 90, r: 16, fill: "#ffd24d" }));
    svg.appendChild(h("svg:text", { x: 150, y: 94, "font-size": 13, "font-weight": 700, fill: "#8a5a00" }, "めしべ・おしべ"));
    svg.appendChild(h("svg:text", { x: 160, y: 40, "font-size": 13, "font-weight": 700, fill: "#c2306f" }, "花びら"));
    svg.appendChild(h("svg:line", { x1: 120, y1: 130, x2: 120, y2: 190, stroke: "#3fa66a", "stroke-width": 7, "stroke-linecap": "round" }));
    return box(v, svg);
  }

  /* ----- 方位 ----- */
  function compass(v) {
    var svg = h("svg:svg", { viewBox: "0 0 240 200", class: "plant-svg", role: "img", "aria-label": "方位" });
    if (v.map) {
      svg.appendChild(h("svg:rect", { x: 30, y: 20, width: 180, height: 160, rx: 12, fill: "#e8f1ff", stroke: "#9ab6ea", "stroke-width": 3 }));
      svg.appendChild(h("svg:text", { x: 70, y: 110, "font-size": 30 }, "🏠"));
      svg.appendChild(h("svg:text", { x: 140, y: 80, "font-size": 30 }, "🏫"));
    }
    var needle = h("svg:g", { class: "needle" },
      h("svg:polygon", { points: "200,50 190,80 210,80", fill: "#e24b4b" }),
      h("svg:polygon", { points: "200,110 190,80 210,80", fill: "#c9d3ea" }),
      h("svg:text", { x: 200, y: 42, "text-anchor": "middle", "font-size": 16, "font-weight": 700, fill: "#e24b4b" }, "北"));
    svg.appendChild(needle);
    if (!v.map) {
      svg.appendChild(h("svg:circle", { cx: 120, cy: 100, r: 70, fill: "#fff", stroke: "#9ab6ea", "stroke-width": 4 }));
      svg.removeChild(needle);
      svg.appendChild(h("svg:polygon", { points: "120,40 108,100 132,100", fill: "#e24b4b" }));
      svg.appendChild(h("svg:polygon", { points: "120,160 108,100 132,100", fill: "#c9d3ea" }));
      [["北", 120, 32], ["南", 120, 182], ["東", 202, 106], ["西", 38, 106]].forEach(function (t) {
        svg.appendChild(h("svg:text", { x: t[1], y: t[2], "text-anchor": "middle", "font-size": 16, "font-weight": 700, fill: "#2f3a66" }, t[0]));
      });
    }
    return box(v, svg);
  }

  /* ----- 地球儀 ----- */
  function globe(v) {
    var lat = v.focus === "latitude";
    var svg = h("svg:svg", { viewBox: "0 0 240 200", class: "plant-svg", role: "img", "aria-label": "緯度と経度" },
      h("svg:circle", { cx: 120, cy: 100, r: 80, fill: "#dff0ff", stroke: "#5b8def", "stroke-width": 4 }));
    [-50, -25, 0, 25, 50].forEach(function (dy) {
      var w = Math.sqrt(80 * 80 - dy * dy);
      svg.appendChild(h("svg:ellipse", { cx: 120, cy: 100 + dy, rx: w, ry: 9, fill: "none", stroke: lat ? (dy === 0 ? "#e24b4b" : "#2b7bd6") : "#b7c7e6", "stroke-width": lat ? (dy === 0 ? 4 : 2.5) : 1.5 }));
    });
    [30, 60, 90, 120, 150].forEach(function (a) {
      svg.appendChild(h("svg:ellipse", { cx: 120, cy: 100, rx: 80 * Math.abs(Math.cos((a * Math.PI) / 180)) || 2, ry: 80, fill: "none", stroke: lat ? "#b7c7e6" : "#2b7bd6", "stroke-width": lat ? 1.5 : 2.5 }));
    });
    svg.appendChild(h("svg:text", { x: 215, y: 104, "font-size": 12, "font-weight": 700, fill: "#e24b4b" }, lat ? "赤道" : ""));
    return box(v, svg);
  }

  /* ----- 割合の帯 ----- */
  function proportion(v) {
    var bar = h("div", { class: "prop-bar" });
    v.sections.forEach(function (s, i) {
      var seg = h("div", { class: "prop-seg pop", style: { flex: String(s.count), background: COLORS[i % COLORS.length] } }, h("b", null, String(s.count)), h("small", null, s.label));
      bar.appendChild(stagger(seg, i, 0.3));
    });
    return box(v, h("div", null, bar, h("div", { class: "prop-total" }, "ぜんぶで " + v.total)));
  }

  var KINDS = { "number-line": numberLine, objects: objects, fractions: fractions, sentence: sentence, flow: flow, pictures: pictures, plant: plant, leaf: leaf, flower: flower, compass: compass, globe: globe, proportion: proportion };
  A.renderVisual = function (v) {
    if (!v || !KINDS[v.kind]) return null;
    try { return KINDS[v.kind](v); } catch (e) { return null; }
  };
  A.PIC = PIC;
})();
