# Tekken Slam Suomi — Valmentajasivusto

Staattinen GitHub Pages -sivusto, jossa valmennettavat selaavat valmentajia
Tekken 8 -henkisen hahmovalinnan tyylisestä rosterista. Jokaisella
valmentajalla on oma profiilisivu, jolla näkyy hänen lomakevastauksensa ja
lyhyt replay-klippi, johon on vaihdettu hänen toivomansa musiikki.

Koko sivusto (`docs/`) generoidaan datasta — sitä ei kirjoiteta käsin.

## Rakenne

```
build/
  coach-map.mjs       käsin ylläpidetty lista: CSV-rivi -> tiedostot -> slug -> hahmot
  parse-csv.mjs       lukee lähde-CSV:n -> raw-coaches.json
  process-media.mjs   leikkaa/yhdistää/rajaa videot + miksaa musiikin (ffmpeg)
  process-characters.mjs  hakee/skaalaa hahmokuvat assets-src/okizeme:sta
  generate-site.mjs   kasaa docs/index.html + docs/coach/<slug>/index.html
  serve.mjs           kevyt paikallinen esikatselupalvelin
data/coaches.json      lopullinen, sivustolla näkyvä data (generoitu)
docs/                  julkaistava GitHub Pages -sivusto
raw-coaches.json       CSV suoraan JSON:ksi (generoitu, väliaikainen)
assets-src/okizeme/    ladatut lähdehahmokuvat (ei committoida, ks. .gitignore)
```

Lähdemateriaalit (CSV, `replat/`, `musat/`) luetaan suoraan jaetusta
kansiosta `C:\Users\mulk\Desktop\tekken slam suomi materiaalit\` — niitä ei
kopioida repoon, koska raakavideot ovat liian isoja gitiin.

## Uuden valmentajan lisääminen

1. Lisää valmentajan rivi CSV:hen ja hänen replay/musiikki-tiedostonsa
   `replat/`- ja `musat/`-kansioihin (samat nimeämiskäytännöt kuin muilla:
   `nimi - cut 0.5s at start.mp4` jos alusta pitää leikata, `nimi mmss-mmss.opus`
   musiikin aloituskohdalle).
2. Lisää yksi rivi `build/coach-map.mjs`-tiedostoon: `key` täytyy täsmätä
   CSV:n "Discord Nickname & Username" -sarakkeeseen tarkalleen. Aseta myös
   `mainCharacter` (hahmon slug osoitteesta `okizeme.gg/database/<slug>`) ja
   halutessa `altCharacters` (max ~4 pientä ikonia). Jätä `mainCharacter: null`
   jos vastauksessa ei ole yhtä selkeää päähahmoa (esim. "Kaikki") — silloin
   kortti näyttää replay-kuvakaappauksen hahmokuvan sijaan.
3. Jos uusi hahmo ei ole vielä ladattuna `assets-src/okizeme/`-kansioon, hae se:
   ```bash
   curl -sL -o "assets-src/okizeme/<slug>-portrait.png" \
     "https://okizeme.gg/assets/images/<slug>-portrait.png"
   ```
4. Aja:
   ```bash
   npm run csv         # CSV -> raw-coaches.json
   npm run media       # ffmpeg: leikkaa, yhdistää osat, rajaa 16:9, miksaa musiikin
   npm run characters  # skaalaa tarvittavat hahmokuvat docs/media/characters/-kansioon
   npm run site        # kasaa data/coaches.json + docs/*.html
   ```
5. Tarkista paikallisesti: `npm run serve` -> http://localhost:4173/

`npm run media` prosessoi joka kerta *kaikki* valmentajat uudelleen (ajot ovat
nopeita, klipit ovat lyhyitä). Jos sama coach on jo prosessoitu eikä lähde
muuttunut, sen voi jättää välistä muokkaamalla scriptiä — ei ole vielä ollut
tarpeen ~20 valmentajan mittakaavassa.

## Julkaisu GitHub Pagesille

```bash
git init
git add .
git commit -m "Tekken Slam Suomi valmentajasivusto"
git branch -M main
git remote add origin <oman github-repon URL>
git push -u origin main
```

GitHub-repon asetuksista: **Settings → Pages → Source: Deploy from a branch**,
branch `main`, kansio `/docs`.

## Huomioita datasta

- CSV:n "Mikä biisi esittelyvideoon?" -sarake **ei** näy sivustolla — sitä
  käytetään vain `coach-map.mjs`:ssä valitsemaan oikea musiikkitiedosto ja
  aloituskohta.
- `replat/velhonike.mp4` on tavutasolla identtinen `julumettu.mp4`:n kanssa
  (sama MD5). Se on jätetty pois sivustolta duplikaattina, kunnes toisin
  ilmoitetaan.
- Etusivun ja profiilisivun hahmokuvat ovat peräisin
  [okizeme.gg/database](https://okizeme.gg/database):sta (Tekken 8 -pelin
  virallista hahmotaidetta heidän sivultaan poimittuna, ei tapahtuman omaa
  materiaalia). Kun coach-map.mjs:ssä ei ollut yksiselitteistä päähahmoa
  (tilis: "Kaikki"), kortti käyttää edelleen replay-kuvakaappausta.
  Julumettu-rivillä oli sekä "Leo main" että "nykyään pelaan ninaa" — kortilla
  näytetään Nina, Leo on lisätty pieneksi ikoniksi.
