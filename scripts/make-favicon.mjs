// Resize the PNG to create favicon sizes using sharp
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, "../public/apple-touch-icon.png");
const outDir = path.resolve(__dirname, "../public");

const sizes = [
    { size: 32, name: "favicon-32x32.png" },
    { size: 16, name: "favicon-16x16.png" },
    { size: 180, name: "apple-touch-icon.png" },
];

for (const { size, name } of sizes) {
    await sharp(src)
        .resize(size, size)
        .png()
        .toFile(path.join(outDir, name));
    console.log(`✅ Created ${name} (${size}x${size})`);
}

// Create a simple favicon.ico by copying the 32x32 PNG and renaming it
// (ICO format not natively supported by sharp, but modern browsers support PNG favicons)
await sharp(src).resize(32, 32).png().toFile(path.join(outDir, "favicon-32x32.png"));
fs.copyFileSync(path.join(outDir, "favicon-32x32.png"), path.join(outDir, "favicon.ico"));
console.log("✅ Created favicon.ico");
