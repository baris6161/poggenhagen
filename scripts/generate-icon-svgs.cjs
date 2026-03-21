/**
 * Statische app/icon.svg + app/apple-icon.svg aus public/pogge.png (data-URL).
 * Kein next/og-Prerender, keine sharp-Abhängigkeit.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "public", "pogge.png");
const appDir = path.join(root, "app");

function wrapSvg(viewBox, imgSize, offset) {
  const b64 = fs.readFileSync(src).toString("base64");
  const dataUrl = `data:image/png;base64,${b64}`;
  const o = offset;
  const s = imgSize;
  const vb = viewBox;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vb} ${vb}" width="${vb}" height="${vb}">
  <rect width="${vb}" height="${vb}" fill="#0c0f0a"/>
  <image href="${dataUrl}" x="${o}" y="${o}" width="${s}" height="${s}" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;
}

function main() {
  if (!fs.existsSync(src)) {
    console.error("generate-icon-svgs: fehlt", src);
    process.exit(1);
  }
  fs.writeFileSync(path.join(appDir, "icon.svg"), wrapSvg(32, 28, 2), "utf8");
  fs.writeFileSync(path.join(appDir, "apple-icon.svg"), wrapSvg(180, 168, 6), "utf8");
  console.log("generate-icon-svgs: app/icon.svg, app/apple-icon.svg");
}

main();
