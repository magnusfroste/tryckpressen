/* Tryckpressen – spegelvända tryck och mönster. Bild åk 4–6. Inga beroenden. */
(function () {
  "use strict";

  /* ---------------- Data ----------------
     Varje mönster är 5×5 rutor; X = höjd (det som blir färg på papperet).
     Mönstren är avsiktligt osymmetriska så att spegelvändningen syns. */
  var MONSTER = {
    fisk: ["....X", "..XXX", "XXXXX", "..XXX", "....X"],
    blad: ["...XX", "..XXX", ".XXX.", "XXX..", "X...."],
    pil:  ["X....", "XX...", "XXXXX", "XX...", "X...."],
    hus:  ["..X..", ".XXX.", "XXXXX", "X.X.X", "X.X.."],
    fjäril: ["X...X", "XX.XX", "XXXXX", ".XXX.", "X...."]
  };

  /* Nivå 2: en beställning per uppgift – trycket som ska hamna på papperet.
     cell = vilken ruta på papperet (0–11, radvis 4 kolumner). */
  var BESTALLNINGAR = [
    { mönster: "fisk", cell: 5 },
    { mönster: "blad", cell: 2 },
    { mönster: "pil",  cell: 10 }
  ];

  var FARGER = [
    { namn: "Indigo", hex: "#2F4F8F" },
    { namn: "Rost", hex: "#B4522F" },
    { namn: "Skogsgrön", hex: "#2E6B4F" },
    { namn: "Gulockra", hex: "#C98A16" }
  ];

  /* Papperet: 4 kolumner × 3 rader. Nivå 3 fyller alla 12 (rapport med förskjutning). */
  var P_COLS = 4, P_ROWS = 3;

  var NIVÅER = [
    { namn: "Första trycket", antal: 1 },
    { namn: "Spegelvändningen", antal: BESTALLNINGAR.length },
    { namn: "Rapport", antal: P_COLS * P_ROWS },
    { namn: "Fria verkstaden", antal: 0 }
  ];

  /* Allt som sägs finns som fast textsträng här, så ljudify kan göra mp3 av det. */
  var ROP = {
    start1: "Nivå 1: rita en form i stämpeln och tryck den på papperet.",
    start2: "Nivå 2: trycket ska se ut som bilden. Tänk på att trycket blir spegelvänt.",
    start3: "Nivå 3: tryck samma stämpel på jämna avstånd över hela papperet. Ett sådant mönster kallas rapport.",
    start4: "Fria verkstaden: rita, välj färg och tryck så många gånger du vill.",
    ritat: "Rita formen genom att trycka på rutorna i stämpeln.",
    forFå: "Stämpeln behöver minst fyra rutor innan du kan trycka.",
    tryck: "Nu trycker du på papperet.",
    ratt: "Rätt! Trycket stämmer med beställningen.",
    ratt1: "Så här blir trycket. Ser du att det är spegelvänt mot stämpeln?",
    spegel: "Nästan. Trycket blir spegelvänt, så rita stämpeln åt andra hållet.",
    rapport: "Ett tryck till, och mönstret växer.",
    klart2: "Klart! Du vände på formen i tanken och tryckte rätt.",
    klart3: "Snyggt! Nu är papperet ett mönster med tolv tryck.",
    fri: "Fritt fram. Papperet tar emot så många tryck du vill.",
    slut: "Pressen är klar! Du har gjort tryck, spegelvänt dem och byggt ett mönster.",
    tom: "Rör papperet först – rita något i stämpeln."
  };

  /* ---------------- Kotten ---------------- */
  function kotten(svg, lage) {
    if (!svg) return;
    var glad = lage === "glad" || lage === "fira";
    var funderar = lage === "funderar";
    var ojdå = lage === "oj";
    var mun = glad ? 'M16 30 Q20 36 24 30' : ojdå ? 'M16.5 32 H23.5' : funderar ? 'M16.5 31 Q20 33 23.5 31' : 'M16 31 Q20 33.5 24 31';
    svg.innerHTML =
      '<g>' +
      '<ellipse cx="20" cy="26" rx="12" ry="11" fill="#b07d4b"/>' +
      '<path d="M8 20 Q5 10 12 6 Q14 14 16 16 Z" fill="#8a5f36"/>' +
      '<path d="M32 20 Q35 10 28 6 Q26 14 24 16 Z" fill="#8a5f36"/>' +
      '<path d="M20 6 Q22 1 26 2 Q23 5 23 8 Z" fill="#5f8f3e"/>' +
      '<circle cx="15.5" cy="24" r="2.7" fill="#2b2118"/>' +
      '<circle cx="24.5" cy="24" r="2.7" fill="#2b2118"/>' +
      '<circle cx="16.4" cy="23.1" r="' + (glad ? 1.1 : 0.8) + '" fill="#fff"/>' +
      '<circle cx="25.4" cy="23.1" r="' + (glad ? 1.1 : 0.8) + '" fill="#fff"/>' +
      '<path d="' + mun + '" stroke="#2b2118" stroke-width="1.7" fill="none" stroke-linecap="round"/>' +
      (lage === "fira" ? '<path d="M32 12 l1.6 3.2 3.4 .5 -2.5 2.4 .6 3.4 -3.1 -1.6 -3.1 1.6 .6 -3.4 -2.5 -2.4 3.4 -.5z" fill="#D99A21"/>' : '') +
      '</g>';
  }

  /* ---------------- Ljud ---------------- */
  var AC = null, ljudPa = true;
  function ton(frek, ms, typ, volym) {
    if (!ljudPa) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var o = AC.createOscillator(), g = AC.createGain();
      o.type = typ || "sine"; o.frequency.value = frek;
      g.gain.value = volym == null ? 0.05 : volym;
      o.connect(g); g.connect(AC.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0008, AC.currentTime + ms / 1000);
      o.stop(AC.currentTime + ms / 1000 + 0.03);
    } catch (e) {}
  }
  function säg(text) {
    if (!ljudPa || !text) return;
    try {
      if (window.__rost) { if (window.__rost(text)) return; }
      
    } catch (e) {}
  }
  function event(n) { try { window.skolappar && window.skolappar.event(n); } catch (e) {} }

  /* ---------------- Tillstånd ---------------- */
  var S = {
    niva: 1,            // 1–4
    celler: [],         // 25 booleaner, stämpelns höjda rutor
    farg: 0,
    tryck: {},          // pappersruta -> { typ: "rätt"|"avdrag", farg }
    klara: 0,           // klara uppgifter på nivån
    stjarnor: 0,
    lage: "start",
    sista: ""           // senaste händelsen, för återkoppling
  };
  function tomStämpel() { var a = [], i; for (i = 0; i < 25; i++) a.push(false); return a; }
  S.celler = tomStämpel();

  var $ = function (s) { return document.querySelector(s); };

  /* ---------------- Geometri ---------------- */
  var duk = document.getElementById("duk"), ctx = duk ? duk.getContext("2d") : null, dpr = 1, L = null;

  function rita() {
    if (!ctx) return;
    var w = duk.clientWidth, h = duk.clientHeight;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var luft = 10;
    var landskap = w > h * 1.02;
    var stampBox, papperBox;

    if (landskap) {
      var ss = Math.min(w * 0.34, h - luft * 2);
      stampBox = { x: luft, y: (h - ss) / 2, w: ss, h: ss };
      papperBox = { x: stampBox.x + ss + luft * 1.6, y: luft, w: w - (stampBox.x + ss + luft * 1.6) - luft, h: h - luft * 2 };
    } else {
      var st = Math.min(w - luft * 2, Math.max(h * 0.40, 320));
      stampBox = { x: (w - st) / 2, y: luft, w: st, h: st };
      papperBox = { x: luft, y: luft + st + luft, w: w - luft * 2, h: h - st - luft * 3 };
    }

    /* stämpelpanel */
    rundRekt(ctx, stampBox.x, stampBox.y, stampBox.w, stampBox.h, 18, "#FFFDF8", "#E4DACB", 2);
    var inner = Math.min(stampBox.w, stampBox.h) - 26;
    var cs = Math.floor(inner / 5);
    var gx = Math.round(stampBox.x + (stampBox.w - cs * 5) / 2);
    var gy = Math.round(stampBox.y + (stampBox.h - cs * 5) / 2);
    var ink = FARGER[S.farg].hex;
    var i, r, c;
    for (r = 0; r < 5; r++) {
      for (c = 0; c < 5; c++) {
        var px = gx + c * cs, py = gy + r * cs;
        var på = S.celler[r * 5 + c];
        ctx.fillStyle = på ? ink : "#F1EADD";
        ctx.fillRect(px + 1, py + 1, cs - 2, cs - 2);
        ctx.strokeStyle = på ? ink : "#DCCFBB";
        ctx.lineWidth = 1;
        ctx.strokeRect(px + .5, py + .5, cs - 1, cs - 1);
      }
    }
    etikett("STÄMPEL", gx, gy - 8, cs * 5, "#6B7A84");

    /* papper */
    rundRekt(ctx, papperBox.x, papperBox.y, papperBox.w, papperBox.h, 14, "#FFFDF8", "#E4DACB", 2);
    var pc = Math.floor(Math.min((papperBox.w - 30) / P_COLS, (papperBox.h - 40) / P_ROWS));
    var pgx = Math.round(papperBox.x + (papperBox.w - pc * P_COLS) / 2);
    var pgy = Math.round(papperBox.y + (papperBox.h - pc * P_ROWS) / 2 + 6);

    /* målrutor (beställning / rapport) */
    var mal = målRutor();
    for (i = 0; i < mal.length; i++) {
      var mcell = mal[i];
      var mx = pgx + (mcell % P_COLS) * pc, my = pgy + Math.floor(mcell / P_COLS) * pc;
      if (!S.tryck[mcell]) {
        ctx.strokeStyle = S.niva === 3 ? "#C7B9A3" : "#B9C9DB";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ritaRuta(ctx, mx + pc * .12, my + pc * .12, pc * .76, 8);
        ctx.stroke();
        ctx.setLineDash([]);
        if (mcell === nästaMål()) {
          var puls = window.__lugn ? 0 : (Math.sin(Date.now() / 320) * 0.5 + 0.5);
          ctx.strokeStyle = "rgba(217,154,33," + (0.45 + puls * 0.45) + ")";
          ctx.lineWidth = 3;
          ritaRuta(ctx, mx + pc * .06, my + pc * .06, pc * .88, 10);
          ctx.stroke();
        }
      }
    }

    /* beställningens bild i nivå 2: en liten förlaga i papperets hörn */
    if (S.niva === 2) {
      var uppg = BESTALLNINGAR[S.klara];
      if (uppg) {
        var fw = Math.min(pc * 0.9, 96);
        var fx = papperBox.x + 10, fy = papperBox.y + 10;
        rundRekt(ctx, fx - 6, fy - 6, fw + 12, fw + 22, 8, "#F4EEE2", "#E4DACB", 1.5);
        ritaMonster(ctx, MONSTER[uppg.mönster], fx, fy, fw, "#8C9AA3");
        ctx.fillStyle = "#6B7A84";
        ctx.font = "600 11px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("BESTÄLLNING", fx, fy + fw + 12);
      }
    }

    /* tryckta bilder */
    for (var nyckel in S.tryck) {
      if (!S.tryck.hasOwnProperty(nyckel)) continue;
      var cell = Number(nyckel);
      var t = S.tryck[cell];
      var tx = pgx + (cell % P_COLS) * pc, ty = pgy + Math.floor(cell / P_COLS) * pc;
      var färg = t.typ === "rätt" ? FARGER[t.farg].hex : "#C6BDB0";
      ritaMonster(ctx, t.bild, tx + pc * .06, ty + pc * .06, pc * .88, färg);
    }

    /* rutnät över papperet, tunt, så att förskjutningen syns */
    ctx.strokeStyle = "rgba(34,48,58,.07)";
    ctx.lineWidth = 1;
    for (r = 0; r <= P_ROWS; r++) {
      ctx.beginPath(); ctx.moveTo(pgx, pgy + r * pc); ctx.lineTo(pgx + pc * P_COLS, pgy + r * pc); ctx.stroke();
    }
    for (c = 0; c <= P_COLS; c++) {
      ctx.beginPath(); ctx.moveTo(pgx + c * pc, pgy); ctx.lineTo(pgx + c * pc, pgy + pc * P_ROWS); ctx.stroke();
    }
    etikett("PAPPER", pgx, pgy - 8, pc * P_COLS, "#6B7A84");

    L = {
      w: w, h: h, landskap: landskap,
      stamp: { x: gx, y: gy, cs: cs },
      papper: { x: pgx, y: pgy, pc: pc }
    };
  }

  function etikett(text, x, y, bredd, farg) {
    ctx.fillStyle = farg;
    ctx.font = "700 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, x + bredd / 2, y - 4);
    ctx.textAlign = "left";
  }

  function ritaRuta(c, x, y, s, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + s, y, x + s, y + s, r);
    c.arcTo(x + s, y + s, x, y + s, r);
    c.arcTo(x, y + s, x, y, r);
    c.arcTo(x, y, x + s, y, r);
    c.closePath();
  }

  function rundRekt(c, x, y, w, h, r, fyll, kant, kantbredd) {
    ritaRuta(c, x, y, w, h, r);
    c.fillStyle = fyll; c.fill();
    if (kant) { c.strokeStyle = kant; c.lineWidth = kantbredd || 1; c.stroke(); }
  }

  function ritaMonster(c, m, x, y, storlek, farg) {
    var st = storlek / 5;
    c.fillStyle = farg;
    for (var r = 0; r < 5; r++) {
      for (var k = 0; k < 5; k++) {
        if (m[r][k] === "X") c.fillRect(x + k * st, y + r * st, st + .5, st + .5);
      }
    }
  }

  /* ---------------- Spegelvändning och mål ---------------- */
  var spegelCache = {};
  function spegel(m) {
    return m.map(function (rad) { return rad ? rad.split("").reverse().join("") : m; });
  }
  function stämpelBild() {
    var ut = [], r, c;
    for (r = 0; r < 5; r++) {
      var rad = "";
      for (c = 0; c < 5; c++) rad += S.celler[r * 5 + c] ? "X" : ".";
      ut.push(rad);
    }
    return ut;
  }
  function antalHöjda() {
    var n = 0, i;
    for (i = 0; i < 25; i++) if (S.celler[i]) n++;
    return n;
  }
  function målRutor() {
    if (S.niva === 2) return BESTALLNINGAR.map(function (b) { return b.cell; });
    if (S.niva === 3) { var a = [], i; for (i = 0; i < P_COLS * P_ROWS; i++) a.push(i); return a; }
    return [];
  }
  function nästaMål() {
    if (S.niva === 2) { var b = BESTALLNINGAR[S.klara]; return b ? b.cell : -1; }
    if (S.niva === 3) {
      for (var i = 0; i < P_COLS * P_ROWS; i++) if (!S.tryck[i]) return i;
      return -1;
    }
    return -1;
  }

  /* ---------------- Spelflöde ---------------- */
  function nollställNivå(n) {
    S.niva = n;
    S.klara = 0;
    S.lage = "spel";
    S.sista = "";
    if (n === 1 || n === 2) S.celler = tomStämpel();
    S.tryck = {};
    if (n === 2) S.celler = tomStämpel();
    uppdateraHud();
    visaInstruktion(n);
    event("level");
    rita();
  }

  function visaInstruktion(n) {
    var text = n === 1 ? ROP.start1 : n === 2 ? ROP.start2 : n === 3 ? ROP.start3 : ROP.start4;
    $("#instruktion").textContent = text;
    $("#instruktion").className = "instruktion";
    säg(text);
  }

  function uppdateraHud() {
    var n = NIVÅER[S.niva - 1];
    $("#nivutext").textContent = "Nivå " + S.niva + ": " + n.namn;
    $("#stjarnor").textContent = S.stjarnor + " \u2605";
    var klar = S.niva < 4 && S.klara >= NIVÅER[S.niva - 1].antal;
    $("#nasta").hidden = S.niva === 4 ? false : !(klar && S.niva < 4);
    $("#nasta").textContent = S.niva === 4 ? "Klar" : "Nästa nivå";
    kotten($("#hud-kotten"), klar ? "fira" : (S.lage === "fel" ? "oj" : "glad"));
  }

  function tips(text, typ) {
    $("#instruktion").textContent = text;
    $("#instruktion").className = "instruktion " + (typ || "");
    säg(text);
  }

  function tryckPå(cell) {
    if (S.lage !== "spel") return;
    if (S.niva === 4) {
      /* fri verkstad: tryck med vald färg, inga krav */
      S.tryck[cell] = { bild: spegel(stämpelBild()), typ: "rätt", farg: S.farg };
      ton(180, 140, "sine", 0.05);
      rita();
      return;
    }
    if (S.niva === 3 && S.tryck[cell]) return;
    if (antalHöjda() < 4) {
      tips(ROP.forFå, "fel");
      kotten($("#hud-kotten"), "funderar");
      return;
    }
    var bild = spegel(stämpelBild());
    var rätt = false;

    if (S.niva === 1) {
      rätt = true;
    } else if (S.niva === 2) {
      var uppg = BESTALLNINGAR[S.klara];
      rätt = !!(uppg && uppg.cell === cell && sammaBild(bild, MONSTER[uppg.mönster]));
    } else if (S.niva === 3) {
      rätt = true; /* mönstret blir rätt när alla rutor är tryckta */
    }

    if (rätt) {
      S.tryck[cell] = { bild: bild, typ: "rätt", farg: S.farg };
      S.klara++;
      S.stjarnor++;
      ton(660, 120, "triangle", 0.05);
      setTimeout(function () { ton(880, 160, "triangle", 0.045); }, 110);
      kotten($("#hud-kotten"), "fira");
      if (S.niva === 2 && S.klara >= BESTALLNINGAR.length) säg(ROP.klart2);
      else if (S.niva === 3 && S.klara >= P_COLS * P_ROWS) säg(ROP.klart3);
      else if (S.niva === 2) säg(ROP.ratt);
      else if (S.niva === 3) säg(ROP.rapport);
      $("#instruktion").textContent = S.niva === 2 && S.klara >= BESTALLNINGAR.length ? ROP.klart2
        : S.niva === 3 && S.klara >= P_COLS * P_ROWS ? ROP.klart3
        : S.niva === 1 ? ROP.ratt1 : S.niva === 2 ? ROP.ratt : ROP.rapport;
      if (S.niva === 1) säg(ROP.ratt1);
      event("hint");
      if (S.klara >= NIVÅER[S.niva - 1].antal && S.niva < 4) {
        $("#nasta").hidden = false;
        kotten($("#hud-kotten"), "fira");
      }
    } else {
      /* fel: trycket blir ett avdrag i grått – det syns, men ger ingen stjärna */
      S.tryck[cell] = { bild: bild, typ: "avdrag", farg: S.farg };
      ton(150, 220, "sine", 0.06);
      kotten($("#hud-kotten"), "oj");
      tips(ROP.spegel, "fel");
      setTimeout(function () { kotten($("#hud-kotten"), "funderar"); }, 900);
    }
    uppdateraHud();
    rita();
  }

  function sammaBild(a, b) {
    for (var r = 0; r < 5; r++) if (a[r] !== b[r]) return false;
    return true;
  }

  /* ---------------- Input ---------------- */
  function punkt(ev) {
    var r = duk.getBoundingClientRect();
    var p = ev.touches && ev.touches[0] ? ev.touches[0] : ev;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  }

  function hantera(ev) {
    if (!L) return;
    var p = punkt(ev);
    if (p.x < 0 || p.y < 0 || p.x > L.w || p.y > L.h) return;

    var st = L.stamp, cs = st.cs;
    if (p.x >= st.x && p.x < st.x + cs * 5 && p.y >= st.y && p.y < st.y + cs * 5) {
      var c = Math.floor((p.x - st.x) / cs), r = Math.floor((p.y - st.y) / cs);
      if (S.niva === 3 && Object.keys(S.tryck).length > 0) {
        tips("Formen är låst nu när mönstret är påbörjat. Fyll papperet med tryck.", "fel");
        return;
      }
      S.celler[r * 5 + c] = !S.celler[r * 5 + c];
      ton(420, 40, "square", 0.03);
      kotten($("#hud-kotten"), "glad");
      rita();
      return;
    }

    var pp = L.papper, pc = pp.pc;
    if (p.x >= pp.x && p.x < pp.x + pc * P_COLS && p.y >= pp.y && p.y < pp.y + pc * P_ROWS) {
      var kc = Math.floor((p.x - pp.x) / pc), kr = Math.floor((p.y - pp.y) / pc);
      tryckPå(kr * P_COLS + kc);
      return;
    }
  }

  duk.addEventListener("pointerdown", function (ev) {
    ev.preventDefault();
    hantera(ev);
  }, { passive: false });

  window.addEventListener("keydown", function (ev) {
    if (S.lage !== "spel") return;
    if (ev.key === "ArrowRight" || ev.key === "d") S.farg = (S.farg + 1) % FARGER.length;
    else if (ev.key === "ArrowLeft" || ev.key === "a") S.farg = (S.farg + FARGER.length - 1) % FARGER.length;
    else return;
    ritaFarger();
    rita();
  });

  /* ---------------- Färger och knappar ---------------- */
  function ritaFarger() {
    var box = $("#farger");
    box.innerHTML = "";
    FARGER.forEach(function (f, i) {
      var b = document.createElement("button");
      b.className = "farg" + (i === S.farg ? " vald" : "");
      b.style.background = f.hex;
      b.setAttribute("aria-label", "Färg " + f.namn);
      b.setAttribute("aria-pressed", i === S.farg ? "true" : "false");
      b.addEventListener("click", function () {
        S.farg = i;
        ritaFarger();
        rita();
        ton(520 + i * 60, 60, "sine", 0.03);
      });
      box.appendChild(b);
    });
  }

  $("#nyform").addEventListener("click", function () {
    if (S.niva === 4) { S.celler = tomStämpel(); S.tryck = {}; }
    else {
      if (S.niva === 3 && Object.keys(S.tryck).length > 0) return;
      S.celler = tomStämpel();
    }
    kotten($("#hud-kotten"), "glad");
    rita();
    uppdateraHud();
  });

  $("#nasta").addEventListener("click", function () {
    if (S.niva >= 4) { avsluta(); return; }
    nollställNivå(S.niva + 1);
    $("#nasta").hidden = true;
    event("round_start");
  });

  $("#ljud").addEventListener("click", function () {
    ljudPa = !ljudPa;
    this.classList.toggle("av", !ljudPa);
    if (!ljudPa) {
      try { if (window.__rostStopp) window.__rostStopp(); } catch (e) {}
      if (window.__rostStopp) window.__rostStopp();
      event("sound_off");
    } else {
      ton(600, 120, "sine", 0.05);
    }
  });

  $("#spela").addEventListener("click", function () {
    $("#startskarm").hidden = true;
    $("#spel").hidden = false;
    S.lage = "spel";
    S.niva = 1; S.klara = 0; S.stjarnor = 0; S.tryck = {}; S.celler = tomStämpel();
    ritaFarger();
    nollställNivå(1);
    event("round_start");
    storleksändra();
  });

  $("#igen").addEventListener("click", function () {
    $("#slut").hidden = true;
    $("#spel").hidden = false;
    S.niva = 1; S.klara = 0; S.stjarnor = 0; S.tryck = {}; S.celler = tomStämpel();
    nollställNivå(1);
    event("round_start");
    storleksändra();
  });

  /* ---------------- Nivåbyte när fri verkstad nås ---------------- */
  function avsluta() {
    if (S.lage === "slut") return;
    S.lage = "slut";
    $("#slut").hidden = false;
    $("#slut-poang").textContent = S.stjarnor + " \u2605";
    $("#slut-text").textContent = ROP.slut;
    säg(ROP.slut);
    event("round_done");
    kotten($("#slut-kotten"), "fira");
  }

  /* ---------------- Storlek ---------------- */
  function storleksändra() {
    if (!duk) return;
    var box = $("#scen");
    var w = box.clientWidth, h = box.clientHeight;
    if (w < 10 || h < 10) return;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    duk.width = Math.round(w * dpr);
    duk.height = Math.round(h * dpr);
    duk.style.width = w + "px";
    duk.style.height = h + "px";
    ctx = duk.getContext("2d");
    rita();
  }

  /* ---------------- Start ---------------- */
  function init() {
    duk = $("#duk");
    ctx = duk.getContext("2d");
    kotten($("#start-kotten"), "glad");
    kotten($("#hud-kotten"), "glad");
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) window.__lugn = true;
    window.addEventListener("resize", storleksändra);
    window.addEventListener("orientationchange", function () { setTimeout(storleksändra, 250); });
    storleksändra();
    ritaFarger();

    /* utvecklingshandtag – används av speltestet, syns inte för barnet */
    window.__game = {
      S: S, NIVÅER: NIVÅER, MONSTER: MONSTER, BESTALLNINGAR: BESTALLNINGAR, FARGER: FARGER,
      rita: rita, spegel: spegel, stämpelBild: stämpelBild, tryckPå: tryckPå,
      nollstall: nollställNivå, mala: målRutor, nastaMal: nästaMål,
      layout: function () { return L; }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  /* slutkontrollen körs när papperet ändras */
  setInterval(function () {
    if (S.niva === 4 && S.lage === "spel") {
      $("#nasta").hidden = false;
    }
  }, 400);
})();