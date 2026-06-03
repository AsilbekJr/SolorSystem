/** PWA install prompt on splash */
let deferredPrompt = null;

export function initInstallPrompt(t) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('install-app-btn');
    if (btn) {
      btn.style.display = 'inline-block';
      btn.textContent = t('splash.install');
      btn.onclick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        btn.style.display = 'none';
      };
    }
  });
}
