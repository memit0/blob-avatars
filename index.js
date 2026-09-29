const PALETTE = ['#ffffff', '#ffd166', '#ef476f', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9f68', '#9ef01a'];

// FNV-1a string hash seeding a mulberry32 PRNG: same seed -> same avatar, forever.
function rng(seed) {
  let h = 2166136261;
  for (const c of String(seed)) h = Math.imul(h ^ c.codePointAt(0), 16777619);
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => +n.toFixed(1);
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

export function blobAvatar(seed, { size = 128, colors = PALETTE, background = '#111111' } = {}) {
  const r = rng(seed);
  const color = colors[Math.floor(r() * colors.length)];

  // Wobbly ring of points around the center (viewBox is 0..100).
  const n = 6 + Math.floor(r() * 3);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const rad = 33 + r() * 10;
    return [50 + Math.cos(a) * rad, 50 + Math.sin(a) * rad];
  });

  // Closed Catmull-Rom spline -> cubic Béziers, so the blob is smooth.
  let d = `M${pt(pts[0])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [-1, 0, 1, 2].map((k) => pts[(i + k + n) % n]);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
  }
  d += 'Z';

  // Face glancing in a random direction.
  const lx = (r() - 0.5) * 16, ly = (r() - 0.5) * 12;
  const gap = 6 + r() * 4, tilt = (r() - 0.5) * 30;
  const cx = 50 + lx, ey = 45 + ly, my = ey + 11;
  const ink = background;
  const line = (d) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`;

  const eyes = [
    (x) => `<ellipse cx="${f(x)}" cy="${f(ey)}" rx="2.6" ry="4.6" fill="${ink}" transform="rotate(${f(tilt)} ${f(x)} ${f(ey)})"/>`, // oval
    (x) => `<circle cx="${f(x)}" cy="${f(ey)}" r="3" fill="${ink}"/>`, // dot
    (x) => line(`M${f(x - 3.5)} ${f(ey + 1.5)}Q${f(x)} ${f(ey - 3.5)} ${f(x + 3.5)} ${f(ey + 1.5)}`), // happy ^^
    (x) => line(`M${f(x - 3.5)} ${f(ey)}h7`), // sleepy
  ];
  const mouths = [
    () => '', // none, like the original
    () => line(`M${f(cx - 5)} ${f(my)}Q${f(cx)} ${f(my + 5)} ${f(cx + 5)} ${f(my)}`), // smile
    () => `<ellipse cx="${f(cx)}" cy="${f(my + 1)}" rx="2.4" ry="3" fill="${ink}"/>`, // "o"
    () => line(`M${f(cx - 4)} ${f(my + 1)}h8`), // flat
    () => `<path d="M${f(cx - 6)} ${f(my)}Q${f(cx)} ${f(my + 9)} ${f(cx + 6)} ${f(my)}Z" fill="${ink}"/>`, // grin
  ];
  const eye = eyes[Math.floor(r() * eyes.length)];
  const mouth = mouths[Math.floor(r() * mouths.length)];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">` +
    `<rect width="100" height="100" fill="${background}"/>` +
    `<path d="${d}" fill="${color}"/>` +
    eye(cx - gap) + eye(cx + gap) + mouth() + `</svg>`;
}

export const blobAvatarDataUri = (seed, opts) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(blobAvatar(seed, opts))}`;
