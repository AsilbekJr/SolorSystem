import { initSplashUI, updateMenuCamera, onSplashHidden, setBootProgress, updateOnlineCounter, mountSplashActionButtons } from './splash.js';
import { initHudUI, updateHudEnhancements, applyUiScale, readUiScale } from './hud.js';
import { initFeedbackUI, showModuleAcquired, animateVictoryScreen, animateDeathOverlay, triggerHvtFeedback } from './feedback.js';
import { initInstallPrompt } from './install.js';
import { playMenuMusic, stopMenuMusic, playPickupSound, playHeartbeat, updateHowlerVolumes } from '../audio/howler-bridge.js';

export {
  initSplashUI,
  updateMenuCamera,
  onSplashHidden,
  setBootProgress,
  updateOnlineCounter,
  mountSplashActionButtons,
  initHudUI,
  updateHudEnhancements,
  applyUiScale,
  readUiScale,
  initFeedbackUI,
  showModuleAcquired,
  animateVictoryScreen,
  animateDeathOverlay,
  triggerHvtFeedback,
  initInstallPrompt,
  playMenuMusic,
  stopMenuMusic,
  playPickupSound,
  playHeartbeat,
  updateHowlerVolumes,
};
