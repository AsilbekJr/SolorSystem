/** Cockpit overlay, resource critical pulse */
export function initHudUI() {
  if (document.getElementById('cockpit-frame')) return;

  const frame = document.createElement('div');
  frame.id = 'cockpit-frame';
  frame.innerHTML = `
    <div class="cockpit-corner tl"></div>
    <div class="cockpit-corner tr"></div>
    <div class="cockpit-corner bl"></div>
    <div class="cockpit-corner br"></div>
  `;
  document.body.appendChild(frame);

  const vignette = document.createElement('div');
  vignette.id = 'hvt-vignette';
  document.body.appendChild(vignette);

  const objectives = document.getElementById('objectives');
  if (objectives) {
    objectives.classList.add('holo-panel');
    document.getElementById('holo-solar-map')?.remove();
  }

  applyUiScale(readUiScale());
}

export function readUiScale() {
  try {
    const v = parseFloat(localStorage.getItem('odyssey.uiScale'));
    return Number.isFinite(v) ? Math.min(1.3, Math.max(0.75, v)) : 1;
  } catch {
    return 1;
  }
}

export function applyUiScale(scale) {
  document.documentElement.style.setProperty('--ui-scale', String(scale));
  try { localStorage.setItem('odyssey.uiScale', String(scale)); } catch {}
}

export function updateHudEnhancements(state, PLANETS) {
  const bars = [
    { wrap: document.querySelector('#hud-left .bar:nth-of-type(1)'), val: state.o2, max: state.maxO2 },
    { wrap: document.querySelector('#hud-left .bar.fuel'), val: state.fuel, max: state.maxFuel },
    { wrap: document.querySelector('#hud-left .bar.batt'), val: state.batt, max: state.maxBatt },
    { wrap: document.querySelector('#hud-left .bar.warn'), val: state.hull, max: state.maxHull },
  ];
  for (const b of bars) {
    if (!b.wrap) continue;
    const pct = b.max > 0 ? b.val / b.max : 1;
    b.wrap.classList.toggle('critical', pct < 0.2 && pct > 0);
  }

  const crosshair = document.getElementById('crosshair');
  if (crosshair) crosshair.classList.toggle('hvt', !!state.hvt);

  const vignette = document.getElementById('hvt-vignette');
  if (vignette) vignette.classList.toggle('active', !!state.hvt);
  document.body.classList.toggle('hvt-mode', !!state.hvt);
}
