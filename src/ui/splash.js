/** Splash tabs, holo map, menu camera, online counter */
let menuCamAngle = 0;
let splashHoloCanvas = null;
let splashHoloCtx = null;

const PLANET_COLORS = {
  earth: '#4a9eff', mars: '#ff6644', jupiter: '#cfa080',
  saturn: '#e8d4a0', uranus: '#7cd4ff', neptune: '#4466ff',
};

export function initSplashUI({ splash, t, profile, PLANETS }) {
  if (!splash || splash.dataset.uiReady) return;
  splash.dataset.uiReady = '1';
  document.body.classList.add('splash-open');

  const preserved = {};
  for (const id of ['lang-picker', 'nameInput', 'launchBtn']) {
    preserved[id] = document.getElementById(id);
  }
  const cards = {};
  for (const id of ['daily-splash', 'lb-splash', 'bp-splash', 'friends-splash', 'faction-splash', 'fscore-splash']) {
    const el = document.getElementById(id);
    if (el) cards[id] = el;
  }
  const actionBtns = document.getElementById('splash-action-btns');

  const langPicker = preserved['lang-picker'];
  const h1Text = splash.querySelector('h1')?.textContent || 'ODYSSEY';
  const h2Text = splash.querySelector('h2')?.textContent || t('splash.subtitle');
  const introText = splash.querySelector('[data-i18n="splash.intro"]')?.textContent || t('splash.intro');
  const controlsEl = splash.querySelector('.controls');

  splash.innerHTML = '';
  splash.classList.add('splash-v2');

  if (langPicker) splash.appendChild(langPicker);

  const hero = document.createElement('div');
  hero.className = 'splash-hero';
  hero.innerHTML = `<h1>${h1Text}</h1>`;
  const drama = document.createElement('div');
  drama.className = 'splash-drama';
  drama.dataset.i18n = 'splash.drama';
  drama.textContent = t('splash.drama');
  hero.appendChild(drama);
  splash.appendChild(hero);

  const tabs = document.createElement('div');
  tabs.className = 'splash-tabs';
  tabs.innerHTML = `
    <button type="button" class="splash-tab active" data-tab="mission">${t('splash.tabMission')}</button>
    <button type="button" class="splash-tab" data-tab="hangar">${t('splash.tabHangar')}</button>
    <button type="button" class="splash-tab" data-tab="social">${t('splash.tabSocial')}</button>
  `;
  splash.appendChild(tabs);

  const panelMission = document.createElement('div');
  panelMission.className = 'splash-panel active';
  panelMission.dataset.panel = 'mission';
  panelMission.innerHTML = `<h2 data-i18n="splash.subtitle">${h2Text}</h2>`;
  const intro = document.createElement('p');
  intro.dataset.i18n = 'splash.intro';
  intro.textContent = introText;
  panelMission.appendChild(intro);

  const holo = document.createElement('canvas');
  holo.id = 'splash-holo-map';
  holo.width = 520;
  holo.height = 72;
  splashHoloCanvas = holo;
  splashHoloCtx = holo.getContext('2d');
  panelMission.appendChild(holo);

  const nameWrap = document.createElement('div');
  if (preserved.nameInput) nameWrap.appendChild(preserved.nameInput);
  panelMission.appendChild(nameWrap);

  const launchRow = document.createElement('div');
  launchRow.className = 'splash-launch-row';
  if (preserved.launchBtn) launchRow.appendChild(preserved.launchBtn);
  const installBtn = document.createElement('button');
  installBtn.type = 'button';
  installBtn.id = 'install-app-btn';
  installBtn.style.display = 'none';
  installBtn.dataset.i18n = 'splash.install';
  installBtn.textContent = t('splash.install');
  launchRow.appendChild(installBtn);
  panelMission.appendChild(launchRow);

  const actions = document.createElement('div');
  actions.id = 'splash-action-btns';
  actions.style.cssText = 'display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap;';
  if (actionBtns) {
    while (actionBtns.firstChild) actions.appendChild(actionBtns.firstChild);
  }
  panelMission.appendChild(actions);

  if (controlsEl) {
    controlsEl.dataset.i18n = 'splash.controls';
    panelMission.appendChild(controlsEl);
  }

  const panelHangar = document.createElement('div');
  panelHangar.className = 'splash-panel';
  panelHangar.dataset.panel = 'hangar';
  panelHangar.id = 'splash-hangar-panel';
  if (cards['daily-splash']) panelHangar.appendChild(cards['daily-splash']);

  const panelSocial = document.createElement('div');
  panelSocial.className = 'splash-panel';
  panelSocial.dataset.panel = 'social';
  panelSocial.id = 'splash-social-panel';
  for (const id of ['faction-splash', 'fscore-splash', 'lb-splash', 'bp-splash', 'friends-splash']) {
    if (cards[id]) panelSocial.appendChild(cards[id]);
  }

  splash.appendChild(panelMission);
  splash.appendChild(panelHangar);
  splash.appendChild(panelSocial);

  const online = document.createElement('div');
  online.id = 'online-counter';
  online.textContent = t('splash.online', { n: 1 });
  splash.appendChild(online);

  tabs.querySelectorAll('.splash-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.splash-tab').forEach((b) => b.classList.remove('active'));
      splash.querySelectorAll('.splash-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      splash.querySelector(`[data-panel="${btn.dataset.tab}"]`)?.classList.add('active');
    });
  });

  drawSplashHoloMap(profile, PLANETS);
}

export function mountSplashActionButtons(buttons) {
  const wrap = document.getElementById('splash-action-btns');
  if (!wrap) return;
  for (const b of buttons) wrap.appendChild(b);
}

export function drawSplashHoloMap(profile, PLANETS) {
  if (!splashHoloCtx || !splashHoloCanvas || !PLANETS) return;
  const ctx = splashHoloCtx;
  const W = splashHoloCanvas.width;
  const H = splashHoloCanvas.height;
  ctx.clearRect(0, 0, W, H);
  const keys = PLANETS.filter((p) => p.module).map((p) => p.key);
  const n = keys.length;
  const pad = 36;
  const step = n > 1 ? (W - pad * 2) / (n - 1) : 0;
  ctx.strokeStyle = 'rgba(124, 212, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  keys.forEach((key, i) => {
    const x = pad + i * step;
    if (i === 0) ctx.moveTo(x, H / 2);
    else ctx.lineTo(x, H / 2);
  });
  ctx.stroke();
  keys.forEach((key, i) => {
    const x = pad + i * step;
    const color = PLANET_COLORS[key] || '#7cd4ff';
    ctx.beginPath();
    ctx.arc(x, H / 2, 7, 0, Math.PI * 2);
    ctx.fillStyle = color + '44';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.fillStyle = 'rgba(174,240,255,0.75)';
    ctx.font = '8px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.fillText(key.slice(0, 3).toUpperCase(), x, H - 8);
  });
}

export function updateMenuCamera(camera, dt) {
  if (!camera) return;
  menuCamAngle += dt * 0.035;
  const r = 14000;
  camera.position.set(
    Math.cos(menuCamAngle) * r,
    2200 + Math.sin(menuCamAngle * 0.4) * 500,
    Math.sin(menuCamAngle) * r
  );
  camera.lookAt(0, 0, 0);
}

export function onSplashHidden() {
  document.body.classList.remove('splash-open');
}

export function setBootProgress(pct, statusText) {
  const fill = document.querySelector('#boot-loader .boot-fill');
  const status = document.getElementById('bootStatus');
  if (fill) fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
  if (status && statusText) status.textContent = statusText;
}

export function updateOnlineCounter(n, t) {
  const el = document.getElementById('online-counter');
  if (el && t) el.textContent = t('splash.online', { n });
}
