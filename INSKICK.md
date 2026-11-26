# Inskick – Tryckpressen

| Fält | Värde |
|---|---|
| Titel | Tryckpressen |
| Kort beskrivning | Rita en stämpel, tryck den på papperet och se att trycket blir spegelvänt. Gör en rapport – ett mönster av samma stämpel. Bild åk 4–6. |
| URL | https://tryckpressen.shipholm.dev/ |
| Ämne | Kreativt |
| Årskurs | 3–6 |
| Typ | Spel |
| Enhet | Alla enheter |
| Lgr22 | BL.4-6.1.2, BL.4-6.2.2 |
| Kortbild | `public/kort.png` (1200×900, spelmoment ur nivå 3 – rapport med sju tryck) |
| Katalograd | `907b4c3f-db3f-4de3-9683-17090c4f234b` (status pending, bild `/images/78a34f7d…png`, curriculum satt) |
| check_app | 15/15, 0 varningar (2026-11-26) |
| Testbevis | `node verify.cjs` 5 mönster + 3 beställningar + 16 stjärnor, 0 fel; alla fyra nivåer spelade med äkta `Input.dispatchTouchEvent` lokalt och nivå 1 på driftsatt URL; 0 px scroll i 1024×768 / 768×1024 / 390×844 / 1440×900; tre mp3-uppspelningar live (initiatorType `audio`) |

## long_description

Tryckpressen är en liten tryckverkstad för bild åk 4–6. Eleven ritar sin egen stämpel i ett
5×5-rutnät, väljer färg och trycker den på papperet – och upptäcker att trycket blir spegelvänt,
precis som i en riktig tryckpress.

Nivå 1 är fritt: rita, trycka, se vad som händer. Nivå 2 ger tre beställningar (fisk, blad, pil) där
trycket ska se ut som bilden, vilket bara går om eleven vänder formen i tanken innan den ritas.
Nivå 3 är rapport: samma stämpel trycks på jämna avstånd över hela papperet och bildar ett mönster;
formen låses när mönstret är påbörjat. Nivå 4 är en fri verkstad med fyra färger och så många tryck
papperet tar.

Ett tryck som inte stämmer blir kvar som ett grått avdrag på papperet och Kotten säger att trycket
blir spegelvänt – ingen stjärna förloras och ingen liv tas. Instruktionerna skrivs och läses upp,
allt ryms på en skärm, och alla former ritas i kod: inga bilder, ingen inloggning, ingen reklam,
inga länkar ut.

Appen tränar två grundvillkor i tryckteknik: att bilden på plåten är spegelvänd när den hamnar på
papperet, och att en liten stämpel kan upprepas till ett mönster (rapport) genom att tryckas på
bestämda avstånd. Källa: Skolverket, Lgr22 (ämnesplan bild).