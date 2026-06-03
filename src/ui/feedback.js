import gsap from 'gsap';

let moduleOverlay = null;
let moduleFlash = null;
let moduleTween = null;

export function initFeedbackUI() {
  if (document.getElementById('module-acquired')) return;

  moduleFlash = document.createElement('div');
  moduleFlash.id = 'module-acquired-flash';
  document.body.appendChild(moduleFlash);

  moduleOverlay = document.createElement('div');
  moduleOverlay.id = 'module-acquired';
  moduleOverlay.innerHTML = `
    <div class="ma-inner">
      <span class="ma-icon" aria-hidden="true">◆</span>
      <div class="ma-text">
        <div class="ma-label">MODULE ACQUIRED</div>
        <div class="ma-name"></div>
      </div>
    </div>
  `;
  document.body.appendChild(moduleOverlay);
}

export function showModuleAcquired(moduleName, labelText) {
  if (!moduleOverlay) initFeedbackUI();
  const nameEl = moduleOverlay.querySelector('.ma-name');
  const labelEl = moduleOverlay.querySelector('.ma-label');
  if (labelEl) labelEl.textContent = labelText || 'MODULE ACQUIRED';
  if (nameEl) nameEl.textContent = moduleName || '';

  if (moduleTween) moduleTween.kill();

  moduleFlash.classList.remove('show');
  void moduleFlash.offsetWidth;
  moduleFlash.classList.add('show');

  moduleOverlay.classList.add('show');
  const inner = moduleOverlay.querySelector('.ma-inner');
  gsap.fromTo(inner,
    { y: -16, opacity: 0, scale: 0.92 },
    { y: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }
  );

  moduleTween = gsap.to(moduleOverlay, {
    opacity: 0,
    delay: 0.85,
    duration: 0.25,
    onComplete: () => {
      moduleOverlay.classList.remove('show');
      gsap.set(moduleOverlay, { opacity: 1 });
      moduleFlash.classList.remove('show');
    },
  });
}

export function animateVictoryScreen(el) {
  if (!el) return;
  gsap.from(el, { opacity: 0, duration: 0.8 });
  gsap.from(el.querySelector('h1'), { y: 30, opacity: 0, duration: 0.6, delay: 0.2 });
  gsap.from(el.querySelector('.stats'), { y: 20, opacity: 0, duration: 0.5, delay: 0.5 });
}

export function animateDeathOverlay(el) {
  if (!el) return;
  gsap.from(el.querySelector('.death-card') || el.firstElementChild, {
    scale: 0.85, opacity: 0, duration: 0.45, ease: 'power2.out',
  });
}

export function triggerHvtFeedback(playHeartbeat) {
  if (playHeartbeat) playHeartbeat();
  const vignette = document.getElementById('hvt-vignette');
  if (vignette) {
    gsap.fromTo(vignette, { opacity: 0 }, { opacity: 1, duration: 0.8 });
  }
}
