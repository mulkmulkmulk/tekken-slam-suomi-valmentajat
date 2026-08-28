// Manual mapping between CSV rows and the raw source files.
// Kept by hand (only ~11-20 coaches) so a mismatch never happens silently.
// To add a coach: add a CSV row + drop files in the source "replat"/"musat"
// folders, then add one entry here and rerun `node build/process-media.mjs`
// followed by `node build/generate-site.mjs`.

export const SRC_ROOT = "C:/Users/kalle/Desktop/claude/tekken slam suomi materiaalit";
export const REPLAT_DIR = `${SRC_ROOT}/replat`;
export const MUSAT_DIR = `${SRC_ROOT}/musat`;

// Character art comes from okizeme.gg/database (slugs match their /database/<slug>
// URLs, e.g. "devil-jin", "jack-8", "miary-zo"). mainCharacter drives the big
// portrait on the roster tile; altCharacters (max ~4) show as small badges.
// Leave mainCharacter null when a coach didn't name one clear main (e.g. "Kaikki")
// -- the tile then falls back to the gameplay poster frame.

// Kept alphabetically by `name` -- this order also drives the roster's
// P01, P02... numbering and tile order on the site.
export const coaches = [
  {
    key: "akir4 ja .akir4.",
    slug: "akir4",
    name: "akir4",
    tag: ".akir4.",
    videoParts: ["akir4 part1.mp4", "akir4 part 2.mkv", "akir4 part 3.mkv"],
    trimStart: 0,
    music: "akir4 0005-0100.opus",
    musicStart: 5,
    // "ak ja vaikka coolmalet + nina" -- "ak" confirmed as Armor King by
    // watching the footage (player tag "gamer" plays Armor King in all 3
    // parts); "coolmalet" (freeform "the cool ones") too vague to map to
    // specific characters, so only the explicitly named Nina is an alt.
    mainCharacter: "armor-king",
    altCharacters: ["nina"],
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
    key: "Dankplank",
    slug: "dankplank",
    name: "Dankplank",
    tag: null,
    videoParts: ["dankplank.mkv"],
    trimStart: 0,
    music: "dankplank 0004-0100.opus",
    musicStart: 4,
    // "Bob" isn't in the Tekken 8 roster okizeme.gg covers (same call as
    // OmnidE) -- skipped from alt icons, still listed in the profile text.
    mainCharacter: "steve",
    altCharacters: ["fahkumram", "lee", "paul", "law"],
  },
  {
    key: "lolzben, D;ewdben",
    slug: "dweben",
    name: "D;ewdben",
    tag: "lolzben",
    videoParts: ["dweben osa1.mp4", "dweben osa2.mp4"],
    trimStart: 0,
    music: "dweben 0050-0150.opus",
    musicStart: 50,
    mainCharacter: "yoshimitsu",
    altCharacters: ["kunimitsu", "anna", "miary-zo", "zafina"],
  },
  {
    key: "erkkas & erkka",
    slug: "erkka",
    name: "erkka",
    tag: "erkkas",
    // Pre-edited clip already has the chosen music mixed in -- used as-is,
    // see `preEdited` handling in process-media.mjs (no separate music mux).
    videoParts: ["erkka - edited.mp4"],
    trimStart: 0,
    preEdited: true,
    mainCharacter: "jin",
    altCharacters: ["kazuya", "paul", "yoshimitsu", "armor-king"],
    // Listed 20 characters (basically the whole roster) -- shown as the
    // "+ KAIKKI HAHMOT" split panel instead of trying to cram them all in.
    helpsAllCharacters: true,
  },
  {
    key: "FinnishMate",
    slug: "finnishmate",
    name: "FinnishMate",
    tag: null,
    videoParts: ["finnishmate.mp4"],
    trimStart: 0,
    music: "finnishmate 0038-0130.opus",
    musicStart: 38,
    mainCharacter: "steve",
    altCharacters: [],
    // "Steve, kaikki paitsi hwoa & mishimat" -- plays/coaches everyone
    // except Hwoarang and the Mishima line (Kazuya/Jin/Devil Jin/Heihachi).
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
    key: "jarsos",
    slug: "jarsos",
    name: "jarsos",
    tag: null,
    videoParts: ["jarsos.mp4"],
    trimStart: 0,
    music: "jarsos 0219-0307.opus",
    musicStart: 139,
    // "Eddy & Bryan" -- both named together as mains; Eddy picked first.
    mainCharacter: "eddy",
    altCharacters: ["bryan", "armor-king", "jack-8"],
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
    key: "KarstaFari",
    slug: "karstafari",
    name: "KarstaFari",
    tag: null,
    // Fully edited clip -- already has the chosen music mixed in, used as-is.
    videoParts: ["karstafari - edited.mp4"],
    trimStart: 0,
    preEdited: true,
    mainCharacter: "armor-king",
    altCharacters: ["heihachi"],
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
    key: "Munapoolo",
    slug: "munapoolo",
    name: "Munapoolo",
    tag: null,
    videoParts: ["munapoolo.mp4"],
    trimStart: 0,
    music: "munapoolo 0100-0200.opus",
    musicStart: 60,
    mainCharacter: "clive",
    altCharacters: ["victor"],
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
    key: "OmnidE",
    slug: "omnide",
    name: "OmnidE",
    tag: null,
    videoParts: ["Omnide.mp4"],
    trimStart: 0,
    music: "omnide 0050-0150.opus",
    musicStart: 50,
    // "Shaheen, leo, bob, feng"
    mainCharacter: "shaheen",
    altCharacters: ["leo", "bob", "feng"],
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
    key: "TUMEFIN&TumeFIN115",
    slug: "tumefin",
    name: "TUMEFIN",
    tag: "TumeFIN115",
    videoParts: ["Tumefin.mp4"],
    trimStart: 0,
    music: "tumefin 0049-0150.opus",
    musicStart: 49,
    // "Lidia/Raven tekken 8 mainit" -- both named as mains; Lidia picked first.
    mainCharacter: "lidia",
    altCharacters: ["raven", "fahkumram", "heihachi", "armor-king"],
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
    key: "zoomoo",
    slug: "zoomoo",
    name: "zoomoo",
    tag: null,
    // Fully edited clip -- already has the chosen music mixed in, used as-is.
    videoParts: ["zoomoo - edited.mp4"],
    trimStart: 0,
    preEdited: true,
    mainCharacter: "paul",
    altCharacters: [],
  },
];
