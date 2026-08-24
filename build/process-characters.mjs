import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { coaches } from "./coach-map.mjs";

const ROOT = path.resolve(
  new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"),
  ".."
);
const SRC_DIR = path.join(ROOT, "assets-src", "okizeme");
const OUT_DIR = path.join(ROOT, "docs", "media", "characters");

fs.mkdirSync(OUT_DIR, { recursive: true });

const slugs = new Set();
for (const c of coaches) {
  if (c.mainCharacter) slugs.add(c.mainCharacter);
  for (const alt of c.altCharacters || []) slugs.add(alt);
}

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], {
    encoding: "utf-8",
  });
}

for (const slug of slugs) {
  const src = path.join(SRC_DIR, `${slug}-portrait.png`);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing downloaded portrait for "${slug}": ${src}`);
  }

  const big = path.join(OUT_DIR, `${slug}.png`);
  const icon = path.join(OUT_DIR, `${slug}-icon.png`);

  ffmpeg(["-i", src, "-vf", "scale=640:640", big]);
  ffmpeg(["-i", src, "-vf", "scale=120:120", icon]);

  console.log(`  ${slug}: OK`);
}

console.log(`\nProcessed ${slugs.size} character portraits into docs/media/characters/`);
