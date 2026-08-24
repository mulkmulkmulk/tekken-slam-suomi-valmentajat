// Manual mapping between CSV rows and the raw source files.
// Kept by hand (only ~11-20 coaches) so a mismatch never happens silently.
// To add a coach: add a CSV row + drop files in the source "replat"/"musat"
// folders, then add one entry here and rerun `node build/process-media.mjs`
// followed by `node build/generate-site.mjs`.

export const SRC_ROOT = "C:/Users/mulk/Desktop/tekken slam suomi materiaalit";
export const REPLAT_DIR = `${SRC_ROOT}/replat`;
export const MUSAT_DIR = `${SRC_ROOT}/musat`;

// Character art comes from okizeme.gg/database (slugs match their /database/<slug>
// URLs, e.g. "devil-jin", "jack-8", "miary-zo"). mainCharacter drives the big
// portrait on the roster tile; altCharacters (max ~4) show as small badges.
// Leave mainCharacter null when a coach didn't name one clear main (e.g. "Kaikki")
// -- the tile then falls back to the gameplay poster frame.

export const coaches = [
  {
    key: "Mauste / .mauste",
    slug: "mauste",
    name: "Mauste",
    tag: ".mauste",
    videoParts: ["mauste.mp4"],
    trimStart: 0,
    music: "mauste 0500-0600.opus",
    musicStart: 300,
    mainCharacter: "jun",
    altCharacters: ["dragunov", "xiaoyu", "kunimitsu", "miary-zo"],
  },
  {
    key: "tilis",
    slug: "tilis",
    name: "tilis",
    tag: null,
    videoParts: ["tilis.mp4"],
    trimStart: 0,
    music: "tilis 0000-0100.opus",
    musicStart: 0,
    // "Kaikki" (plays everyone) -- no single main, so the tile shows a
    // roster-mosaic instead of one character.
    mainCharacter: null,
    altCharacters: [],
    allCharacters: true,
  },
  {
    key: "Julumettu / Joulumehu",
    slug: "julumettu",
    name: "Julumettu",
    tag: "Joulumehu",
    videoParts: ["julumettu.mp4"],
    trimStart: 0,
    music: "julumettu 0000-0100.opus",
    musicStart: 0,
    // Form says "Leo main, nykyään pelaan ninaa" (Leo main, currently playing
    // Nina) -- picked Nina as the current one; Leo shown as an alt instead.
    mainCharacter: "nina",
    altCharacters: ["leo", "dragunov", "leroy"],
  },
  {
    key: "levis",
    slug: "levis",
    name: "levis",
    tag: null,
    videoParts: ["Levis-cut0.5s at start.mp4"],
    trimStart: 0.5,
    music: "levis 0020-0100.opus",
    musicStart: 20,
    mainCharacter: "kazuya",
    altCharacters: ["claudio", "king", "hwoarang", "devil-jin"],
  },
  {
    key: "Zleepys/Lumpo",
    slug: "zleepys",
    name: "Zleepys",
    tag: "Lumpo",
    videoParts: ["zleepys.mp4"],
    trimStart: 0,
    music: "zleepys 0500-0600.opus",
    musicStart: 300,
    mainCharacter: "alisa",
    altCharacters: ["devil-jin", "heihachi", "dragunov"],
  },
  {
    key: "Varathar",
    slug: "varathar",
    name: "Varathar",
    tag: null,
    videoParts: ["Varathar.mp4"],
    trimStart: 0,
    music: "varathar 0200-0300.opus",
    musicStart: 120,
    mainCharacter: "law",
    altCharacters: [],
  },
  {
    key: "DC: nhl_keissi. tekken nimi Nixxoks",
    slug: "nixxoks",
    name: "Nixxoks",
    tag: "nhl_keissi",
    videoParts: ["keissi-cut 0.5s at start.mp4"],
    trimStart: 0.5,
    music: "keissi 0000-0100.webm",
    musicStart: 0,
    mainCharacter: "fahkumram",
    altCharacters: ["steve", "heihachi", "lee"],
  },
  {
    key: "lolzben, D;ewdben",
    slug: "dweben",
    name: "dweben",
    tag: "lolzben",
    videoParts: ["dweben osa1.mp4", "dweben osa2.mp4"],
    trimStart: 0,
    music: "dweben 0050-0150.opus",
    musicStart: 50,
    mainCharacter: "yoshimitsu",
    altCharacters: ["kunimitsu", "anna", "miary-zo", "zafina"],
  },
  {
    key: "Ka-Fu/k_fu",
    slug: "ka-fu",
    name: "Ka-Fu",
    tag: "k_fu",
    videoParts: ["kafu - cut 2s start.mp4"],
    trimStart: 2,
    music: "kafu 0030-0100.opus",
    musicStart: 30,
    mainCharacter: "hwoarang",
    altCharacters: [],
    // "Pystyn auttamaan kaikkien hahmojen kanssa" -- shown as a small "+ ALL"
    // badge next to the alt-character icons instead of listing every character.
    helpsAllCharacters: true,
  },
  {
    key: "Stupi",
    slug: "stupi",
    name: "Stupi",
    tag: null,
    videoParts: ["stupi.mp4"],
    trimStart: 0,
    music: "stupi 0000-0100.opus",
    musicStart: 0,
    mainCharacter: "armor-king",
    altCharacters: ["jack-8", "claudio", "zafina", "king"],
  },
  {
    key: "-Pepsimäyn-",
    slug: "pepsimayn",
    name: "Pepsimäyn",
    tag: null,
    videoParts: ["pepsimäyn loop 2 times.mp4"],
    trimStart: 0,
    music: "pepsiman 0015-0115.opus",
    musicStart: 15,
    mainCharacter: "bryan",
    altCharacters: [],
  },
  {
    key: "Roke / Somppe",
    slug: "roke",
    name: "Roke",
    tag: "Somppe",
    videoParts: ["Roke.mp4"],
    trimStart: 0,
    music: "Roke 0000-0100.opus",
    musicStart: 0,
    mainCharacter: "asuka",
    altCharacters: ["azucena", "anna"],
  },
  {
    key: "alika",
    slug: "alika",
    name: "alika",
    tag: null,
    videoParts: ["alika.mp4"],
    trimStart: 0,
    music: "alika 0000-0100.opus",
    musicStart: 0,
    mainCharacter: "armor-king",
    altCharacters: ["feng"],
    // "valmentaa voin mitä tahansa hahmoa" -- can coach any character.
    helpsAllCharacters: true,
  },
  {
    key: "Big_Boss & bigbosso",
    slug: "big-boss",
    name: "Big_Boss",
    tag: "bigbosso",
    videoParts: ["bigboss.mp4"],
    trimStart: 0,
    music: "bigboss 0018-0120.opus",
    musicStart: 18,
    // No single "main" stated -- "Azucena, Paul, King, Claudio, Asuka
    // vahvuudet" (strengths in these) -- first-listed used as the main.
    mainCharacter: "azucena",
    altCharacters: ["paul", "king", "claudio", "asuka"],
  },
  {
    key: "xeroh96",
    slug: "xeroh",
    name: "xeroh96",
    tag: null,
    videoParts: ["xeroh.mp4"],
    trimStart: 0,
    music: "xeroh 0005-0105.opus",
    musicStart: 5,
    // "Lili ja kunimitsu päähahmot" -- two mains named; Lili picked as the
    // featured art (listed first), Kunimitsu shown as an alt instead.
    mainCharacter: "lili",
    altCharacters: ["kunimitsu", "bryan", "dragunov"],
  },
  {
    key: "Visatron",
    slug: "visatron",
    name: "Visatron",
    tag: null,
    videoParts: ["visatron.mp4"],
    trimStart: 0,
    music: "visatron 0028-0130.opus",
    musicStart: 28,
    mainCharacter: "jack-8",
    altCharacters: [],
    // "voin valmentaa kaikkia hahmoja" -- can coach any character.
    helpsAllCharacters: true,
  },
  {
    key: "Velhonike",
    slug: "velhonike",
    name: "Velhonike",
    tag: null,
    videoParts: ["velhonike.mp4"],
    trimStart: 0,
    music: "velhonike 0000-0056.opus",
    musicStart: 0,
    mainCharacter: "feng",
    altCharacters: ["shaheen"],
    helpsAllCharacters: true,
  },
  {
    key: "Heddy, Heddyxo",
    slug: "heddy",
    name: "Heddy",
    tag: "Heddyxo",
    videoParts: ["heddy.mp4"],
    trimStart: 0,
    music: "heddy 0102-0130.opus",
    musicStart: 62,
    mainCharacter: "feng",
    altCharacters: ["heihachi", "reina"],
    // "voin valmentaa ketä vaan hahmoa pelin aloittaneelle" -- can coach
    // anyone starting the game.
    helpsAllCharacters: true,
  },
  {
    key: "OmnidE",
    slug: "omnide",
    name: "OmnidE",
    tag: null,
    videoParts: ["Omnide.mp4"],
    trimStart: 0,
    music: "omnide 0050-0150.opus",
    musicStart: 50,
    // "Shaheen, leo, bob, feng" -- Bob isn't in the Tekken 8 roster okizeme.gg
    // covers, so he's skipped from the alt icons (still listed in the text).
    mainCharacter: "shaheen",
    altCharacters: ["leo", "feng"],
  },
];
