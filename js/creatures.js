/* AOTO2 いきもの12しゅるい(SVG・オリジナル): かわいい系6 + かっこいい系6
 * 4つのすがた: 0=たまご 1=ひび 2=こども 3=おとな。A.creatures.el(kind, form) で要素を作る */
(function () {
  "use strict";
  var A = window.A;
  var DARK = "#2a2f55";
  var EGG = "M100 34C140 34 164 96 162 134C160 168 134 182 100 182C66 182 40 168 38 134C36 96 60 34 100 34Z";

  function eye(x, y, rx, ry) {
    return '<g class="cr-blink"><ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + DARK + '"/>' +
      '<circle cx="' + (x + rx * 0.35) + '" cy="' + (y - ry * 0.4) + '" r="' + (rx * 0.38) + '" fill="#fff"/><circle cx="' + (x - rx * 0.35) + '" cy="' + (y + ry * 0.35) + '" r="' + (rx * 0.18) + '" fill="#fff"/></g>';
  }
  function cheeks(x1, x2, y, c) {
    return '<ellipse cx="' + x1 + '" cy="' + y + '" rx="9" ry="6" fill="' + (c || "#ff9fb8") + '" opacity=".78"/><ellipse cx="' + x2 + '" cy="' + y + '" rx="9" ry="6" fill="' + (c || "#ff9fb8") + '" opacity=".78"/>';
  }
  function smile(x, y) { return '<path d="M' + (x - 8) + ' ' + y + 'Q' + x + ' ' + (y + 11) + ' ' + (x + 8) + ' ' + y + '" stroke="' + DARK + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>'; }
  function slitEyes(x1, x2, y, col) {
    col = col || "#ffd23a";
    return '<g class="cr-blink"><ellipse cx="' + x1 + '" cy="' + y + '" rx="9" ry="8" fill="' + col + '"/><ellipse cx="' + x1 + '" cy="' + y + '" rx="2.8" ry="7.5" fill="#1b1440"/>' +
      '<ellipse cx="' + x2 + '" cy="' + y + '" rx="9" ry="8" fill="' + col + '"/><ellipse cx="' + x2 + '" cy="' + y + '" rx="2.8" ry="7.5" fill="#1b1440"/></g>' +
      '<path d="M' + (x1 - 14) + ' ' + (y - 12) + 'L' + (x1 + 12) + ' ' + (y - 5) + 'M' + (x2 + 14) + ' ' + (y - 12) + 'L' + (x2 - 12) + ' ' + (y - 5) + '" stroke="#1b1440" stroke-width="4.5" stroke-linecap="round"/>';
  }

  /* ---------- おとなのすがた ---------- */
  var LIST = [];
  function def(o) { LIST.push(o); }

  /* ===== かわいい系 ===== */
  def({ id: "jelly", n: "ぷるりん", type: "cute", r: 1, g: ["#b8f7df", "#4fcfa3"], eggg: ["#d6fff0", "#8be8c6"],
    egg: '<circle cx="76" cy="110" r="9" fill="#5fd9ac" opacity=".7"/><circle cx="122" cy="94" r="7" fill="#5fd9ac" opacity=".7"/><circle cx="116" cy="140" r="11" fill="#5fd9ac" opacity=".7"/>', crack: "#2a2f55",
    hint: '<path d="M100 66Q100 54 106 48" stroke="#3aa55d" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M106 50C112 36 128 38 130 40C130 40 126 58 106 52Z" fill="#6fdc74"/>',
    adult: function (G) { return '<path d="M100 40Q100 26 106 18" stroke="#3aa55d" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M106 22C112 6 136 8 138 10C138 10 134 34 106 26Z" fill="#6fdc74"/><path d="M102 30C94 14 72 18 70 20C70 20 74 40 102 34Z" fill="#59c964"/>' +
      '<path d="M100 48C144 48 170 90 166 128C163 162 136 180 100 180C64 180 37 162 34 128C30 90 56 48 100 48Z" fill="url(#' + G + ')"/><ellipse cx="70" cy="80" rx="15" ry="8" fill="#fff" opacity=".65" transform="rotate(-32 70 80)"/><circle cx="52" cy="98" r="4" fill="#fff" opacity=".55"/>' +
      eye(78, 122, 11, 14) + eye(122, 122, 11, 14) + cheeks(58, 142, 142) + smile(100, 142); } });

  def({ id: "mochi", n: "もちぴょん", type: "cute", r: 2, g: ["#fffaf0", "#ffdcae"], eggg: ["#ffffff", "#ffe2bd"],
    egg: '<path d="M60 100c8-8 16-8 22 0M112 80c8-8 16-8 22 0M70 140c8-8 16-8 22 0M116 132c8-8 16-8 22 0" stroke="#ffb3c8" stroke-width="5" fill="none" stroke-linecap="round"/>', crack: "#2a2f55",
    hint: '<ellipse cx="78" cy="96" rx="8" ry="20" fill="#ffe9cf" transform="rotate(-14 78 96)"/><ellipse cx="122" cy="96" rx="8" ry="20" fill="#ffe9cf" transform="rotate(14 122 96)"/>',
    adult: function (G) { return '<ellipse cx="68" cy="50" rx="14" ry="38" fill="url(#' + G + ')" transform="rotate(-14 68 50)"/><ellipse cx="70" cy="54" rx="6.5" ry="26" fill="#ffb3c8" transform="rotate(-14 70 54)"/>' +
      '<ellipse cx="132" cy="50" rx="14" ry="38" fill="url(#' + G + ')" transform="rotate(14 132 50)"/><ellipse cx="130" cy="54" rx="6.5" ry="26" fill="#ffb3c8" transform="rotate(14 130 54)"/><circle cx="152" cy="150" r="14" fill="#fff"/>' +
      '<ellipse cx="100" cy="124" rx="56" ry="52" fill="url(#' + G + ')"/><ellipse cx="62" cy="146" rx="10" ry="7" fill="#ffd9a8" transform="rotate(30 62 146)"/><ellipse cx="138" cy="146" rx="10" ry="7" fill="#ffd9a8" transform="rotate(-30 138 146)"/>' +
      '<ellipse cx="78" cy="174" rx="14" ry="8" fill="#ffd9a8"/><ellipse cx="122" cy="174" rx="14" ry="8" fill="#ffd9a8"/>' +
      '<polygon class="cr-glow" points="100,84 103,92 112,92.5 105,98 107.5,107 100,102 92.5,107 95,98 88,92.5 97,92" fill="#ffd23a" stroke="#ffb300" stroke-width="1.5" stroke-linejoin="round"/>' +
      eye(80, 126, 8.5, 11) + eye(120, 126, 8.5, 11) + cheeks(62, 138, 140) + '<ellipse cx="100" cy="134" rx="4" ry="3" fill="#ff8aa6"/><path d="M93 140Q100 147 100 138Q100 147 107 140" stroke="' + DARK + '" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; } });

  def({ id: "cat", n: "ふわにゃ", type: "cute", r: 1, g: ["#f6e2ff", "#d9a8ff"], eggg: ["#f8ecff", "#dcb4ff"],
    egg: '<path d="M44 96Q100 84 156 96M42 120Q100 108 158 120M44 146Q100 134 156 146" stroke="#b97ae6" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>', crack: "#2a2f55",
    hint: '<polygon points="66,96 64,72 86,88" fill="#d9a8ff"/><polygon points="134,96 136,72 114,88" fill="#d9a8ff"/>',
    adult: function (G) { return '<path d="M148 152C186 152 192 112 168 102" stroke="#c48cf0" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="168" cy="102" r="8" fill="#fff"/>' +
      '<polygon points="58,90 54,42 94,70" fill="#d9a8ff"/><polygon points="64,80 62,56 83,70" fill="#ffb3d6"/><polygon points="142,90 146,42 106,70" fill="#d9a8ff"/><polygon points="136,80 138,56 117,70" fill="#ffb3d6"/>' +
      '<ellipse cx="100" cy="124" rx="55" ry="50" fill="url(#' + G + ')"/><ellipse cx="78" cy="174" rx="14" ry="8" fill="#ecd0ff"/><ellipse cx="122" cy="174" rx="14" ry="8" fill="#ecd0ff"/>' +
      '<path d="M91 84V95M100 81V95M109 84V95" stroke="#b97ae6" stroke-width="4" stroke-linecap="round"/>' +
      eye(79, 120, 9, 12) + eye(121, 120, 9, 12) + cheeks(60, 140, 140) + '<path d="M96 133H104L100 138Z" fill="#ff7fa8"/><path d="M100 138Q95 146 89 141M100 138Q105 146 111 141" stroke="' + DARK + '" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M54 128L72 133M54 140L72 140M146 128L128 133M146 140L128 140" stroke="#a77ed1" stroke-width="2.5" stroke-linecap="round"/>'; } });

  def({ id: "bear", n: "ぽよクマ", type: "cute", r: 1, g: ["#f2c79a", "#c98b55"], eggg: ["#f8dcbc", "#d9a06a"],
    egg: '<circle cx="86" cy="108" r="14" fill="#b87a45" opacity=".55"/><circle cx="76" cy="94" r="6" fill="#b87a45" opacity=".55"/><circle cx="98" cy="94" r="6" fill="#b87a45" opacity=".55"/><circle cx="122" cy="146" r="12" fill="#b87a45" opacity=".55"/>', crack: "#2a2f55",
    hint: '<circle cx="70" cy="100" r="11" fill="#c98b55"/><circle cx="130" cy="100" r="11" fill="#c98b55"/>',
    adult: function (G) { return '<circle cx="58" cy="76" r="20" fill="#c98b55"/><circle cx="58" cy="76" r="10" fill="#f3cfa6"/><circle cx="142" cy="76" r="20" fill="#c98b55"/><circle cx="142" cy="76" r="10" fill="#f3cfa6"/>' +
      '<ellipse cx="100" cy="126" rx="56" ry="52" fill="url(#' + G + ')"/><ellipse cx="62" cy="152" rx="11" ry="8" fill="#c98b55" transform="rotate(30 62 152)"/><ellipse cx="138" cy="152" rx="11" ry="8" fill="#c98b55" transform="rotate(-30 138 152)"/>' +
      '<ellipse cx="78" cy="176" rx="15" ry="8" fill="#c98b55"/><ellipse cx="122" cy="176" rx="15" ry="8" fill="#c98b55"/>' +
      eye(78, 114, 8, 10) + eye(122, 114, 8, 10) + '<ellipse cx="100" cy="138" rx="24" ry="18" fill="#f8e3cb"/><ellipse cx="100" cy="130" rx="7.5" ry="5.5" fill="' + DARK + '"/>' +
      '<path d="M100 135V141M92 143Q100 151 108 143" stroke="' + DARK + '" stroke-width="3" fill="none" stroke-linecap="round"/>' + cheeks(58, 142, 134) +
      '<path d="M88 96L100 88L112 96L100 104Z" fill="#ff7b7b" opacity=".0"/>'; } });

  def({ id: "chick", n: "ぴよまる", type: "cute", r: 1, g: ["#fff6b0", "#ffd23d"], eggg: ["#fffbe0", "#ffe27a"],
    egg: '<path d="M38 112L54 96L70 112L86 96L102 112L118 96L134 112L150 96L162 112" stroke="#ffb347" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round"/>', crack: "#a35a00",
    hint: '<path d="M76 104C76 84 124 84 124 104L118 98L111 106L104 96L97 106L90 98Z" fill="#fff" stroke="#f0e6d2" stroke-width="2"/>',
    adult: function (G) { return '<ellipse cx="44" cy="140" rx="14" ry="22" fill="#ffc533" transform="rotate(14 44 140)"/><ellipse cx="156" cy="140" rx="14" ry="22" fill="#ffc533" transform="rotate(-14 156 140)"/>' +
      '<ellipse cx="100" cy="124" rx="54" ry="52" fill="url(#' + G + ')"/><path d="M84 172V184M76 184H92M116 172V184M108 184H124" stroke="#ff9f3a" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M66 86C66 56 134 56 134 86L126 76L118 88L109 74L100 88L91 74L82 88L74 76Z" fill="#fff" stroke="#f0e6d2" stroke-width="2.5" stroke-linejoin="round"/>' +
      eye(78, 118, 7.5, 11) + eye(122, 118, 7.5, 11) + cheeks(58, 142, 138) + '<path d="M90 130Q100 122 110 130Q100 146 90 130Z" fill="#ff9f3a"/>'; } });

  def({ id: "kurage", n: "ぷかりん", type: "cute", r: 2, g: ["#d3f1ff", "#74bdff"], eggg: ["#e2f6ff", "#9bd0ff"],
    egg: '<path d="M44 100Q58 90 72 100T100 100T128 100T156 100M44 130Q58 120 72 130T100 130T128 130T156 130" stroke="#5aa9f0" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>', crack: "#2a2f55",
    hint: '<path d="M70 150Q64 164 72 176M100 152Q96 168 104 180M130 150Q136 164 128 176" stroke="#8cc8ff" stroke-width="6" fill="none" stroke-linecap="round"/>',
    adult: function (G) { return '<g class="cr-sway"><path d="M64 108Q54 130 64 148Q72 162 62 178" stroke="#9ad0ff" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M88 112Q80 134 90 152Q96 168 88 184" stroke="#8cc8ff" stroke-width="8" fill="none" stroke-linecap="round"/>' +
      '<path d="M112 112Q120 134 110 152Q104 168 112 184" stroke="#8cc8ff" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M136 108Q146 130 136 148Q128 162 138 178" stroke="#9ad0ff" stroke-width="8" fill="none" stroke-linecap="round"/></g>' +
      '<path d="M42 108C42 44 158 44 158 108Q143 122 129 108Q114 122 100 108Q86 122 71 108Q57 122 42 108Z" fill="url(#' + G + ')"/>' +
      '<ellipse cx="72" cy="66" rx="14" ry="7" fill="#fff" opacity=".7" transform="rotate(-28 72 66)"/><circle cx="130" cy="62" r="5" fill="#fff" opacity=".5"/><circle cx="144" cy="76" r="3.5" fill="#fff" opacity=".5"/>' +
      eye(78, 92, 9, 11) + eye(122, 92, 9, 11) + cheeks(58, 142, 104, "#ff9fcf") + smile(100, 100) +
      '<circle cx="24" cy="70" r="7" fill="none" stroke="#9ad0ff" stroke-width="3"/><circle cx="176" cy="56" r="5" fill="none" stroke="#9ad0ff" stroke-width="3"/><circle cx="170" cy="130" r="8" fill="none" stroke="#9ad0ff" stroke-width="3"/>'; } });

  /* ===== かっこいい系 ===== */
  def({ id: "dragon", n: "ガルドラ", type: "cool", r: 3, g: ["#6a55c4", "#2b2260"], eggg: ["#7a64d4", "#34286f"],
    egg: '<path d="M42 110L58 96L74 112L90 96L106 112L122 96L138 112L154 98L160 112" stroke="#ff6a3d" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M40 146L56 132L72 148L88 132L104 148L120 132L136 148L152 134L162 146" stroke="#ffb347" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>', crack: "#ffd23a",
    extra: [["wing", "#ff7a45", "#a62f6a"]],
    hint: '<path d="M74 100L66 82L84 94Z" fill="#ffe08a"/><path d="M126 100L134 82L116 94Z" fill="#ffe08a"/><path d="M96 92L100 80L104 92Z" fill="#ff6a3d"/>',
    face: "cool",
    adult: function (G, X) { return '<path d="M136 156C176 158 190 128 172 104" stroke="#3b2d7d" stroke-width="14" fill="none" stroke-linecap="round"/><g class="cr-flame"><path d="M172 102C158 88 168 76 172 62C180 76 192 86 172 102Z" fill="#ff7a2f"/><path d="M172 100C165 92 170 85 172 78C177 86 182 92 172 100Z" fill="#ffe066"/></g>' +
      '<path d="M70 104C40 76 22 82 10 58C36 60 50 56 62 42C60 64 74 80 86 92Z" fill="url(#' + X.wing + ')"/><g transform="translate(200 0) scale(-1 1)"><path d="M70 104C40 76 22 82 10 58C36 60 50 56 62 42C60 64 74 80 86 92Z" fill="url(#' + X.wing + ')"/></g>' +
      '<ellipse cx="100" cy="138" rx="46" ry="42" fill="url(#' + G + ')"/><ellipse cx="100" cy="148" rx="27" ry="29" fill="#ffd9a0"/><path d="M80 138H120M78 150H122M82 162H118" stroke="#f0b873" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="72" cy="176" rx="17" ry="9" fill="#2b2260"/><ellipse cx="128" cy="176" rx="17" ry="9" fill="#2b2260"/><path d="M62 176l2 5M72 177v5M82 176l-2 5M118 176l2 5M128 177v5M138 176l-2 5" stroke="#ffe08a" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M72 74L58 42L86 66Z" fill="#ffe08a"/><path d="M128 74L142 42L114 66Z" fill="#ffe08a"/><path d="M90 60L100 38L110 60Z" fill="#ff6a3d"/><path d="M78 66L84 50L92 64Z" fill="#ff8a4d"/><path d="M122 66L116 50L108 64Z" fill="#ff8a4d"/>' +
      '<ellipse cx="100" cy="92" rx="42" ry="35" fill="url(#' + G + ')"/><ellipse cx="100" cy="108" rx="24" ry="15" fill="#7a66d4"/><circle cx="92" cy="106" r="2.2" fill="#2b2260"/><circle cx="108" cy="106" r="2.2" fill="#2b2260"/>' +
      slitEyes(82, 118, 90) + '<path d="M86 114Q100 124 114 114" stroke="#1b1440" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M88 115L92 115L90 122ZM108 115L112 115L110 122Z" fill="#fff"/>'; } });

  def({ id: "crystal", n: "クォーツガイスト", type: "cool", r: 3, g: ["#aef3ff", "#3f6fd8"], eggg: ["#d4f9ff", "#6b9af0"],
    egg: '<path d="M100 34L120 90L100 182M100 34L80 90L100 182M62 70L120 90M138 70L80 90M44 124L80 90M156 124L120 90" stroke="#fff" stroke-width="3" fill="none" opacity=".55" stroke-linejoin="round"/>', crack: "#ff3df0",
    hint: '<polygon points="100,70 112,92 100,98 88,92" fill="#e4fcff"/>', face: "crystal",
    adult: function (G) { return '<g class="cr-shard"><polygon points="22,52 32,40 38,58 28,66" fill="#9ff0ff" opacity=".9"/></g><g class="cr-shard b"><polygon points="170,40 182,52 172,66 164,52" fill="#c6f7ff" opacity=".9"/></g><g class="cr-shard c"><polygon points="176,150 188,160 178,172 170,160" fill="#8ee9ff" opacity=".9"/></g><g class="cr-shard b"><polygon points="14,150 24,142 30,156 20,164" fill="#7fdcff" opacity=".9"/></g>' +
      '<g class="cr-shard c"><polygon points="20,100 40,94 48,112 30,124 14,114" fill="url(#' + G + ')"/><polygon points="20,100 40,94 30,112 14,114" fill="#fff" opacity=".3"/></g><g class="cr-shard"><polygon points="180,100 160,94 152,112 170,124 186,114" fill="url(#' + G + ')"/><polygon points="180,100 160,94 170,112 186,114" fill="#fff" opacity=".2"/></g>' +
      '<polygon points="82,58 86,28 98,46" fill="#c9f8ff"/><polygon points="96,46 100,12 106,46" fill="#e4fcff"/><polygon points="104,46 116,30 120,58" fill="#b3f3ff"/><polygon points="100,40 146,76 140,140 100,174 60,140 54,76" fill="url(#' + G + ')"/>' +
      '<polygon points="100,40 54,76 100,102" fill="#fff" opacity=".32"/><polygon points="100,40 146,76 100,102" fill="#fff" opacity=".12"/><polygon points="54,76 100,102 60,140" fill="#1b3a8a" opacity=".18"/><polygon points="146,76 100,102 140,140" fill="#fff" opacity=".28"/><polygon points="60,140 100,102 140,140 100,174" fill="#1b3a8a" opacity=".12"/>' +
      '<g class="cr-glow" filter="url(#fGlow)"><polygon points="72,94 94,102 90,114 70,108" fill="#ff3df0"/><polygon points="128,94 106,102 110,114 130,108" fill="#ff3df0"/><polygon points="78,99 90,103 88,108 77,105" fill="#fff"/><polygon points="122,99 110,103 112,108 123,105" fill="#fff"/></g>' +
      '<polygon class="cr-glow" points="100,126 109,138 100,152 91,138" fill="#ffe3fb" stroke="#ff3df0" stroke-width="2.5" filter="url(#fGlow)"/>'; } });

  def({ id: "ghost", n: "ナイトゴースト", type: "cool", r: 2, g: ["#6a58b5", "#241a52"], eggg: ["#5a4aa0", "#1f1647"],
    egg: '<polygon points="70,92 74,102 85,103 77,110 80,121 70,115 60,121 63,110 55,103 66,102" fill="#5ff2e1" opacity=".85"/><polygon points="128,120 131,128 140,129 133,135 136,144 128,139 120,144 123,135 116,129 125,128" fill="#5ff2e1" opacity=".85"/><circle cx="112" cy="80" r="4" fill="#5ff2e1" opacity=".8"/>', crack: "#5ff2e1",
    hint: '<path d="M100 84C90 74 96 66 100 56C105 66 110 74 100 84Z" fill="#5ff2e1" class="cr-flame"/>', face: "ghost",
    adult: function (G) { return '<g class="cr-flame"><path d="M100 58C86 44 94 34 100 18C106 34 114 44 100 58Z" fill="#5ff2e1"/><path d="M100 54C94 46 98 40 100 32C103 40 106 46 100 54Z" fill="#d6fffa"/></g><g class="cr-flame"><path d="M70 66C62 56 68 50 70 40C75 50 80 58 70 66Z" fill="#3fc9d8" opacity=".9"/></g><g class="cr-flame"><path d="M130 66C122 56 128 50 130 40C135 50 140 58 130 66Z" fill="#3fc9d8" opacity=".9"/></g>' +
      '<path d="M50 176L50 104C50 52 150 52 150 104L150 176L132 160L116 178L100 160L84 178L68 160Z" fill="url(#' + G + ')"/><ellipse cx="38" cy="130" rx="10" ry="15" fill="#4a3a90" transform="rotate(20 38 130)"/><ellipse cx="162" cy="130" rx="10" ry="15" fill="#4a3a90" transform="rotate(-20 162 130)"/>' +
      '<ellipse cx="74" cy="82" rx="12" ry="6" fill="#fff" opacity=".18" transform="rotate(-25 74 82)"/>' +
      '<g class="cr-glow" filter="url(#fGlow)"><polygon points="66,96 92,104 88,116 64,110" fill="#5ff2e1"/><polygon points="134,96 108,104 112,116 136,110" fill="#5ff2e1"/><polygon points="74,100 88,105 86,110 73,106" fill="#fff"/><polygon points="126,100 112,105 114,110 127,106" fill="#fff"/></g>' +
      '<path d="M72 134L82 142L91 132L100 142L109 132L118 142L128 134" stroke="#d6fffa" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; } });

  def({ id: "robot", n: "ギアボルト", type: "cool", r: 2, g: ["#b9cbe0", "#5f7a96"], eggg: ["#c5d4e6", "#6a85a2"],
    extra: [["orange", "#ffb347", "#e8731c"]],
    egg: '<rect x="38" y="104" width="124" height="14" fill="#ffb347" opacity=".9"/><circle cx="52" cy="111" r="3" fill="#7a4a10"/><circle cx="84" cy="111" r="3" fill="#7a4a10"/><circle cx="116" cy="111" r="3" fill="#7a4a10"/><circle cx="148" cy="111" r="3" fill="#7a4a10"/><path d="M96 130L86 150H98L92 168L112 142H100Z" fill="#ffe15a"/>', crack: "#3dffb0",
    hint: '<path d="M100 98V82" stroke="#5f7a96" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="78" r="6" fill="#ff6a3d"/>', face: "robot",
    adult: function (G, X) { return '<path d="M100 46V26" stroke="#5f7a96" stroke-width="5" stroke-linecap="round"/><circle class="cr-glow" cx="100" cy="21" r="8" fill="#ff6a3d" filter="url(#fGlow)"/>' +
      '<circle cx="48" cy="80" r="13" fill="url(#' + X.orange + ')"/><circle cx="48" cy="80" r="5" fill="#7a4a10"/><circle cx="152" cy="80" r="13" fill="url(#' + X.orange + ')"/><circle cx="152" cy="80" r="5" fill="#7a4a10"/>' +
      '<rect x="22" y="112" width="24" height="42" rx="12" fill="url(#' + G + ')"/><rect x="154" y="112" width="24" height="42" rx="12" fill="url(#' + G + ')"/><circle cx="34" cy="158" r="10" fill="url(#' + X.orange + ')"/><circle cx="166" cy="158" r="10" fill="url(#' + X.orange + ')"/>' +
      '<rect x="72" y="164" width="22" height="18" rx="6" fill="#4a617a"/><rect x="106" y="164" width="22" height="18" rx="6" fill="#4a617a"/><rect x="60" y="100" width="80" height="70" rx="16" fill="url(#' + G + ')"/>' +
      '<path d="M104 112L92 134H102L96 156L114 128H104Z" fill="#ffe15a" stroke="#e8a21c" stroke-width="2" stroke-linejoin="round"/><rect x="60" y="100" width="80" height="12" fill="#fff" opacity=".18"/>' +
      '<rect x="48" y="44" width="104" height="68" rx="20" fill="url(#' + G + ')"/><rect x="58" y="56" width="84" height="40" rx="14" fill="#14203a"/>' +
      '<g class="cr-glow cr-blink" filter="url(#fGlow)"><rect x="70" y="68" width="22" height="16" rx="6" fill="#3dffb0"/><rect x="108" y="68" width="22" height="16" rx="6" fill="#3dffb0"/></g><path d="M86 90Q100 96 114 90" stroke="#3dffb0" stroke-width="3" fill="none" stroke-linecap="round"/>'; } });

  def({ id: "devil", n: "イグニス", type: "cool", r: 2, g: ["#ff8a7a", "#b3202f"], eggg: ["#ff7a6a", "#8f1a28"],
    egg: '<path d="M46 150C56 120 70 134 78 100C86 128 100 112 104 80C112 112 126 120 132 96C138 124 152 128 158 150Z" fill="#3a1020" opacity=".85"/><path d="M60 150C66 134 76 140 82 120C88 138 98 130 104 106C110 130 122 136 128 122C134 138 142 140 148 150Z" fill="#ffb347" opacity=".9"/>', crack: "#ffe066",
    hint: '<path d="M72 100C66 90 68 82 74 78C74 88 80 94 84 98Z" fill="#3a1020"/><path d="M128 100C134 90 132 82 126 78C126 88 120 94 116 98Z" fill="#3a1020"/>', face: "devil",
    adult: function (G) { return '<path d="M146 152C180 158 190 130 172 116" stroke="#b3202f" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M172 112L162 106L172 94L184 104Z" fill="#3a1020" transform="rotate(10 172 104)"/>' +
      '<path d="M54 120L22 98L28 124L16 136L40 138L46 152Z" fill="#5a1630"/><g transform="translate(200 0) scale(-1 1)"><path d="M54 120L22 98L28 124L16 136L40 138L46 152Z" fill="#5a1630"/></g>' +
      '<path d="M66 78C50 56 54 36 72 28C68 48 78 62 86 74Z" fill="#3a1020"/><path d="M134 78C150 56 146 36 128 28C132 48 122 62 114 74Z" fill="#3a1020"/>' +
      '<ellipse cx="100" cy="140" rx="44" ry="38" fill="url(#' + G + ')"/><ellipse cx="74" cy="176" rx="15" ry="8" fill="#8f1a28"/><ellipse cx="126" cy="176" rx="15" ry="8" fill="#8f1a28"/>' +
      '<ellipse cx="100" cy="106" rx="52" ry="46" fill="url(#' + G + ')"/><ellipse cx="74" cy="84" rx="12" ry="6" fill="#fff" opacity=".28" transform="rotate(-28 74 84)"/>' +
      slitEyes(80, 120, 100, "#ffe066") + '<path d="M70 124Q100 156 130 124Q100 136 70 124Z" fill="#3a0a14"/><path d="M82 128L86 128L84 135ZM96 132L102 132L99 140ZM114 128L118 128L116 135Z" fill="#fff"/>'; } });

  def({ id: "cyclops", n: "ギョロス", type: "cool", r: 1, g: ["#c3ef7a", "#4e9c2a"], eggg: ["#d6f59a", "#5aa535"],
    egg: '<circle cx="100" cy="108" r="26" fill="#fff"/><circle cx="100" cy="108" r="14" fill="#ff5a3d"/><circle cx="100" cy="108" r="7" fill="#1a1a1a"/><circle cx="105" cy="103" r="3" fill="#fff"/><path d="M60 140Q100 160 140 140" stroke="#2f6a14" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>', crack: "#2f3a10",
    hint: '<polygon points="76,96 72,80 88,92" fill="#fff4d6"/><polygon points="124,96 128,80 112,92" fill="#fff4d6"/>', face: "cyclops",
    adult: function (G) { return '<polygon points="62,78 54,48 84,68" fill="#fff4d6"/><polygon points="138,78 146,48 116,68" fill="#fff4d6"/>' +
      '<ellipse cx="42" cy="136" rx="12" ry="18" fill="#7fc44a" transform="rotate(20 42 136)"/><ellipse cx="158" cy="136" rx="12" ry="18" fill="#7fc44a" transform="rotate(-20 158 136)"/>' +
      '<ellipse cx="100" cy="124" rx="56" ry="54" fill="url(#' + G + ')"/><ellipse cx="76" cy="176" rx="16" ry="8" fill="#4e9c2a"/><ellipse cx="124" cy="176" rx="16" ry="8" fill="#4e9c2a"/>' +
      '<g class="cr-blink"><circle cx="100" cy="106" r="31" fill="#fff"/><circle cx="100" cy="108" r="17" fill="#ff5a3d"/><circle cx="100" cy="108" r="8.5" fill="#1a1a1a"/><circle cx="106" cy="102" r="4" fill="#fff"/></g>' +
      '<path d="M66 82L134 92" stroke="#1d3a10" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="M66 146Q100 178 134 146Q100 160 66 146Z" fill="#2a0f10"/><path d="M76 149L82 149L79 157ZM94 154L100 154L97 162ZM112 154L118 154L115 162Z" fill="#fff"/>'; } });

  /* ---------- 組み立て ---------- */
  var defs = "", ids = {};
  LIST.forEach(function (c, i) {
    c.kind = i; c.gid = "gm-" + c.id; c.egid = "ge-" + c.id; c.X = {};
    defs += '<linearGradient id="' + c.gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c.g[0] + '"/><stop offset="1" stop-color="' + c.g[1] + '"/></linearGradient>';
    defs += '<linearGradient id="' + c.egid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c.eggg[0] + '"/><stop offset="1" stop-color="' + c.eggg[1] + '"/></linearGradient>';
    (c.extra || []).forEach(function (x) {
      c.X[x[0]] = "gx-" + c.id + "-" + x[0];
      defs += '<linearGradient id="' + c.X[x[0]] + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + x[1] + '"/><stop offset="1" stop-color="' + x[2] + '"/></linearGradient>';
    });
  });
  defs += '<filter id="fGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  var holder = document.createElement("div");
  holder.setAttribute("aria-hidden", "true");
  holder.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  holder.innerHTML = '<svg width="0" height="0"><defs>' + defs + "</defs></svg>";
  document.body.insertBefore(holder, document.body.firstChild);

  function eggSvg(c, cracked) {
    var s = '<ellipse cx="100" cy="184" rx="40" ry="7" class="cr-shadow"/><path d="' + EGG + '" fill="url(#' + c.egid + ')"/>' + c.egg +
      '<ellipse cx="78" cy="70" rx="9" ry="14" fill="#fff" opacity=".5" transform="rotate(20 78 70)"/>';
    if (cracked) {
      s += '<path d="M84 60L96 80L86 94L102 112L92 130L104 146" stroke="' + c.crack + '" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M120 80L110 98L122 110" stroke="' + c.crack + '" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    }
    return s;
  }
  function babyFace(c) {
    var f = c.face || "cute";
    if (f === "cute") return eye(80, 142, 8, 10) + eye(120, 142, 8, 10) + cheeks(62, 138, 156) + smile(100, 156);
    if (f === "cyclops") return '<g class="cr-blink"><circle cx="100" cy="136" r="19" fill="#fff"/><circle cx="100" cy="138" r="10" fill="#ff5a3d"/><circle cx="100" cy="138" r="5" fill="#1a1a1a"/><circle cx="104" cy="133" r="2.4" fill="#fff"/></g><path d="M80 118L120 124" stroke="#1d3a10" stroke-width="5" stroke-linecap="round"/><path d="M84 160Q100 170 116 160" stroke="#2a0f10" stroke-width="3" fill="none" stroke-linecap="round"/>';
    if (f === "robot") return '<rect x="68" y="126" width="64" height="26" rx="10" fill="#14203a"/><g class="cr-glow" filter="url(#fGlow)"><rect x="76" y="134" width="14" height="10" rx="4" fill="#3dffb0"/><rect x="110" y="134" width="14" height="10" rx="4" fill="#3dffb0"/></g>';
    if (f === "ghost" || f === "crystal") return '<g class="cr-glow" filter="url(#fGlow)"><polygon points="72,134 92,140 88,150 70,146" fill="' + (f === "ghost" ? "#5ff2e1" : "#ff3df0") + '"/><polygon points="128,134 108,140 112,150 130,146" fill="' + (f === "ghost" ? "#5ff2e1" : "#ff3df0") + '"/></g><path d="M86 160Q100 168 114 160" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>';
    return slitEyes(80, 120, 140, f === "devil" ? "#ffe066" : "#ffd23a") + '<path d="M88 160Q100 168 112 160" stroke="#1b1440" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M92 161L96 161L94 167ZM104 161L108 161L106 167Z" fill="#fff"/>';
  }
  function babySvg(c) {
    var body = '<ellipse cx="100" cy="182" rx="40" ry="7" class="cr-shadow"/>' + c.hint;
    if (c.id === "ghost") body += '<path d="M60 176L60 130C60 92 140 92 140 130L140 176L126 164L113 178L100 164L87 178L74 164Z" fill="url(#' + c.gid + ')"/>';
    else if (c.id === "kurage") body += '<path d="M52 140C52 90 148 90 148 140Q136 152 124 140Q112 152 100 140Q88 152 76 140Q64 152 52 140Z" fill="url(#' + c.gid + ')"/>';
    else if (c.id === "crystal") body += '<polygon points="100,86 138,112 132,160 100,182 68,160 62,112" fill="url(#' + c.gid + ')"/><polygon points="100,86 62,112 100,128" fill="#fff" opacity=".3"/>';
    else if (c.id === "robot") body += '<rect x="52" y="106" width="96" height="72" rx="22" fill="url(#' + c.gid + ')"/>';
    else body += '<ellipse cx="100" cy="146" rx="48" ry="40" fill="url(#' + c.gid + ')"/>';
    return body + babyFace(c);
  }
  A.creatures = {
    list: LIST,
    count: LIST.length,
    svg: function (kind, form) {
      var c = LIST[kind % LIST.length];
      var inner = form === 0 ? '<g class="cr-egg-wob">' + eggSvg(c, false) + "</g>" : form === 1 ? '<g class="cr-egg-wob fast">' + eggSvg(c, true) + "</g>" :
        form === 2 ? babySvg(c) : '<ellipse cx="100" cy="184" rx="52" ry="8" class="cr-shadow"/>' + c.adult(c.gid, c.X);
      return '<svg class="cr" viewBox="0 0 200 200" aria-hidden="true" focusable="false">' + inner + "</svg>";
    },
    el: function (kind, form, cls) {
      var s = document.createElement("span");
      s.className = "cr-wrap" + (cls ? " " + cls : "");
      s.innerHTML = A.creatures.svg(kind, form);
      return s;
    },
    silhouette: function (kind) { return A.creatures.el(kind, 3, "cr-sil"); },
  };
})();
