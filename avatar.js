/* =====================================================================
   Classe Party - AVATARS (version 1.11) - v2 "détaillés"
   Personnages originaux dessinés en SVG (dégradés, ombres, reflets) :
   animaux, créatures fantastiques, enfants, princes, princesses, fées,
   super-héros. Tous inventés pour Classe Party : aucun personnage existant.
   © 2026 Jérôme Manderlier - Licence CC BY-NC-ND 4.0
   ===================================================================== */
(function () {
  'use strict';
  const INK = '#2b1a10';
  const PERSOS = ['renard', 'loup', 'ours', 'panda', 'chat', 'tigre', 'lion', 'lapin', 'souris', 'chien', 'cochon', 'singe', 'koala',
    'hibou', 'poussin', 'perroquet', 'pingouin', 'grenouille', 'dragon', 'licorne', 'monstre', 'blob', 'robot', 'fantome', 'alien', 'enfant', 'elfe'];
  const OPT = {
    perso: PERSOS,
    peau: ['naturel', '#f6d2b8', '#e3ab84', '#b97b50', '#7d4f31', '#f07f2a', '#a86a3d', '#9aa3b5', '#f4f4f4', '#3a3f4f', '#ffd93b', '#7ad36b', '#6fb7ff', '#c58bff', '#ff9ecb'],
    cheveux: ['courts', 'longs', 'couettes', 'boucles', 'chignon', 'crete', 'aucun'],
    cheveuxCouleur: ['#5c3a1e', '#2a1a12', '#f2c84b', '#d9692e', '#eeeeee', '#3fa9f5', '#ff7eb6', '#9b5de5', '#4cc94c'],
    yeux: ['ronds', 'brillants', 'joyeux', 'clin', 'coquins', 'etoiles', 'coeurs', 'cyclope'],
    bouche: ['sourire', 'rire', 'langue', 'dents', 'crocs', 'o', 'moustache'],
    dessus: ['aucun', 'couronne', 'diademe', 'chapeau', 'casquette', 'bonnet', 'noeud', 'fleurs', 'aureole', 'cornes', 'antennes'],
    visage: ['aucun', 'joues', 'taches', 'lunettes', 'soleil', 'masque'],
    dos: ['aucun', 'badge', 'cape', 'ailes', 'etincelles'],
    teinte: ['#ef3e36', '#3fa9f5', '#4cc94c', '#9b5de5', '#ff8c1a', '#ff5fa2', '#22b8a7', '#ffcf4a', '#3a1d0e']
  };
  const LABELS = {
    perso: 'Personnage', peau: 'Couleur', cheveux: 'Cheveux', cheveuxCouleur: 'Couleur des cheveux', yeux: 'Yeux', bouche: 'Bouche',
    dessus: 'Sur la tête', visage: 'Visage', dos: 'Derrière', teinte: 'Couleur des accessoires',
    renard: 'Renard', loup: 'Loup', ours: 'Ours', panda: 'Panda', chat: 'Chat', tigre: 'Tigre', lion: 'Lion', lapin: 'Lapin', souris: 'Souris',
    chien: 'Chien', cochon: 'Cochon', singe: 'Singe', koala: 'Koala', hibou: 'Hibou', poussin: 'Poussin', perroquet: 'Perroquet', pingouin: 'Pingouin',
    grenouille: 'Grenouille', dragon: 'Dragon', licorne: 'Licorne', monstre: 'Monstre poilu', blob: 'Monstre gluant', robot: 'Robot', fantome: 'Fantôme',
    alien: 'Extraterrestre', enfant: 'Enfant', elfe: 'Elfe',
    naturel: 'Naturelle',
    courts: 'Courts', longs: 'Longs', couettes: 'Couettes', boucles: 'Bouclés', chignon: 'Chignon', crete: 'Crête', aucun: 'Rien',
    ronds: 'Ronds', brillants: 'Brillants', joyeux: 'Joyeux', clin: 'Clin d\'œil', coquins: 'Coquins', etoiles: 'Étoiles', coeurs: 'Cœurs', cyclope: 'Un seul œil',
    sourire: 'Sourire', rire: 'Rire', langue: 'Langue', dents: 'Dents de lapin', crocs: 'Crocs', o: 'Surpris', moustache: 'Moustache',
    couronne: 'Couronne', diademe: 'Diadème', chapeau: 'Chapeau de magicien', casquette: 'Casquette', bonnet: 'Bonnet', noeud: 'Nœud', fleurs: 'Couronne de fleurs',
    aureole: 'Auréole', cornes: 'Cornes', antennes: 'Antennes',
    joues: 'Joues roses', taches: 'Taches de rousseur', lunettes: 'Lunettes', soleil: 'Lunettes de soleil', masque: 'Masque de héros',
    badge: 'Rond de couleur', cape: 'Cape', ailes: 'Ailes de fée', etincelles: 'Étincelles'
  };
  const STYLES = {
    animal: {nom: '🐾 Animal', a: {perso: 'renard', peau: 'naturel', yeux: 'ronds', bouche: 'sourire', dessus: 'aucun', visage: 'joues', dos: 'aucun', teinte: '#ff8c1a'}},
    monstre: {nom: '👾 Monstre', a: {perso: 'monstre', peau: 'naturel', yeux: 'brillants', bouche: 'crocs', dessus: 'aucun', visage: 'aucun', dos: 'aucun', teinte: '#9b5de5'}},
    dragon: {nom: '🐉 Dragon', a: {perso: 'dragon', peau: 'naturel', yeux: 'coquins', bouche: 'sourire', dessus: 'aucun', visage: 'aucun', dos: 'etincelles', teinte: '#ffcf4a'}},
    prince: {nom: '👑 Prince', a: {perso: 'enfant', peau: '#f6d2b8', cheveux: 'courts', cheveuxCouleur: '#5c3a1e', yeux: 'ronds', bouche: 'sourire', dessus: 'couronne', visage: 'aucun', dos: 'cape', teinte: '#3fa9f5'}},
    princesse: {nom: '💎 Princesse', a: {perso: 'enfant', peau: '#e3ab84', cheveux: 'longs', cheveuxCouleur: '#f2c84b', yeux: 'brillants', bouche: 'sourire', dessus: 'diademe', visage: 'joues', dos: 'etincelles', teinte: '#ff5fa2'}},
    fee: {nom: '✨ Féerique', a: {perso: 'elfe', peau: 'naturel', cheveux: 'longs', cheveuxCouleur: '#ff7eb6', yeux: 'etoiles', bouche: 'sourire', dessus: 'fleurs', visage: 'joues', dos: 'ailes', teinte: '#22b8a7'}},
    heros: {nom: '🦸 Super-héros', a: {perso: 'enfant', peau: '#b97b50', cheveux: 'courts', cheveuxCouleur: '#2a1a12', yeux: 'ronds', bouche: 'rire', dessus: 'aucun', visage: 'masque', dos: 'cape', teinte: '#ef3e36'}}
  };
  const HUMAINS = ['enfant', 'elfe'];
  const isHuman = a => HUMAINS.includes(a.perso);
  function clean(a) {
    const o = {}; a = a || {};
    for (const k of Object.keys(OPT)) o[k] = OPT[k].includes(a[k]) ? a[k] : OPT[k][0];
    return o;
  }
  function cats(a) {
    const c = ['perso', 'peau', 'yeux', 'bouche', 'dessus', 'visage', 'dos', 'teinte'];
    if (isHuman(clean(a))) c.splice(2, 0, 'cheveux', 'cheveuxCouleur');
    return c;
  }
  function random() {
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    const o = {perso: pick(PERSOS), peau: Math.random() < .8 ? 'naturel' : pick(OPT.peau), cheveux: pick(OPT.cheveux), cheveuxCouleur: pick(OPT.cheveuxCouleur),
      yeux: pick(['ronds', 'ronds', 'brillants', 'joyeux', 'clin', 'coquins', 'etoiles', 'coeurs']), bouche: pick(['sourire', 'sourire', 'rire', 'langue', 'dents', 'crocs', 'o']),
      dessus: Math.random() < .45 ? 'aucun' : pick(OPT.dessus), visage: pick(['aucun', 'joues', 'joues', 'taches', 'lunettes', 'soleil', 'masque']),
      dos: Math.random() < .55 ? 'aucun' : pick(OPT.dos), teinte: pick(OPT.teinte)};
    return o;
  }

  /* ---------- couleurs ---------- */
  function rgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function mix(a, b, t) { const x = rgb(a), y = rgb(b); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
  const lighter = (c, t) => mix(c, '#ffffff', t), darker = (c, t) => mix(c, '#000000', t);
  const lum = c => { const [r, g, b] = rgb(c); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  const f = n => Math.round(n * 10) / 10;
  const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const S2 = `stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"`;
  const mir = s => `<g transform="matrix(-1 0 0 1 120 0)">${s}</g>`;
  const pair = s => s + mir(s);
  function bumpy(cx, cy, rx, ry, n, k) {
    let d = '';
    for (let i = 0; i <= n; i++) {
      const a = i / n * 2 * Math.PI - Math.PI / 2, x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
      if (i === 0) d += `M${f(x)} ${f(y)}`;
      else { const m = (i - .5) / n * 2 * Math.PI - Math.PI / 2; d += ` Q${f(cx + rx * k * Math.cos(m))} ${f(cy + ry * k * Math.sin(m))} ${f(x)} ${f(y)}`; }
    }
    return d + ' Z';
  }
  function star(x, y, r) { return `M${x} ${y - r} Q${x + r * .18} ${y - r * .18} ${x + r} ${y} Q${x + r * .18} ${y + r * .18} ${x} ${y + r} Q${x - r * .18} ${y + r * .18} ${x - r} ${y} Q${x - r * .18} ${y - r * .18} ${x} ${y - r} Z`; }
  function star5(x, y, r) { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + f(x + rr * Math.cos(a)) + ' ' + f(y + rr * Math.sin(a)); } return d + 'Z'; }
  function heart(x, y, r) { return `M${x} ${f(y + r * .9)} C${f(x - r * 1.4)} ${f(y)} ${f(x - r * .9)} ${f(y - r * 1.1)} ${x} ${f(y - r * .35)} C${f(x + r * .9)} ${f(y - r * 1.1)} ${f(x + r * 1.4)} ${y} ${x} ${f(y + r * .9)} Z`; }

  /* ---------- formes de tête ---------- */
  const HEAD = {
    rond: 'M60 30 C82 30 97 45 97 66 C97 87 81 102 60 102 C39 102 23 87 23 66 C23 45 38 30 60 30 Z',
    large: 'M60 32 C86 32 101 46 101 68 C101 89 83 102 60 102 C37 102 19 89 19 68 C19 46 34 32 60 32 Z',
    touffu: 'M60 30 C82 30 96 44 97 60 L106 67 L97 71 L103 81 L90 83 C84 96 73 102 60 102 C47 102 36 96 30 83 L17 81 L23 71 L14 67 L23 60 C24 44 38 30 60 30 Z',
    oeuf: 'M60 24 C84 24 96 46 96 68 C96 90 80 104 60 104 C40 104 24 90 24 68 C24 46 36 24 60 24 Z',
    hibou: 'M60 34 C84 34 99 48 99 68 C99 90 82 104 60 104 C38 104 21 90 21 68 C21 48 36 34 60 34 Z',
    carre: 'M36 30 H84 Q98 30 98 44 V88 Q98 102 84 102 H36 Q22 102 22 88 V44 Q22 30 36 30 Z',
    blob: 'M60 16 C66 30 96 44 96 72 C96 90 86 100 78 102 Q77 112 71.5 112 Q66 112 66 103 L52 103 Q51 109 46.5 109 Q42 109 42 101 C30 98 24 88 24 72 C24 44 54 30 60 16 Z',
    fantome: 'M60 22 C84 22 96 40 96 64 V98 Q90 108 84 99 Q78 92 72 99 Q66 108 60 99 Q54 92 48 99 Q42 108 36 99 Q30 92 24 98 V64 C24 40 36 22 60 22 Z',
    alien: 'M60 22 C88 22 101 40 99 58 C97 80 76 104 60 104 C44 104 23 80 21 58 C19 40 32 22 60 22 Z',
    grenouille: 'M60 44 C88 44 104 56 104 74 C104 92 84 102 60 102 C36 102 16 92 16 74 C16 56 32 44 60 44 Z',
    poilu: bumpy(60, 67, 38, 36, 18, 1.09),
    humain: 'M60 30 C80 30 94 45 94 66 C94 88 79 102 60 102 C41 102 26 88 26 66 C26 45 40 30 60 30 Z'
  };

  /* ---------- les personnages ----------
     c : couleur principale, c2 : claire (museau...), c3 : détail
     eye : {x écart, y, r}, my : bouche, mw : largeur, ny : nez (bouche en « w »), beak : bec */
  const W = (y1, y2) => ({ww: true, ny: y1, my: y2});
  const nose = (y, w, col) => `<path d="M${60 - w} ${y} Q60 ${y - w * .55} ${60 + w} ${y} Q${60 + w * .8} ${f(y + w * .75)} 60 ${f(y + w * .8)} Q${60 - w * .8} ${f(y + w * .75)} ${60 - w} ${y} Z" fill="${col || INK}" ${S2}/><ellipse cx="${f(60 - w * .3)}" cy="${f(y - w * .05)}" rx="${f(w * .3)}" ry="${f(w * .16)}" fill="#fff" opacity=".7"/>`;
  const whiskers = (y) => pair(`<g stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity=".75" fill="none"><path d="M42 ${y} Q32 ${y - 3} 20 ${y - 4}"/><path d="M42 ${y + 4} Q32 ${y + 4} 21 ${y + 6}"/></g>`);
  const SP = {
    renard: {c: '#f07f2a', c2: '#fff4e6', c3: '#3a1d0e', head: 'touffu', iris: '#c8761a', ...W(76, 84), mw: 9,
      back: X => pair(`<path d="M30 50 L25 12 Q36 16 53 35 Z" fill="${X.F}" ${S}/><path d="M33 43 L30 22 Q38 26 46 35 Z" fill="${X.c2}"/><path d="M26.4 22 L25 12 Q30.5 14 35.5 18 Z" fill="${X.c3}"/>`),
      inside: X => `<path d="M10 68 Q34 60 50 72 Q60 66 70 72 Q86 60 110 68 V112 H10 Z" fill="${X.F2}"/><path d="M60 34 Q55 44 60 52 Q65 44 60 34 Z" fill="${X.l}" opacity=".7"/>`,
      nose: X => nose(76, 7)},
    loup: {c: '#8d9db3', c2: '#eef2f7', c3: '#4d5b70', head: 'touffu', iris: '#f2b51c', ...W(76, 85), mw: 9,
      back: X => pair(`<path d="M28 52 L23 8 Q37 16 53 34 Z" fill="${X.F}" ${S}/><path d="M32 44 L28 20 Q37 25 46 35 Z" fill="${X.c3}"/>`),
      inside: X => `<path d="M34 24 L60 52 L86 24 Z" fill="${X.d}" opacity=".55"/><path d="M10 70 Q34 62 50 74 Q60 68 70 74 Q86 62 110 70 V112 H10 Z" fill="${X.F2}"/>` + pair(`<ellipse cx="45" cy="49" rx="5.5" ry="3" fill="${X.c2}"/>`),
      nose: X => nose(76, 9)},
    ours: {c: '#a86a3d', c2: '#ecd0a8', c3: '#6e3f1f', head: 'large', iris: '#5a3518', ...W(77, 88), mw: 9, eye: {x: 15, y: 62, r: 8},
      back: X => pair(`<circle cx="31" cy="40" r="14" fill="${X.F}" ${S}/><circle cx="31.5" cy="40.5" r="7.5" fill="${X.c2}"/>`),
      inside: X => `<ellipse cx="60" cy="84" rx="18" ry="13" fill="${X.F2}" ${S2}/>`,
      nose: X => nose(77, 7.5)},
    panda: {c: '#f7f7f2', c2: '#ffffff', c3: '#2b2b33', head: 'large', iris: '#3a2a20', ...W(77, 88), mw: 9, eye: {x: 15, y: 63, r: 7.5},
      back: X => pair(`<circle cx="30" cy="40" r="14" fill="${X.F3}" ${S}/><circle cx="29" cy="37" r="4" fill="#fff" opacity=".18"/>`),
      inside: X => `<ellipse cx="45" cy="64" rx="11" ry="14" transform="rotate(38 45 64)" fill="${X.F3}"/><ellipse cx="75" cy="64" rx="11" ry="14" transform="rotate(-38 75 64)" fill="${X.F3}"/><ellipse cx="60" cy="84" rx="16" ry="12" fill="${X.F2}" ${S2}/>`,
      nose: X => nose(77, 7)},
    chat: {c: '#f2c27a', c2: '#fff7ea', c3: '#ffa3b8', head: 'large', iris: '#55b84a', ...W(80, 86), mw: 8,
      back: X => pair(`<path d="M27 56 L24 16 Q40 22 51 36 Z" fill="${X.F}" ${S}/><path d="M31 47 L29 25 Q38 29 44 37 Z" fill="${X.c3}"/>`),
      inside: X => `<g fill="none" stroke="${X.d}" stroke-width="4" stroke-linecap="round"><path d="M60 34 V44"/><path d="M52 35 Q53 40 54 43"/><path d="M68 35 Q67 40 66 43"/></g>` + pair(`<g stroke="${X.d}" stroke-width="3.5" stroke-linecap="round"><path d="M19 64 L29 66"/><path d="M19 72 L28 72"/></g>`) + `<circle cx="54" cy="83" r="7.5" fill="${X.F2}"/><circle cx="66" cy="83" r="7.5" fill="${X.F2}"/>`,
      nose: X => `<path d="M55.5 77 H64.5 Q65 78 60 82 Q55 78 55.5 77 Z" fill="${X.c3}" ${S2}/>` + whiskers(83)},
    tigre: {c: '#f7931e', c2: '#fff6e8', c3: '#2a1a12', head: 'touffu', iris: '#b7d63a', ...W(79, 86), mw: 8,
      back: X => pair(`<circle cx="33" cy="38" r="11" fill="${X.F}" ${S}/><circle cx="33.5" cy="38.5" r="5" fill="${X.c2}"/>`),
      inside: X => `<path d="M10 72 Q36 64 52 74 Q60 70 68 74 Q84 64 110 72 V112 H10 Z" fill="${X.F2}"/><g fill="${X.c3}"><path d="M57 29 L60 46 L63 29 Z"/><path d="M45 33 L52 44 L50 31 Z"/><path d="M75 33 L68 44 L70 31 Z"/></g>` + pair(`<g fill="${X.c3}"><path d="M14 56 L34 61 L16 65 Z"/><path d="M14 69 L31 72 L17 77 Z"/></g>`) + `<circle cx="54" cy="83" r="7" fill="${X.c2}"/><circle cx="66" cy="83" r="7" fill="${X.c2}"/>`,
      nose: X => `<path d="M54 76 H66 Q66 79 60 82 Q54 79 54 76 Z" fill="#d0645a" ${S2}/>` + whiskers(84)},
    lion: {c: '#f6c04a', c2: '#fff0cf', c3: '#c8641e', head: 'rond', iris: '#a0661c', ...W(79, 87), mw: 8,
      back: X => `<path d="${bumpy(60, 66, 50, 48, 14, 1.13)}" fill="${X.F3}" ${S}/><path d="${bumpy(60, 66, 43, 41, 14, 1.1)}" fill="${X.c3}" opacity=".0"/>` + pair(`<circle cx="34" cy="37" r="10" fill="${X.F}" ${S}/><circle cx="34.5" cy="37.5" r="5" fill="${X.c2}"/>`),
      inside: X => `<circle cx="54" cy="84" r="8" fill="${X.F2}"/><circle cx="66" cy="84" r="8" fill="${X.F2}"/><path d="M52 36 Q60 32 68 36 Q64 40 60 41 Q56 40 52 36 Z" fill="${X.c3}" opacity=".6"/>`,
      nose: X => `<path d="M53 76 H67 Q67 80 60 83 Q53 80 53 76 Z" fill="#7a3a1a" ${S2}/>` + pair(`<g fill="${INK}" opacity=".6"><circle cx="50" cy="85" r="1.2"/><circle cx="47" cy="88" r="1.2"/><circle cx="51" cy="90" r="1.2"/></g>`)},
    lapin: {c: '#f4f0fa', c2: '#ffffff', c3: '#ff9ec0', head: 'rond', iris: '#7a4fb5', ...W(79, 86), mw: 8, bouche: 'dents',
      back: X => pair(`<g transform="rotate(-12 44 26)"><ellipse cx="44" cy="24" rx="10" ry="23" fill="${X.F}" ${S}/><ellipse cx="44" cy="26" rx="5" ry="16" fill="${X.c3}"/></g>`),
      inside: X => `<circle cx="54.5" cy="83" r="7" fill="${X.F2}"/><circle cx="65.5" cy="83" r="7" fill="${X.F2}"/>`,
      nose: X => `<path d="${heart(60, 78.5, 3.6)}" fill="${X.c3}" ${S2}/>` + whiskers(83)},
    souris: {c: '#a9adb8', c2: '#e9ebf0', c3: '#ffb3c8', head: 'rond', iris: '#3a2a20', ...W(81, 89), mw: 8,
      back: X => pair(`<circle cx="27" cy="38" r="20" fill="${X.F}" ${S}/><circle cx="28" cy="39" r="12.5" fill="${X.c3}"/>`),
      inside: X => `<ellipse cx="60" cy="84" rx="13" ry="10" fill="${X.F2}"/>`,
      nose: X => `<circle cx="60" cy="79" r="4.8" fill="#ff7fa1" ${S2}/><circle cx="58.6" cy="77.6" r="1.4" fill="#fff" opacity=".8"/>` + whiskers(84)},
    chien: {c: '#e7c28f', c2: '#fff4e2', c3: '#8a5a35', head: 'rond', iris: '#6b4220', ...W(77, 87), mw: 9, bouche: 'langue',
      inside: X => `<ellipse cx="77" cy="58" rx="13" ry="11" fill="${X.F3}"/><ellipse cx="60" cy="84" rx="16" ry="12" fill="${X.F2}"/>`,
      over: X => pair(`<path d="M32 38 Q14 38 12 62 Q11 86 25 88 Q35 86 35 64 Q36 48 32 38 Z" fill="${X.F3}" ${S}/>`),
      nose: X => nose(77, 9)},
    cochon: {c: '#ffb3c7', c2: '#ff9ab5', c3: '#d9607f', head: 'rond', iris: '#4a3020', my: 92, mw: 8, visage: 'joues',
      back: X => pair(`<path d="M32 46 L22 18 L50 34 Z" fill="${X.F}" ${S}/><path d="M33 40 L27 25 L43 34 Z" fill="${X.c2}"/>`),
      nose: X => `<ellipse cx="60" cy="79" rx="14" ry="10" fill="${X.F2}" ${S}/><ellipse cx="55" cy="79" rx="2.6" ry="4.2" fill="${X.c3}"/><ellipse cx="65" cy="79" rx="2.6" ry="4.2" fill="${X.c3}"/><ellipse cx="54" cy="74.5" rx="4" ry="1.6" fill="#fff" opacity=".5"/>`},
    singe: {c: '#8a5a3b', c2: '#f2cfa6', c3: '#6e4128', head: 'rond', iris: '#5a3518', ...W(77, 87), mw: 10,
      back: X => pair(`<circle cx="22" cy="66" r="12" fill="${X.F}" ${S}/><circle cx="22.5" cy="66" r="6.5" fill="${X.c2}"/>`),
      inside: X => `<g fill="${X.F2}"><circle cx="47" cy="60" r="14"/><circle cx="73" cy="60" r="14"/><ellipse cx="60" cy="83" rx="22" ry="15"/></g>`,
      top: X => `<path d="M50 33 Q50 20 60 27 Q66 16 72 31 Q62 28 50 33 Z" fill="${X.F}" ${S2}/>`,
      nose: X => `<g fill="${INK}"><ellipse cx="57" cy="75" rx="1.8" ry="2.4"/><ellipse cx="63" cy="75" rx="1.8" ry="2.4"/></g>`},
    koala: {c: '#a7adba', c2: '#eef0f4', c3: '#3c3f4a', head: 'large', iris: '#3a2a20', my: 91, mw: 8, eye: {x: 18, y: 62, r: 7},
      back: X => pair(`<path d="${bumpy(23, 46, 21, 21, 11, 1.08)}" fill="${X.F}" ${S}/><path d="${bumpy(24, 47, 12, 12, 9, 1.12)}" fill="${X.c2}"/>`),
      nose: X => `<ellipse cx="60" cy="75" rx="9.5" ry="12.5" fill="${X.F3}" ${S2}/><ellipse cx="56.5" cy="69" rx="3" ry="4" fill="#fff" opacity=".35"/>`},
    hibou: {c: '#8b5e3c', c2: '#f3e2c4', c3: '#f2a81c', head: 'hibou', iris: '#f7c21c', beak: {y: 70, w: 6, h: 11}, eye: {x: 15, y: 61, r: 10},
      back: X => pair(`<path d="M28 54 L17 16 L46 38 Z" fill="${X.F}" ${S}/>`),
      inside: X => `<circle cx="45" cy="61" r="17" fill="${X.F2}" ${S2}/><circle cx="75" cy="61" r="17" fill="${X.F2}" ${S2}/><g fill="none" stroke="${X.d}" stroke-width="2" stroke-linecap="round"><path d="M44 92 q4 4 8 0 q4 4 8 0 q4 4 8 0 q4 4 8 0"/><path d="M48 99 q4 4 8 0 q4 4 8 0 q4 4 8 0"/><path d="M55 39 l5 4 l5 -4"/></g>`},
    poussin: {c: '#ffd93b', c2: '#fff3a8', c3: '#ff9f1c', head: 'rond', iris: '#3a2a20', beak: {y: 75, w: 7, h: 9}, visage: 'joues',
      top: X => `<g fill="${X.F}" ${S2}><path d="M60 32 Q46 24 45 15 Q57 19 60 32 Z"/><path d="M60 32 Q74 24 75 15 Q63 19 60 32 Z"/><path d="M60 32 Q53 18 60 10 Q66 18 60 32 Z"/></g>`,
      inside: X => `<ellipse cx="60" cy="96" rx="27" ry="14" fill="${X.c2}" opacity=".8"/>`},
    perroquet: {c: '#2fbf71', c2: '#ffffff', c3: '#ffc233', head: 'oeuf', iris: '#3a2a20', beak: {y: 70, w: 9, h: 17, hook: true}, eye: {x: 15, y: 58, r: 8},
      top: X => `<g ${S2}><path d="M60 26 Q48 14 50 4 Q60 12 60 26 Z" fill="#ef3e36"/><path d="M60 26 Q72 12 74 4 Q66 16 60 26 Z" fill="#ff8c1a"/><path d="M60 26 Q56 10 61 0 Q66 12 60 26 Z" fill="#ffcf4a"/></g>`,
      inside: X => `<path d="M10 86 Q60 70 110 86 V112 H10 Z" fill="#ffd23f"/><path d="M10 80 Q60 64 110 80 L110 86 Q60 72 10 86 Z" fill="#3fa9f5" opacity=".85"/><ellipse cx="45" cy="58" rx="12.5" ry="11.5" fill="${X.F2}"/><ellipse cx="75" cy="58" rx="12.5" ry="11.5" fill="${X.F2}"/>`},
    pingouin: {c: '#2f3b52', c2: '#ffffff', c3: '#ff9f1c', head: 'oeuf', iris: '#2b2b33', beak: {y: 72, w: 7, h: 9}, visage: 'joues',
      inside: X => `<path d="M60 52 C53 38 29 41 29 66 C29 90 45 101 60 101 C75 101 91 90 91 66 C91 41 67 38 60 52 Z" fill="${X.F2}"/>`},
    grenouille: {c: '#6cc04a', c2: '#d7f2a6', c3: '#ff7b8f', head: 'grenouille', iris: '#e8b81c', my: 78, mw: 20, eye: {x: 20, y: 45, r: 10}, top0: 30,
      back: X => pair(`<circle cx="40" cy="46" r="15.5" fill="${X.F}" ${S}/>`),
      inside: X => `<ellipse cx="60" cy="98" rx="30" ry="12" fill="${X.F2}"/><g fill="${X.d}" opacity=".45"><circle cx="28" cy="74" r="4"/><circle cx="90" cy="70" r="3"/><circle cx="84" cy="80" r="2.3"/><circle cx="34" cy="83" r="2.2"/></g>`,
      over: X => pair(`<path d="M27 52 A15.5 15.5 0 0 0 53 52" fill="${X.c}"/>`),
      nose: X => `<g fill="${X.d}"><circle cx="55.5" cy="64" r="1.6"/><circle cx="64.5" cy="64" r="1.6"/></g>`},
    dragon: {c: '#3fbf9f', c2: '#c9f2d9', c3: '#ffd166', head: 'large', iris: '#ffcc00', pupil: 'fente', my: 94, mw: 11, eye: {x: 16, y: 60, r: 8.5},
      back: X => pair(`<path d="M36 40 Q22 26 26 6 Q34 22 48 33 Z" fill="${X.F3}" ${S}/><path d="M29 22 L33 24 M28 15 L31 17" stroke="${X.dd3}" stroke-width="1.8" stroke-linecap="round"/><path d="M22 60 L4 50 L14 63 L3 70 L15 72 L8 82 L24 76 Z" fill="${X.l}" ${S}/>`),
      inside: X => `<g fill="none" stroke="${X.d}" stroke-width="2.2" stroke-linecap="round"><path d="M50 44 q5 -5 10 0 q5 -5 10 0"/><path d="M55 50 q5 -5 10 0"/></g>`,
      top: X => `<path d="M53 34 L56 24 L60 33 L64 24 L67 34 Z" fill="${X.F3}" ${S2}/>`,
      nose: X => `<ellipse cx="60" cy="85" rx="22" ry="13.5" fill="${X.F2}" ${S}/><g fill="${INK}"><ellipse cx="53" cy="82" rx="2.2" ry="3" transform="rotate(-20 53 82)"/><ellipse cx="67" cy="82" rx="2.2" ry="3" transform="rotate(20 67 82)"/></g>`},
    licorne: {c: '#fdf6ff', c2: '#ffffff', c3: '#ff9ec0', head: 'rond', iris: '#b05bd6', lashes: true, ...W(80, 87), mw: 8, visage: 'joues',
      back: X => `<path d="M78 34 Q106 40 104 72 Q102 92 92 102 Q96 76 84 56 Z" fill="#c58bff" ${S}/><path d="M84 40 Q112 56 102 88 Q98 70 88 60 Z" fill="#6fb7ff" ${S}/>` + pair(`<path d="M35 44 L31 22 L48 35 Z" fill="${X.F}" ${S}/><path d="M36 39 L34 27 L43 35 Z" fill="${X.c3}"/>`),
      top: X => `<path d="M54 33 L60 3 L66 33 Z" fill="${X.G}" ${S}/><path d="M55.5 26 L64.5 22 M57 18 L63 15 M58.3 11 L61.6 9" stroke="#c98a0c" stroke-width="2" stroke-linecap="round"/><path d="M46 36 Q56 22 72 30 Q66 44 50 50 Q54 42 46 36 Z" fill="#ff7eb6" ${S2}/><path d="M64 31 Q76 26 84 38 Q74 42 66 46 Q70 38 64 31 Z" fill="#c58bff" ${S2}/>`,
      nose: X => `<g fill="${X.c3}"><ellipse cx="56" cy="79" rx="1.5" ry="2"/><ellipse cx="64" cy="79" rx="1.5" ry="2"/></g>`},
    monstre: {c: '#9b5de5', c2: '#c7a6ff', c3: '#ffe08a', head: 'poilu', iris: '#3fbf5f', my: 86, mw: 12,
      back: X => pair(`<path d="M40 38 Q32 22 40 12 Q43 26 51 33 Z" fill="${X.F3}" ${S}/>`),
      inside: X => `<ellipse cx="60" cy="98" rx="26" ry="13" fill="${X.c2}" opacity=".7"/><g fill="${X.c2}" opacity=".7"><circle cx="34" cy="80" r="4"/><circle cx="86" cy="54" r="3.5"/><circle cx="90" cy="76" r="2.5"/><circle cx="30" cy="52" r="2.5"/></g>`},
    blob: {c: '#7ad36b', c2: '#c6f7b8', c3: '#3fa35a', head: 'blob', iris: '#3a2a20', my: 86, mw: 11, top0: 28,
      inside: X => `<ellipse cx="44" cy="44" rx="6" ry="11" transform="rotate(30 44 44)" fill="#fff" opacity=".55"/><circle cx="50" cy="33" r="2.5" fill="#fff" opacity=".6"/><g fill="${X.c3}" opacity=".35"><circle cx="82" cy="60" r="5"/><circle cx="34" cy="86" r="3.5"/><circle cx="80" cy="88" r="2.5"/></g>`},
    robot: {c: '#a9c2d6', c2: '#e3eef6', c3: '#ef3e36', head: 'carre', iris: '#33a1ff', my: 88, mw: 10,
      back: X => pair(`<rect x="12" y="54" width="13" height="24" rx="4" fill="${X.F2}" ${S}/><path d="M15 60 H22 M15 66 H22 M15 72 H22" stroke="${X.d}" stroke-width="2" stroke-linecap="round"/>`) + `<path d="M60 30 V14" stroke="${INK}" stroke-width="3"/><circle cx="60" cy="11" r="6.5" fill="${X.F3}" ${S2}/><circle cx="58" cy="9" r="2" fill="#fff" opacity=".8"/>`,
      inside: X => `<rect x="30" y="44" width="60" height="40" rx="9" fill="${X.F2}" opacity=".85"/><g fill="${X.d}"><circle cx="30" cy="37" r="2.2"/><circle cx="90" cy="37" r="2.2"/><circle cx="30" cy="95" r="2.2"/><circle cx="90" cy="95" r="2.2"/></g><path d="M40 95 H80" stroke="${X.d}" stroke-width="2" stroke-linecap="round"/>`},
    fantome: {c: '#f4f7ff', c2: '#ffffff', c3: '#b6c4ff', head: 'fantome', iris: '#4a5aa0', my: 82, mw: 9, visage: 'joues', top0: 24,
      inside: X => `<path d="M24 80 Q60 92 96 80 V112 H24 Z" fill="${X.c3}" opacity=".35"/>`},
    alien: {c: '#b49cff', c2: '#e4dbff', c3: '#7cf0c5', head: 'alien', iris: '#1fbf8f', my: 86, mw: 8, eye: {x: 16, y: 60, r: 10}, top0: 24,
      back: X => pair(`<path d="M46 26 Q40 14 34 8" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="33" cy="7" r="5.5" fill="${X.F3}" ${S2}/>`),
      inside: X => `<g fill="${X.d}" opacity=".35"><circle cx="60" cy="34" r="3"/><circle cx="51" cy="38" r="2"/><circle cx="69" cy="38" r="2"/></g>`},
    enfant: {c: '#f1c7a5', c2: '#ffffff', c3: '#e3a07c', head: 'humain', human: true, iris: '#6b4a2b', my: 86, mw: 9, eye: {x: 13, y: 64, r: 7.3}, top0: 26,
      back: X => pair(`<ellipse cx="27" cy="68" rx="6.5" ry="8" fill="${X.F}" ${S}/>`),
      nose: X => `<path d="M57 77 Q60 80 63 77" fill="none" stroke="${X.dd}" stroke-width="2.4" stroke-linecap="round"/>`},
    elfe: {c: '#cdeccb', c2: '#ffffff', c3: '#9ccc98', head: 'humain', human: true, iris: '#22b8a7', lashes: true, my: 86, mw: 9, eye: {x: 13, y: 64, r: 7.5}, top0: 26,
      back: X => pair(`<path d="M30 62 L4 44 Q12 60 30 76 Z" fill="${X.F}" ${S}/><path d="M26 63 L12 52 Q17 61 27 69 Z" fill="${X.d}" opacity=".25"/>`),
      nose: X => `<path d="M57 77 Q60 80 63 77" fill="none" stroke="${X.dd}" stroke-width="2.4" stroke-linecap="round"/>`}
  };

  /* ---------- cheveux (enfant, elfe) ---------- */
  function hair(a, X) {
    const H = X.H; let b = '', fr = '';
    const shine = `<path d="M40 33 Q50 27 62 28" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".4"/>`;
    const fringe = `<path d="M24 64 C21 34 39 23 60 23 C82 23 99 34 96 64 C91 50 80 42 66 40 C58 46 44 48 34 46 C30 50 26 56 24 64 Z" fill="${H}" ${S}/>`;
    switch (a.cheveux) {
      case 'courts': fr = `<path d="M24 66 C20 34 38 22 60 22 C82 22 100 34 96 66 C94 55 90 49 85 46 C80 51 74 51 70 45 C64 51 53 51 49 45 C43 51 37 51 33 48 C29 53 26 59 24 66 Z" fill="${H}" ${S}/>` + shine; break;
      case 'longs': b = `<path d="M25 64 C20 30 40 22 60 22 C80 22 100 30 95 64 L100 104 Q92 113 83 103 Q79 97 76 97 L44 97 Q41 97 37 103 Q28 113 20 104 Z" fill="${H}" ${S}/>`; fr = fringe + shine; break;
      case 'couettes': b = pair(`<ellipse cx="15" cy="74" rx="11" ry="18" transform="rotate(14 15 74)" fill="${H}" ${S}/><circle cx="25" cy="60" r="4.5" fill="${X.T}" ${S2}/>`); fr = fringe + shine; break;
      case 'boucles': fr = `<g fill="${H}" ${S}>${[[28, 62], [27, 48], [34, 36], [45, 28], [58, 25], [71, 27], [83, 33], [92, 45], [93, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10.5"/>`).join('')}</g><path d="M34 44 Q60 32 86 44 Q60 40 34 44 Z" fill="${H}"/>` + `<g fill="#fff" opacity=".35"><circle cx="43" cy="25" r="2.5"/><circle cx="56" cy="22" r="2.5"/><circle cx="69" cy="24" r="2.5"/></g>`; break;
      case 'chignon': b = `<circle cx="60" cy="19" r="13" fill="${H}" ${S}/><path d="M50 15 Q60 10 70 15" fill="none" stroke="#fff" stroke-width="2.4" opacity=".4" stroke-linecap="round"/>`; fr = `<path d="M25 63 C22 34 40 26 60 26 C80 26 98 34 95 63 C88 46 76 40 60 40 C44 40 32 46 25 63 Z" fill="${H}" ${S}/><path d="M50 27 Q60 32 70 27" fill="none" stroke="${X.T}" stroke-width="4" stroke-linecap="round"/>` + shine; break;
      case 'crete': fr = `<path d="M47 36 L49 10 L55 24 L60 4 L65 24 L71 10 L73 36 Q60 32 47 36 Z" fill="${H}" ${S}/>`; break;
    }
    return {b, fr};
  }

  /* ---------- yeux ---------- */
  function oneEye(cx, y, r, X, sp, kind) {
    const ri = r * .64, ix = cx + r * .06, iy = y + r * .12;
    let s = `<ellipse cx="${f(cx)}" cy="${f(y)}" rx="${f(r * .9)}" ry="${f(r)}" fill="url(#${X.id}w)" ${S2}/>`;
    if (kind === 'etoiles') s += `<path d="${star5(ix, iy, ri * 1.15)}" fill="url(#${X.id}gd)" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>`;
    else if (kind === 'coeurs') s += `<path d="${heart(ix, iy - ri * .1, ri * .95)}" fill="#ff4f7b" stroke="${INK}" stroke-width="1.4"/>`;
    else {
      s += `<circle cx="${f(ix)}" cy="${f(iy)}" r="${f(ri)}" fill="url(#${X.id}i)"/>`;
      s += sp.pupil === 'fente' ? `<ellipse cx="${f(ix)}" cy="${f(iy)}" rx="${f(ri * .24)}" ry="${f(ri * .82)}" fill="${INK}"/>` : `<circle cx="${f(ix)}" cy="${f(iy)}" r="${f(ri * .5)}" fill="${INK}"/>`;
    }
    s += `<circle cx="${f(ix + ri * .38)}" cy="${f(iy - ri * .4)}" r="${f(ri * .34)}" fill="#fff"/><circle cx="${f(ix - ri * .38)}" cy="${f(iy + ri * .42)}" r="${f(ri * .15)}" fill="#fff" opacity=".9"/>`;
    if (kind === 'brillants') s += `<circle cx="${f(ix - ri * .1)}" cy="${f(iy - ri * .55)}" r="${f(ri * .12)}" fill="#fff"/>`;
    return s;
  }
  function eyes(a, X, sp) {
    const e = sp.eye || {x: 14, y: 60, r: 8.5}, L = 60 - e.x, R = 60 + e.x, y = e.y;
    let r = e.r; const k = a.yeux;
    if (k === 'brillants') r *= 1.18;
    const arc = (cx, up) => `<path d="M${f(cx - r * .9)} ${f(y + 2)} Q${cx} ${f(y + (up ? -r * 1.2 : r * .9))} ${f(cx + r * .9)} ${f(y + 2)}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`;
    let s = '';
    if (k === 'joyeux') s = arc(L, true) + arc(R, true);
    else if (k === 'clin') s = oneEye(L, y, r, X, sp, k) + `<path d="M${f(R - r * .9)} ${y} Q${R} ${f(y - r * .5)} ${f(R + r * .9)} ${y}" fill="none" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/><path d="M${f(R - r * .6)} ${f(y + 3)} L${f(R + r * .6)} ${f(y - 3)}" stroke="${INK}" stroke-width="0" />`;
    else if (k === 'cyclope') { const R2 = r * 1.65, cy = y - 1; s = oneEye(60, cy, R2, X, sp, 'brillants'); }
    else {
      s = oneEye(L, y, r, X, sp, k) + oneEye(R, y, r, X, sp, k);
      if (k === 'coquins') {
        const lid = cx => `<path d="M${f(cx - r * .92)} ${f(y - r * .05)} A${f(r * .9)} ${f(r)} 0 0 1 ${f(cx + r * .92)} ${f(y - r * .05)} Z" fill="${X.lidc}" ${S2}/>`;
        s += lid(L) + lid(R) + `<path d="M${f(L - r)} ${f(y - r * 1.5)} L${f(L + r * .9)} ${f(y - r * 1.05)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${f(R + r)} ${f(y - r * 1.5)} L${f(R - r * .9)} ${f(y - r * 1.05)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      }
    }
    if (sp.lashes && k !== 'cyclope') {
      const lash = cx => `<path d="M${f(cx + r * .75)} ${f(y - r * .6)} l4 -3 M${f(cx + r * .9)} ${f(y - r * .1)} l4.5 -1" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
      s += lash(R) + mir(lash(R));
    }
    return s;
  }

  /* ---------- bouche / bec ---------- */
  function mouth(a, X, sp) {
    const k = a.bouche, my = sp.my || 86, w = sp.mw || 9;
    if (sp.beak) return beak(sp.beak, X, ['rire', 'o', 'langue'].includes(k), k === 'langue');
    let pre = '';
    if (sp.ww) pre = `<path d="M60 ${f(sp.ny + 5)} V${my}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
    const smile = sp.ww ? `<path d="M${60 - w} ${my - 1} Q${f(60 - w / 2)} ${my + 6} 60 ${my} Q${f(60 + w / 2)} ${my + 6} ${60 + w} ${my - 1}" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`
      : `<path d="M${60 - w} ${my} Q60 ${f(my + w * 1.05)} ${60 + w} ${my}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${60 - w - 1.5} ${my - 1.5} Q${60 - w} ${my} ${60 - w + .5} ${my + 1.5}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><path d="M${60 + w + 1.5} ${my - 1.5} Q${60 + w} ${my} ${60 + w - .5} ${my + 1.5}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
    const id = X.id;
    switch (k) {
      case 'rire': {
        const W2 = w + 2, H = Math.max(12, w * .9);
        return pre + `<clipPath id="${id}m"><path d="M${60 - W2} ${my - 1} Q60 ${my + 2} ${60 + W2} ${my - 1} Q${60 + W2 - 1} ${f(my + H)} 60 ${f(my + H)} Q${60 - W2 + 1} ${f(my + H)} ${60 - W2} ${my - 1} Z"/></clipPath>` +
          `<path d="M${60 - W2} ${my - 1} Q60 ${my + 2} ${60 + W2} ${my - 1} Q${60 + W2 - 1} ${f(my + H)} 60 ${f(my + H)} Q${60 - W2 + 1} ${f(my + H)} ${60 - W2} ${my - 1} Z" fill="#6b1f2a"/>` +
          `<g clip-path="url(#${id}m)"><ellipse cx="60" cy="${f(my + H)}" rx="${f(W2 * .7)}" ry="${f(H * .45)}" fill="#ff7b8f"/><rect x="${60 - W2}" y="${my - 2}" width="${W2 * 2}" height="4.5" fill="#fff"/></g>` +
          `<path d="M${60 - W2} ${my - 1} Q60 ${my + 2} ${60 + W2} ${my - 1} Q${60 + W2 - 1} ${f(my + H)} 60 ${f(my + H)} Q${60 - W2 + 1} ${f(my + H)} ${60 - W2} ${my - 1} Z" fill="none" ${S}/>`;
      }
      case 'langue': return pre + `<path d="M${f(60 - w * .55)} ${my + 3} Q${f(60 - w * .6)} ${my + 14} 60 ${my + 14} Q${f(60 + w * .6)} ${my + 14} ${f(60 + w * .55)} ${my + 3} Z" fill="#ff7b8f" ${S2}/><path d="M60 ${my + 5} V${my + 10}" stroke="#d9476a" stroke-width="1.8" stroke-linecap="round"/>` + smile;
      case 'dents': return pre + `<path d="M55 ${my + 1} H65 V${my + 8} Q65 ${my + 10} 63 ${my + 10} H57 Q55 ${my + 10} 55 ${my + 8} Z" fill="#fff" ${S2}/><path d="M60 ${my + 1.5} V${my + 9.5}" stroke="${INK}" stroke-width="1.6"/>` + smile;
      case 'crocs': return pre + `<path d="M${60 - w - 1} ${my - 1} Q60 ${f(my + w * 1.4)} ${60 + w + 1} ${my - 1} Q60 ${my + 4} ${60 - w - 1} ${my - 1} Z" fill="#6b1f2a" ${S2}/><path d="M${f(60 - w * .62)} ${my + 1.3} l2.4 7.5 l2.6 -6.6 Z" fill="#fff" ${S2}/><path d="M${f(60 + w * .62)} ${my + 1.3} l-2.4 7.5 l-2.6 -6.6 Z" fill="#fff" ${S2}/>`;
      case 'o': return pre + `<ellipse cx="60" cy="${my + 4}" rx="5.5" ry="7" fill="#6b1f2a" ${S2}/><ellipse cx="60" cy="${my + 8}" rx="3.2" ry="2.2" fill="#ff7b8f"/>`;
      case 'moustache': return `<path d="M60 ${my - 5} Q51 ${my - 11} 41 ${my - 3} Q42 ${my + 1} 46 ${my - 1} Q53 ${my - 4} 60 ${my - 1} Q67 ${my - 4} 74 ${my - 1} Q78 ${my + 1} 79 ${my - 3} Q69 ${my - 11} 60 ${my - 5} Z" fill="url(#${id}h)" ${S2}/><path d="M54 ${my + 5} Q60 ${my + 9} 66 ${my + 5}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
      default: return pre + smile;
    }
  }
  function beak(b, X, open, tongue) {
    const y = b.y, w = b.w, h = b.h, F = `url(#${X.id}k)`;
    if (b.hook) {
      const up = `<path d="M${60 - w} ${y} Q60 ${y - 6} ${60 + w} ${y} Q${60 + w + 1} ${y + h * .8} 60 ${y + h} Q${60 + 1} ${f(y + h * .6)} ${f(60 - w * .5)} ${f(y + h * .45)} Q${60 - w} ${f(y + h * .3)} ${60 - w} ${y} Z" fill="${F}" ${S2}/>`;
      const lo = open ? `<path d="M${f(60 - w * .7)} ${f(y + h * .55)} Q60 ${f(y + h * .95)} ${f(60 + w * .3)} ${f(y + h * .75)} Q60 ${f(y + h * 1.25)} ${f(60 - w * .7)} ${f(y + h * .55)} Z" fill="#6b1f2a" ${S2}/>` : `<path d="M${f(60 - w * .55)} ${f(y + h * .5)} Q${60 - 2} ${f(y + h * .9)} ${f(60 + w * .1)} ${f(y + h * .8)}" fill="none" ${S2}/>`;
      return lo + up + `<ellipse cx="${60 - 3}" cy="${y + 1}" rx="2" ry="1.3" fill="${INK}"/><ellipse cx="${60 - w * .4}" cy="${y - 1}" rx="${w * .3}" ry="1.2" fill="#fff" opacity=".6"/>`;
    }
    if (!open) return `<path d="M${60 - w} ${y} Q60 ${y - 4} ${60 + w} ${y} Q${f(60 + w * .4)} ${f(y + h * .7)} 60 ${y + h} Q${f(60 - w * .4)} ${f(y + h * .7)} ${60 - w} ${y} Z" fill="${F}" ${S2}/><path d="M${f(60 - w * .75)} ${y + 1} Q60 ${f(y + h * .45)} ${f(60 + w * .75)} ${y + 1}" fill="none" stroke="${X.dd3}" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="${f(60 - w * .35)}" cy="${y - .5}" rx="${f(w * .3)}" ry="1.1" fill="#fff" opacity=".6"/>`;
    return `<path d="M${60 - w} ${y + 2} Q60 ${y + h * 1.7} ${60 + w} ${y + 2} Z" fill="#6b1f2a" ${S2}/>` + (tongue ? `<ellipse cx="60" cy="${f(y + h * .9)}" rx="${f(w * .45)}" ry="${f(h * .35)}" fill="#ff7b8f"/>` : '') +
      `<path d="M${60 - w} ${y + 2} Q60 ${y + h * 1.7} ${60 + w} ${y + 2} Q60 ${y + h * 1.25} ${60 - w} ${y + 2} Z" fill="${F}" ${S2}/>` +
      `<path d="M${60 - w} ${y} Q60 ${y - 4} ${60 + w} ${y} Q${f(60 + w * .4)} ${f(y + h * .45)} 60 ${f(y + h * .6)} Q${f(60 - w * .4)} ${f(y + h * .45)} ${60 - w} ${y} Z" fill="${F}" ${S2}/>`;
  }

  /* ---------- visage, dessus, dos ---------- */
  function faceExtra(k, X, sp, phase) {
    const e = sp.eye || {x: 14, y: 60, r: 8.5}, L = 60 - e.x, R = 60 + e.x, y = e.y, r = e.r;
    if (phase === 'under') {
      if (k === 'joues') return pair(`<ellipse cx="${L - 6}" cy="${y + r + 6}" rx="8" ry="5.5" fill="url(#${X.id}b)"/>`);
      if (k === 'taches') return pair(`<g fill="${X.dd}" opacity=".6">${[[-6, 6], [-1, 9], [-8, 11], [-3, 13]].map(([dx, dy]) => `<circle cx="${L + dx}" cy="${y + r + dy - 4}" r="1.5"/>`).join('')}</g>`);
      if (k === 'masque') { const m = r + 7; return `<path d="M${L - m} ${f(y - r * .6)} Q60 ${f(y - r * 1.6)} ${R + m} ${f(y - r * .6)} Q${R + m + 3} ${y + r + 2} ${R} ${y + r + 4} Q66 ${y + r + 3} 60 ${y + 3} Q54 ${y + r + 3} ${L} ${y + r + 4} Q${L - m - 3} ${y + r + 2} ${L - m} ${f(y - r * .6)} Z" fill="url(#${X.id}t)" ${S}/><path d="M${L - m + 5} ${f(y - r * .8)} Q60 ${f(y - r * 1.4)} ${R + m - 5} ${f(y - r * .8)}" fill="none" stroke="#fff" stroke-width="2" opacity=".45" stroke-linecap="round"/>`; }
      return '';
    }
    if (k === 'lunettes') { const g = r + 4.5; return `<g fill="#fff" fill-opacity=".22" stroke="${X.t}" stroke-width="3.6">${[L, R].map(cx => `<circle cx="${cx}" cy="${y}" r="${g}"/>`).join('')}</g><g fill="none" stroke="${INK}" stroke-width="1.4" opacity=".7">${[L, R].map(cx => `<circle cx="${cx}" cy="${y}" r="${g + 2}"/>`).join('')}</g><path d="M${L + g} ${y - 1} Q60 ${y - 5} ${R - g} ${y - 1}" fill="none" stroke="${X.t}" stroke-width="3.2"/><path d="M${L - 4} ${y - 5} l4 -3" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>`; }
    if (k === 'soleil') { const g = r + 6; const lens = cx => `<path d="M${cx - g} ${y - g * .6} H${cx + g} Q${cx + g} ${y + g * .9} ${cx} ${y + g * .85} Q${cx - g} ${y + g * .9} ${cx - g} ${y - g * .6} Z" fill="url(#${X.id}s)" ${S2}/><path d="M${cx - g * .6} ${y - g * .25} l${g * .5} ${g * .5}" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>`; return lens(L) + lens(R) + `<path d="M${L + g} ${f(y - g * .5)} Q60 ${f(y - g * .9)} ${R - g} ${f(y - g * .5)}" fill="none" stroke="${INK}" stroke-width="3"/><path d="M${L - g} ${f(y - g * .55)} L${L - g - 7} ${f(y - g * .75)} M${R + g} ${f(y - g * .55)} L${R + g + 7} ${f(y - g * .75)}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`; }
    return '';
  }
  function topItem(k, X) {
    const t = X.T, td = X.td, G = X.G;
    switch (k) {
      case 'couronne': return `<path d="M37 38 L34 14 L47 26 L60 7 L73 26 L86 14 L83 38 Z" fill="${G}" ${S}/><path d="M37 34 Q60 38 83 34" fill="none" stroke="#c98a0c" stroke-width="2.4"/><g fill="${G}" ${S2}><circle cx="34" cy="12" r="3.6"/><circle cx="60" cy="6" r="3.8"/><circle cx="86" cy="12" r="3.6"/></g><ellipse cx="60" cy="26" rx="4.5" ry="5.5" fill="${t}" ${S2}/><circle cx="47" cy="31" r="2.6" fill="${t}"/><circle cx="73" cy="31" r="2.6" fill="${t}"/><path d="M41 30 L40 20" stroke="#fff" stroke-width="2" opacity=".55" stroke-linecap="round"/>`;
      case 'diademe': return `<path d="M33 40 Q60 24 87 40" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/><path d="M33 40 Q60 24 87 40" fill="none" stroke="#ffd34d" stroke-width="4" stroke-linecap="round"/><path d="M60 14 L68 25 L60 35 L52 25 Z" fill="${t}" ${S2}/><path d="M60 17 L64 25 L60 25 Z" fill="#fff" opacity=".6"/><g fill="#fff" ${S2} stroke-width="1.6"><circle cx="45" cy="31" r="3"/><circle cx="75" cy="31" r="3"/></g>`;
      case 'chapeau': return `<ellipse cx="60" cy="38" rx="33" ry="7.5" fill="${td}" ${S}/><path d="M41 37 Q47 16 72 -2 Q70 18 79 37 Z" fill="${t}" ${S}/><path d="M42 33 Q60 38 78 33 L79 37 Q60 42 41 37 Z" fill="${G}" ${S2}/><path d="${star5(58, 22, 4)}" fill="${G}"/><path d="${star5(68, 12, 2.6)}" fill="${G}"/><circle cx="50" cy="28" r="1.4" fill="#fff"/>`;
      case 'casquette': return `<path d="M26 46 Q26 16 60 16 Q94 16 94 46 Z" fill="${t}" ${S}/><path d="M60 16 V46 M43 19 Q38 30 38 46 M77 19 Q82 30 82 46" fill="none" stroke="${td}" stroke-width="2"/><path d="M30 45 Q60 37 90 45 Q93 53 84 53 Q60 47 36 53 Q27 53 30 45 Z" fill="${td}" ${S}/><circle cx="60" cy="16" r="3.2" fill="${td}" ${S2}/><path d="M34 34 Q38 24 48 20" fill="none" stroke="#fff" stroke-width="2.4" opacity=".4" stroke-linecap="round"/>`;
      case 'bonnet': return `<path d="M29 44 Q27 14 60 14 Q93 14 91 44 Z" fill="${t}" ${S}/><g stroke="${td}" stroke-width="2" fill="none"><path d="M45 18 Q42 30 42 42"/><path d="M60 15 V42"/><path d="M75 18 Q78 30 78 42"/></g><rect x="24" y="38" width="72" height="13" rx="6.5" fill="${X.tl}" ${S}/><g stroke="${t}" stroke-width="2" opacity=".55">${[32, 40, 48, 56, 64, 72, 80, 88].map(x => `<path d="M${x} 41 V48"/>`).join('')}</g><path d="${bumpy(60, 12, 9, 9, 10, 1.15)}" fill="#fff" ${S2}/>`;
      case 'noeud': return `<g transform="rotate(-14 82 30)"><path d="M82 30 L64 19 Q59 30 64 41 Z" fill="${t}" ${S2}/><path d="M82 30 L100 19 Q105 30 100 41 Z" fill="${t}" ${S2}/><g fill="#fff" opacity=".75"><circle cx="68" cy="26" r="1.7"/><circle cx="67" cy="35" r="1.7"/><circle cx="96" cy="26" r="1.7"/><circle cx="97" cy="35" r="1.7"/></g><ellipse cx="82" cy="30" rx="5" ry="6" fill="${td}" ${S2}/></g>`;
      case 'fleurs': return `<path d="M30 40 Q60 26 90 40" fill="none" stroke="#3fae4f" stroke-width="3.5" stroke-linecap="round"/><g fill="#5cc96b" ${S2} stroke-width="1.5"><path d="M41 34 q-5 -6 -11 -3 q5 6 11 3 Z"/><path d="M79 34 q5 -6 11 -3 q-5 6 -11 3 Z"/></g>` +
        [[34, 39, '#ff9ecb'], [47, 31, '#ffcf4a'], [60, 28, t], [73, 31, '#ff9ecb'], [86, 39, '#ffcf4a']].map(([x, y, c]) => `<g ${S2} stroke-width="1.6" fill="${c}">${[0, 72, 144, 216, 288].map(an => `<ellipse cx="${x}" cy="${y - 3.6}" rx="2.9" ry="4" transform="rotate(${an} ${x} ${y})"/>`).join('')}</g><circle cx="${x}" cy="${y}" r="2.3" fill="#fff4d6" stroke="${INK}" stroke-width="1.2"/>`).join('');
      case 'aureole': return `<ellipse cx="60" cy="14" rx="23" ry="6.5" fill="none" stroke="${INK}" stroke-width="8"/><ellipse cx="60" cy="14" rx="23" ry="6.5" fill="none" stroke="#ffd34d" stroke-width="4.5"/><path d="M44 11 Q52 8.5 60 8.5" fill="none" stroke="#fff" stroke-width="1.8" opacity=".8" stroke-linecap="round"/>`;
      case 'cornes': return pair(`<path d="M38 40 Q24 30 28 10 Q36 26 48 33 Z" fill="url(#${X.id}hn)" ${S}/><path d="M29 22 L34 23 M28 16 L32 17" stroke="#c9b48a" stroke-width="1.8" stroke-linecap="round"/>`);
      case 'antennes': return pair(`<path d="M48 33 Q42 18 34 11" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="33" cy="10" r="6" fill="${t}" ${S2}/><circle cx="31" cy="8" r="1.8" fill="#fff" opacity=".8"/>`);
    }
    return '';
  }
  function backItem(k, X) {
    const t = X.T;
    if (k === 'badge') return `<circle cx="60" cy="62" r="57" fill="url(#${X.id}bg)"/><circle cx="60" cy="62" r="57" fill="none" stroke="${X.t}" stroke-width="2" opacity=".5"/>`;
    if (k === 'cape') return `<path d="M12 120 Q16 84 60 84 Q104 84 108 120 Z" fill="${t}" ${S}/><path d="M24 120 Q30 98 60 98 Q90 98 96 120 Z" fill="${X.td}" opacity=".8"/><path d="M26 90 L14 80 L38 88 Z M94 90 L106 80 L82 88 Z" fill="${t}" ${S2}/>`;
    if (k === 'ailes') return pair(`<path d="M36 64 C10 26 -2 52 6 72 C12 84 28 80 36 70 Z" fill="url(#${X.id}a)" ${S2}/><path d="M36 76 C14 84 12 102 24 103 C33 104 37 90 38 80 Z" fill="url(#${X.id}a)" ${S2}/><path d="M33 66 Q20 52 12 50 M33 70 Q20 68 10 70 M35 80 Q26 88 22 96" fill="none" stroke="#fff" stroke-width="1.6" opacity=".9" stroke-linecap="round"/>`);
    if (k === 'etincelles') return `<g fill="url(#${X.id}gd)" ${S2} stroke-width="1.6">${[[13, 28, 9], [106, 22, 8], [10, 92, 7], [110, 86, 9], [100, 52, 5]].map(([x, y, r]) => `<path d="${star(x, y, r)}"/>`).join('')}</g><g fill="#fff"><circle cx="22" cy="48" r="1.6"/><circle cx="98" cy="104" r="1.6"/><circle cx="18" cy="108" r="1.2"/></g>`;
    return '';
  }

  /* ---------- dessin complet ---------- */
  let uid = 0;
  function svg(a0, opts) {
    const a = clean(a0); const sp = SP[a.perso] || SP.renard; const id = 'cpa' + (++uid);
    const c = a.peau === 'naturel' ? sp.c : a.peau;
    const t = a.teinte, hc = a.cheveuxCouleur;
    const X = {id, c, c2: sp.c2, c3: sp.c3, t, F: `url(#${id}c)`, F2: `url(#${id}c2)`, F3: `url(#${id}c3)`, T: `url(#${id}t)`, H: `url(#${id}h)`, G: `url(#${id}g)`,
      l: lighter(c, .35), d: darker(c, .22), dd: darker(c, .4), dd3: darker(sp.c3, .3), td: darker(t, .28), tl: lighter(t, .45), lidc: c};
    if (lum(c) > .9) X.d = darker(c, .14);
    const rad = (gid, col, hl, sh) => `<radialGradient id="${id}${gid}" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="${lighter(col, hl)}"/><stop offset=".55" stop-color="${col}"/><stop offset="1" stop-color="${darker(col, sh)}"/></radialGradient>`;
    const lin = (gid, a1, a2) => `<linearGradient id="${id}${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a1}"/><stop offset="1" stop-color="${a2}"/></linearGradient>`;
    const headD = HEAD[sp.head];
    const defs = `<defs>${rad('c', c, .38, .2)}${rad('c2', sp.c2, .5, .08)}${rad('c3', sp.c3, .35, .25)}${rad('t', t, .35, .25)}${rad('h', hc, .3, .3)}${rad('k', sp.c3, .45, .2)}` +
      lin('g', '#fff2a8', '#f0a90c') + lin('gd', '#fff6c2', '#ffc21a') + lin('w', '#ffffff', '#dfe6f2') + lin('hn', '#fffaf0', '#e8d6aa') + lin('s', '#4a4a5a', darker(t, .55)) +
      lin('a', 'rgba(255,255,255,.95)', lighter(t, .55)) +
      `<radialGradient id="${id}i" cx="45%" cy="35%" r="65%"><stop offset="0" stop-color="${lighter(sp.iris, .45)}"/><stop offset=".7" stop-color="${sp.iris}"/><stop offset="1" stop-color="${darker(sp.iris, .45)}"/></radialGradient>` +
      `<radialGradient id="${id}b"><stop offset="0" stop-color="#ff6f91" stop-opacity=".75"/><stop offset="1" stop-color="#ff6f91" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="${id}bg" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="${lighter(t, .75)}"/><stop offset="1" stop-color="${lighter(t, .35)}"/></radialGradient>` +
      `<clipPath id="${id}hc"><path d="${headD}"/></clipPath></defs>`;
    const top0 = sp.top0 || (sp.head === 'oeuf' ? 26 : 32);
    const hr = sp.human ? hair(a, X) : {b: '', fr: ''};
    const faceK = a.visage;
    let out = defs;
    out += backItem(a.dos === 'badge' ? 'badge' : '', X);
    out += backItem(a.dos !== 'badge' ? a.dos : '', X);
    out += hr.b;
    out += sp.back ? sp.back(X) : '';
    out += `<path d="${headD}" fill="${X.F}"/>`;
    out += `<g clip-path="url(#${id}hc)">${sp.inside ? sp.inside(X) : ''}<ellipse cx="60" cy="118" rx="52" ry="22" fill="#000" opacity=".09"/><ellipse cx="42" cy="${top0 + 16}" rx="11" ry="6" transform="rotate(-28 42 ${top0 + 16})" fill="#fff" opacity=".3"/></g>`;
    out += `<path d="${headD}" fill="none" ${S}/>`;
    out += sp.over ? sp.over(X) : '';
    out += sp.top ? sp.top(X) : '';
    out += hr.fr;
    out += faceExtra(faceK, X, sp, 'under');
    if (sp.human) X.lidc = c;
    out += eyes(a, X, sp);
    out += sp.nose ? sp.nose(X) : '';
    out += mouth(a, X, sp);
    out += faceExtra(faceK, X, sp, 'over');
    const dy = (sp.human ? 26 : top0) - 32;
    const ti = topItem(a.dessus, X);
    out += ti ? (dy ? `<g transform="translate(0 ${dy})">${ti}</g>` : ti) : '';
    const cls = opts && opts.cls ? ` class="${opts.cls}"` : '';
    return `<svg viewBox="0 0 120 120"${cls} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${out}</svg>`;
  }
  const mainColor = a0 => { const a = clean(a0); return a.peau === 'naturel' ? (SP[a.perso] || SP.renard).c : a.peau; };
  window.CPAvatar = {OPT, LABELS, STYLES, cats, clean, random, svg, mainColor, isHuman: a => isHuman(clean(a))};
})();
