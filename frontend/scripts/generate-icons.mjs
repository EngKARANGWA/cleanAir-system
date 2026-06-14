import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const svgPath   = join(publicDir, "icons", "icon-source.svg");
const svgBuffer = readFileSync(svgPath);

const sizes = [
  { name: "icon-72.png",    size: 72  },
  { name: "icon-96.png",    size: 96  },
  { name: "icon-128.png",   size: 128 },
  { name: "icon-144.png",   size: 144 },
  { name: "icon-152.png",   size: 152 },
  { name: "icon-192.png",   size: 192 },
  { name: "icon-384.png",   size: 384 },
  { name: "icon-512.png",   size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32.png", size: 32  },
  { name: "favicon-16.png", size: 16  },
];

for (const { name, size } of sizes) {
  const out = join(publicDir, "icons", name);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(out);
  console.log(`✓ ${name} (${size}×${size})`);
}

// Also generate a favicon.ico equivalent (32x32 PNG named favicon.png in public root)
await sharp(svgBuffer).resize(32, 32).png().toFile(join(publicDir, "favicon.png"));
console.log("✓ favicon.png (32×32)");

console.log("\nAll icons generated successfully!");
