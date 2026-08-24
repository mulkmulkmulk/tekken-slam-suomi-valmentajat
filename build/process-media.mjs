import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { coaches, REPLAT_DIR, MUSAT_DIR } from "./coach-map.mjs";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "..");
const TMP_DIR = path.join(ROOT, "build", "tmp");
const MEDIA_DIR = path.join(ROOT, "docs", "media");

fs.mkdirSync(TMP_DIR, { recursive: true });
fs.mkdirSync(MEDIA_DIR, { recursive: true });

function ffprobe(args) {
  return execFileSync("ffprobe", ["-v", "error", ...args], { encoding: "utf-8" }).trim();
}

function ffmpeg(args, label) {
  try {
    execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], {
      encoding: "utf-8",
    });
  } catch (err) {
    console.error(`ffmpeg failed for ${label}`);
    console.error(err.stderr || err.message);
    throw err;
  }
}

function probeSize(file) {
  const out = ffprobe([
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height",
    "-of",
    "csv=p=0",
    file,
  ]);
  const [w, h] = out.split(",").map(Number);
  return { width: w, height: h };
}

function probeDuration(file) {
  return parseFloat(
    ffprobe(["-show_entries", "format=duration", "-of", "csv=p=0", file])
  );
}

// Normalize one source clip to 1280x720/30fps/h264, video-only, optionally
// trimming `trimStart` seconds off the front. Crops ultra-wide captures to
// 16:9 first so gameplay isn't squished.
function normalizePart(srcFile, outFile, trimStart) {
  const { width, height } = probeSize(srcFile);
  const ratio = width / height;
  const vf = [];
  if (ratio > 1.9) {
    const cropW = Math.round(((height * 16) / 9) / 2) * 2;
    vf.push(`crop=${cropW}:${height}`);
  }
  vf.push("scale=1280:720");

  const args = [];
  if (trimStart > 0) args.push("-ss", String(trimStart));
  args.push(
    "-i",
    srcFile,
    "-an",
    "-vf",
    vf.join(","),
    "-r",
    "30",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "25",
    "-maxrate",
    "3000k",
    "-bufsize",
    "6000k",
    "-pix_fmt",
    "yuv420p",
    outFile
  );
  ffmpeg(args, path.basename(srcFile));
}

function concatParts(partFiles, outFile) {
  const listFile = outFile + ".txt";
  const listContent = partFiles
    .map((f) => `file '${f.replace(/'/g, "'\\''")}'`)
    .join("\n");
  fs.writeFileSync(listFile, listContent, "utf-8");
  ffmpeg(
    ["-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", outFile],
    "concat"
  );
  fs.rmSync(listFile);
}

function makePoster(videoFile, outFile, duration) {
  const t = Math.max(0.1, duration * 0.4);
  ffmpeg(
    [
      "-ss",
      String(t),
      "-i",
      videoFile,
      "-frames:v",
      "1",
      "-vf",
      "crop=720:720:280:0,scale=640:640",
      outFile,
    ],
    "poster"
  );
}

// Widescreen poster for the <video> stage element (the square poster above
// is for the roster tile / profile thumbnail only -- using it as the video
// poster would pillarbox against the 16:9 stage box).
function makeWidePoster(videoFile, outFile, duration) {
  const t = Math.max(0.1, duration * 0.4);
  ffmpeg(
    ["-ss", String(t), "-i", videoFile, "-frames:v", "1", outFile],
    "wide poster"
  );
}

function makeFinal(videoFile, musicFile, musicStart, duration, outFile) {
  const fadeOutStart = Math.max(0, duration - 0.5);
  ffmpeg(
    [
      "-i",
      videoFile,
      "-ss",
      String(musicStart),
      "-i",
      musicFile,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-t",
      String(duration),
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-af",
      `afade=t=in:st=0:d=0.3,afade=t=out:st=${fadeOutStart}:d=0.5`,
      "-movflags",
      "+faststart",
      "-shortest",
      outFile,
    ],
    "mux"
  );
}

// Optional slug filter: `node build/process-media.mjs heddy velhonike`
// reprocesses just those coaches instead of the whole roster. No args = all.
const filter = process.argv.slice(2);
const targets = filter.length
  ? coaches.filter((c) => filter.includes(c.slug))
  : coaches;
if (filter.length) {
  const missing = filter.filter((s) => !coaches.some((c) => c.slug === s));
  if (missing.length) throw new Error(`Unknown slug(s): ${missing.join(", ")}`);
  console.log(`Processing only: ${targets.map((c) => c.slug).join(", ")}`);
}

const results = [];

for (const coach of targets) {
  console.log(`\n=== ${coach.name} ===`);

  const partOutputs = coach.videoParts.map((part, i) => {
    const src = path.join(REPLAT_DIR, part);
    const out = path.join(TMP_DIR, `${coach.slug}_part${i}.mp4`);
    const trim = i === 0 ? coach.trimStart : 0;
    console.log(`  normalizing ${part} (trim ${trim}s)`);
    normalizePart(src, out, trim);
    return out;
  });

  const combined = path.join(TMP_DIR, `${coach.slug}_combined.mp4`);
  if (partOutputs.length > 1) {
    console.log("  concatenating parts");
    concatParts(partOutputs, combined);
  } else {
    fs.copyFileSync(partOutputs[0], combined);
  }

  const duration = probeDuration(combined);
  console.log(`  duration: ${duration.toFixed(2)}s`);

  const finalVideo = path.join(MEDIA_DIR, `${coach.slug}.mp4`);
  const musicPath = path.join(MUSAT_DIR, coach.music);
  console.log(`  muxing music from ${coach.musicStart}s of ${coach.music}`);
  makeFinal(combined, musicPath, coach.musicStart, duration, finalVideo);

  const poster = path.join(MEDIA_DIR, `${coach.slug}.jpg`);
  console.log("  extracting poster frame");
  makePoster(combined, poster, duration);

  const widePoster = path.join(MEDIA_DIR, `${coach.slug}-wide.jpg`);
  makeWidePoster(combined, widePoster, duration);

  const finalSize = fs.statSync(finalVideo).size;
  console.log(`  done: ${(finalSize / 1024 / 1024).toFixed(1)}MB`);

  results.push({ slug: coach.slug, duration, sizeMB: finalSize / 1024 / 1024 });
}

fs.rmSync(TMP_DIR, { recursive: true, force: true });

console.log("\nAll done.");
console.table(results);
