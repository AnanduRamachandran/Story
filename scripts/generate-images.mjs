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
// 1. Hero background — sparse constellation / contour field
// ============================================================
function heroSvg() {
  const rand = mulberry32(2409);
  const W = 1600;
  const H = 1000;
  const N = 64;
  const nodes = Array.from({ length: N }, () => ({
    x: rand() * W,
    y: rand() * H * 0.9 + H * 0.05,
    r: rand() * 1.4 + 0.9,
    accent: rand() > 0.9,
  }));

  // Connect each node to its single nearest neighbor (within range) —
  // produces sparse, tree-like constellations instead of closed polygons.
  let lines = '';
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    let best = -1;
    let bestD = 190;
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < bestD) {
        bestD = d;
        best = j;
      }
    }
    if (best !== -1 && rand() > 0.35) {
      const b = nodes[best];
      lines += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${COLOR.navy}" stroke-width="1" stroke-opacity="${(0.16 + rand() * 0.16).toFixed(2)}" />`;
    }
  }

  let dots = '';
  for (const n of nodes) {
    const fill = n.accent ? COLOR.ember : COLOR.navy;
    const opacity = n.accent ? 0.85 : 0.55;
    dots += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${(n.accent ? n.r + 1.4 : n.r).toFixed(1)}" fill="${fill}" fill-opacity="${opacity}" />`;
  }

  // a few faint orbit arcs for structure
  let arcs = '';
  const arcCenters = [
    { cx: W * 0.82, cy: H * 0.28 },
    { cx: W * 0.15, cy: H * 0.78 },
  ];
  for (const c of arcCenters) {
    for (let k = 0; k < 3; k++) {
      const r = 60 + k * 46;
      arcs += `<circle cx="${c.cx}" cy="${c.cy}" r="${r}" fill="none" stroke="${COLOR.navy}" stroke-width="1" stroke-opacity="${(0.22 - k * 0.05).toFixed(2)}" />`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="none" />
    ${arcs}
    ${lines}
    ${dots}
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

render(heroSvg(), { width: 1600 }, 'hero-field.png');
render(ogSvg(), { width: 1200 }, 'og-cover.png');
render(faviconSvg(), { width: 512 }, 'favicon.png');
