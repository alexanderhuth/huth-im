# huth.im

Personal short-URL service. Completely static — no server, no dependencies.

## How it works

`links.json` defines the short codes. The build script generates `_redirects` for instant 301s on statichost.eu, plus an `/all` listing page and a 404 page. Output goes to `dist/`.

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

## Special pages

| Path | Description |
|------|-------------|
| `/all` | Lists all short codes and their targets |
| `/*` | 404 page with a link to `/all` |
