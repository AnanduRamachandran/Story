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
// 1. Home background — seigaiha (青海波), the traditional Japanese
//    "blue ocean wave" pattern: rows of nested concentric arcs,
//    each row overlapping the next. Built as a plain grid, not a
//    trace of any specific print (e.g. Hokusai) — a pattern, not
//    an illustration.
// ============================================================
function seigaihaSvg() {
  const W = 1920;
  const H = 1280;
  const R = 52; // fan radius — finer grain than a bold print
  const ARCS = 3; // concentric arcs per fan
  const rowH = R * 0.62; // vertical overlap between rows
  const colW = R * 2;

  let paths = '';
  let row = 0;
  for (let cy = -R; cy < H + R; cy += rowH) {
    const offset = row % 2 === 0 ? 0 : R;
    // One accent arc roughly every ~9th row — a hint of warmth, not a stripe.
    const accentRow = row % 9 === 4;
    for (let cx = -R + offset; cx < W + R; cx += colW) {
      for (let k = ARCS; k >= 1; k--) {
        const r = (R * k) / ARCS;
        const outer = k === ARCS;
        const stroke = accentRow && outer ? COLOR.ember : COLOR.navy;
        const opacity = accentRow && outer ? 0.32 : 0.22 - (ARCS - k) * 0.045;
        paths += `<path d="M ${(cx - r).toFixed(1)} ${cy.toFixed(1)} A ${r} ${r} 0 0 1 ${(cx + r).toFixed(1)} ${cy.toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="1.1" stroke-opacity="${opacity.toFixed(2)}" />`;
      }
    }
    row++;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="none" />
    ${paths}
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
// 4. Nav mark — an abstract straw hat inside a thin orbit ring.
//    Generic hat silhouette (wide brim, rounded crown, banded) —
//    an original geometric shape, not a trace of any copyrighted
//    character art or logo — set inside the same orbit-ring language
//    as the hero background, so it still reads as one system.
// ============================================================
function navMarkSvg() {
  const S = 120;
  const cx = 60;
  const cy = 62;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
    <circle cx="${cx}" cy="${cy}" r="48" fill="none" stroke="${COLOR.navy}" stroke-width="2.5" stroke-opacity="0.4" />
    <ellipse cx="${cx}" cy="76" rx="35" ry="8.5" fill="${COLOR.cream}" stroke="${COLOR.navyDeep}" stroke-width="1.2" stroke-opacity="0.5" />
    <path
      d="M 39 68 Q 39 34 60 32 Q 81 34 81 68 Z"
      fill="${COLOR.cream}"
      stroke="${COLOR.navyDeep}"
      stroke-width="1.2"
      stroke-opacity="0.5"
    />
    <rect x="39" y="61" width="42" height="9" fill="${COLOR.ember}" />
  </svg>`;
}

render(seigaihaSvg(), { width: 1920 }, 'home-waves.png');
render(ogSvg(), { width: 1200 }, 'og-cover.png');
render(faviconSvg(), { width: 512 }, 'favicon.png');
render(navMarkSvg(), { width: 240 }, 'nav-mark.png');
