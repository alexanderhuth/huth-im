#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const links = JSON.parse(fs.readFileSync("links.json", "utf8"));
const dist = "dist";

if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true });
fs.mkdirSync(dist);

// Copy static assets (favicon, etc.) into dist root
const staticDir = "static";
if (fs.existsSync(staticDir)) {
  for (const file of fs.readdirSync(staticDir)) {
    if (file.startsWith(".")) continue;
    fs.copyFileSync(path.join(staticDir, file), path.join(dist, file));
  }
}


const shortLinks = Object.fromEntries(
  Object.entries(links).filter(([code]) => code !== "/")
);

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
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
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
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
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

// Generate _redirects for statichost.eu
const redirectLines = [
  ...Object.entries(shortLinks).flatMap(([code, url]) => [
    `/${code}  ${url}  301`,
    `/${code}/  ${url}  301`,
  ]),
];
if (links["/"]) redirectLines.push(`/  ${links["/"]}  301`);
redirectLines.push(`/*  /404.html  404`);
fs.writeFileSync(path.join(dist, "_redirects"), redirectLines.join("\n") + "\n");


console.log(`Built ${Object.keys(shortLinks).length} redirect(s) → dist/`);
