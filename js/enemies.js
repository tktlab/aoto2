/* AOTO2 てき(問題のモンスター)18しゅるい: 教科ごとに2しゅるい+いろちがい。SVG・オリジナル */
(function () {
  "use strict";
  var A = window.A;
  var INK = "#1d1840";
  function eyes(x1, x2, y, r, brow) {
    brow = brow || INK;
    return '<g class="cr-blink"><circle cx="' + x1 + '" cy="' + y + '" r="' + r + '" fill="#fff"/><circle cx="' + x2 + '" cy="' + y + '" r="' + r + '" fill="#fff"/>' +
      '<circle cx="' + (x1 + 2) + '" cy="' + (y + 2) + '" r="' + (r * 0.5) + '" fill="' + INK + '"/><circle cx="' + (x2 - 2) + '" cy="' + (y + 2) + '" r="' + (r * 0.5) + '" fill="' + INK + '"/></g>' +
      '<path d="M' + (x1 - r - 4) + ' ' + (y - r - 4) + 'L' + (x1 + r) + ' ' + (y - r + 4) + 'M' + (x2 + r + 4) + ' ' + (y - r - 4) + 'L' + (x2 - r) + ' ' + (y - r + 4) + '" stroke="' + brow + '" stroke-width="5" stroke-linecap="round"/>';
  }
  function grin(cx, y, w, col) {
    col = col || INK; var h = w * 0.32;
    return '<path d="M' + (cx - w / 2) + ' ' + y + 'Q' + cx + ' ' + (y + h * 2.2) + ' ' + (cx + w / 2) + ' ' + y + 'Q' + cx + ' ' + (y + h * 0.9) + ' ' + (cx - w / 2) + ' ' + y + 'Z" fill="' + col + '"/>' +
      '<path d="M' + (cx - w * 0.3) + ' ' + (y + 1.5) + 'l' + (w * 0.1) + ' 0l-' + (w * 0.05) + ' ' + (h * 0.9) + 'zM' + (cx + w * 0.2) + ' ' + (y + 1.5) + 'l' + (w * 0.1) + ' 0l-' + (w * 0.05) + ' ' + (h * 0.9) + 'z" fill="#fff"/>';
  }
  var LIST = [
    { id: "numbo", n: "ナンバーン", subject: "数学", g: ["#8db4ff", "#2f55c4"], art: function (G) {
      return '<text x="34" y="64" font-size="34" font-weight="900" fill="#ffd23a" class="cr-shard">＋</text><text x="150" y="54" font-size="34" font-weight="900" fill="#7ef0ff" class="cr-shard b">−</text><text x="158" y="126" font-size="30" font-weight="900" fill="#ff9ad0" class="cr-shard c">×</text>' +
        '<ellipse cx="38" cy="124" rx="12" ry="18" fill="#3a63d0" transform="rotate(20 38 124)"/><ellipse cx="162" cy="124" rx="12" ry="18" fill="#3a63d0" transform="rotate(-20 162 124)"/>' +
        '<rect x="66" y="156" width="26" height="22" rx="8" fill="#2a47a0"/><rect x="108" y="156" width="26" height="22" rx="8" fill="#2a47a0"/>' +
        '<rect x="48" y="58" width="104" height="104" rx="28" fill="url(#' + G + ')"/><rect x="58" y="66" width="40" height="10" rx="5" fill="#fff" opacity=".35"/>' +
        eyes(80, 120, 98, 13, "#14286b") + grin(100, 126, 56, "#14286b"); } },
    { id: "alphabee", n: "アルファビー", subject: "英語", g: ["#ff9fd0", "#d63c8c"], art: function (G) {
      return '<path d="M56 96C26 70 14 80 6 56C28 58 40 52 50 40C48 62 62 76 72 86Z" fill="#b8326f"/><g transform="translate(200 0) scale(-1 1)"><path d="M56 96C26 70 14 80 6 56C28 58 40 52 50 40C48 62 62 76 72 86Z" fill="#b8326f"/></g>' +
        '<path d="M66 70L60 42L86 62Z" fill="#fff0c0"/><path d="M134 70L140 42L114 62Z" fill="#fff0c0"/>' +
        '<ellipse cx="78" cy="176" rx="14" ry="8" fill="#a82a74"/><ellipse cx="122" cy="176" rx="14" ry="8" fill="#a82a74"/>' +
        '<circle cx="100" cy="112" r="54" fill="url(#' + G + ')"/><ellipse cx="100" cy="146" rx="30" ry="22" fill="#fff" opacity=".92"/>' +
        '<text x="100" y="158" font-size="38" font-weight="900" fill="#d63c8c" text-anchor="middle">A</text>' +
        eyes(80, 120, 96, 12, "#6a1245") + '<path d="M86 114Q100 122 114 114" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M90 116L94 116L92 124ZM106 116L110 116L108 124Z" fill="#fff"/>'; } },
    { id: "mojimojin", n: "モジモジン", subject: "国語", g: ["#ffc16a", "#e8761c"], art: function (G) {
      return '<path d="M150 30L124 76" stroke="#7a4a10" stroke-width="5" stroke-linecap="round"/><path d="M150 30C170 28 178 44 168 58C160 66 146 54 150 30Z" fill="#ffe9c0" stroke="#d9a55a" stroke-width="2"/>' +
        '<path d="M100 56C142 52 168 84 160 118C156 140 170 154 152 172C138 184 122 170 114 182C106 192 94 176 84 182C70 188 62 168 54 162C36 146 46 122 42 102C36 70 66 58 100 56Z" fill="url(#' + G + ')"/>' +
        '<ellipse cx="72" cy="78" rx="14" ry="7" fill="#fff" opacity=".4" transform="rotate(-28 72 78)"/>' +
        '<text x="100" y="164" font-size="34" font-weight="900" fill="#fff" text-anchor="middle" opacity=".9">あ</text>' +
        eyes(82, 118, 100, 12, "#7a3a08") + grin(100, 118, 40, "#5a2a08"); } },
    { id: "flaskon", n: "フラスコン", subject: "理科", g: ["#7ff0a8", "#25a85c"], art: function (G) {
      return '<g class="cr-flame"><circle cx="92" cy="14" r="6" fill="#fff" opacity=".7"/><circle cx="108" cy="22" r="8" fill="#fff" opacity=".6"/></g>' +
        '<rect x="80" y="26" width="40" height="16" rx="5" fill="#a8743a"/>' +
        '<path d="M84 42H116V86L158 156C166 172 156 184 140 184H60C44 184 34 172 42 156L84 86Z" fill="#dff7ee" stroke="#8fd9b6" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M60 136H140L156 160C160 172 152 178 140 178H60C48 178 40 172 44 160Z" fill="url(#' + G + ')"/>' +
        '<circle cx="74" cy="168" r="4" fill="#fff" opacity=".7"/><circle cx="130" cy="146" r="3" fill="#fff" opacity=".7"/><circle cx="116" cy="170" r="5" fill="#fff" opacity=".6"/>' +
        eyes(82, 118, 148, 10, "#0f5a2c") + '<path d="M88 166Q100 174 112 166" stroke="#0f5a2c" stroke-width="3.5" fill="none" stroke-linecap="round"/>'; } },
    { id: "chizura", n: "チズラ", subject: "社会", g: ["#b99cff", "#6a42c8"], art: function (G) {
      return '<ellipse cx="100" cy="184" rx="38" ry="8" fill="#3b2a80"/><path d="M52 50Q24 112 58 166" stroke="#3b2a80" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<path d="M100 48V26" stroke="#3b2a80" stroke-width="4"/><path d="M100 26L124 34L100 42Z" fill="#ff5a5a"/>' +
        '<circle cx="100" cy="112" r="58" fill="url(#' + G + ')"/>' +
        '<path d="M60 92C70 80 86 82 92 92C86 104 72 108 62 106Z" fill="#7ad884"/><path d="M116 84C132 78 148 90 146 104C140 112 124 112 116 102Z" fill="#7ad884"/><path d="M96 138C110 132 124 144 118 156C108 162 98 154 96 138Z" fill="#7ad884"/>' +
        '<path d="M100 54Q70 112 100 168M100 54Q130 112 100 168M44 112H156" stroke="#fff" stroke-width="2" fill="none" opacity=".35"/>' +
        eyes(82, 118, 104, 12, "#2a1860") + grin(100, 128, 40, "#2a1860"); } },
    { id: "onpuler", n: "オンプラー", subject: "音楽", g: ["#ff9a9a", "#d03a3a"], art: function (G) {
      return '<path d="M168 96Q184 110 168 126M180 84Q202 110 180 138" stroke="#ffb3b3" stroke-width="4" fill="none" stroke-linecap="round" class="cr-glow"/>' +
        '<rect x="112" y="34" width="14" height="104" rx="7" fill="#8f1f1f"/><path d="M126 36C156 48 176 68 162 104C164 80 148 72 126 70Z" fill="#8f1f1f"/>' +
        '<ellipse cx="86" cy="140" rx="46" ry="38" fill="url(#' + G + ')" transform="rotate(-14 86 140)"/><ellipse cx="66" cy="124" rx="12" ry="6" fill="#fff" opacity=".4" transform="rotate(-30 66 124)"/>' +
        '<ellipse cx="62" cy="178" rx="14" ry="7" fill="#8f1f1f"/><ellipse cx="102" cy="176" rx="14" ry="7" fill="#8f1f1f"/>' +
        eyes(68, 102, 134, 11, "#5a0f0f") + '<ellipse cx="86" cy="160" rx="11" ry="9" fill="#5a0f0f"/><ellipse cx="86" cy="165" rx="6" ry="4" fill="#ff7a7a"/>'; } },
    { id: "penking", n: "ペンキング", subject: "美術", g: ["#ffa8e8", "#c43fb0"], art: function (G) {
      return '<polygon points="64,64 70,36 84,56 100,30 116,56 130,36 136,64" fill="#ffd23a" stroke="#e8a21c" stroke-width="2" stroke-linejoin="round"/><circle cx="70" cy="36" r="5" fill="#4ad8ff"/><circle cx="100" cy="30" r="5" fill="#7aef6a"/><circle cx="130" cy="36" r="5" fill="#ff6a6a"/>' +
        '<path d="M100 58C138 54 160 82 158 114C158 138 148 160 130 172C116 180 84 180 70 172C52 160 42 138 42 114C40 82 62 62 100 58Z" fill="url(#' + G + ')"/>' +
        '<path d="M60 168C58 184 70 190 70 176ZM126 172C124 190 138 192 136 176Z" fill="#c43fb0"/><circle cx="30" cy="104" r="7" fill="#4ad8ff"/><circle cx="172" cy="86" r="6" fill="#7aef6a"/><circle cx="168" cy="150" r="8" fill="#ffd23a"/>' +
        '<ellipse cx="72" cy="84" rx="14" ry="7" fill="#fff" opacity=".4" transform="rotate(-28 72 84)"/>' +
        eyes(80, 120, 102, 12, "#6a1a60") + '<path d="M82 126Q100 142 118 126Z" fill="#6a1a60"/><path d="M92 130Q100 150 108 130Z" fill="#ff6a8a"/>'; } },
    { id: "borgon", n: "ボルゴン", subject: "保健体育", g: ["#ffffff", "#cfdcec"], art: function (G) {
      function pent(cx, cy, r) { var p = []; for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; p.push((cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1)); } return '<polygon points="' + p.join(" ") + '" fill="#2fb5c7"/>'; }
      return '<ellipse cx="74" cy="178" rx="16" ry="8" fill="#1d7a88"/><ellipse cx="126" cy="178" rx="16" ry="8" fill="#1d7a88"/>' +
        '<circle cx="100" cy="112" r="58" fill="url(#' + G + ')" stroke="#b6c8de" stroke-width="3"/>' + pent(100, 62, 13) + pent(52, 112, 12) + pent(148, 112, 12) + pent(74, 164, 11) + pent(126, 164, 11) +
        '<rect x="44" y="86" width="112" height="14" rx="6" fill="#ff5a5a"/><path d="M152 90L176 80L172 100Z" fill="#ff5a5a"/>' +
        eyes(82, 118, 118, 11, INK) + grin(100, 138, 34, INK); } },
    { id: "nejira", n: "ネジラ", subject: "技術家庭", g: ["#f0dd6a", "#8a8a1f"], art: function (G) {
      var teeth = ""; for (var i = 0; i < 12; i++) teeth += '<rect x="92" y="46" width="16" height="22" rx="4" fill="#9a9a2a" transform="rotate(' + (i * 30) + ' 100 110)"/>';
      return '<path d="M150 124L176 94" stroke="#9aa6b8" stroke-width="10" stroke-linecap="round"/><circle cx="178" cy="90" r="11" fill="none" stroke="#9aa6b8" stroke-width="7"/>' +
        '<ellipse cx="78" cy="178" rx="14" ry="8" fill="#6a6a18"/><ellipse cx="122" cy="178" rx="14" ry="8" fill="#6a6a18"/>' +
        '<g class="cr-sway" style="transform-origin:50% 50%">' + teeth + '</g><circle cx="100" cy="110" r="50" fill="url(#' + G + ')"/>' +
        '<path d="M88 66H112M100 54V78" stroke="#6a6a18" stroke-width="5" stroke-linecap="round" opacity=".6"/>' +
        eyes(82, 118, 108, 11, "#4a4a10") + grin(100, 130, 34, "#4a4a10"); } },

    { id: "sankakun", n: "サンカクン", subject: "数学", g: ["#9be7ff", "#2a8fd0"], art: function (G) {
      return '<text x="22" y="70" font-size="30" font-weight="900" fill="#ffd23a" class="cr-shard">π</text><text x="160" y="64" font-size="30" font-weight="900" fill="#ff9ad0" class="cr-shard b">÷</text>' +
        '<ellipse cx="70" cy="180" rx="16" ry="8" fill="#1d5f94"/><ellipse cx="130" cy="180" rx="16" ry="8" fill="#1d5f94"/>' +
        '<polygon points="100,30 170,164 30,164" fill="url(#' + G + ')" stroke="#2a8fd0" stroke-width="14" stroke-linejoin="round"/>' +
        '<path d="M84 64L100 50" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".45"/>' +
        '<path d="M70 150h20M70 150v-14" stroke="#14507a" stroke-width="4" fill="none" opacity=".5"/>' +
        eyes(82, 118, 108, 12, "#0f3a5a") + grin(100, 130, 36, "#0f3a5a"); } },
    { id: "bukkuro", n: "ブックロー", subject: "英語", g: ["#7fe3d6", "#1f9a8c"], art: function (G) {
      return '<path d="M52 70L36 46L70 58ZM148 70L164 46L130 58Z" fill="#14695f"/>' +
        '<ellipse cx="76" cy="182" rx="14" ry="7" fill="#f2a83a"/><ellipse cx="124" cy="182" rx="14" ry="7" fill="#f2a83a"/>' +
        '<rect x="42" y="56" width="116" height="122" rx="22" fill="url(#' + G + ')"/><rect x="42" y="150" width="116" height="28" rx="14" fill="#fff" opacity=".85"/>' +
        '<path d="M50 160h100M50 168h100" stroke="#9fd8d0" stroke-width="2"/><text x="100" y="172" font-size="22" font-weight="900" fill="#1f9a8c" text-anchor="middle">ABC</text>' +
        eyes(78, 122, 92, 15, "#0d4a42") + '<path d="M92 112L108 112L100 126Z" fill="#f2a83a"/>'; } },
    { id: "fudemaru", n: "フデマル", subject: "国語", g: ["#7f84a8", "#23243a"], art: function (G) {
      return '<rect x="92" y="14" width="16" height="56" rx="8" fill="#c98a3a"/><rect x="92" y="14" width="16" height="12" rx="6" fill="#8a5a1a"/>' +
        '<path d="M100 60C132 62 154 92 152 128C150 158 138 178 100 184C62 178 50 158 48 128C46 92 68 62 100 60Z" fill="url(#' + G + ')"/>' +
        '<path d="M100 184C96 194 104 196 100 200" stroke="#23243a" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<text x="100" y="170" font-size="30" font-weight="900" fill="#fff" text-anchor="middle" opacity=".85">文</text>' +
        '<ellipse cx="76" cy="86" rx="10" ry="5" fill="#fff" opacity=".35" transform="rotate(-30 76 86)"/>' +
        eyes(80, 120, 110, 12, "#fff") + grin(100, 130, 34, "#fff"); } },
    { id: "denkyuu", n: "デンキュウ", subject: "理科", g: ["#fff3a0", "#f2b41a"], art: function (G) {
      return '<g class="cr-glow"><path d="M100 4V18M30 40L40 50M170 40L160 50M16 100H30M184 100H170" stroke="#ffd23a" stroke-width="6" stroke-linecap="round"/></g>' +
        '<rect x="76" y="140" width="48" height="36" rx="8" fill="#9aa6b8"/><path d="M76 152H124M76 164H124" stroke="#6a7688" stroke-width="4"/><rect x="88" y="174" width="24" height="10" rx="5" fill="#4a5468"/>' +
        '<path d="M100 28C142 28 162 62 156 96C152 116 134 124 128 140H72C66 124 48 116 44 96C38 62 58 28 100 28Z" fill="url(#' + G + ')" stroke="#e8a21c" stroke-width="3"/>' +
        '<path d="M108 40L92 76H110L96 104" stroke="#fff" stroke-width="6" fill="none" stroke-linejoin="round" opacity=".7"/>' +
        eyes(80, 120, 88, 12, "#6a4a08") + grin(100, 110, 34, "#6a4a08"); } },
    { id: "shirokko", n: "シロッコ", subject: "社会", g: ["#d9c2a0", "#9a7448"], art: function (G) {
      return '<path d="M100 18V6" stroke="#5a3a18" stroke-width="4"/><path d="M100 6L128 14L100 22Z" fill="#ff5a5a"/>' +
        '<path d="M52 40H70V56H86V40H114V56H130V40H148V176H52Z" fill="url(#' + G + ')" stroke="#7a5a30" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M52 100H148M52 140H148M76 100V140M124 60V100M76 60V100M124 140V176" stroke="#7a5a30" stroke-width="2" opacity=".4"/>' +
        '<path d="M80 176V150Q100 128 120 150V176Z" fill="#4a3018"/>' +
        eyes(80, 120, 84, 12, "#4a3018") + '<path d="M84 112Q100 124 116 112" stroke="#4a3018" stroke-width="4" fill="none" stroke-linecap="round"/>'; } },
    { id: "taikon", n: "タイコン", subject: "音楽", g: ["#7fd0ff", "#2f78d6"], art: function (G) {
      return '<path d="M30 30L84 82M170 30L116 82" stroke="#c98a3a" stroke-width="7" stroke-linecap="round"/><circle cx="28" cy="28" r="8" fill="#ffd23a"/><circle cx="172" cy="28" r="8" fill="#ffd23a"/>' +
        '<ellipse cx="100" cy="176" rx="56" ry="12" fill="#1d4a94"/><rect x="44" y="92" width="112" height="84" fill="url(#' + G + ')"/><ellipse cx="100" cy="92" rx="56" ry="18" fill="#fff" stroke="#e8e8f0" stroke-width="3"/>' +
        '<path d="M44 108L72 176M72 108L100 176M100 108L128 176M128 108L156 176" stroke="#ff5a5a" stroke-width="4" opacity=".6"/>' +
        eyes(80, 120, 128, 12, "#0f2f6a") + grin(100, 146, 30, "#0f2f6a"); } },
    { id: "paretto", n: "パレット", subject: "美術", g: ["#ffe0b0", "#d9a05a"], art: function (G) {
      return '<path d="M170 30L124 90" stroke="#8a5a1a" stroke-width="7" stroke-linecap="round"/><path d="M174 24C186 16 190 28 176 34Z" fill="#c43fb0"/>' +
        '<path d="M100 50C150 46 178 84 170 122C164 152 132 148 120 160C108 176 66 186 44 156C24 130 30 66 100 50Z" fill="url(#' + G + ')" stroke="#b88040" stroke-width="3"/>' +
        '<circle cx="132" cy="146" r="9" fill="#9a7440"/><circle cx="62" cy="84" r="9" fill="#ff5a5a"/><circle cx="90" cy="66" r="9" fill="#ffd23a"/><circle cx="130" cy="68" r="9" fill="#4ad8ff"/><circle cx="154" cy="96" r="9" fill="#7aef6a"/>' +
        eyes(78, 118, 112, 12, "#5a3a10") + grin(98, 134, 32, "#5a3a10"); } },
    { id: "kettler", n: "ケトラー", subject: "保健体育", g: ["#7a8aa8", "#2d3650"], art: function (G) {
      return '<path d="M62 70C60 20 140 20 138 70" stroke="#2d3650" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M72 66C72 36 128 36 128 66" stroke="#8a9ab8" stroke-width="3" fill="none" opacity=".6"/>' +
        '<ellipse cx="72" cy="184" rx="16" ry="7" fill="#1d2438"/><ellipse cx="128" cy="184" rx="16" ry="7" fill="#1d2438"/>' +
        '<path d="M100 56C150 56 170 100 162 138C154 170 134 182 100 182C66 182 46 170 38 138C30 100 50 56 100 56Z" fill="url(#' + G + ')"/>' +
        '<ellipse cx="70" cy="88" rx="14" ry="7" fill="#fff" opacity=".3" transform="rotate(-30 70 88)"/><text x="100" y="170" font-size="20" font-weight="900" fill="#fff" text-anchor="middle" opacity=".6">10kg</text>' +
        eyes(80, 120, 110, 12, "#fff") + grin(100, 128, 36, "#fff"); } },
    { id: "itomaki", n: "イトマキ", subject: "技術家庭", g: ["#ff9fb0", "#d6406a"], art: function (G) {
      return '<path d="M150 120L186 52" stroke="#c8d0dc" stroke-width="5" stroke-linecap="round"/><ellipse cx="186" cy="52" rx="3" ry="6" fill="none" stroke="#c8d0dc" stroke-width="2"/>' +
        '<path d="M150 150C176 150 180 120 168 110" stroke="#ff7a9a" stroke-width="4" fill="none" stroke-linecap="round" class="cr-sway"/>' +
        '<rect x="50" y="36" width="100" height="26" rx="10" fill="#f0d8a8" stroke="#c9a868" stroke-width="3"/><rect x="50" y="160" width="100" height="26" rx="10" fill="#f0d8a8" stroke="#c9a868" stroke-width="3"/>' +
        '<rect x="58" y="58" width="84" height="106" fill="url(#' + G + ')"/><path d="M58 76H142M58 94H142M58 112H142M58 130H142M58 148H142" stroke="#fff" stroke-width="2" opacity=".3"/>' +
        eyes(80, 120, 100, 12, "#6a1a30") + grin(100, 124, 34, "#6a1a30"); } },
  ];
  var defs = "", by = {}, subj = {};
  LIST.forEach(function (e, i) {
    e.idx = i; e.gid = "gn-" + e.id; by[e.id] = e; (subj[e.subject] = subj[e.subject] || []).push(e);
    defs += '<linearGradient id="' + e.gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + e.g[0] + '"/><stop offset="1" stop-color="' + e.g[1] + '"/></linearGradient>';
  });
  var holder = document.createElement("div");
  holder.setAttribute("aria-hidden", "true");
  holder.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
  holder.innerHTML = '<svg width="0" height="0"><defs>' + defs + "</defs></svg>";
  document.body.insertBefore(holder, document.body.firstChild);
  var HUES = [0, 30, -35, 70, -70];
  A.enemies = {
    list: LIST,
    forSubject: function (subject, variant) { var pool = subj[subject] || [LIST[0]]; return { e: pool[Math.floor(Math.random() * pool.length)], hue: HUES[Math.floor(Math.random() * HUES.length)] }; },
    el: function (id, hue, cls) {
      var e = by[id], s = document.createElement("span");
      s.className = "cr-wrap foe-art" + (cls ? " " + cls : "");
      if (hue) s.style.filter = "hue-rotate(" + hue + "deg)";
      s.innerHTML = '<svg class="cr" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><ellipse cx="100" cy="186" rx="50" ry="7" class="cr-shadow"/>' + e.art(e.gid) + "</svg>";
      return s;
    },
  };
})();
