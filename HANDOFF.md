# Handoff — Tekken Slam Suomi valmentajasivusto

Tämä tiedosto on kirjoitettu, jotta työ voidaan jatkaa toisella koneella
(tai uudessa Claude-keskustelussa) ilman että aiempi chat-historia on
mukana. Liitä tämän tiedoston sisältö uuden Clauden ensimmäiseen viestiin,
niin sillä on täysi konteksti.

## Mitä tämä on

Staattinen GitHub Pages -sivusto Tekken Slam Suomi -tapahtumaan. Valmennettavat
selaavat valmentajia Tekken 8 -henkisestä hahmovalintaruudusta (etusivu =
"character select" -ruudukko), klikkaavat kortin ja päätyvät valmentajan omalle
profiilisivulle: hänen lomakevastauksensa + lyhyt replay-klippi, johon on
vaihdettu valmentajan toivoma musiikki.

Koko sivusto **generoidaan datasta** build-skripteillä — mitään HTML:ää ei
kirjoiteta käsin. Tämä on tärkeää ymmärtää: jos jokin näyttää väärältä,
korjaus tehdään lähdedataan tai templateen, ei suoraan `docs/`-kansion
HTML-tiedostoihin (ne ylikirjoitetaan joka buildissa).

## Rakenne

```
build/
  coach-map.mjs        käsin ylläpidetty: CSV-rivi -> tiedostot -> slug -> hahmot
  parse-csv.mjs         CSV -> raw-coaches.json
  process-media.mjs     ffmpeg: leikkaa/yhdistää/rajaa videot + miksaa musiikin
  process-characters.mjs hakee/skaalaa hahmokuvat okizeme.gg:stä
  generate-site.mjs     kasaa docs/index.html + docs/coach/<slug>/index.html
  serve.mjs             paikallinen esikatselupalvelin (http://localhost:4173/)
data/coaches.json        lopullinen sivustolla näkyvä data (generoitu)
docs/                    julkaistava GitHub Pages -sivusto (generoitu)
raw-coaches.json         CSV JSON:ksi (generoitu, väliaikainen)
assets-src/okizeme/      ladatut hahmokuvat (ei committoida, hakee uudelleen tarvittaessa)
```

**Lähdemateriaalit** (CSV + raakavideot + musiikit) EIVÄT ole tässä
repossa — ne ovat liian isoja gitiin (yksittäiset raakavideot 100-230MB,
GitHubin raja on 100MB/tiedosto). Ne siirretään erikseen (Google Drive /
USB) kansiosta:

```
C:\Users\mulk\Desktop\tekken slam suomi materiaalit\
  csv\Tekken Coach Info.csv
  replat\   (raakavideot)
  musat\    (musiikit)
```

## Uudella koneella: näin pääset jatkamaan

1. Kloonaa tämä repo: `git clone https://github.com/mulkmulkmulk/tekken-slam-suomi-valmentajat.git`
2. Pura Google Drivestä ladattu `tekken-slam-suomi-materiaalit.zip`
   samaan polkuun kuin ennen: `C:\Users\<KÄYTTÄJÄ>\Desktop\tekken slam suomi materiaalit\`
   — **jos käyttäjänimi on eri**, muokkaa polku [build/coach-map.mjs](build/coach-map.mjs)
   -tiedoston alusta (`SRC_ROOT`-vakio) vastaamaan uutta polkua.
3. Asenna [ffmpeg](https://ffmpeg.org/) (löytyy PATH:ista, `ffmpeg -version` toimii terminaalissa).
   Node.js pitää myös olla asennettuna.
4. Kaikki pitäisi toimia suoraan: `node build/parse-csv.mjs && node build/generate-site.mjs`
   generoi sivuston uudelleen ilman muutoksia (koska videot/kuvat on jo
   valmiiksi prosessoitu `docs/`-kansioon ja committoitu gittiin).
5. Esikatselu: `node build/serve.mjs` -> http://localhost:4173/

## Uuden valmentajan lisääminen (jatkossa)

1. Uusi rivi CSV:hen + tiedostot `replat/`- ja `musat/`-kansioihin
   (nimeämiskäytäntö: `nimi - cut 0.5s at start.mp4` jos pitää leikata alusta,
   `nimi mmss-mmss.opus` musiikin aloituskohdalle filenimessä).
2. Yksi rivi `build/coach-map.mjs`:ään: `key` täsmää CSV:n "Discord Nickname
   & Username" -sarakkeeseen tarkalleen. `mainCharacter` = hahmon slug
   osoitteesta `okizeme.gg/database/<slug>` (esim. "devil-jin", "jack-8",
   "miary-zo"). `altCharacters` maks. ~4. `helpsAllCharacters: true` jos
   coach mainitsee voivansa auttaa kaikkien/minkä tahansa hahmon kanssa.
3. Aja (voi antaa slugin, jolloin käsittelee vain sen — nopeampi kuin koko
   roosterin uudelleenajo):
   ```bash
   node build/parse-csv.mjs
   node build/process-media.mjs <slug>      # esim: node build/process-media.mjs heddy
   node build/process-characters.mjs
   node build/generate-site.mjs
   ```

## Tärkeitä päätöksiä/kompromisseja matkan varrella

- **"Mikä biisi esittelyvideoon?"** CSV-sarake ei näy sivustolla missään —
  sitä käytetään vain valitsemaan musiikkitiedosto ja aloituskohta manuaalisesti
  `coach-map.mjs`:ään.
- **Hahmokuvat** ovat peräisin [okizeme.gg/database](https://okizeme.gg/database):sta
  (Tekken 8:n virallista hahmotaidetta), ei tapahtuman omaa materiaalia.
  URL-kaava: `https://okizeme.gg/assets/images/<slug>-portrait.png`.
- **tilis** pelaa "kaikkia hahmoja" (ei yhtä päähahmoa) -> etusivun kortti
  näyttää 3x3-mosaiikin 9 hahmosta + "KAIKKI HAHMOT"-tekstin sen sijaan että
  yrittäisi arvata yhden päähahmon.
- **"+ALL" / "kaikki hahmot" -coachit** (Ka-Fu, alika, Visatron, Velhonike,
  Heddy — CSV:ssä mainitsevat voivansa auttaa minkä tahansa hahmon kanssa,
  mutta HEILLÄ ON myös oma päähahmo): kortti on jaettu kahtia — vasemmalla
  päähahmo + hänen omat alt-hahmoikoninsa, oikealla oma "KAIKKI HAHMOT"
  -paneeli 4 hahmon minimosaiikilla. Tämä muotoiltiin muutaman iteraation
  kautta (aluksi pieni badge, sitten vino nauha joka meni alt-ikonien päälle,
  lopulta tämä jako-versio).
- **Julumettu**: CSV sanoo "Leo main, nykyään pelaan ninaa" (ristiriitainen) —
  valittu Nina näkyväksi päähahmoksi koska "nykyään" (nyt), Leo näkyy alt-ikonina.
  Voi vaihtaa jos väärä tulkinta: `build/coach-map.mjs`, rivi `slug: "julumettu"`.
- **OmnidE**: CSV mainitsee "Bob" yhtenä hahmona, mutta Bob ei ole Tekken 8:n
  roostersa/okizeme.gg:ssä -> jätetty pois alt-ikoneista (näkyy silti
  "Hahmot"-tekstissä hänen profiilissaan).
- **replat/velhonike.mp4** oli aluksi tavutasolla identtinen `julumettu.mp4`:n
  kanssa (vahinkokopio) -> pidettiin Velhonike pois sivustolta kunnes hän
  toimitti oman replaynsa myöhemmin. Tämä on nyt korjattu, mutta jos
  vastaava tilanne toistuu: tarkista `md5sum` ennen kuin lisäät uuden coachin.
- Videot on **re-enkoodattu** ffmpeg:llä crf 25 + maxrate 3000k, 1280x720,
  koska raakavideot olivat osin 30+ Mbps ultraleveä-kaappauksia (yksi klippi
  saattoi olla 220MB muutaman kymmenen sekunnin klipistä). Lopputulos on
  n. 5-20MB/valmentaja, kaikki hyvin alle GitHubin 100MB-rajan.
- Musiikki leikataan aina klipin pituiseksi CSV/tiedostonimen aloituskohdasta
  alkaen, lyhyt fade in/out lisätty.

## Nykyinen tila (19 valmentajaa)

1. Mauste — Jun
2. tilis — Kaikki hahmot (mosaiikki)
3. Julumettu — Nina (alt: Leo)
4. levis — Kazuya
5. Zleepys — Alisa
6. Varathar — Law
7. Nixxoks — Fahkumram
8. dweben — Yoshimitsu
9. Ka-Fu — Hwoarang **[+ALL]**
10. Stupi — Armor King
11. Pepsimäyn — Bryan
12. Roke — Asuka
13. alika — Armor King **[+ALL]**
14. Big_Boss — Azucena
15. xeroh96 — Lili
16. Visatron — Jack-8 **[+ALL]**
17. Velhonike — Feng **[+ALL]**
18. Heddy — Feng **[+ALL]**
19. OmnidE — Shaheen

## Vielä tekemättä / avoimena

- **GitHub Pages ei ole vielä päällä.** Repon asetuksista: Settings → Pages →
  Source: Deploy from a branch → branch `main`, kansio `/docs`. HUOM: repo
  pitää olla **public** jotta Pages toimii ilmaistilillä — valmentajien
  Discord-nimet ja kuvaukset olisivat silloin kenen tahansa nähtävissä.
  Tätä ei ole vielä varmistettu käyttäjän kanssa.
- Lisää valmentajia tulossa (~20 alun perin luvattu, nyt 19).
- Ei automaattista deploy-pipelinea — build ajetaan käsin ja `docs/`-kansion
  muutokset committoidaan/pushataan käsin.
