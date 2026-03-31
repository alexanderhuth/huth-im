#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const links = JSON.parse(fs.readFileSync("links.json", "utf8"));
const dist = "dist";

if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true });
fs.mkdirSync(dist);

function redirectPage(url) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=${url}">
  <link rel="canonical" href="${url}">
  <title>Redirecting…</title>
  <script>window.location.replace(${JSON.stringify(url)})</script>
</head>
<body>
  <a href="${url}">Redirecting…</a>
</body>
</html>`;
}

const shortLinks = Object.fromEntries(
  Object.entries(links).filter(([code]) => code !== "/")
);

// Generate per-link redirect pages
for (const [code, url] of Object.entries(shortLinks)) {
  const dir = path.join(dist, code);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), redirectPage(url));
}

// /all — HTML page listing all short links
const allRows = Object.entries(shortLinks)
  .map(([code, url]) => `    <tr><td><a href="/${code}">/${code}</a></td><td><a href="${url}">${url}</a></td></tr>`)
  .join("\n");
const allPage = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>huth.im/all</title>
  <style>
    body { font-family: monospace; max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
    a { color: inherit; }
    td { padding: .25rem .75rem .25rem 0; }
  </style>
</head>
<body>
  <h1>huth.im</h1>
  <table>
${allRows}
  </table>
</body>
</html>`;
fs.mkdirSync(path.join(dist, "all"));
fs.writeFileSync(path.join(dist, "all", "index.html"), allPage);

// 404 page
const notFoundPage = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 — huth.im</title>
  <style>
    body { font-family: monospace; max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
    a { color: inherit; }
  </style>
</head>
<body>
  <h1>404</h1>
  <p>No redirect found. <a href="/all">See all links.</a></p>
</body>
</html>`;
fs.writeFileSync(path.join(dist, "404.html"), notFoundPage);

// Generate _redirects for Cloudflare Pages (instant, no HTML roundtrip)
const redirectLines = [
  ...Object.entries(shortLinks).map(([code, url]) => `/${code}  ${url}  301`),
];
if (links["/"]) redirectLines.push(`/  ${links["/"]}  301`);
redirectLines.push(`/*  /404.html  404`);
fs.writeFileSync(path.join(dist, "_redirects"), redirectLines.join("\n") + "\n");

// Root index.html — homepage redirect (HTML fallback)
fs.writeFileSync(
  path.join(dist, "index.html"),
  links["/"] ? redirectPage(links["/"]) : "<html><body>huth.im</body></html>"
);

console.log(`Built ${Object.keys(shortLinks).length} redirect(s) → dist/`);
