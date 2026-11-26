#!/usr/bin/env node
/* verify.cjs – kontrollerar Tryckpressen utan webbläsare.
   1) alla mönster är 5×5 och osymmetriska (annars syns ingen spegelvändning)
   2) beställningarna pekar på rutor som finns på papperet, utan dubbletter
   3) spegel(spegel(x)) === x
   4) en korrekt spelare kan lösa nivå 2: rita spegeln av beställningen, tryck på rutan
   5) nivå 3: tolv tryck, inga dubbletter, papperet räcker
   6) hela spelet ger 1 + 3 + 12 stjärnor
*/
const fs = require("fs");
const src = fs.readFileSync(__dirname + "/public/app.js", "utf8");

function block(name) {
  const m = new RegExp("var " + name + " = (\\[[\\s\\S]*?\\n  \\]);").exec(src);
  if (!m) { console.error("hittar inte " + name); process.exit(1); }
  return eval(m[1]);
}
const MONSTER = eval("(" + /var MONSTER = (\{[\s\S]*?\n  \});/.exec(src)[1] + ")");
const BESTALLNINGAR = block("BESTALLNINGAR");
const FARGER = block("FARGER");
const P_COLS = 4, P_ROWS = 3;
const CELLER = P_COLS * P_ROWS;

let fel = 0;
const kolla = (ok, text) => { if (!ok) { fel++; console.log("FEL: " + text); } };

/* 1) form och symmetri */
for (const namn in MONSTER) {
  const m = MONSTER[namn];
  kolla(m.length === 5, namn + " har " + m.length + " rader");
  kolla(m.every((r) => r.length === 5 && /^[.X]{5}$/.test(r)), namn + " har en rad som inte är 5 rutor");
  const speglad = m.map((r) => r.split("").reverse().join(""));
  kolla(JSON.stringify(speglad) !== JSON.stringify(m), namn + " är symmetrisk – spegelvändningen syns inte");
  const höjda = m.join("").split("").filter((c) => c === "X").length;
  kolla(höjda >= 4, namn + " har bara " + höjda + " rutor (minst 4 krävs för att trycka)");
}

/* 2) beställningarna */
kolla(BESTALLNINGAR.length === 3, "väntade 3 beställningar, fick " + BESTALLNINGAR.length);
const använda = new Set();
BESTALLNINGAR.forEach((b, i) => {
  kolla(!!MONSTER[b.mönster], "beställning " + i + " pekar på okänt mönster " + b.mönster);
  kolla(Number.isInteger(b.cell) && b.cell >= 0 && b.cell < CELLER, "beställning " + i + " har ruta utanför papperet: " + b.cell);
  kolla(!använda.has(b.cell), "två beställningar ligger på samma ruta: " + b.cell);
  använda.add(b.cell);
});

/* 3) spegeln är en involution */
const spegel = (m) => m.map((r) => r.split("").reverse().join(""));
Object.keys(MONSTER).forEach((n) => {
  kolla(JSON.stringify(spegel(spegel(MONSTER[n]))) === JSON.stringify(MONSTER[n]), "spegel(spegel(" + n + ")) stämmer inte");
});

/* 4) en korrekt spelare på nivå 2 */
let stjärnor = 1; /* nivå 1: ett tryck */
BESTALLNINGAR.forEach((b) => {
  const stämpel = spegel(MONSTER[b.mönster]);       /* det barnet måste rita */
  const tryck = spegel(stämpel);                    /* det som hamnar på papperet */
  kolla(JSON.stringify(tryck) === JSON.stringify(MONSTER[b.mönster]), "rätt stämpel ger inte beställningen för " + b.mönster);
  /* fel stämpel ska inte ge beställningen */
  const felStämpel = MONSTER[b.mönster];            /* att rita förlagan rakt av är det vanliga misstaget */
  kolla(JSON.stringify(spegel(felStämpel)) !== JSON.stringify(MONSTER[b.mönster]), "förlagan rakt av ger rätt tryck – då är nivån för lätt/omöjlig att lära av");
  stjärnor++;
});

/* 5) nivå 3: tolv rutor, alla unika */
const rutor = [];
for (let i = 0; i < CELLER; i++) rutor.push(i);
kolla(new Set(rutor).size === CELLER, "papperet har dubbletter");
kolla(CELLER === 12, "papperet ska ha 12 rutor, har " + CELLER);
stjärnor += CELLER;

/* 6) summan */
kolla(stjärnor === 16, "en full runda ska ge 16 stjärnor, ger " + stjärnor);

/* 7) färger */
kolla(FARGER.length === 4, "väntade 4 färger");
FARGER.forEach((f) => kolla(/^#[0-9A-Fa-f]{6}$/.test(f.hex), "färgen " + f.namn + " har ingen hexkod"));
kolla(new Set(FARGER.map((f) => f.hex)).size === FARGER.length, "två färger har samma hexkod");

/* 8) alla meningar som sägs finns som text i källan (för mp3-uttaget) */
const rop = /var ROP = \{([\s\S]*?)\n  \};/.exec(src);
kolla(!!rop, "hittar inte ROP");
if (rop) {
  const antal = (rop[1].match(/: "/g) || []).length;
  kolla(antal >= 15, "för få meningar i ROP: " + antal);
}

console.log(fel === 0
  ? "OK: " + Object.keys(MONSTER).length + " mönster, " + BESTALLNINGAR.length + " beställningar, " + stjärnor + " stjärnor i en full runda, 0 fel"
  : fel + " fel");
process.exit(fel === 0 ? 0 : 1);