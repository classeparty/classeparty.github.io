/* =====================================================================
   Classe Party - MANETTES (tablettes des élèves)
   Côté ordinateur du prof. Chargé par le jeu quand on choisit
   « Avec manettes » sur l'écran d'accueil (internet nécessaire).
   © 2026 Jérôme Manderlier - Licence CC BY-NC-ND 4.0
   ===================================================================== */
(function () {
  'use strict';
  const CFG = window.CP_CONFIG || {};
  if (!window.supabase || !CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY) return;
  const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {auth: {persistSession: false, autoRefreshToken: false, detectSessionInUrl: false}});

  const LAB = {
    on: false, code: '', ch: null, all: true, phones: {}, q: null,
    sideAns: new Map(), sendT: null, seq: 0, priceMode: 'auto', wait: 10
  };
  window.CP_LAB = LAB;

  /* ---------- style ---------- */
  const css = `
  .lab-box{display:grid;gap:10px;background:#efe6ff;border:3px dashed var(--v);border-radius:14px;padding:12px 14px}
  .lab-box h3{margin:0;font-family:var(--f-display);font-weight:400;font-size:1.25rem}
  .lab-box p{margin:0;font-weight:600;line-height:1.35}
  .lab-join{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;align-items:center}
  .lab-qr{width:150px;background:#fff;border:3px solid var(--ink);border-radius:12px;padding:6px}
  .lab-qr svg{display:block;width:100%;height:auto}
  .lab-code{font-family:var(--f-display);font-size:2.4rem;letter-spacing:.12em;line-height:1}
  .lab-url{font-weight:700;font-size:.9rem;overflow-wrap:anywhere}
  .lab-list{display:flex;flex-wrap:wrap;gap:6px}
  .lab-list > span{display:inline-flex;align-items:center;gap:5px;background:#fff;border:2px solid var(--ink);border-radius:999px;padding:1px 9px 1px 4px;font-weight:700;font-size:.9rem}
  .lab-chk{display:flex;gap:8px;align-items:flex-start;font-weight:700}
  .lab-chk input{width:20px;height:20px;accent-color:var(--v);flex:none;margin-top:2px}
  .lab-chip{font-family:var(--f-display);font-size:1rem;background:var(--v);color:#fff;border:3px solid var(--ink);border-radius:999px;padding:.2em .8em;box-shadow:0 4px 0 var(--ink);cursor:pointer;-webkit-text-stroke:0}
  .lab-count{margin:0;font-weight:800;color:var(--v);text-align:center}
  .answers.lab-wait .ans{opacity:.55;pointer-events:none}
  .lab-big{display:grid;justify-items:center;gap:12px;text-align:center}
  .lab-big .lab-qr{width:min(320px,70vw)}
  .lab-big .lab-code{font-size:3.6rem}
  @media (max-width:520px){.lab-join{grid-template-columns:minmax(0,1fr)}}`;
  document.head.append(Object.assign(document.createElement('style'), {textContent: css}));

  /* ---------- outils ---------- */
  const joinUrl = () => (window.CP_SITE ? window.CP_SITE + 'manette.html?code=' + LAB.code : new URL('manette.html?code=' + LAB.code, location.href).href);
  const shortUrl = () => joinUrl().replace(/^https?:\/\//, '').replace(/\?.*$/, '');
  function qrSvg(text) {
    try { const q = window.qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({cellSize: 4, margin: 2, scalable: true}); }
    catch (e) { return ''; }
  }
  function playerList() {
    if (G && Array.isArray(G.players)) return G.players.map((p, i) => ({i, name: p.name, color: p.color}));
    return [...document.querySelectorAll('#names input')].map((inp, i) => ({i, name: inp.value.trim() || ('Élève ' + (i + 1)), color: COLORS[i]}));
  }
  function phonesFor(i) { return Object.values(LAB.phones).filter(ph => ph.pid === i).length; }
  function nPhones() { return Object.keys(LAB.phones).length; }

  /* ---------- état envoyé aux manettes ---------- */
  function modalInfo() {
    const m = document.getElementById('modal');
    if (!m || m.hidden || !m.firstChild) return null;
    const title = (m.querySelector('.card-title') || {}).textContent || '';
    if (LAB.q && m.querySelector('.ans')) {
      const hold = (LAB.q.hold && !LAB.q.revealed) ? Math.max(0, Math.ceil((LAB.q.hold.until - Date.now()) / 1000)) : 0;
      const ex = m.querySelector('.lab-exit');
      return {type: 'q', title, exit: !!(ex && !ex.hidden), q: {text: LAB.q.text, vf: LAB.q.vf, opts: LAB.q.opts, revealed: LAB.q.revealed, right: LAB.q.revealed ? LAB.q.right : null, all: LAB.q.all, hold, results: LAB.q.revealed ? LAB.q.results : null}, cont: LAB.q.revealed};
    }
    const foot = [...m.querySelectorAll('.card-foot .btn')].filter(b => !b.hidden);
    if (m.querySelector('.shop-wrap')) return {type: 'shop', title, shop: shopInfo(m)};
    if (m.querySelector('.secret') && LAB.mime) {
      const chronoBtn = [...m.querySelectorAll('.secret-row .btn')][1];
      return {type: 'mime', title, mime: {pid: LAB.mime.pid, word: LAB.mime.word, chrono: !!(chronoBtn && chronoBtn.disabled)}};
    }
    const ok = foot.filter(b => foot.length === 1 || b.classList.contains('phone-ok'));
    return {type: 'other', title, btn: ok.length === 1 ? ok[0].textContent : null, btns: ok.map(b => b.textContent)};
  }
  /* boutique : ce que la manette du joueur doit afficher */
  function shopInfo(m) {
    const p = cur(); if (!p) return null;
    const els = [...m.querySelectorAll('.shop-item')];
    return {
      coins: p.coins || 0,
      items: ITEMS.map((it, i) => {
        const b = els[i] && els[i].querySelector('.btn');
        const why = b && b.disabled ? b.textContent : '';
        return {i, name: it.name, desc: it.desc, price: it.price(), why, target: !!it.target,
          targets: (it.target && !why) ? validTargets(p, it).map(t => ({pid: G.players.indexOf(t), name: t.name, color: t.color, joker: !!(t.cards && t.cards.joker > 0), tours: Math.floor(t.progress / N)})) : []};
      })
    };
  }
  function state() {
    const playing = !!(G && Array.isArray(G.players) && !document.getElementById('game').hidden);
    return {
      v: 1, seq: ++LAB.seq, title: typeof gameTitle === 'function' ? gameTitle() : 'Classe Party',
      playing, over: playing ? !!G.over : false,
      players: playerList().map(p => {
        const gp = playing ? G.players[p.i] : null;
        return {name: p.name, color: p.color, coins: gp ? (gp.coins || 0) : null, tours: gp ? Math.floor(gp.progress / N) : null, jailed: gp ? !!gp.jailed : false};
      }),
      turn: playing ? G.turn : -1, phase: playing ? G.phase : 'setup', paused: playing ? !!G.paused : false,
      shop: typeof shopOn === 'function' ? shopOn() : true,
      card: playing ? modalInfo() : null
    };
  }
  function push() {
    if (!LAB.on || !LAB.ch) return;
    clearTimeout(LAB.sendT);
    LAB.sendT = setTimeout(() => {
      try { LAB.ch.send({type: 'broadcast', event: 'state', payload: state()}); } catch (e) {}
      refreshCounters();
    }, 120);
  }
  LAB.push = push;

  /* ---------- actions reçues des manettes ---------- */
  function onAct(a) {
    if (!a || !G || !Array.isArray(G.players) || document.getElementById('game').hidden) return;
    const pid = parseInt(a.pid, 10);
    if (!(pid >= 0 && pid < G.players.length)) return;
    const isTurn = pid === G.turn && !G.over;
    const m = document.getElementById('modal');
    if (a.a === 'roll') {
      if (isTurn && G.phase === 'roll' && !G.paused && m.hidden) roll();
      return;
    }
    if (a.a === 'ans') {
      if (!LAB.q || LAB.q.revealed) return;
      const j = parseInt(a.j, 10);
      if (!(j >= 0 && j < LAB.q.btns.length)) return;
      if (isTurn) { if (!LAB.q.hold) LAB.q.btns[j].click(); return; }
      if (LAB.q.all && !LAB.sideAns.has(pid)) { LAB.sideAns.set(pid, j); refreshCounters(); push(); }
      return;
    }
    if (!isTurn || m.hidden) return;
    if (a.a === 'cont') {
      if (m.querySelector('.shop-wrap') || m.querySelector('.secret') || m.querySelector('.ans:not([disabled])')) return;
      const foot = [...m.querySelectorAll('.card-foot .btn')].filter(b => !b.hidden && !b.disabled);
      const ok = foot.filter(b => foot.length === 1 || b.classList.contains('phone-ok'));
      const i = Number.isInteger(a.i) ? a.i : 0;
      if (ok[i]) ok[i].click();
      return;
    }
    if (a.a === 'useexit') { const b = m.querySelector('.lab-exit'); if (b && !b.hidden) b.click(); return; }
    /* --- boutique depuis le téléphone --- */
    if (a.a === 'buy' && m.querySelector('.shop-wrap')) {
      const i = parseInt(a.i, 10), it = ITEMS[i]; if (!it) return;
      const item = () => m.querySelectorAll('.shop-item')[i];
      const b = item() && item().querySelector('.btn');
      if (!b || b.disabled) return;
      if (!it.target) { b.click(); return; }
      const tpid = parseInt(a.t, 10); const target = G.players[tpid];
      const list = validTargets(cur(), it); const k = list.indexOf(target);
      if (k < 0) return;
      if (!item().classList.contains('picking')) b.click();
      const tb = m.querySelectorAll('.target-btn')[k]; if (tb) tb.click();
      return;
    }
    if (a.a === 'shopdone' && m.querySelector('.shop-wrap')) {
      const f = m.querySelector('.card-foot .btn'); if (f) f.click();
      return;
    }
    /* --- mime affiché sur le téléphone --- */
    if (m.querySelector('.secret')) {
      const row = [...m.querySelectorAll('.secret-row .btn')];
      const foot = [...m.querySelectorAll('.card-foot .btn')];
      if (a.a === 'chrono' && row[1] && !row[1].disabled) row[1].click();
      if (a.a === 'mimerefuse' && foot[2]) foot[2].click();
    }
  }

  /* ---------- prix de la boutique ----------
     Quand toute la classe répond, chacun gagne bien plus de pièces :
     les prix sont multipliés (automatique : selon le nombre de joueurs). */
  function autoMult() { const n = playerList().length; return Math.max(2, Math.min(5, Math.round(1 + 0.3 * (n - 1)))); }
  function priceMult() {
    if (!LAB.on || !LAB.all) return 1;
    return LAB.priceMode === 'auto' ? autoMult() : LAB.priceMode;
  }
  const _setNum = setNum;
  setNum = function (k, d) {
    const v = _setNum(k, d);
    return /^price/.test(k) ? Math.max(1, Math.round(v * priceMult())) : v;
  };
  function pricesTxt() { return `Dé bonus ${setNum('priceDie', 3)} · Canne à pêche ${setNum('priceFish', 8)} · Glue ${setNum('priceGlue', 4)} pièces`; }

  /* ---------- branchement sur le jeu ---------- */
  const _askQuestion = askQuestion;
  askQuestion = function (p, kind, jail) {
    LAB.sideAns = new Map();
    LAB.q = null; LAB.pendingKind = kind; LAB.pendingPlayer = p;
    const r = _askQuestion.apply(this, arguments);
    hookQuestion();
    return r;
  };
  function hookQuestion() {
    const m = document.getElementById('modal');
    const btns = [...m.querySelectorAll('.ans')];
    if (!btns.length) { LAB.q = null; return; }
    const p = LAB.pendingPlayer;
    LAB.q = {
      kind: LAB.pendingKind, text: (m.querySelector('.qtext') || {}).textContent || '',
      vf: LAB.pendingKind === 'vf', btns, opts: btns.map(b => b.dataset.txt || b.textContent),
      right: btns.findIndex(b => b.dataset.right === '1'), revealed: false,
      all: LAB.on && LAB.all && nPhones() > 0, player: p, results: null
    };
    if (LAB.q.all) {
      const line = document.createElement('p'); line.className = 'lab-count'; line.id = 'labCount';
      const body = m.querySelector('.card-body'); if (body) body.append(line);
    }
    btns.forEach((b, j) => b.addEventListener('click', () => reveal(j), {once: true}));
    /* le joueur du tour a répondu : on laisse quelques secondes aux autres avant de corriger */
    const box = m.querySelector('.answers');
    if (box) box.addEventListener('click', e => {
      const b = e.target.closest('.ans'); const q = LAB.q;
      if (!b || !q || q.pass || q.revealed || !q.all) return;
      if (!q.hold && !othersPending()) return;
      e.stopImmediatePropagation(); e.preventDefault();
      if (!q.hold) startHold(q.btns.indexOf(b));
    }, true);
    refreshCounters(); push();
  }
  function eligible() { return [...new Set(Object.values(LAB.phones).map(ph => ph.pid))].filter(pid => pid >= 0 && pid !== G.turn && pid < G.players.length); }
  function othersPending() { return eligible().some(pid => !LAB.sideAns.has(pid)); }
  function startHold(j) {
    const q = LAB.q; if (!q) return;
    q.hold = {j, until: Date.now() + LAB.wait * 1000};
    const box = document.querySelector('#modal .answers'); if (box) box.classList.add('lab-wait');
    const line = document.getElementById('labCount');
    if (line) {
      const now = h('button', {type: 'button', class: 'btn mini grey', style: 'margin-left:8px'}, 'Corriger maintenant');
      now.addEventListener('click', finishHold);
      line.after(h('p', {class: 'lab-count', id: 'labHold'}, '', now));
    }
    q.hold.timer = setInterval(tickHold, 250); tickHold(); push();
  }
  function tickHold() {
    const q = LAB.q; if (!q || !q.hold) return;
    const left = Math.max(0, Math.ceil((q.hold.until - Date.now()) / 1000));
    const el = document.getElementById('labHold');
    if (el && el.firstChild) el.firstChild.textContent = `✅ ${q.player.name} a répondu ! ⏳ Encore ${left} s pour que la classe réponde`;
    if (left <= 0 || !othersPending()) finishHold();
  }
  function finishHold() {
    const q = LAB.q; if (!q || !q.hold || q.pass) return;
    clearInterval(q.hold.timer); q.pass = true;
    const box = document.querySelector('#modal .answers'); if (box) box.classList.remove('lab-wait');
    const el = document.getElementById('labHold'); if (el) el.remove();
    q.btns[q.hold.j].click();
  }
  function reveal() {
    const q = LAB.q; if (!q || q.revealed) return;
    q.revealed = true;
    let good = 0, total = 0;
    const res = {};
    if (q.all) {
      const rightTxt = q.opts[q.right] || '';
      LAB.sideAns.forEach((j, pid) => {
        const pl = G.players[pid]; if (!pl || pl === q.player) return;
        const ok = j === q.right; total++; if (ok) good++;
        res[pid] = ok;
        if (ok && shopOn()) { ensurePlayerFields(pl); addCoins(pl, 1); }
        logAnswer(pl, q.kind, q.text, ok, rightTxt, q.opts[j] || '', {side: true});
      });
      q.results = res;
      const line = document.getElementById('labCount');
      if (line) line.textContent = total ? `📱 La classe : ${good} bonne${good > 1 ? 's' : ''} réponse${good > 1 ? 's' : ''} sur ${total}` + (good && shopOn() ? ' · +1 pièce chacun !' : '') : '📱 Personne d\'autre n\'a répondu.';
      renderSide(); saveGame();
    }
    push();
  }
  function refreshCounters() {
    const line = document.getElementById('labCount');
    if (line && LAB.q && !LAB.q.revealed) {
      const n = LAB.sideAns.size;
      line.textContent = `📱 Toute la classe répond sur sa tablette : ${n} réponse${n > 1 ? 's' : ''} reçue${n > 1 ? 's' : ''}`;
    }
    const chip = document.getElementById('labChip');
    if (chip) chip.textContent = `📱 ${LAB.code} · ${nPhones()}`;
    renderSetupBox();
  }
  ['renderCenter', 'renderSide', 'openModal', 'closeModal', 'renderNames', 'showScreen'].forEach(fn => {
    const orig = window[fn]; if (typeof orig !== 'function') return;
    window[fn] = function () {
      const r = orig.apply(this, arguments);
      if (fn === 'closeModal') { if (LAB.q && LAB.q.hold) clearInterval(LAB.q.hold.timer); LAB.q = null; LAB.mime = null; }
      if (fn === 'openModal') hookMime();
      push(); return r;
    };
  });
  /* le mot à mimer part sur le téléphone du joueur, pas au tableau */
  function hookMime() {
    LAB.mime = null;
    const m = document.getElementById('modal'); const sec = m.querySelector('.secret');
    if (!sec || !G || !LAB.on || !phonesFor(G.turn)) return;
    LAB.mime = {pid: G.turn, word: sec.textContent};
    const row = m.querySelector('.secret-row'); const hint = m.querySelector('.hintline');
    const toggle = row && row.querySelector('.btn');
    if (toggle) { toggle.textContent = 'Montrer ici quand même'; toggle.classList.remove('pink'); toggle.classList.add('grey', 'small'); }
    const info = document.createElement('p'); info.className = 'lab-count';
    info.textContent = `📱 Le mot à mimer s'affiche uniquement sur la tablette de ${G.players[G.turn].name}.`;
    if (hint) hint.replaceWith(info); else if (row) row.before(info);
    const chronoBtn = row && row.querySelectorAll('.btn')[1];
    if (chronoBtn) chronoBtn.addEventListener('click', () => push());
  }
  document.addEventListener('input', e => { if (e.target && e.target.closest && e.target.closest('#names')) push(); });

  /* ---------- connexion temps réel ---------- */
  function start() {
    LAB.code = String(Math.floor(10000 + Math.random() * 90000));
    LAB.on = true; LAB.phones = {};
    const ch = sb.channel('cp-' + LAB.code, {config: {broadcast: {self: false}, presence: {key: 'host'}}});
    ch.on('broadcast', {event: 'act'}, ({payload}) => onAct(payload))
      .on('broadcast', {event: 'hello'}, () => push())
      .on('presence', {event: 'sync'}, () => {
        const st = ch.presenceState(); const ph = {};
        Object.entries(st).forEach(([k, metas]) => { if (k !== 'host' && metas && metas[0]) ph[k] = {pid: metas[0].pid ?? -1}; });
        LAB.phones = ph; refreshCounters();
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') { try { await ch.track({role: 'host'}); } catch (e) {} push(); renderSetupBox(); }
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') { LAB.err = 'Connexion impossible au serveur temps réel.'; renderSetupBox(); }
      });
    LAB.ch = ch; addChip(); renderSetupBox();
    /* jeu ouvert hors du site (fichier, programme Windows) : compté dans « en ce moment » */
    if (window.CP_SITE && !LAB.siteCh) { try { const pc = sb.channel('cp-site', {config: {presence: {key: 'j' + Math.random().toString(36).slice(2, 10)}}}); pc.subscribe(st => { if (st === 'SUBSCRIBED') { try { pc.track({p: 'jeu'}); } catch (e) {} } }); LAB.siteCh = pc; sb.rpc('compter_visite', {p_page: 'jeu', p_nouvelle: true}).then(() => {}, () => {}); } catch (e) {} }
    clearInterval(LAB.beat); LAB.beat = setInterval(push, 8000);
  }
  function stop() {
    if (LAB.ch) { try { sb.removeChannel(LAB.ch); } catch (e) {} }
    clearInterval(LAB.beat);
    LAB.ch = null; LAB.on = false; LAB.phones = {}; LAB.err = '';
    const chip = document.getElementById('labChip'); if (chip) chip.remove();
    if (LAB.zone) { LAB.zone.className = ''; LAB.zone.replaceChildren(); }
  }

  /* ---------- interface : écran d'accueil ---------- */
  function renderSetupBox() {
    const box = LAB.zone; if (!box || !box.isConnected) return;
    box.className = 'lab-box';
    box.replaceChildren();
    if (!LAB.on) return;
    const svg = qrSvg(joinUrl());
    box.append(...[
      h('div', {class: 'lab-join'},
        h('div', {class: 'lab-qr', html: svg}),
        h('div', {style: 'display:grid;gap:6px;min-width:0'},
          h('p', {}, 'Scanne le QR code ou va sur :'), h('p', {class: 'lab-url'}, shortUrl()),
          h('p', {}, 'Code de la partie :'), h('div', {class: 'lab-code'}, LAB.code))),
      LAB.err ? h('p', {style: 'color:var(--x)'}, LAB.err) : null,
      h('p', {}, `${nPhones()} manette${nPhones() > 1 ? 's' : ''} connectée${nPhones() > 1 ? 's' : ''}`),
      h('div', {class: 'lab-list'}, playerList().filter(p => phonesFor(p.i)).map(p => h('span', {}, h('span', {class: 'tdot', style: '--pc:' + p.color + ';width:16px;height:16px;border-width:2px'}), p.name + (phonesFor(p.i) > 1 ? ' ×' + phonesFor(p.i) : '')))),
      (() => { const c = h('input', {type: 'checkbox'}); c.checked = LAB.all; c.addEventListener('change', () => { LAB.all = c.checked; renderSetupBox(); }); return h('label', {class: 'lab-chk'}, c, h('span', {}, 'Toute la classe répond à chaque quiz et vrai ou faux (seul le joueur du tour avance ; les autres gagnent 1 pièce s\'ils ont juste).')); })(),
      LAB.all ? (() => {
        const sel = h('select', {class: 'in', style: 'width:auto;padding:4px 8px'});
        [5, 10, 15, 20, 30].forEach(v => { const o = h('option', {value: String(v)}, v + ' secondes'); if (v === LAB.wait) o.selected = true; sel.append(o); });
        sel.addEventListener('change', () => { LAB.wait = parseInt(sel.value, 10) || 10; });
        return h('label', {class: 'lab-chk', style: 'align-items:center;flex-wrap:wrap'}, h('span', {}, '⏳ Quand le joueur a répondu, les autres ont encore :'), sel);
      })() : null,
      (LAB.all && shopOn()) ? (() => {
        const sel = h('select', {class: 'in', style: 'width:auto;padding:4px 8px'});
        [['auto', `Automatique (×${autoMult()} avec ${playerList().length} joueurs)`], [1, 'Prix normaux'], [2, 'Prix ×2'], [3, 'Prix ×3'], [4, 'Prix ×4'], [5, 'Prix ×5']].forEach(([v, l]) => {
          const o = h('option', {value: String(v)}, l); if (String(v) === String(LAB.priceMode)) o.selected = true; sel.append(o); });
        sel.addEventListener('change', () => { LAB.priceMode = sel.value === 'auto' ? 'auto' : parseInt(sel.value, 10); renderSetupBox(); });
        return h('div', {style: 'display:grid;gap:6px'},
          h('label', {class: 'lab-chk', style: 'align-items:center;flex-wrap:wrap'}, h('span', {}, '🪙 Prix de la boutique :'), sel),
          h('p', {class: 'small-note', style: 'font-weight:700;color:var(--ink-2)'}, pricesTxt()),
          h('p', {class: 'small-note', style: 'color:var(--muted)'}, 'Toute la classe gagne des pièces à chaque bonne réponse : les prix augmentent pour que les objets restent précieux.'));
      })() : null,
    ].filter(Boolean));
  }
  function addChip() {
    if (document.getElementById('labChip')) return;
    const chip = h('button', {type: 'button', class: 'lab-chip', id: 'labChip', title: 'Afficher le QR code pour rejoindre'}, `📱 ${LAB.code}`);
    chip.addEventListener('click', showBigQr);
    const bar = document.querySelector('.tb-btns'); if (bar) bar.prepend(chip);
  }
  function showBigQr() {
    const ov = h('div', {class: 'overlay', style: 'z-index:65'});
    const close = () => ov.remove();
    ov.append(h('div', {class: 'card', style: '--hc:var(--v);width:min(100%,520px)', role: 'dialog', 'aria-modal': 'true'},
      h('div', {class: 'card-head'}, h('div', {class: 'card-title outline'}, 'REJOINDRE LA PARTIE')),
      h('div', {class: 'card-body lab-big'}, h('div', {class: 'lab-qr', html: qrSvg(joinUrl())}), h('p', {class: 'lab-url'}, shortUrl()), h('div', {class: 'lab-code'}, LAB.code),
        h('p', {style: 'font-weight:700'}, `${nPhones()} manette${nPhones() > 1 ? 's' : ''} connectée${nPhones() > 1 ? 's' : ''}`)),
      h('div', {class: 'card-foot'}, btn('FERMER', 'big go', close))));
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    document.body.append(ov);
  }

  LAB.start = function (zone) { LAB.zone = zone || LAB.zone; if (!LAB.on) start(); else renderSetupBox(); };
  LAB.stop = stop;
})();
