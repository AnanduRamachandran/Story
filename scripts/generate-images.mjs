// Generates the site's PNG assets (hero background, OG card, favicon)
// from hand-written SVG, rasterized locally with resvg — no external
// image-gen service, no reliance on system-installed fonts.
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public/images');
mkdirSync(outDir, { recursive: true });

// NOTE: this build of @resvg/resvg-js only accepts local font *paths*
// (`fontFiles`) — there is no `fontBuffers` option, despite some docs
// implying otherwise. Passing buffers is silently ignored (no error),
// which will silently render everything in resvg's built-in fallback
// font. Always verify custom-font output visually after touching this.
const fontDir = path.resolve(__dirname, 'fonts');
const fontFiles = [
  path.join(fontDir, 'Lora-Regular.ttf'),
  path.join(fontDir, 'Lora-Bold.ttf'),
  path.join(fontDir, 'Lora-Italic.ttf'),
];

const COLOR = {
  black: '#000000',
  navyDeep: '#0b192c',
  navy: '#1e3e62',
  ember: '#ff6500',
  cream: '#f4f1ea',
};

function render(svg, { width }, outName) {
  const resvg = new Resvg(svg, {
    font: {
      loadSystemFonts: false,
      fontFiles,
      defaultFontFamily: 'Lora',
    },
    fitTo: { mode: 'width', value: width },
  });
  const png = resvg.render().asPng();
  writeFileSync(path.join(outDir, outName), png);
  console.log(`wrote ${outName} (${png.length} bytes)`);
}

// --- deterministic pseudo-random (so the art is stable across runs) ---
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================================
// 1. Home background — a single line-art medallion evoking Hokusai's
//    "The Great Wave off Kanagawa" (1831 — long public domain).
//    An original abstracted line drawing of the composition's
//    silhouette (the cresting wave and its claw-like foam), not a
//    trace of the print itself, set inside a ring. One emblem, not
//    a repeating pattern.
// ============================================================
function waveMedallionSvg() {
  const S = 900;
  const cx = 450;
  const cy = 450;

  // Smooth crest body — the claws are overlaid on top of this, not
  // baked into the outline, so each hook can be shaped individually.
  const crest = `M 120 560
    C 130 460, 170 380, 250 330
    C 300 300, 335 268, 355 230
    C 395 195, 455 178, 515 195
    C 550 206, 572 226, 570 250
    C 548 266, 512 270, 486 254
    C 494 292, 476 336, 440 372
    C 396 416, 336 446, 274 462
    C 226 474, 172 486, 120 560 Z`;

  // One talon: an open hooked stroke from the crest edge up to a
  // sharp curled tip — no closed loop, so it reads as a claw rather
  // than a bubble. Placed and rotated per-instance along the crest.
  const talon = (ax, ay, rot, scale) =>
    `<path d="M 0 0 C 9 -7 17 -19 15 -29 C 14 -35 8 -37 2 -33"
      transform="translate(${ax} ${ay}) rotate(${rot}) scale(${scale})"
      stroke="${COLOR.navy}" stroke-width="${(2.4 / scale).toFixed(2)}" stroke-opacity="0.65"
      fill="none" stroke-linecap="round" stroke-linejoin="round" />`;

  const talons = [
    talon(355, 228, -50, 1.15),
    talon(392, 199, -25, 1.3),
    talon(432, 182, -3, 1.35),
    talon(474, 180, 18, 1.3),
    talon(513, 194, 40, 1.2),
    talon(548, 217, 60, 1.0),
  ].join('\n    ');

  // Thin contour lines inside the wave body, following the curl —
  // Hokusai's surface striping, simplified.
  const contours = [
    `M 165 540 C 190 460, 235 400, 300 358 C 322 344, 340 328, 353 310`,
    `M 205 520 C 235 450, 278 400, 335 366 C 352 356, 366 342, 377 326`,
    `M 250 495 C 278 440, 316 400, 358 374`,
  ];

  // Smaller secondary swell, lower right, curling the opposite way.
  const swell = `M 560 620
    C 580 570, 620 540, 668 535
    C 690 533, 705 522, 710 505
    C 706 495, 696 492, 688 496
    C 691 478, 708 474, 714 492
    Z`;
  const swellTalons = [talon(688, 500, 200, 0.7), talon(706, 490, 230, 0.6)].join('\n    ');
  const swellContour = `M 585 608 C 602 574, 630 552, 664 544 C 682 540, 696 532, 702 518`;

  // Foam spray — small dots scattered near the claws, one in accent.
  const spray = [
    [388, 172, false],
    [420, 152, false],
    [462, 148, false],
    [500, 156, false],
    [536, 178, true],
    [330, 202, false],
  ];

  const strokeMain = `stroke="${COLOR.navy}" stroke-width="2.2" stroke-opacity="0.6" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const strokeThin = `stroke="${COLOR.navy}" stroke-width="1.3" stroke-opacity="0.4" fill="none" stroke-linecap="round"`;

  const contourPaths = contours.map((d) => `<path d="${d}" ${strokeThin} />`).join('\n    ');
  const sprayDots = spray
    .map(
      ([x, y, accent]) =>
        `<circle cx="${x}" cy="${y}" r="${accent ? 4.5 : 3}" fill="${accent ? COLOR.ember : COLOR.navy}" fill-opacity="${accent ? 0.75 : 0.5}" />`
    )
    .join('\n    ');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <circle cx="${cx}" cy="${cy}" r="410" fill="none" stroke="${COLOR.navy}" stroke-width="2" stroke-opacity="0.35" />
    <circle cx="${cx}" cy="${cy}" r="392" fill="none" stroke="${COLOR.navy}" stroke-width="1" stroke-opacity="0.22" />
    <path d="${crest}" ${strokeMain} />
    ${talons}
    ${contourPaths}
    <path d="${swell}" ${strokeMain} />
    ${swellTalons}
    <path d="${swellContour}" ${strokeThin} />
    ${sprayDots}
  </svg>`;
}

// ============================================================
// 2. OG social card — 1200x630
// ============================================================
function ogSvg() {
  const W = 1200;
  const H = 630;
  const rand = mulberry32(77);
  let dots = '';
  for (let i = 0; i < 26; i++) {
    const x = W * 0.62 + rand() * W * 0.36;
    const y = rand() * H;
    const accent = rand() > 0.82;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(accent ? 3 : 1.6).toFixed(1)}" fill="${accent ? COLOR.ember : COLOR.navy}" fill-opacity="${accent ? 0.9 : 0.5}" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${COLOR.black}" />
    <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${COLOR.navy}" stroke-width="1.5" />
    ${dots}
    <text x="88" y="146" font-family="Lora" font-weight="700" font-size="26" fill="${COLOR.ember}">AR.</text>
    <text x="88" y="330" font-family="Lora" font-weight="700" font-size="86" fill="${COLOR.cream}">Anandu</text>
    <text x="88" y="422" font-family="Lora" font-weight="700" font-size="86" fill="${COLOR.cream}">Ramachandran</text>
    <text x="90" y="480" font-family="Lora" font-style="italic" font-size="24" fill="${COLOR.navy}">Software Developer &#183; Logophile &#183; Philosophy</text>
  </svg>`;
}

// ============================================================
// 3. Favicon — 512x512 monogram
// ============================================================
function faviconSvg() {
  const S = 512;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <rect width="${S}" height="${S}" rx="96" fill="${COLOR.black}" />
    <rect x="10" y="10" width="${S - 20}" height="${S - 20}" rx="88" fill="none" stroke="${COLOR.navy}" stroke-width="6" />
    <text x="50%" y="61%" font-family="Lora" font-weight="700" font-size="300" fill="${COLOR.cream}" text-anchor="middle">A</text>
    <circle cx="392" cy="392" r="26" fill="${COLOR.ember}" />
  </svg>`;
}

// ============================================================
// 4. Nav mark — a simple home/house glyph inside a thin orbit ring,
//    since the mark now links back to "/". Same construction as the
//    rest of the mark set: cream fill, thin navy edge, one ember
//    accent, set inside the same ring language as the favicon and
//    the hero medallion, so it reads as part of one system.
// ============================================================
function navMarkSvg() {
  const S = 120;
  const cx = 60;
  const cy = 62;
  const edge = `stroke="${COLOR.navyDeep}" stroke-width="1.2" stroke-opacity="0.5"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <circle cx="${cx}" cy="${cy}" r="48" fill="none" stroke="${COLOR.navy}" stroke-width="2.5" stroke-opacity="0.4" />
    <path d="M 60 34 L 91 63 L 29 63 Z" fill="${COLOR.cream}" ${edge} stroke-linejoin="round" />
    <rect x="38" y="63" width="44" height="29" fill="${COLOR.cream}" ${edge} />
    <rect x="52" y="76" width="16" height="16" fill="${COLOR.ember}" />
  </svg>`;
}

render(waveMedallionSvg(), { width: 1400 }, 'home-waves.png');
render(ogSvg(), { width: 1200 }, 'og-cover.png');
render(faviconSvg(), { width: 512 }, 'favicon.png');
render(navMarkSvg(), { width: 240 }, 'nav-mark.png');
