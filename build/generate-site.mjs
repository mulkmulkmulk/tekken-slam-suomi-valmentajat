import fs from "node:fs";
import path from "node:path";
import { coaches as coachMap } from "./coach-map.mjs";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "..");
const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "raw-coaches.json"), "utf-8"));
const DOCS = path.join(ROOT, "docs");

// ---- merge CSV rows with the manual file mapping -------------------------

const coaches = coachMap.map((c) => {
  const row = raw.find((r) => r["Discord Nickname & Username"] === c.key);
  if (!row) throw new Error(`No CSV row found for key "${c.key}"`);
  return {
    slug: c.slug,
    name: c.name,
    tag: c.tag,
    characters: row["Päähahmot ja valmennettavat hahmot"],
    experience: row["Kokemus"],
    specialty: row["Erikoisosaaminen"],
    style: row["Valmennustyyli"],
    availability: row["Saatavuus"],
    description: row["Lyhyt kuvaus sinusta pelaajana"],
    discord: c.key,
    video: `media/${c.slug}.mp4`,
    poster: `media/${c.slug}.jpg`,
    posterWide: `media/${c.slug}-wide.jpg`,
    mainCharacter: c.mainCharacter,
    altCharacters: c.altCharacters || [],
    allCharacters: Boolean(c.allCharacters),
    helpsAllCharacters: Boolean(c.helpsAllCharacters),
  };
});

fs.mkdirSync(path.join(ROOT, "data"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "data", "coaches.json"),
  JSON.stringify(coaches, null, 2),
  "utf-8"
);
console.log(`data/coaches.json written (${coaches.length} coaches)`);

// ---- character art (okizeme.gg slugs -> display names) --------------------

const CHARACTER_NAMES = {
  jun: "Jun",
  dragunov: "Dragunov",
  xiaoyu: "Xiaoyu",
  kunimitsu: "Kunimitsu",
  "miary-zo": "Miary Zo",
  nina: "Nina",
  leo: "Leo",
  leroy: "Leroy",
  kazuya: "Kazuya",
  claudio: "Claudio",
  king: "King",
  hwoarang: "Hwoarang",
  "devil-jin": "Devil Jin",
  alisa: "Alisa",
  heihachi: "Heihachi",
  law: "Law",
  fahkumram: "Fahkumram",
  steve: "Steve",
  lee: "Lee",
  yoshimitsu: "Yoshimitsu",
  anna: "Anna",
  zafina: "Zafina",
  "armor-king": "Armor King",
  "jack-8": "Jack-8",
  bryan: "Bryan",
  paul: "Paul",
  asuka: "Asuka",
  azucena: "Azucena",
  feng: "Feng",
  shaheen: "Shaheen",
  lili: "Lili",
  eddy: "Eddy",
  jin: "Jin",
  bob: "Bob",
  lidia: "Lidia",
  raven: "Raven",
  clive: "Clive",
  victor: "Victor",
};

// A varied 9-face roster wall for coaches who play "everyone" instead of one
// main (currently just tilis). Reuses portraits already downloaded for other
// coaches so it needs no extra assets.
const MOSAIC_CHARACTERS = [
  "kazuya",
  "jun",
  "xiaoyu",
  "king",
  "heihachi",
  "yoshimitsu",
  "hwoarang",
  "alisa",
  "law",
];

// ---- tiny helpers ----------------------------------------------------------

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragraphs(text = "") {
  return esc(text)
    .split(/\n{2,}/)
    .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

function page(title, body, depth = 0) {
  const prefix = depth === 0 ? "" : "../".repeat(depth);
  return `<!doctype html>
<html lang="fi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${prefix}assets/css/style.css">
</head>
<body>
${body}
<script src="${prefix}assets/js/app.js"></script>
</body>
</html>
`;
}

// ---- index (character select) ---------------------------------------------

function mosaicArt(prefix = "") {
  const cells = MOSAIC_CHARACTERS.map(
    (slug) =>
      `<img src="${prefix}media/characters/${slug}-icon.png" alt="${esc(CHARACTER_NAMES[slug] || slug)}" loading="lazy">`
  ).join("");
  return `
        <span class="tile-mosaic">${cells}</span>
        <span class="tile-mosaic-badge">KAIKKI<br>HAHMOT</span>`;
}

function tileAlts(c, prefix = "") {
  if (!c.altCharacters.length) return "";
  const icons = c.altCharacters
    .map(
      (slug) =>
        `<img src="${prefix}media/characters/${slug}-icon.png" alt="${esc(
          CHARACTER_NAMES[slug] || slug
        )}" title="${esc(CHARACTER_NAMES[slug] || slug)}">`
    )
    .join("");
  return `<span class="tile-alts">${icons}</span>`;
}

// Diagonal corner ribbon for "can coach any character" -- used on the (small,
// alt-icon-free) profile portrait.
function allRibbon() {
  return `<span class="all-ribbon" title="Auttaa tarvittaessa myös kaikkien muiden hahmojen kanssa">+ Kaikki hahmot</span>`;
}

// A quick 4-face preview for "can coach any character", reusing whichever
// portraits are already downloaded.
const ALL_SPLIT_PREVIEW = ["kazuya", "jun", "xiaoyu", "king"];

// Tile split in two: the coach's main character on the left, a small
// "plays everyone" panel on the right -- keeps the alt-character icons (top
// right of the character half) from colliding with the all-characters call-out.
function splitArt(c) {
  const miniCells = ALL_SPLIT_PREVIEW.map(
    (slug) => `<img src="media/characters/${slug}-icon.png" alt="" loading="lazy">`
  ).join("");
  return `
        <span class="tile-split">
          <span class="tile-split-char">
            <span class="tile-glow"></span>
            <img class="tile-char" src="media/characters/${c.mainCharacter}.png" alt="${esc(
      CHARACTER_NAMES[c.mainCharacter] || c.mainCharacter
    )}" loading="lazy">
          </span>
          <span class="tile-split-all" title="Auttaa tarvittaessa myös kaikkien muiden hahmojen kanssa">
            ${tileAlts(c)}
            <span class="tile-split-mosaic">${miniCells}</span>
            <span class="tile-split-label">KAIKKI<br>HAHMOT</span>
          </span>
        </span>`;
}

function tileArt(c) {
  if (c.allCharacters) return mosaicArt();
  if (c.mainCharacter && c.helpsAllCharacters) return splitArt(c);
  if (c.mainCharacter) {
    return `
        <span class="tile-glow"></span>
        <img class="tile-char" src="media/characters/${c.mainCharacter}.png" alt="${esc(
      CHARACTER_NAMES[c.mainCharacter] || c.mainCharacter
    )}" loading="lazy">`;
  }
  return `<img class="tile-img" src="media/${c.slug}.jpg" alt="" loading="lazy">`;
}

const tiles = coaches
  .map((c, i) => {
    const usesSplit = Boolean(c.mainCharacter && c.helpsAllCharacters);
    return `
      <a class="tile${c.mainCharacter ? " has-character" : ""}${c.allCharacters ? " has-mosaic" : ""}${usesSplit ? " has-split" : ""}" href="coach/${c.slug}/" style="--i:${i}">
        ${tileArt(c)}
        <span class="tile-scrim"></span>
        <span class="tile-num">P${String(i + 1).padStart(2, "0")}</span>
        ${usesSplit ? "" : tileAlts(c)}
        <span class="tile-info">
          <span class="tile-name">${esc(c.name)}</span>
          ${
            c.mainCharacter
              ? `<span class="tile-tag tile-tag-char">${esc(CHARACTER_NAMES[c.mainCharacter] || c.mainCharacter)}</span>`
              : c.allCharacters
                ? `<span class="tile-tag tile-tag-char">Kaikki hahmot</span>`
                : c.tag
                  ? `<span class="tile-tag">${esc(c.tag)}</span>`
                  : ""
          }
        </span>
      </a>`;
  })
  .join("\n");

const indexBody = `
<div class="hairlines" aria-hidden="true"></div>
<header class="hero">
  <div class="wrap">
    <p class="eyebrow"><span class="dot"></span>Tekken Slam Suomi &mdash; Valmentaja Rosteri</p>
    <h1 class="title">VALITSE<br><em>VALMENTAJASI</em></h1>
    <p class="subhead">Valitse kortti, niin näet valmentajan jättämät tiedot sekä lyhyen pelinäytteen.</p>
  </div>
</header>
<main class="wrap">
  <div class="roster" id="roster">
${tiles}
  </div>
</main>
<footer class="site-footer">
  <div class="wrap">Tekken Slam Suomi &middot; valmentajarosteri</div>
</footer>
`;

fs.writeFileSync(
  path.join(DOCS, "index.html"),
  page("Tekken Slam Suomi — Valitse valmentajasi", indexBody, 0),
  "utf-8"
);

// ---- per-coach page ----------------------------------------------------------

function statRow(label, value, { emphasis = false } = {}) {
  if (!value) return "";
  return `
      <div class="stat">
        <div class="stat-label">${esc(label)}</div>
        <div class="stat-value${emphasis ? " emphasis" : ""}">${paragraphs(value)}</div>
      </div>`;
}

for (const c of coaches) {
  const idx = coaches.findIndex((x) => x.slug === c.slug);
  const body = `
<div class="hairlines" aria-hidden="true"></div>
<main class="wrap profile-wrap">
  <a class="back-link" href="../../">&larr; Takaisin valmentajiin</a>

  <div class="profile-head">
    <div class="profile-portrait${c.mainCharacter ? " has-character" : ""}${c.allCharacters ? " has-mosaic" : ""}">
      ${
        c.allCharacters
          ? mosaicArt("../../")
          : c.mainCharacter
            ? `<span class="profile-glow"></span><img class="profile-char" src="../../media/characters/${c.mainCharacter}.png" alt="${esc(CHARACTER_NAMES[c.mainCharacter] || c.mainCharacter)}">`
            : `<img src="../../media/${c.slug}.jpg" alt="">`
      }
      ${c.helpsAllCharacters ? allRibbon() : ""}
      <span class="profile-num">P${String(idx + 1).padStart(2, "0")}</span>
    </div>
    <div class="profile-heading">
      <p class="eyebrow"><span class="dot"></span>Valmentajaprofiili</p>
      <h1 class="profile-name">${esc(c.name)}</h1>
      ${c.mainCharacter ? `<p class="profile-tag">${esc(CHARACTER_NAMES[c.mainCharacter] || c.mainCharacter)}${c.tag ? ` &middot; ${esc(c.tag)}` : ""}</p>` : c.allCharacters ? `<p class="profile-tag">Kaikki hahmot</p>` : c.tag ? `<p class="profile-tag">${esc(c.tag)}</p>` : ""}
      ${c.altCharacters.length ? `<div class="profile-alts">${tileAlts(c, "../../")}</div>` : ""}
    </div>
  </div>

  <div class="stage">
    <video
      class="stage-video"
      controls
      playsinline
      preload="metadata"
      poster="../../media/${c.slug}-wide.jpg"
    >
      <source src="../../media/${c.slug}.mp4" type="video/mp4">
    </video>
    <span class="stage-corner tl"></span>
    <span class="stage-corner tr"></span>
    <span class="stage-corner bl"></span>
    <span class="stage-corner br"></span>
    <span class="stage-label"><span class="dot"></span>Replay</span>
  </div>

  <div class="sheet">
    ${statRow("Hahmot", c.characters, { emphasis: true })}
    ${statRow("Kokemus", c.experience)}
    ${statRow("Erikoisosaaminen", c.specialty)}
    ${statRow("Valmennustyyli", c.style)}
    ${statRow("Saatavuus", c.availability)}
    ${statRow("Pelaajana", c.description)}
  </div>

  <div class="cta-row">
    <div class="cta-box">
      <p class="cta-label">Ota yhteyttä Discordissa</p>
      <p class="cta-discord">${esc(c.discord)}</p>
    </div>
    <a class="cta" href="../../">Selaa muita valmentajia</a>
  </div>
</main>
`;
  const outDir = path.join(DOCS, "coach", c.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "index.html"),
    page(`${c.name} — Tekken Slam Suomi`, body, 2),
    "utf-8"
  );
}

console.log(`Wrote index.html + ${coaches.length} coach pages.`);
