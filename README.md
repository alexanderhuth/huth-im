# huth.im

Personal short-URL service. Completely static — no server, no dependencies.

## How it works

Edit `links.json`, run the build, deploy. The build script produces:

- `dist/<code>/index.html` — per-link redirect page (meta refresh + JS fallback)
- `dist/_redirects` — instant 301s handled by the host before HTML is served
- `dist/all/index.html` — page listing all short codes and targets
- `dist/404.html` — fallback for unknown codes

## links.json

```json
{
  "/": "https://example.com",
  "gh": "https://github.com/you",
  "meet": "https://cal.com/you"
}
```

- `"/"` — homepage redirect (optional)
- All other keys become short codes (`huth.im/gh`, `huth.im/meet`, …)

## Build

```sh
node build.js
# or
npm run build
```

Output goes to `dist/` (git-ignored).

## Special pages

| Path | Description |
|------|-------------|
| `/all` | Lists all short codes and their targets |
| `/*` | 404 page with a link to `/all` |

## Deploy

Deployed via [statichost.eu](https://statichost.eu). The `statichost.yml` is already configured:

```yaml
image: node:20
command: node build.js
public: dist
```

Connect the repo on statichost.eu and point the `huth.im` domain at the project. The `_redirects` file format is also compatible with Cloudflare Pages if you ever switch.
