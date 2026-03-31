# huth.im

Personal short-URL service. Completely static — no server, no dependencies.

## How it works

Edit `links.json`, run the build, deploy. Each short code becomes an HTML redirect page plus an entry in `_redirects` for instant 301s on Cloudflare Pages / statichost.eu.

## Adding or changing links

Edit `links.json`:

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

Output goes to `dist/`.

## Special pages

| Path | Description |
|------|-------------|
| `/all` | Lists all short codes and their targets |
| `/*` | 404 page with a link to `/all` |

## Deploy

`statichost.yml` is already configured. Connect the repo and point your `huth.im` domain at the project.
