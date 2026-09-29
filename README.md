# blob-avatars

Deterministic SVG blob avatars for default profile pictures. Same seed (user id, email…) → same blob, every time. No dependencies, no storage, works in Node, browsers, and edge runtimes.

Each avatar gets a random wobbly shape, a color, a glance direction, and one of 20 faces (4 eye styles × 5 mouths).

## Install

```sh
npm install blob-avatars
```

## Usage

```js
import { blobAvatar, blobAvatarDataUri } from 'blob-avatars';

blobAvatar(user.id);                    // '<svg ...>...</svg>'
blobAvatarDataUri(user.id);             // 'data:image/svg+xml;utf8,...' for <img src>
```

React:

```jsx
<img src={blobAvatarDataUri(user.id)} alt="" width={40} height={40} />
```

Serve it from an endpoint (e.g. a Next.js route handler at `app/avatar/[id]/route.js`):

```js
export async function GET(_req, { params }) {
  const { id } = await params;
  return new Response(blobAvatar(id), {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
```

## Options

| Option       | Default     | Description                                   |
| ------------ | ----------- | --------------------------------------------- |
| `size`       | `128`       | Width/height in px                            |
| `colors`     | 8 brights   | Palette the blob color is picked from         |
| `background` | `'#111111'` | Background color, or `'none'` / `'transparent'` for just the blob |
| `face`       | background  | Eyes/mouth color (`'#111111'` when there's no background) |

```js
blobAvatar('ada', { size: 64, background: '#ffffff', colors: ['#111', '#555'] });
blobAvatar('ada', { background: 'none' });                  // just the blob, no square
blobAvatar('ada', { background: 'none', face: '#ffffff' }); // …with a white face
```

## Development

```sh
npm test          # runs assertions and writes preview.html
open preview.html
```

## License

MIT
