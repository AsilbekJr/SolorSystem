/** Enhanced audio layer (Web Audio) — menu ambient, pickup, heartbeat */
let audioCtx = null;
let menuOsc = null;
let menuGain = null;
let initialized = false;

function getCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch {}
  }
  return audioCtx;
}

function sfxVol() {
  try {
    const raw = localStorage.getItem('odyssey.profile');
    if (raw) return JSON.parse(raw)?.settings?.sfxVolume ?? 0.55;
  } catch {}
  return 0.55;
}

function musicVol() {
  try {
    const raw = localStorage.getItem('odyssey.profile');
    if (raw) return JSON.parse(raw)?.settings?.musicVolume ?? 0.42;
  } catch {}
  return 0.42;
}

export function initHowlerAudio() {
  initialized = true;
}

export function playMenuMusic() {
  const ctx = getCtx();
  if (!ctx || menuOsc) return;
  try {
    menuGain = ctx.createGain();
    menuGain.gain.value = musicVol() * 0.08;
    menuGain.connect(ctx.destination);
    menuOsc = ctx.createOscillator();
    menuOsc.type = 'sine';
    menuOsc.frequency.value = 55;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 8;
    lfo.connect(lfoG);
    lfoG.connect(menuOsc.frequency);
    menuOsc.connect(menuGain);
    menuOsc.start();
    lfo.start();
  } catch {}
}

export function stopMenuMusic() {
  try {
    if (menuOsc) { menuOsc.stop(); menuOsc.disconnect(); menuOsc = null; }
    if (menuGain) { menuGain.disconnect(); menuGain = null; }
  } catch {}
}

export function playPickupSound() {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(440, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(sfxVol() * 0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.4);
  } catch {}
}

export function playHeartbeat() {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    for (let i = 0; i < 2; i++) {
      const t = ctx.currentTime + i * 0.22;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 52;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(sfxVol() * 0.35, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.2);
    }
  } catch {}
}

export function updateHowlerVolumes(sfx, music) {
  if (menuGain) menuGain.gain.value = music * 0.08;
}

export function setCombatLayer() {}
