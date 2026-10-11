/* =====================================================================
   Classe Party - AVATARS DANS LE JEU (version 1.11)
   Avec ou sans tablettes : chaque joueur peut avoir un avatar, créé au
   tableau (clic sur sa pastille) ou sur sa tablette. Affiché sur les pions,
   le classement, la plaque du tour et le podium animé.
   Les avatars sont retenus par prénom sur cet ordinateur.
   © 2026 Jérôme Manderlier - Licence CC BY-NC-ND 4.0
   ===================================================================== */
(function () {
  'use strict';
  if (window.CPAV) return;
  const on = () => (typeof avatarsOn === 'function') ? avatarsOn() : (typeof TEST111 !== 'undefined' && TEST111 === true);
  const KEY = 'classeparty-avatars';
  const CPAV = window.CPAV = {listeners: []};
  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { store = {}; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };
  const norm = n => String(n || '').trim().toLowerCase();

  const css = `
  .lab-av{display:inline-block;width:26px;height:26px;flex:none}
  .lab-av svg{display:block;width:100%;height:100%}
  .side-av{width:30px;height:30px}
  .plate-av{width:max(36px,5cqw);height:max(36px,5cqw)}
  .score.many .side-av{width:24px;height:24px}
  .av-click{cursor:pointer}
  .av-click:hover{filter:brightness(1.08);transform:scale(1.08)}
  .tk.has-av{font-size:0;padding:0;overflow:hidden;background:radial-gradient(circle at 50% 40%,#fffdf7 0 55%,var(--pc) 56%)}
  .tk.has-av svg{display:block;width:118%;height:118%;margin:-9% 0 0 -9%}
  .pod-av{position:relative;width:min(120px,22vw);aspect-ratio:1;animation:podHop 1s ease-in-out infinite;transform-origin:50% 100%}
  .pod-av svg{display:block;width:100%;height:100%;filter:drop-shadow(0 4px 0 rgba(58,29,14,.35))}
  .pod-av-1{width:min(150px,28vw);animation:podDance 1.1s ease-in-out infinite}
  .pod-av-2{animation-delay:.25s}.pod-av-3{animation-delay:.5s}
  .pod-shine{position:absolute;right:-6px;top:-6px;font-size:1.8rem;animation:podShine 1.4s linear infinite}
  @keyframes podHop{0%,100%{transform:translateY(0)}40%{transform:translateY(-16px) scaleY(1.04)}60%{transform:translateY(0) scaleY(.94)}}
  @keyframes podDance{0%,100%{transform:translateY(0) rotate(0)}25%{transform:translateY(-22px) rotate(-8deg)}50%{transform:translateY(0) rotate(0) scaleY(.92)}75%{transform:translateY(-22px) rotate(8deg)}}
  @keyframes podShine{0%{transform:scale(.6) rotate(0);opacity:.4}50%{transform:scale(1.2) rotate(180deg);opacity:1}100%{transform:scale(.6) rotate(360deg);opacity:.4}}
  .av-pick{position:relative;flex:none;width:40px;height:40px;padding:0;border:3px solid var(--ink);border-radius:50%;background:radial-gradient(circle at 50% 40%,#fffdf7 0 55%,var(--pc) 56%);cursor:pointer;box-shadow:0 3px 0 var(--ink);overflow:visible}
  .av-pick svg{display:block;width:118%;height:118%;margin:-9% 0 0 -9%;border-radius:50%;overflow:hidden}
  .av-pick.empty{background:var(--pc)}
  .av-pick.empty::after{content:'+';position:absolute;right:-6px;bottom:-6px;width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid var(--ink);font:900 14px/14px sans-serif;color:var(--ink);display:grid;place-items:center}
  .av-pick:hover{transform:scale(1.08)}
  .av-hint{margin:8px 0 0;font-weight:700;font-size:.92rem;color:var(--v)}
  .ave-card{width:min(100%,980px)}
  .ave-body{display:grid;grid-template-columns:minmax(220px,300px) minmax(0,1fr);gap:18px;align-items:start}
  .ave-left{display:grid;justify-items:center;gap:10px;position:sticky;top:0}
  .ave-big{width:min(260px,60vw);aspect-ratio:1;animation:aveHop 1.6s ease-in-out infinite}
  .ave-big svg{display:block;width:100%;height:100%;filter:drop-shadow(0 6px 0 rgba(58,29,14,.25))}
  @keyframes aveHop{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .ave-who{font-family:var(--f-display);font-size:1.6rem;text-align:center;overflow-wrap:anywhere}
  .ave-right{display:grid;gap:10px;min-width:0}
  .ave-row{display:flex;flex-wrap:wrap;gap:6px}
  .ave-chip{font:inherit;font-weight:800;font-size:.9rem;background:#fff;color:var(--ink);border:3px solid var(--ink);border-radius:999px;padding:4px 12px;cursor:pointer;box-shadow:0 3px 0 var(--ink)}
  .ave-chip.dice{background:#ffe58a}
  .ave-cat{font:inherit;font-weight:800;font-size:.85rem;background:#f3e6cf;color:var(--ink);border:2px solid var(--ink);border-radius:10px;padding:4px 10px;cursor:pointer}
  .ave-cat.on{background:var(--v);color:#fff}
  .ave-opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;max-height:min(46vh,430px);overflow-y:auto;padding:4px}
  .ave-opts.colors{grid-template-columns:repeat(auto-fill,minmax(52px,1fr))}
  .ave-opt{display:grid;justify-items:center;gap:2px;font:inherit;font-weight:700;font-size:.78rem;color:var(--ink);background:#fff;border:3px solid var(--ink);border-radius:14px;padding:4px;cursor:pointer}
  .ave-opt.on{border-color:var(--v);box-shadow:0 0 0 3px var(--v)}
  .ave-opt svg{display:block;width:70px;height:70px}
  .ave-opts.colors .ave-opt{aspect-ratio:1;border-radius:50%;font-size:1.1rem;font-weight:900}
  .ave-foot{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;align-items:center;margin-top:6px}
  .ave-foot .grow{margin-right:auto}
  @media (max-width:720px){.ave-body{grid-template-columns:minmax(0,1fr)}.ave-left{position:static}.ave-big{width:170px}}
  @media (prefers-reduced-motion: reduce){.pod-av,.pod-av-1,.pod-shine,.ave-big{animation:none}}`;
  document.head.append(Object.assign(document.createElement('style'), {textContent: css}));

  function playing() { const g = document.getElementById('game'); return !!(G && Array.isArray(G.players) && g && !g.hidden); }
  function players() {
    if (playing()) return G.players.map((p, i) => ({i, name: p.name, color: p.color}));
    return [...document.querySelectorAll('#names input')].map((inp, i) => ({i, name: inp.value.trim() || ('Élève ' + (i + 1)), color: COLORS[i]}));
  }
  const nameOf = i => { const p = players()[i]; return p ? p.name : ''; };
  CPAV.on = on;
  CPAV.get = i => (on() && window.CPAvatar) ? (store[norm(nameOf(i))] || null) : null;
  CPAV.set = (i, av) => {
    const k = norm(nameOf(i)); if (!k || !window.CPAvatar) return;
    if (av) store[k] = CPAvatar.clean(av); else delete store[k];
    save(); refresh();
  };
  function refresh() { apply(); decorateNames(); CPAV.listeners.forEach(fn => { try { fn(); } catch (e) {} }); }
  CPAV.refresh = refresh;

  /* ---------- affichage ---------- */
  function apply() {
    if (!on() || !window.CPAvatar || !G || !Array.isArray(G.players) || !playing()) return;
    G.players.forEach((p, i) => {
      const tk = document.querySelector('#tok-' + i + ' .tk'); if (!tk) return;
      const av = CPAV.get(i); const key = av ? JSON.stringify(av) : '';
      if ((tk.dataset.av || '') === key) return;
      if (!av) { tk.classList.remove('has-av'); tk.dataset.av = ''; tk.textContent = G.players.length > 8 ? String(i + 1) : (typeof initials === 'function' ? initials(p.name) : ''); return; }
      tk.dataset.av = key; tk.classList.add('has-av'); tk.innerHTML = CPAvatar.svg(av);
    });
    const cav = CPAV.get(G.turn); const plateDot = document.querySelector('#turnPlate .tdot');
    if (cav && plateDot && !G.over) plateDot.replaceWith(h('span', {class: 'lab-av plate-av', html: CPAvatar.svg(cav)}));
    const rows = [...document.querySelectorAll('#score .srow')];
    const order = G.players.map((p, i) => ({p, i})).sort((a, b) => b.p.progress - a.p.progress);
    order.forEach(({i}, k) => {
      const row = rows[k]; if (!row) return;
      const av = CPAV.get(i); let dot = row.querySelector('.tdot, .side-av'); if (!dot) return;
      if (av && dot.classList.contains('tdot')) { const s = h('span', {class: 'lab-av side-av', html: CPAvatar.svg(av)}); dot.replaceWith(s); dot = s; }
      if (!dot.dataset.avc) { dot.dataset.avc = '1'; dot.classList.add('av-click'); dot.title = 'Choisir l\'avatar de ' + G.players[i].name; dot.addEventListener('click', e => { e.stopPropagation(); openEditor(i); }); }
    });
  }
  CPAV.apply = apply;
  const _showPodium = window.showPodium;
  if (typeof _showPodium === 'function') {
    showPodium = function () {
      const r = _showPodium.apply(this, arguments);
      if (on() && window.CPAvatar && G) {
        const order = [...G.players].sort((a, b) => b.progress - a.progress);
        [1, 2, 3].forEach(place => {
          const p = order[place - 1]; const pod = document.querySelector('#modal .pod.p' + place); if (!p || !pod) return;
          const av = CPAV.get(G.players.indexOf(p)); const dot = pod.querySelector('.tdot'); if (!av || !dot) return;
          dot.replaceWith(h('div', {class: 'pod-av pod-av-' + place, html: CPAvatar.svg(av) + (place === 1 ? '<span class="pod-shine">✨</span>' : '')}));
        });
        const rest = [...document.querySelectorAll('#modal .rest li')];
        order.slice(3).forEach((p, k) => { const av = CPAV.get(G.players.indexOf(p)); const dot = rest[k] && rest[k].querySelector('.tdot'); if (av && dot) dot.replaceWith(h('span', {class: 'lab-av', html: CPAvatar.svg(av)})); });
      }
      return r;
    };
  }
  ['renderTokens', 'buildBoard', 'renderSide', 'renderCenter'].forEach(fn => {
    const orig = window[fn]; if (typeof orig !== 'function') return;
    window[fn] = function () { const r = orig.apply(this, arguments); apply(); return r; };
  });

  /* ---------- écran d'accueil : pastille cliquable ---------- */
  function decorateNames() {
    const box = document.getElementById('names'); if (!box || !window.CPAvatar) return;
    if (!on()) {
      [...box.querySelectorAll('.av-pick')].forEach((b, i) => b.replaceWith(h('span', {class: 'tdot' + (box.children.length > 8 ? ' num' : ''), style: '--pc:' + COLORS[i]}, box.children.length > 8 ? i + 1 : null)));
      const hint = document.getElementById('avHint'); if (hint) hint.remove(); return;
    }
    [...box.querySelectorAll('.nm')].forEach((row, i) => {
      let b = row.querySelector('.av-pick');
      if (!b) {
        const dot = row.querySelector('.tdot');
        b = h('button', {type: 'button', class: 'av-pick', style: '--pc:' + COLORS[i], onclick: () => openEditor(i)});
        if (dot) dot.replaceWith(b); else row.prepend(b);
      }
      const av = CPAV.get(i); const key = av ? JSON.stringify(av) : '';
      if (b.dataset.av === key && b.dataset.done) return;
      b.dataset.av = key; b.dataset.done = '1';
      b.classList.toggle('empty', !av); b.innerHTML = av ? CPAvatar.svg(av) : '';
      b.title = 'Choisir l\'avatar de ' + nameOf(i); b.setAttribute('aria-label', b.title);
    });
    if (!document.getElementById('avHint')) box.after(h('p', {class: 'av-hint', id: 'avHint'}, '🙂 Clique sur la pastille d\'un joueur pour lui créer un avatar.'));
  }
  const _renderNames = window.renderNames;
  if (typeof _renderNames === 'function') renderNames = function () { const r = _renderNames.apply(this, arguments); decorateNames(); return r; };
  document.addEventListener('change', e => { if (e.target && e.target.closest && e.target.closest('#names')) decorateNames(); });
  document.addEventListener('input', e => { if (e.target && e.target.closest && e.target.closest('#names')) { clearTimeout(CPAV._t); CPAV._t = setTimeout(decorateNames, 250); } });

  /* ---------- éditeur au tableau ---------- */
  let ov = null;
  function openEditor(i) {
    if (!on() || !window.CPAvatar) return;
    if (ov) ov.remove();
    const A = CPAvatar; const list = players(); if (!list[i]) return;
    let draft = Object.assign({}, CPAV.get(i) || A.STYLES.animal.a); let cat = 'perso';
    ov = h('div', {class: 'overlay ave-ov', style: 'z-index:80'});
    const close = () => { if (ov) { ov.remove(); ov = null; } document.removeEventListener('keydown', esc); };
    const esc = e => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc);
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    const card = h('div', {class: 'card ave-card', style: '--hc:var(--v)', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Avatar de ' + list[i].name});
    ov.append(card); document.body.append(ov);
    function draw() {
      const cats = A.cats(draft); if (!cats.includes(cat)) cat = cats[0];
      const isColor = cat === 'peau' || cat === 'teinte' || cat === 'cheveuxCouleur';
      const cur = A.clean(draft)[cat];
      const opts = h('div', {class: 'ave-opts' + (isColor ? ' colors' : '')}, ...A.OPT[cat].map(v => {
        const b = h('button', {type: 'button', class: 'ave-opt' + (cur === v ? ' on' : ''), title: A.LABELS[v] || v, 'aria-label': A.LABELS[v] || v, onclick: () => { draft[cat] = v; if (typeof SFX !== 'undefined' && SFX.click) SFX.click(); draw(); }});
        if (isColor) { b.style.background = v === 'naturel' ? A.mainColor(Object.assign({}, draft, {peau: 'naturel'})) : v; if (v === 'naturel') b.textContent = '★'; }
        else { b.innerHTML = A.svg(Object.assign({}, draft, {[cat]: v})); b.append(h('span', {}, A.LABELS[v] || v)); }
        return b;
      }));
      const next = i + 1 < list.length ? i + 1 : -1;
      card.replaceChildren(
        h('div', {class: 'card-head'}, h('div', {class: 'card-title outline'}, 'AVATAR DE ' + list[i].name.toUpperCase())),
        h('div', {class: 'card-body'},
          h('div', {class: 'ave-body'},
            h('div', {class: 'ave-left'}, h('div', {class: 'ave-big', html: A.svg(draft)}), h('div', {class: 'ave-who'}, list[i].name)),
            h('div', {class: 'ave-right'},
              h('div', {class: 'ave-row'}, ...Object.values(A.STYLES).map(st => h('button', {type: 'button', class: 'ave-chip', onclick: () => { draft = Object.assign({}, st.a); draw(); }}, st.nom)),
                h('button', {type: 'button', class: 'ave-chip dice', onclick: () => { draft = A.random(); draw(); }}, '🎲 Au hasard')),
              h('div', {class: 'ave-row'}, ...A.cats(draft).map(c => h('button', {type: 'button', class: 'ave-cat' + (c === cat ? ' on' : ''), onclick: () => { cat = c; draw(); }}, A.LABELS[c]))),
              opts)),
          h('div', {class: 'ave-foot'},
            CPAV.get(i) ? h('button', {type: 'button', class: 'btn grey grow', onclick: () => { CPAV.set(i, null); close(); }}, 'Retirer l\'avatar') : h('span', {class: 'grow'}),
            h('button', {type: 'button', class: 'btn grey', onclick: close}, 'Annuler'),
            next >= 0 ? h('button', {type: 'button', class: 'btn blue', onclick: () => { CPAV.set(i, draft); close(); openEditor(next); }}, 'Valider, joueur suivant ➜') : null,
            h('button', {type: 'button', class: 'btn go', onclick: () => { CPAV.set(i, draft); if (typeof SFX !== 'undefined' && SFX.fanfare) SFX.fanfare(); close(); }}, '✅ C\'est moi !'))));
    }
    draw();
  }
  CPAV.openEditor = openEditor;

  function boot() { decorateNames(); apply(); }
  if (window.CPAvatar) boot();
  else { const sc = document.createElement('script'); sc.src = (window.CP_SITE || '') + 'avatar.js?v=20261011g'; sc.onload = boot; document.body.append(sc); }
})();
