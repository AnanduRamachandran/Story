// Generates the site's SVG-based PNG assets (OG card, favicon, nav mark)
// rasterized locally with resvg — no external image-gen service, no
// reliance on system-installed fonts. The home page's background
// (public/images/great-wave.png) is a supplied illustration, not
// generated here — see the README for its provenance.
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
// 1. OG social card — 1200x630
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
// 2. Favicon — 512x512 wave-curl glyph. Transparent canvas, a
//    single open stroke (no fills, no letters) echoing the
//    Hokusai wave on the home page — legible as a small accent
//    mark rather than a monogram.
// ============================================================
function faviconSvg() {
  const S = 512;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <path d="M 92 328 C 138 208 292 152 384 224 C 452 276 420 372 328 366 C 274 362 254 322 284 296"
      fill="none" stroke="${COLOR.ember}" stroke-width="36" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;
}

// ============================================================
// 3. Nav mark — an outline home glyph inside a thin orbit ring,
//    since the mark now links back to "/". Open stroked lines, not
//    filled shapes, matching the site's line-art language — just
//    one filled ember accent for the door.
// ============================================================
function navMarkSvg() {
  const S = 120;
  const cx = 60;
  const cy = 62;
  const line = `fill="none" stroke="${COLOR.cream}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <circle cx="${cx}" cy="${cy}" r="48" fill="none" stroke="${COLOR.navy}" stroke-width="2.5" stroke-opacity="0.4" />
    <path d="M 28 64 L 60 34 L 92 64" ${line} />
    <path d="M 36 63 L 36 92 L 84 92 L 84 63" ${line} />
    <rect x="52" y="76" width="16" height="16" fill="${COLOR.ember}" />
  </svg>`;
}

render(ogSvg(), { width: 1200 }, 'og-cover.png');
render(faviconSvg(), { width: 512 }, 'favicon.png');
render(navMarkSvg(), { width: 240 }, 'nav-mark.png');
