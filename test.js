import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { blobAvatar } from './index.js';

assert.equal(blobAvatar('user_123'), blobAvatar('user_123'), 'same seed must give same avatar');
assert.notEqual(blobAvatar('user_123'), blobAvatar('user_124'), 'different seeds should differ');
assert.match(blobAvatar('x', { size: 64 }), /^<svg[^>]+width="64"[\s\S]*<\/svg>$/);

// Every face part should show up across a batch of users.
const batch = Array.from({ length: 300 }, (_, i) => blobAvatar(`u${i}`)).join('');
for (const part of ['rx="2.6"', '<circle', 'Q', 'h7', 'rx="2.4"', 'h8']) assert.ok(batch.includes(part), part);
assert.match(batch, /<path d="M[^"]*Q[^"]*Z"/, 'grin');

// Optional background: no square, face falls back to near-black; `face` overrides.
assert.ok(!blobAvatar('x', { background: 'none' }).includes('<rect'));
assert.ok(!blobAvatar('x', { background: 'transparent' }).includes('<rect'));
assert.match(blobAvatar('x', { background: 'none' }), /fill="#111111"|stroke="#111111"/);
assert.match(blobAvatar('x', { background: '#fff', face: '#f00' }), /<rect[^>]+#fff[\s\S]*(fill|stroke)="#f00"/);

// Preview sheet: open preview.html in a browser.
const seeds = Array.from({ length: 24 }, (_, i) => `user-${i}`);
writeFileSync('preview.html', `<body style="background:#222">${seeds.map((s) => blobAvatar(s, { size: 96 })).join(' ')}</body>`);
console.log('ok');
