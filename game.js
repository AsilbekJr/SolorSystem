// Odyssey: Sol's Last Breath — MVP client
// Three.js sahna + Newton fizikasi + WebSocket multiplayer
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// ---------- I18N (Internationalization) ----------
const I18N = {
  uz: {
    'splash.subtitle': "SOL'S LAST BREATH",
    'splash.intro':    "Yer yadrosi o'lmoqda. Quyosh tizimining chetiga safar qiling, har bir sayyoradan modul yig'ing va Genesis zarrasini olib qayting. Boshqa pilotlar yordam berishi yoki o'g'irlashi mumkin.",
    'splash.launch':   '▶ LAUNCH',
    'splash.controls': "W/S — gaz   ·   A/D — yaw   ·   Q/E — roll   ·   sichqoncha — qarash   ·   Shift — boost   ·   Space — tormoz   ·   B (hold) — emote   ·   H — hail (do'stlarga ping)",
    'splash.namePlaceholder': 'Pilot nomi',
    'chat.placeholder':       'Xabar yozing... (Enter — yuborish, Esc — bekor)',
    'splash.pilot':           '⬢ PILOT FILE',
    'splash.shipyard':        '⛨ SHIPYARD',
    'splash.daily':           "◆ TODAY'S CHALLENGES",
    'splash.leaderboard':     '★ GLOBAL LEADERBOARD',
    'splash.leaderboardEmpty': "Hali g'olib yo'q. Birinchi bo'ling!",
    'faction.choose':         'FRAKSIYA TANLANG',
    'faction.intro':          'Sizning ishonchingiz galaxyani shakllantiradi.',
    'faction.confirm':        'TASDIQLASH',
    'faction.warTitle':       '⚔ BUGUNGI FRAKSIYA URUSHI',
    'login.title':            '⬢ DAILY LOGIN BONUS',
    'login.streak':           'DAY {day} OF 7  ·  STREAK: {streak}',
    'login.received':         '+{n}⬢ qabul qilindi!',
    'login.hint':             "Ertaga qaytib keling — keyingi sovg'a sizni kutmoqda",
    'login.continue':         '▶ DAVOM ETISH',
    'victory.title':          '✦ MISSION COMPLETE ✦',
    'victory.subtitle':       'HUMANITY SAVED',
    'victory.share':          '𝕏  ULASHISH',
    'victory.newGame':        '▶ NEW GAME',
    'death.title':            'MISSION FAILED',
    'death.respawn':          "Qayta tug'ilish 4 sekundda...",
    'death.share':            '𝕏  ULASHISH',
    'shop.upgrades':          '⛨ UPGRADES',
    'shop.ships':             '◆ SHIPS',
    'shop.credits':           'CREDITS',
    'shop.equip':             'EQUIP',
    'shop.equipped':          '★ EQUIPPED',
    'shop.buy':               'BUY',
    'tutorial.s1':            '⌨ <b>WASD</b> — gaz · <b>A/D</b> — yaw · <b>Q/E</b> — roll',
    'tutorial.s2':            '🖱 <b>Sichqoncha</b> — qarash · <b>LMB</b> — ot · <b>[1/2/3]</b> — qurol',
    'tutorial.s3':            '⚡ <b>[Shift]</b> — boost · <b>[Space]</b> — tormoz · <b>[F]</b> — Jump Gate',
    'tutorial.s4':            '✦ Sayyora yonidagi sariq modulni 14u\'gacha yaqin keling — avtomatik olinadi',
    'tutorial.s5':            '⛽ Past resurs? Sayyoraga 80u dan yaqin uchsangiz <b>doking</b> + recharge',
    'tutorial.s6':            '⛨ <b>[P]</b> — pause + sozlamalar + shipyard (credits → upgrade)',
    'tutorial.s7':            '★ MAQSAD: 7 modul yig\'ing → Neptun\'dan <b>Genesis</b> → Yerga qayting',
    'bp.title':               '★ BATTLE PASS',
    'bp.tier':                'TIER {n}/{max}',
    'bp.rewards':             'MUKOFOTLAR',
    'bp.rewardsReady':        '★ MUKOFOTLAR TAYYOR',
    'bp.maxTier':             'MAX TIER',
    'bp.next':                '→ {label} @ {xp} XP',
    'bp.claim':               'CLAIM',
    'bp.premiumTitle':        '⬡  PREMIUM BATTLE PASS',
    'bp.premiumDesc':         "Har bir tier uchun qo'shimcha mukofot · Maxsus badges · Star Master + 5000⬢ T20'da",
    'bp.premiumUnlock':       '{cost}⬢  UNLOCK',
    'bp.premiumNotEnough':    '{cost}⬢  (yetmaydi)',
    'bp.premiumActive':       "★ PREMIUM AKTIV — barcha tier'lar uchun 2x mukofot",
    'bp.trackFree':           'FREE',
    'bp.trackPrem':           'PREMIUM',
    'bp.tierUp':              '★ BATTLE PASS TIER {tier}! Mukofotni olish: {label}',
    'bp.season':              'SEZON {id}',
    'bp.seasonResetTitle':    '★ YANGI SEZON BOSHLANDI',
    'bp.seasonResetDesc':     "Battle Pass yangi sezonga reset qilindi. Oldingi yutuqlar (kemalar, badges) saqlandi. Yangi tier'lar va mukofotlar kutmoqda!",
    'bp.seasonResetCta':      "▶ KIRISH",
    'bp.seasonEnds':          "Sezon tugashiga: {days} kun",
    'friends.title':          '👥 DO\'STLAR',
    'friends.empty':          "Hali do'stlar yo'q. Kod orqali qo'shing.",
    'friends.online':         '{n} ONLINE',
    'friends.code':           "DO'ST KODI",
    'friends.yourCode':       "Sizning kodingiz: {code}",
    'friends.codeHint':       "Bu kodni do'stlaringizga bering — ular sizni qo'shishlari mumkin",
    'friends.addPlaceholder': '8-belgili kodni kiriting',
    'friends.addBtn':         '+ QO\'SHISH',
    'friends.remove':         'O\'chirish',
    'friends.added':          "✓ {name} do'stlarga qo'shildi",
    'friends.errSelf':        "O'zingizni qo\'sha olmaysiz",
    'friends.errExists':      "Bu pilot allaqachon do'stlaringizda",
    'friends.errNotFound':    'Bu kod bilan pilot topilmadi',
    'friends.errBadCode':     "Kod 8 ta hex belgi bo'lishi kerak",
    'friends.errGeneric':     "Server xatoligi. Keyinroq urinib ko'ring",
    'friends.copied':         '✓ KOD NUSXALANDI',
    'friends.confirmRemove':  "{name} ni do'stlardan o'chirasizmi?",
    'friends.errRateLimit':   "Juda tez urinmoqdasiz. Bir daqiqadan keyin qayta urining.",
    'friends.errLimitMax':    "Do'stlar ro‘yxati to'lgan ({n} max)",
    'lb.tabGlobal':           'GLOBAL',
    'lb.tabFriends':          "DO'STLAR",
    'lb.noFriendScores':      "Do'stlar reytingda hali yo'q",
  },
  en: {
    'splash.subtitle': "SOL'S LAST BREATH",
    'splash.intro':    "Earth's core is dying. Travel to the edge of the solar system, collect modules from each planet, and bring back the Genesis Particle. Other pilots may help — or steal from you.",
    'splash.launch':   '▶ LAUNCH',
    'splash.controls': 'W/S — thrust   ·   A/D — yaw   ·   Q/E — roll   ·   mouse — look   ·   Shift — boost   ·   Space — brake   ·   B (hold) — emote   ·   H — hail (ping friends)',
    'splash.namePlaceholder': 'Pilot name',
    'chat.placeholder':       'Type a message... (Enter — send, Esc — cancel)',
    'splash.pilot':           '⬢ PILOT FILE',
    'splash.shipyard':        '⛨ SHIPYARD',
    'splash.daily':           "◆ TODAY'S CHALLENGES",
    'splash.leaderboard':     '★ GLOBAL LEADERBOARD',
    'splash.leaderboardEmpty': 'No champions yet. Be the first!',
    'faction.choose':         'CHOOSE YOUR FACTION',
    'faction.intro':          'Your beliefs will shape the galaxy.',
    'faction.confirm':        'CONFIRM',
    'faction.warTitle':       "⚔ TODAY'S FACTION WAR",
    'login.title':            '⬢ DAILY LOGIN BONUS',
    'login.streak':           'DAY {day} OF 7  ·  STREAK: {streak}',
    'login.received':         '+{n}⬢ received!',
    'login.hint':             'Come back tomorrow — your next reward awaits',
    'login.continue':         '▶ CONTINUE',
    'victory.title':          '✦ MISSION COMPLETE ✦',
    'victory.subtitle':       'HUMANITY SAVED',
    'victory.share':          '𝕏  SHARE',
    'victory.newGame':        '▶ NEW GAME',
    'death.title':            'MISSION FAILED',
    'death.respawn':          'Respawning in 4 seconds...',
    'death.share':            '𝕏  SHARE',
    'shop.upgrades':          '⛨ UPGRADES',
    'shop.ships':             '◆ SHIPS',
    'shop.credits':           'CREDITS',
    'shop.equip':             'EQUIP',
    'shop.equipped':          '★ EQUIPPED',
    'shop.buy':               'BUY',
    'tutorial.s1':            '⌨ <b>WASD</b> — thrust · <b>A/D</b> — yaw · <b>Q/E</b> — roll',
    'tutorial.s2':            '🖱 <b>Mouse</b> — look · <b>LMB</b> — fire · <b>[1/2/3]</b> — weapon',
    'tutorial.s3':            '⚡ <b>[Shift]</b> — boost · <b>[Space]</b> — brake · <b>[F]</b> — Jump Gate',
    'tutorial.s4':            '✦ Approach the yellow module near a planet within 14u — auto-collected',
    'tutorial.s5':            '⛽ Low on resources? Fly within 80u of a planet to <b>dock</b> + recharge',
    'tutorial.s6':            '⛨ <b>[P]</b> — pause + settings + shipyard (credits → upgrade)',
    'tutorial.s7':            '★ GOAL: collect 7 modules → grab <b>Genesis</b> from Neptune → return to Earth',
    'bp.title':               '★ BATTLE PASS',
    'bp.tier':                'TIER {n}/{max}',
    'bp.rewards':             'REWARDS',
    'bp.rewardsReady':        '★ REWARDS READY',
    'bp.maxTier':             'MAX TIER',
    'bp.next':                '→ {label} @ {xp} XP',
    'bp.claim':               'CLAIM',
    'bp.premiumTitle':        '⬡  PREMIUM BATTLE PASS',
    'bp.premiumDesc':         'Bonus reward per tier · Exclusive badges · Star Master + 5000⬢ at T20',
    'bp.premiumUnlock':       '{cost}⬢  UNLOCK',
    'bp.premiumNotEnough':    '{cost}⬢  (insufficient)',
    'bp.premiumActive':       '★ PREMIUM ACTIVE — bonus rewards on every tier',
    'bp.trackFree':           'FREE',
    'bp.trackPrem':           'PREMIUM',
    'bp.tierUp':              '★ BATTLE PASS TIER {tier}! Claim reward: {label}',
    'bp.season':              'SEASON {id}',
    'bp.seasonResetTitle':    '★ NEW SEASON STARTED',
    'bp.seasonResetDesc':     'Battle Pass has been reset for the new season. Earned ships and badges are preserved. New tiers and rewards await!',
    'bp.seasonResetCta':      '▶ ENTER',
    'bp.seasonEnds':          'Season ends in: {days} days',
    'friends.title':          '👥 FRIENDS',
    'friends.empty':          'No friends yet. Add via friend code.',
    'friends.online':         '{n} ONLINE',
    'friends.code':           'FRIEND CODE',
    'friends.yourCode':       'Your code: {code}',
    'friends.codeHint':       'Share this code so others can add you',
    'friends.addPlaceholder': 'Enter 8-char code',
    'friends.addBtn':         '+ ADD',
    'friends.remove':         'Remove',
    'friends.added':          '✓ {name} added to friends',
    'friends.errSelf':        "You can't add yourself",
    'friends.errExists':      'This pilot is already in your friends',
    'friends.errNotFound':    'No pilot found with this code',
    'friends.errBadCode':     'Code must be 8 hex characters',
    'friends.errGeneric':     'Server error. Try again later',
    'friends.copied':         '✓ CODE COPIED',
    'friends.confirmRemove':  'Remove {name} from friends?',
    'friends.errRateLimit':   'Too many attempts. Try again in a minute.',
    'friends.errLimitMax':    'Friend list is full ({n} max)',
    'lb.tabGlobal':           'GLOBAL',
    'lb.tabFriends':          'FRIENDS',
    'lb.noFriendScores':      'No friend scores yet',
  },
  ru: {
    'splash.subtitle': "ПОСЛЕДНИЙ ВЗДОХ СОЛНЦА",
    'splash.intro':    "Ядро Земли умирает. Путешествуйте к краю Солнечной системы, собирайте модули с каждой планеты и верните Частицу Генезиса. Другие пилоты могут помочь — или украсть.",
    'splash.launch':   '▶ СТАРТ',
    'splash.controls': 'W/S — тяга   ·   A/D — рысканье   ·   Q/E — крен   ·   мышь — обзор   ·   Shift — буст   ·   Space — тормоз   ·   B (удерж.) — эмоция   ·   H — пинг друзьям',
    'splash.namePlaceholder': 'Имя пилота',
    'chat.placeholder':       'Введите сообщение... (Enter — отправить, Esc — отмена)',
    'splash.pilot':           '⬢ ПРОФИЛЬ',
    'splash.shipyard':        '⛨ ВЕРФЬ',
    'splash.daily':           "◆ ЕЖЕДНЕВНЫЕ ИСПЫТАНИЯ",
    'splash.leaderboard':     '★ ТАБЛИЦА ЛИДЕРОВ',
    'splash.leaderboardEmpty': 'Пока нет чемпионов. Будь первым!',
    'faction.choose':         'ВЫБЕРИТЕ ФРАКЦИЮ',
    'faction.intro':          'Ваши убеждения изменят галактику.',
    'faction.confirm':        'ПОДТВЕРДИТЬ',
    'faction.warTitle':       '⚔ ВОЙНА ФРАКЦИЙ СЕГОДНЯ',
    'login.title':            '⬢ ЕЖЕДНЕВНЫЙ БОНУС',
    'login.streak':           'ДЕНЬ {day} ИЗ 7  ·  СЕРИЯ: {streak}',
    'login.received':         '+{n}⬢ получено!',
    'login.hint':             'Возвращайтесь завтра — следующая награда ждёт',
    'login.continue':         '▶ ПРОДОЛЖИТЬ',
    'victory.title':          '✦ МИССИЯ ВЫПОЛНЕНА ✦',
    'victory.subtitle':       'ЧЕЛОВЕЧЕСТВО СПАСЕНО',
    'victory.share':          '𝕏  ПОДЕЛИТЬСЯ',
    'victory.newGame':        '▶ НОВАЯ ИГРА',
    'death.title':            'ПРОВАЛ МИССИИ',
    'death.respawn':          'Возрождение через 4 секунды...',
    'death.share':            '𝕏  ПОДЕЛИТЬСЯ',
    'shop.upgrades':          '⛨ УЛУЧШЕНИЯ',
    'shop.ships':             '◆ КОРАБЛИ',
    'shop.credits':           'КРЕДИТЫ',
    'shop.equip':             'ЭКИПИРОВАТЬ',
    'shop.equipped':          '★ ЭКИПИРОВАН',
    'shop.buy':               'КУПИТЬ',
    'tutorial.s1':            '⌨ <b>WASD</b> — тяга · <b>A/D</b> — рысканье · <b>Q/E</b> — крен',
    'tutorial.s2':            '🖱 <b>Мышь</b> — обзор · <b>ЛКМ</b> — огонь · <b>[1/2/3]</b> — оружие',
    'tutorial.s3':            '⚡ <b>[Shift]</b> — буст · <b>[Space]</b> — тормоз · <b>[F]</b> — Jump Gate',
    'tutorial.s4':            '✦ Приблизьтесь к жёлтому модулю у планеты на 14u — авто-сбор',
    'tutorial.s5':            '⛽ Мало ресурсов? Подлетите к планете на 80u — <b>стыковка</b> + зарядка',
    'tutorial.s6':            '⛨ <b>[P]</b> — пауза + настройки + верфь (кредиты → улучшение)',
    'tutorial.s7':            '★ ЦЕЛЬ: соберите 7 модулей → возьмите <b>Генезис</b> с Нептуна → вернитесь на Землю',
    'bp.title':               '★ БОЕВОЙ ПРОПУСК',
    'bp.tier':                'УРОВЕНЬ {n}/{max}',
    'bp.rewards':             'НАГРАДЫ',
    'bp.rewardsReady':        '★ НАГРАДЫ ГОТОВЫ',
    'bp.maxTier':             'МАКС. УРОВЕНЬ',
    'bp.next':                '→ {label} @ {xp} XP',
    'bp.claim':               'ЗАБРАТЬ',
    'bp.premiumTitle':        '⬡  PREMIUM БОЕВОЙ ПРОПУСК',
    'bp.premiumDesc':         'Бонус на каждом уровне · Эксклюзивные значки · Star Master + 5000⬢ на T20',
    'bp.premiumUnlock':       '{cost}⬢  АКТИВИРОВАТЬ',
    'bp.premiumNotEnough':    '{cost}⬢  (недостаточно)',
    'bp.premiumActive':       '★ PREMIUM АКТИВЕН — бонусы на каждом уровне',
    'bp.trackFree':           'FREE',
    'bp.trackPrem':           'PREMIUM',
    'bp.tierUp':              '★ УРОВЕНЬ {tier}! Заберите награду: {label}',
    'bp.season':              'СЕЗОН {id}',
    'bp.seasonResetTitle':    '★ НОВЫЙ СЕЗОН НАЧАЛСЯ',
    'bp.seasonResetDesc':     'Боевой пропуск сброшен для нового сезона. Полученные корабли и значки сохранены. Новые уровни и награды ждут!',
    'bp.seasonResetCta':      '▶ ВОЙТИ',
    'bp.seasonEnds':          'До конца сезона: {days} дн.',
    'friends.title':          '👥 ДРУЗЬЯ',
    'friends.empty':          'Друзей пока нет. Добавьте по коду.',
    'friends.online':         '{n} ONLINE',
    'friends.code':           'КОД ДРУГА',
    'friends.yourCode':       'Ваш код: {code}',
    'friends.codeHint':       'Поделитесь кодом — друзья смогут вас добавить',
    'friends.addPlaceholder': 'Введите 8-символьный код',
    'friends.addBtn':         '+ ДОБАВИТЬ',
    'friends.remove':         'Удалить',
    'friends.added':          '✓ {name} добавлен в друзья',
    'friends.errSelf':        'Нельзя добавить себя',
    'friends.errExists':      'Этот пилот уже в друзьях',
    'friends.errNotFound':    'Пилот с таким кодом не найден',
    'friends.errBadCode':     'Код должен быть из 8 hex-символов',
    'friends.errGeneric':     'Ошибка сервера. Попробуйте позже',
    'friends.copied':         '✓ КОД СКОПИРОВАН',
    'friends.confirmRemove':  'Удалить {name} из друзей?',
    'friends.errRateLimit':   'Слишком много попыток. Попробуйте через минуту.',
    'friends.errLimitMax':    'Список друзей переполнен ({n} max)',
    'lb.tabGlobal':           'ГЛОБАЛЬНЫЙ',
    'lb.tabFriends':          'ДРУЗЬЯ',
    'lb.noFriendScores':      'Результатов друзей пока нет',
  },
};
const I18N_KEY = 'odyssey.lang';
function detectDefaultLang() {
  try {
    const saved = localStorage.getItem(I18N_KEY);
    if (saved && I18N[saved]) return saved;
  } catch {}
  const browser = (navigator.language || 'uz').toLowerCase();
  if (browser.startsWith('ru')) return 'ru';
  if (browser.startsWith('en')) return 'en';
  return 'uz';
}
let currentLang = detectDefaultLang();
function t(key, vars) {
  const dict = I18N[currentLang] || I18N.uz;
  let str = (dict[key] !== undefined ? dict[key] : (I18N.uz[key] || key));
  if (vars) {
    for (const k in vars) str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), vars[k]);
  }
  return str;
}
function applyTranslations(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  scope.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  scope.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
}
function setLang(code) {
  if (!I18N[code]) return;
  currentLang = code;
  try { localStorage.setItem(I18N_KEY, code); } catch {}
  applyTranslations();
  // Update lang pills
  document.querySelectorAll('.lang-pill').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === code);
  });
  // Re-render dynamic splash panels (if they exist)
  if (typeof renderDailySplash === 'function') renderDailySplash();
  if (typeof renderLeaderboardSplash === 'function') renderLeaderboardSplash();
  if (typeof renderFactionSplash === 'function') renderFactionSplash();
  if (typeof renderBattlePassSplash === 'function') renderBattlePassSplash();
  if (typeof renderFriendsSplash === 'function') renderFriendsSplash();
  document.documentElement.lang = code;
}
// Apply on first load
document.addEventListener('DOMContentLoaded', () => applyTranslations());
applyTranslations(); // also try immediately (in case DOM already ready)
// Wire pill click
document.addEventListener('click', (e) => {
  const pill = e.target.closest('.lang-pill');
  if (!pill) return;
  setLang(pill.dataset.lang);
});
// Mark current pill active on init (after DOM ready)
setTimeout(() => {
  document.querySelectorAll('.lang-pill').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });
  document.documentElement.lang = currentLang;
}, 50);

// ---------- BOOT LOADER ----------
const _bootStatus = document.getElementById('bootStatus');
const _bootLoader = document.getElementById('boot-loader');
function setBootStatus(text) {
  if (_bootStatus) _bootStatus.textContent = text;
}
function hideBootLoader() {
  if (_bootLoader && !_bootLoader.classList.contains('hidden')) {
    _bootLoader.classList.add('hidden');
    setTimeout(() => { if (_bootLoader) _bootLoader.remove(); }, 700);
  }
}
setBootStatus('Loading Three.js...');

// ---------- PERFORMANCE MONITOR (stats.js — toggle with backtick `) ----------
let perfStats = null;
if (typeof Stats !== 'undefined') {
  perfStats = new Stats();
  perfStats.showPanel(0); // 0=FPS, 1=MS, 2=MB
  perfStats.dom.style.cssText = 'position:fixed;top:0;left:0;z-index:1000;display:none;';
  document.body.appendChild(perfStats.dom);
  let panelIdx = 0;
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Backquote') {
      e.preventDefault();
      const isHidden = perfStats.dom.style.display === 'none';
      if (isHidden) {
        perfStats.dom.style.display = 'block';
      } else {
        // Cycle FPS → MS → MB → off
        panelIdx = (panelIdx + 1) % 4;
        if (panelIdx === 3) {
          perfStats.dom.style.display = 'none';
          panelIdx = 0;
        } else {
          perfStats.showPanel(panelIdx);
        }
      }
    }
  });
}

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);
const splash = $('splash');
const launchBtn = $('launchBtn');
const nameInput = $('nameInput');
const aidaText = $('aidaText');
const chatBox = $('chat');
const chatInput = $('chatInput');
const targetsLayer = $('targets');

// ---------- WEB AUDIO (procedural SFX, no asset files) ----------
let audioCtx = null;
let masterGain = null;
let engineOsc = null;
let engineGain = null;
let engineFilter = null;
let sfxMuted = false;
const SFX_VOLUME = 0.55;

function ensureAudio() {
  if (audioCtx) return audioCtx;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = sfxMuted ? 0 : SFX_VOLUME;
    masterGain.connect(audioCtx.destination);
  } catch (e) {
    audioCtx = null;
  }
  return audioCtx;
}

function setMuted(m) {
  sfxMuted = m;
  if (masterGain) {
    masterGain.gain.linearRampToValueAtTime(m ? 0 : SFX_VOLUME, audioCtx.currentTime + 0.05);
  }
  const btn = document.getElementById('muteBtn');
  if (btn) btn.textContent = m ? '🔇' : '🔊';
}

function playTone(freq, duration, type = 'sine', vol = 0.3, freqEnd = null) {
  const ctx = ensureAudio();
  if (!ctx || sfxMuted) return;
  const t0 = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd != null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t0 + duration);
  }
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function playNoise(duration, vol = 0.3, filterFreq = null, lowpass = true) {
  const ctx = ensureAudio();
  if (!ctx || sfxMuted) return;
  const t0 = ctx.currentTime;
  const buffer = ctx.createBuffer(1, Math.max(1, ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  let last = src;
  if (filterFreq) {
    const filt = ctx.createBiquadFilter();
    filt.type = lowpass ? 'lowpass' : 'highpass';
    filt.frequency.value = filterFreq;
    src.connect(filt);
    last = filt;
  }
  last.connect(gain);
  gain.connect(masterGain);
  src.start(t0);
}

// SFX library — short, recognizable
const SFX = {
  laser:     () => playTone(1400, 0.12, 'square', 0.18, 280),
  missile:   () => { playTone(220, 0.5, 'sawtooth', 0.18, 60); playNoise(0.45, 0.10, 1200, true); },
  mine:      () => playTone(140, 0.18, 'sine', 0.22, 60),
  explosion: () => { playNoise(0.55, 0.45, 700, true); playTone(80, 0.4, 'sawtooth', 0.28, 30); },
  hitThud:   () => { playTone(150, 0.20, 'sawtooth', 0.32, 55); playNoise(0.12, 0.18, 600, true); },
  pickup:    () => { playTone(740, 0.08, 'sine', 0.2); setTimeout(() => playTone(1180, 0.10, 'sine', 0.22), 70); },
  beep:      () => playTone(950, 0.05, 'sine', 0.10),
  warn:      () => playTone(440, 0.18, 'square', 0.18),
  alarm:     () => { playTone(640, 0.08, 'square', 0.22); setTimeout(() => playTone(480, 0.08, 'square', 0.22), 110); },
  jump:      () => playTone(220, 0.6, 'sine', 0.25, 1100),
  bossSpawn: () => { playTone(50, 1.4, 'sawtooth', 0.40, 28); setTimeout(() => playTone(95, 0.9, 'square', 0.20, 38), 220); },
  lightning: () => { playNoise(0.18, 0.55, 5000, false); playTone(110, 0.25, 'sawtooth', 0.18, 40); },
  trade:     () => { playTone(820, 0.10, 'sine', 0.15); setTimeout(() => playTone(1040, 0.10, 'sine', 0.18), 80); setTimeout(() => playTone(1320, 0.12, 'sine', 0.20), 160); },
  pirateFire:() => playTone(640, 0.10, 'square', 0.16, 240),
  bossFire:  () => playTone(180, 0.18, 'sawtooth', 0.20, 80),
  notify:    () => { playTone(880, 0.10, 'sine', 0.16); setTimeout(() => playTone(1320, 0.14, 'sine', 0.18), 90); },
};

// ---------- AMBIENT MUSIC (procedural drone + sparkle notes) ----------
let musicNodes = null;
let musicMuted = false;
function startAmbientMusic() {
  const ctx = ensureAudio();
  if (!ctx || musicNodes) return;
  const musicGain = ctx.createGain();
  musicGain.gain.value = musicMuted ? 0 : 0.42;
  musicGain.connect(masterGain);

  // Detuned harmonic drone (root, 5th, octave, octave+5th)
  const freqs = [55, 82.5, 110, 165];
  const oscs = [];
  for (const f of freqs) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.005);
    const g = ctx.createGain();
    g.gain.value = 0.022 + Math.random() * 0.018;
    o.connect(g);
    g.connect(musicGain);
    o.start();
    oscs.push({ osc: o, gain: g });
  }

  // Soft pad layer (triangle, slightly detuned)
  const pad = ctx.createOscillator();
  pad.type = 'triangle';
  pad.frequency.value = 220;
  const padGain = ctx.createGain();
  padGain.gain.value = 0.012;
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.value = 1200;
  pad.connect(padFilter);
  padFilter.connect(padGain);
  padGain.connect(musicGain);
  pad.start();

  // LFO modulating musicGain for slow breathing
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.08; // ~12s cycle
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.10;
  lfo.connect(lfoGain);
  lfoGain.connect(musicGain.gain);
  lfo.start();

  // Sparkle notes (minor pentatonic) every ~6-14s
  const sparkleNotes = [523.25, 622.25, 698.46, 880, 1046.5]; // C5, D#5, F5, A5, C6
  const sparkleInterval = setInterval(() => {
    if (sfxMuted || musicMuted) return;
    if (Math.random() < 0.65) {
      const f = sparkleNotes[Math.floor(Math.random() * sparkleNotes.length)];
      // Soft sine tone with long fade
      const t0 = ctx.currentTime;
      const so = ctx.createOscillator();
      so.type = 'sine';
      so.frequency.value = f;
      const sg = ctx.createGain();
      sg.gain.setValueAtTime(0.0001, t0);
      sg.gain.exponentialRampToValueAtTime(0.05, t0 + 0.4);
      sg.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.4);
      so.connect(sg);
      sg.connect(musicGain);
      so.start(t0);
      so.stop(t0 + 2.6);
    }
  }, 7500);

  // ----- COMBAT LAYER (adaptive: fades in during danger) -----
  const combatGain = ctx.createGain();
  combatGain.gain.value = 0;
  combatGain.connect(musicGain);

  const combatFilter = ctx.createBiquadFilter();
  combatFilter.type = 'lowpass';
  combatFilter.frequency.value = 220;
  combatFilter.Q.value = 5;
  combatFilter.connect(combatGain);

  // 2 detuned sawtooths in tense minor 3rd interval
  const combatOscs = [];
  for (const f of [110, 130.81]) {
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = 0.5;
    o.connect(g);
    g.connect(combatFilter);
    o.start();
    combatOscs.push({ osc: o, gain: g });
  }
  // Heartbeat LFO (1.2 → 2.4 Hz with intensity)
  const combatLfo = ctx.createOscillator();
  combatLfo.type = 'sine';
  combatLfo.frequency.value = 1.4;
  const combatLfoGain = ctx.createGain();
  combatLfoGain.gain.value = 0.0;
  combatLfo.connect(combatLfoGain);
  combatLfoGain.connect(combatGain.gain);
  combatLfo.start();

  musicNodes = {
    oscs, pad, lfo, musicGain, sparkleInterval,
    combat: {
      combatGain, combatFilter, combatOscs, combatLfo, combatLfoGain,
    },
  };
}

// ---------- ADAPTIVE MUSIC ----------
let combatIntensity = 0;
let lastCombatTriggerT = 0;
let lastHullSeen = 100;

function trackCombatPulse() {
  lastCombatTriggerT = performance.now();
}

function updateAdaptiveMusic(dt) {
  if (!musicNodes || !musicNodes.combat || !audioCtx) return;
  if (musicMuted) return;

  // Determine target intensity
  let target = 0;
  // (1) Pirates in proximity
  if (typeof pirates !== 'undefined') {
    for (const p of pirates) {
      const d = state.pos.distanceTo(p.mesh.position);
      if (d < 280) target = Math.max(target, 1 - d / 280);
    }
  }
  // (2) Recent damage (hull decrement detection)
  if (state.hull < lastHullSeen - 0.5) trackCombatPulse();
  lastHullSeen = state.hull;
  // (3) Recent fire / hit
  const since = performance.now() - lastCombatTriggerT;
  if (since < 5000) target = Math.max(target, 1 - since / 5000);
  // (4) Enemy faction player nearby
  if (profile && profile.faction && typeof otherPlayers !== 'undefined') {
    for (const [, o] of otherPlayers) {
      if (!o.faction || !isEnemy(profile.faction, o.faction)) continue;
      const d = state.pos.distanceTo(o.mesh.position);
      if (d < 320) target = Math.max(target, 1 - d / 320);
    }
  }
  // (5) Boss nearby
  if (typeof bossActive !== 'undefined' && bossActive) target = Math.max(target, 0.7);

  // Smooth lerp (faster ramp-up than ramp-down for dramatic effect)
  const lerpRate = target > combatIntensity ? 1.6 : 0.5;
  combatIntensity += (target - combatIntensity) * Math.min(1, dt * lerpRate);
  combatIntensity = Math.max(0, Math.min(1, combatIntensity));

  // Apply to nodes
  const c = musicNodes.combat;
  const t = audioCtx.currentTime;
  // Filter cutoff opens
  c.combatFilter.frequency.cancelScheduledValues(t);
  c.combatFilter.frequency.linearRampToValueAtTime(220 + combatIntensity * 1400, t + 0.15);
  // Gain
  const targetGain = combatIntensity * 0.085;
  c.combatGain.gain.cancelScheduledValues(t);
  c.combatGain.gain.linearRampToValueAtTime(targetGain, t + 0.15);
  // Heartbeat LFO depth
  c.combatLfoGain.gain.cancelScheduledValues(t);
  c.combatLfoGain.gain.linearRampToValueAtTime(combatIntensity * 0.05, t + 0.15);
  // Heartbeat tempo
  c.combatLfo.frequency.cancelScheduledValues(t);
  c.combatLfo.frequency.linearRampToValueAtTime(1.2 + combatIntensity * 1.2, t + 0.3);
}

function setMusicMuted(m) {
  musicMuted = m;
  if (musicNodes && musicNodes.musicGain && audioCtx) {
    musicNodes.musicGain.gain.linearRampToValueAtTime(m ? 0 : 0.42, audioCtx.currentTime + 0.3);
  }
  const btn = document.getElementById('musicBtn');
  if (btn) btn.textContent = m ? '🎵̸' : '🎵';
}

function startEngineHum() {
  const ctx = ensureAudio();
  if (!ctx || engineOsc) return;
  engineOsc = ctx.createOscillator();
  engineOsc.type = 'sawtooth';
  engineOsc.frequency.value = 55;
  engineFilter = ctx.createBiquadFilter();
  engineFilter.type = 'lowpass';
  engineFilter.frequency.value = 350;
  engineGain = ctx.createGain();
  engineGain.gain.value = 0;
  engineOsc.connect(engineFilter);
  engineFilter.connect(engineGain);
  engineGain.connect(masterGain);
  engineOsc.start();
}
function setEngineLevel(thrustOn, boost) {
  if (!engineGain || !audioCtx) return;
  const t = audioCtx.currentTime;
  const target = thrustOn ? (boost ? 0.16 : 0.08) : 0.0;
  engineGain.gain.linearRampToValueAtTime(target, t + 0.12);
  engineOsc.frequency.linearRampToValueAtTime(thrustOn ? (boost ? 115 : 72) : 55, t + 0.12);
  if (engineFilter) engineFilter.frequency.linearRampToValueAtTime(thrustOn ? (boost ? 700 : 420) : 300, t + 0.12);
}

// ---------- Three.js ----------
const renderer = new THREE.WebGLRenderer({
  canvas: $('scene'),
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

setBootStatus('Building scene...');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02030a);
scene.fog = null;

const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 1, 150000);

// ---------- Postprocessing (Bloom for stunning glow) ----------
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.55,  // strength (calmer, no screen blowout)
  0.45,  // radius
  0.65   // threshold (only really bright stuff: sun, lasers, beacons)
);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  composer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- Starfield (layered + colored) ----------
function makeStarLayer(N, rMin, rMax, sizeMin, sizeMax, colored) {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const sizes = new Float32Array(N);
  const palette = [
    [1.0, 1.0, 1.0],
    [0.85, 0.92, 1.0],
    [1.0, 0.92, 0.78],
    [1.0, 0.78, 0.65],
    [0.78, 0.88, 1.0],
    [1.0, 0.85, 1.0],
  ];
  for (let i = 0; i < N; i++) {
    const r = rMin + Math.random() * (rMax - rMin);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i*3+0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    const c = colored ? palette[(Math.random() * palette.length) | 0] : [1, 1, 1];
    const b = 0.6 + Math.random() * 0.4;
    colors[i*3+0] = c[0] * b;
    colors[i*3+1] = c[1] * b;
    colors[i*3+2] = c[2] * b;
    sizes[i] = sizeMin + Math.random() * (sizeMax - sizeMin);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  // Soft circular star sprite texture
  const starTex = makeStarSpriteTexture();
  const mat = new THREE.PointsMaterial({
    size: (sizeMin + sizeMax) / 2,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: starTex,
    alphaTest: 0.01,
  });
  return new THREE.Points(geo, mat);
}
function makeStarSpriteTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.3, 'rgba(255,255,255,0.7)');
  grd.addColorStop(0.65, 'rgba(255,255,255,0.15)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
// Far background stars (dense, dim)
scene.add(makeStarLayer(7000, 80000, 100000, 40, 80, true));
// Mid layer (sparse, brighter, colored)
scene.add(makeStarLayer(900, 30000, 60000, 80, 180, true));

// ---------- LENS FLARE (DOM-based, sun-driven) ----------
const lensFlareLayer = document.createElement('div');
lensFlareLayer.id = 'lens-flare';
document.body.appendChild(lensFlareLayer);

const FLARE_GHOSTS = [
  { offset: 0.0,  size: 320, color: 'rgba(255, 230, 140, 0.85)', halo: 'rgba(255, 200, 100, 0.6)' },
  { offset: 0.35, size: 90,  color: 'rgba(255, 180, 80, 0.45)',  halo: null },
  { offset: 0.6,  size: 36,  color: 'rgba(120, 200, 255, 0.32)', halo: null },
  { offset: 0.85, size: 120, color: 'rgba(255, 110, 60, 0.38)',  halo: null },
  { offset: 1.15, size: 22,  color: 'rgba(150, 220, 255, 0.45)', halo: null },
  { offset: 1.4,  size: 60,  color: 'rgba(255, 220, 120, 0.25)', halo: null },
  { offset: -0.25, size: 16, color: 'rgba(255, 200, 120, 0.35)', halo: null },
];
const flareElements = FLARE_GHOSTS.map(g => {
  const el = document.createElement('div');
  el.className = 'flare-ghost';
  el.style.width = el.style.height = g.size + 'px';
  el.style.background = `radial-gradient(circle, ${g.color} 0%, transparent 70%)`;
  if (g.halo) el.style.boxShadow = `0 0 60px ${g.halo}`;
  lensFlareLayer.appendChild(el);
  return el;
});
// Horizontal streak (anamorphic lens artifact)
const flareStreak = document.createElement('div');
flareStreak.className = 'flare-streak';
lensFlareLayer.appendChild(flareStreak);

const _flareScreen = new THREE.Vector3();
const _flareDir = new THREE.Vector3();
const _flareTmp1 = new THREE.Vector3();
const _flareTmp2 = new THREE.Vector3();
let lensFlareEnabled = true;

function updateLensFlare() {
  if (!lensFlareEnabled) {
    lensFlareLayer.style.opacity = '0';
    return;
  }
  const sunMesh = planetMeshes['sun'];
  if (!sunMesh) { lensFlareLayer.style.opacity = '0'; return; }

  // 1. Sun direction relative to camera
  _flareDir.copy(sunMesh.position).sub(camera.position);
  const sunDist = _flareDir.length();
  _flareDir.normalize();
  // 2. Camera forward
  const camFwd = _flareTmp1.set(0, 0, -1).applyQuaternion(camera.quaternion);
  const facing = _flareDir.dot(camFwd);
  if (facing < 0.05) {
    lensFlareLayer.style.opacity = '0';
    return;
  }
  // 3. Project sun to screen
  const onScreen = projectToScreen(sunMesh.position, _flareScreen);
  if (!onScreen) {
    lensFlareLayer.style.opacity = '0';
    return;
  }
  // 4. Occlusion: planet between camera and sun?
  let occluded = false;
  for (const p of PLANETS) {
    if (p.isStar) continue;
    const planetPos = planetMeshes[p.key].position;
    // Distance from planet center to ray (camera→sun)
    const toPlanet = _flareTmp1.copy(planetPos).sub(camera.position);
    const t = toPlanet.dot(_flareDir);
    if (t < 0 || t > sunDist) continue; // planet behind cam or beyond sun
    const closestPoint = _flareTmp2.copy(camera.position).addScaledVector(_flareDir, t);
    if (closestPoint.distanceTo(planetPos) < p.r * 1.05) { occluded = true; break; }
  }
  if (occluded) {
    // Smooth fade-out when occluded
    const cur = parseFloat(lensFlareLayer.style.opacity || '0');
    lensFlareLayer.style.opacity = Math.max(0, cur - 0.08).toFixed(2);
    return;
  }
  // 5. Intensity (facing + distance falloff)
  const facingFalloff = Math.pow(Math.max(0, facing), 1.4);
  const distFalloff = Math.min(1, 9000 / Math.max(sunDist, 800));
  const intensity = Math.min(1, facingFalloff * distFalloff * 1.6);

  // 6. Position ghosts along line from sun → screen center
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  const dx = cx - _flareScreen.x, dy = cy - _flareScreen.y;

  // Smooth opacity ramp toward target
  const target = intensity;
  const cur = parseFloat(lensFlareLayer.style.opacity || '0');
  const next = cur + (target - cur) * 0.18;
  lensFlareLayer.style.opacity = next.toFixed(3);

  for (let i = 0; i < flareElements.length; i++) {
    const g = FLARE_GHOSTS[i];
    const el = flareElements[i];
    const x = _flareScreen.x + dx * g.offset;
    const y = _flareScreen.y + dy * g.offset;
    el.style.transform = `translate(${(x - g.size / 2).toFixed(1)}px, ${(y - g.size / 2).toFixed(1)}px)`;
  }
  // Streak rotated along ghost line, anchored on sun
  const angle = Math.atan2(dy, dx);
  flareStreak.style.transform =
    `translate(${_flareScreen.x.toFixed(1)}px, ${_flareScreen.y.toFixed(1)}px) rotate(${angle.toFixed(3)}rad)`;
  flareStreak.style.opacity = (intensity * 0.85).toFixed(2);
}

// ---------- COSMIC DUST (parallax depth around camera) ----------
const cosmicDust = (() => {
  const N = 500;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const baseHues = [0.55, 0.62, 0.78, 0.05]; // cyan/blue/violet/amber
  for (let i = 0; i < N; i++) {
    // Spherical distribution in radius 800-1500
    const u = Math.random(), v = Math.random();
    const theta = u * 2 * Math.PI;
    const phi = Math.acos(2 * v - 1);
    const r = 800 + Math.random() * 700;
    positions[i*3+0] = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);
    const c = new THREE.Color().setHSL(
      baseHues[i % baseHues.length] + (Math.random() - 0.5) * 0.08,
      0.4 + Math.random() * 0.3,
      0.55 + Math.random() * 0.25
    );
    colors[i*3+0] = c.r; colors[i*3+1] = c.g; colors[i*3+2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 4, sizeAttenuation: true, vertexColors: true,
    transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false,
    map: makeStarSpriteTexture(),
  });
  return new THREE.Points(geo, mat);
})();
scene.add(cosmicDust);
function updateCosmicDust(dt) {
  cosmicDust.position.copy(state.pos);
  cosmicDust.rotation.y += dt * 0.012;
  cosmicDust.rotation.x += dt * 0.005;
}

// Distant nebula clouds — rich multi-blob structures (parent + satellite puffs)
const nebulaCloudTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  // Layered radial gradient with noise for organic feel
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0,    'rgba(255,255,255,0.65)');
  grd.addColorStop(0.25, 'rgba(255,255,255,0.32)');
  grd.addColorStop(0.55, 'rgba(255,255,255,0.12)');
  grd.addColorStop(1,    'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  // Sprinkle small bright noise blobs for variation
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 256, y = Math.random() * 256;
    const r = 4 + Math.random() * 14;
    const a = 0.05 + Math.random() * 0.18;
    const ng = g.createRadialGradient(x, y, 0, x, y, r);
    ng.addColorStop(0, `rgba(255,255,255,${a})`);
    ng.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = ng;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  return new THREE.CanvasTexture(c);
})();

function makeRichNebula(color, cx, cy, cz, baseSize) {
  // Main core blob
  const core = new THREE.Sprite(new THREE.SpriteMaterial({
    map: nebulaCloudTex, color, transparent: true, opacity: 0.42,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  core.position.set(cx, cy, cz);
  core.scale.set(baseSize, baseSize, 1);
  scene.add(core);
  // Satellite puffs (8-12) with color variation
  const baseColor = new THREE.Color(color);
  const numSats = 9 + Math.floor(Math.random() * 4);
  for (let i = 0; i < numSats; i++) {
    const c2 = baseColor.clone();
    // Slight hue/intensity variation
    const hsl = { h: 0, s: 0, l: 0 };
    c2.getHSL(hsl);
    hsl.h = (hsl.h + (Math.random() - 0.5) * 0.08 + 1) % 1;
    hsl.l = Math.max(0.1, Math.min(0.7, hsl.l + (Math.random() - 0.5) * 0.25));
    c2.setHSL(hsl.h, hsl.s, hsl.l);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: nebulaCloudTex, color: c2, transparent: true,
      opacity: 0.20 + Math.random() * 0.22,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    const ang = Math.random() * Math.PI * 2;
    const dist = baseSize * (0.35 + Math.random() * 0.7);
    s.position.set(
      cx + Math.cos(ang) * dist,
      cy + (Math.random() - 0.5) * baseSize * 0.4,
      cz + Math.sin(ang) * dist
    );
    const sz = baseSize * (0.35 + Math.random() * 0.55);
    s.scale.set(sz, sz, 1);
    scene.add(s);
  }
  // Bright stellar embers (small bright dots inside the cloud)
  for (let i = 0; i < 6; i++) {
    const ember = new THREE.Sprite(new THREE.SpriteMaterial({
      map: nebulaCloudTex, color: 0xffffff, transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    const ang = Math.random() * Math.PI * 2;
    const dist = baseSize * (0.1 + Math.random() * 0.4);
    ember.position.set(
      cx + Math.cos(ang) * dist,
      cy + (Math.random() - 0.5) * baseSize * 0.2,
      cz + Math.sin(ang) * dist
    );
    const sz = baseSize * 0.04;
    ember.scale.set(sz, sz, 1);
    scene.add(ember);
  }
}
makeRichNebula(0x7a44cc, -40000, 8000, 30000, 35000);  // Purple
makeRichNebula(0xcc4488, 50000, -5000, -25000, 30000); // Magenta
makeRichNebula(0x4488dd, 10000, -10000, 50000, 40000); // Blue
makeRichNebula(0x33cc88, -25000, 15000, -45000, 28000);// Teal
makeRichNebula(0xff8844, 35000, 12000, 45000, 26000);  // Orange
makeRichNebula(0x9966dd, -45000, -12000, -38000, 32000); // Lavender

// ---------- Galactic Spiral Disc (background) ----------
(function makeGalaxyDisc() {
  const N = 4000;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const center = new THREE.Vector3(-55000, -8000, 35000);
  for (let i = 0; i < N; i++) {
    const arm = (i % 3);
    const t = Math.pow(Math.random(), 0.7) * 7;
    const armAngle = arm * (Math.PI * 2 / 3) + t * 1.4 + (Math.random() - 0.5) * 0.7;
    const r = t * 4500 + Math.random() * 1500;
    const y = (Math.random() - 0.5) * Math.exp(-t * 0.4) * 2500;
    positions[i*3+0] = center.x + Math.cos(armAngle) * r;
    positions[i*3+1] = center.y + y;
    positions[i*3+2] = center.z + Math.sin(armAngle) * r;
    const intensity = 0.5 + (1 - t / 7) * 0.5;
    // Bluer at edges, yellower in core
    const core = 1 - t / 7;
    colors[i*3+0] = (0.6 + core * 0.4) * intensity;
    colors[i*3+1] = (0.55 + core * 0.35) * intensity;
    colors[i*3+2] = (0.85 - core * 0.15) * intensity;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 220, vertexColors: true, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  scene.add(new THREE.Points(geo, mat));
  // Bright galactic core
  const coreSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    color: 0xffeecc, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  coreSprite.position.copy(center);
  coreSprite.scale.set(4500, 4500, 1);
  scene.add(coreSprite);
})();

// ---------- Andromeda-like distant galaxy (smaller, opposite side, tilted) ----------
(function makeAndromeda() {
  const N = 1800;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const center = new THREE.Vector3(60000, 12000, -40000);
  // Tilt axis (rotates the disk so we see it edge-on-ish)
  const tiltX = Math.PI * 0.32;
  const tiltZ = Math.PI * 0.18;
  const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);
  const cosZ = Math.cos(tiltZ), sinZ = Math.sin(tiltZ);
  for (let i = 0; i < N; i++) {
    const arm = i % 2;
    const t = Math.pow(Math.random(), 0.6) * 6;
    const armAngle = arm * Math.PI + t * 1.6 + (Math.random() - 0.5) * 0.6;
    const r = t * 2200 + Math.random() * 700;
    let x = Math.cos(armAngle) * r;
    let y = (Math.random() - 0.5) * Math.exp(-t * 0.5) * 1200;
    let z = Math.sin(armAngle) * r;
    // Apply tilt (X then Z)
    const y1 = y * cosX - z * sinX;
    const z1 = y * sinX + z * cosX;
    const x2 = x * cosZ - y1 * sinZ;
    const y2 = x * sinZ + y1 * cosZ;
    positions[i*3+0] = center.x + x2;
    positions[i*3+1] = center.y + y2;
    positions[i*3+2] = center.z + z1;
    const intensity = 0.55 + (1 - t / 6) * 0.45;
    const core = 1 - t / 6;
    colors[i*3+0] = (0.85 + core * 0.15) * intensity;
    colors[i*3+1] = (0.7 + core * 0.25) * intensity;
    colors[i*3+2] = (0.6 + core * 0.20) * intensity;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 180, vertexColors: true, transparent: true, opacity: 0.75,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  scene.add(new THREE.Points(geo, mat));
  // Galaxy core glow (warm)
  const coreSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    color: 0xffd9a8, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  coreSprite.position.copy(center);
  coreSprite.scale.set(2800, 2800, 1);
  scene.add(coreSprite);
})();

// ---------- DEEP SPACE SUPERNOVAE (rare bright flashes far away) ----------
const supernovae = []; // { sprite, life, max, size }
let supernovaT = 25 + Math.random() * 35;
function spawnSupernova() {
  // Random direction at deep distance
  const ang = Math.random() * Math.PI * 2;
  const elev = (Math.random() - 0.5) * Math.PI * 0.5;
  const dist = 70000 + Math.random() * 25000;
  const pos = new THREE.Vector3(
    Math.cos(ang) * Math.cos(elev) * dist,
    Math.sin(elev) * dist,
    Math.sin(ang) * Math.cos(elev) * dist
  );
  const tints = [0xffffff, 0xaaccff, 0xffcc88, 0xffaaaa];
  const tint = tints[Math.floor(Math.random() * tints.length)];
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: nebulaCloudTex, color: tint, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  sprite.position.copy(pos);
  const peakSize = 2200 + Math.random() * 2600;
  sprite.scale.set(peakSize * 0.1, peakSize * 0.1, 1);
  scene.add(sprite);
  supernovae.push({ sprite, life: 0, max: 5.5 + Math.random() * 2.5, peakSize, tint });
}
function updateSupernovae(dt) {
  supernovaT -= dt;
  if (supernovaT <= 0) {
    spawnSupernova();
    supernovaT = 30 + Math.random() * 60;
  }
  for (let i = supernovae.length - 1; i >= 0; i--) {
    const s = supernovae[i];
    s.life += dt;
    const t = s.life / s.max;
    // Brightness curve: rapid rise, slow fade
    let bright;
    if (t < 0.15) bright = (t / 0.15);
    else bright = Math.pow(1 - (t - 0.15) / 0.85, 2.2);
    s.sprite.material.opacity = Math.max(0, bright * 0.95);
    const sz = s.peakSize * (0.25 + bright * 0.85);
    s.sprite.scale.set(sz, sz, 1);
    if (s.life >= s.max) {
      scene.remove(s.sprite);
      supernovae.splice(i, 1);
    }
  }
}

// ---------- SHOOTING STARS (brief streaks across deep space) ----------
const shootingStars = [];
let shootingStarT = 6 + Math.random() * 10;
function spawnShootingStar() {
  // Pick a random distant point, then a velocity tangent to camera
  const ang = Math.random() * Math.PI * 2;
  const elev = (Math.random() - 0.5) * Math.PI * 0.6;
  const dist = 45000 + Math.random() * 15000;
  const pos = new THREE.Vector3(
    Math.cos(ang) * Math.cos(elev) * dist,
    Math.sin(elev) * dist,
    Math.sin(ang) * Math.cos(elev) * dist
  );
  // Velocity perpendicular-ish to view direction
  const dir = new THREE.Vector3(
    (Math.random() - 0.5),
    (Math.random() - 0.5) * 0.4,
    (Math.random() - 0.5)
  ).normalize().multiplyScalar(2200 + Math.random() * 1800);
  // Streak as elongated sprite
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: nebulaCloudTex, color: 0xffffff, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  sprite.position.copy(pos);
  sprite.scale.set(800, 80, 1);
  // Orient streak along its velocity
  const angRot = Math.atan2(dir.y, Math.hypot(dir.x, dir.z));
  sprite.material.rotation = angRot;
  scene.add(sprite);
  shootingStars.push({ sprite, vel: dir, life: 0, max: 0.9 + Math.random() * 0.6 });
}
function updateShootingStars(dt) {
  shootingStarT -= dt;
  if (shootingStarT <= 0) {
    spawnShootingStar();
    shootingStarT = 5 + Math.random() * 12;
  }
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.life += dt;
    s.sprite.position.addScaledVector(s.vel, dt);
    const t = s.life / s.max;
    s.sprite.material.opacity = Math.max(0, 0.95 * (1 - t * t));
    if (s.life >= s.max) {
      scene.remove(s.sprite);
      shootingStars.splice(i, 1);
    }
  }
}

// ---------- Procedural Planet Textures ----------
function noise2D(seed) {
  const p = new Array(512);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = (seed >>> 0) || 1;
  for (let i = 255; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  }
  for (let i = 0; i < 256; i++) p[256 + i] = p[i];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  return (x, y) => {
    const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x), yf = y - Math.floor(y);
    const u = fade(xf), v = fade(yf);
    const aa = p[p[xi] + yi] / 255;
    const ab = p[p[xi] + yi + 1] / 255;
    const ba = p[p[xi + 1] + yi] / 255;
    const bb = p[p[xi + 1] + yi + 1] / 255;
    return aa * (1 - u) * (1 - v) + ba * u * (1 - v) + ab * (1 - u) * v + bb * u * v;
  };
}
function fbm(n, x, y, oct) {
  let v = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < oct; i++) { v += n(x * freq, y * freq) * amp; max += amp; amp *= 0.5; freq *= 2; }
  return v / max;
}
function makePlanetTexture(opts) {
  const { type, baseColor = [128,128,128], accentColor = [200,200,200], seed = 1, w = 768, h = 384 } = opts;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  const n = noise2D(seed);
  const lerp = (a, b, t) => a + (b - a) * t;
  // Wrap-helper: blend left edge into right edge to hide seam
  const wrapFbm = (x, y, oct, scale) => {
    const a = fbm(n, x * scale, y * scale, oct);
    const b = fbm(n, (x - w) * scale, y * scale, oct);
    return lerp(b, a, x / w);
  };
  for (let y = 0; y < h; y++) {
    const lat = (y / h - 0.5) * 2;
    for (let x = 0; x < w; x++) {
      let r, g, b;
      if (type === 'gas-jupiter') {
        const bandPhase = lat * 7 + (n(x * 0.012, lat * 0.5) - 0.5) * 1.6;
        const band = Math.sin(bandPhase * Math.PI) * 0.5 + 0.5;
        const detail = wrapFbm(x, y, 4, 0.012);
        const t = band * 0.65 + detail * 0.35;
        r = lerp(180, 235, t); g = lerp(140, 200, t); b = lerp(95, 155, t);
        // Great Red Spot
        const spotX = (x / w - 0.7), spotY = (lat - 0.15);
        const spot = Math.exp(-(spotX * spotX * 80 + spotY * spotY * 400));
        r = lerp(r, 200, spot); g = lerp(g, 70, spot); b = lerp(b, 50, spot);
      } else if (type === 'gas-saturn') {
        const bandPhase = lat * 5.5 + (n(x * 0.01, lat * 0.5) - 0.5) * 1.2;
        const band = Math.sin(bandPhase * Math.PI) * 0.5 + 0.5;
        const detail = wrapFbm(x, y, 4, 0.014);
        const t = band * 0.65 + detail * 0.35;
        r = lerp(208, 240, t); g = lerp(180, 215, t); b = lerp(135, 175, t);
      } else if (type === 'earth') {
        const elev = wrapFbm(x, y, 5, 0.012);
        if (elev > 0.52) {
          const v = (elev - 0.52) / 0.48;
          r = lerp(46, 110, v); g = lerp(115, 75, v); b = lerp(45, 35, v);
          // Mountains/desert
          if (v > 0.6) { r = lerp(r, 165, (v - 0.6) / 0.4); g = lerp(g, 135, (v - 0.6) / 0.4); b = lerp(b, 95, (v - 0.6) / 0.4); }
        } else {
          const v = elev / 0.52;
          r = lerp(12, 38, v); g = lerp(35, 78, v); b = lerp(78, 140, v);
        }
        // Cloud layer (additive white)
        const cloud = wrapFbm(x, y, 4, 0.018);
        if (cloud > 0.62) {
          const ct = (cloud - 0.62) / 0.38;
          r = lerp(r, 245, ct * 0.7); g = lerp(g, 248, ct * 0.7); b = lerp(b, 252, ct * 0.7);
        }
        // Polar caps
        const ap = Math.abs(lat);
        if (ap > 0.82) {
          const t = (ap - 0.82) / 0.18;
          r = lerp(r, 248, t); g = lerp(g, 252, t); b = lerp(b, 255, t);
        }
      } else if (type === 'mars') {
        const elev = wrapFbm(x, y, 5, 0.014);
        r = lerp(132, 215, elev); g = lerp(58, 105, elev); b = lerp(32, 72, elev);
        // Dark mare
        const dark = wrapFbm(x, y, 3, 0.005);
        if (dark < 0.4) { const t = (0.4 - dark) / 0.4; r = lerp(r, 95, t * 0.6); g = lerp(g, 45, t * 0.6); b = lerp(b, 30, t * 0.6); }
        // Polar ice caps
        const ap = Math.abs(lat);
        if (ap > 0.92) { const t = (ap - 0.92) / 0.08; r = lerp(r, 235, t); g = lerp(g, 235, t); b = lerp(b, 240, t); }
      } else if (type === 'ice-uranus') {
        const swirl = wrapFbm(x, y, 4, 0.018);
        const t = swirl;
        r = lerp(125, 195, t); g = lerp(205, 235, t); b = lerp(220, 240, t);
        // Subtle bands
        const band = Math.sin(lat * 4 * Math.PI) * 0.06;
        r += band * 30; g += band * 20; b += band * 15;
      } else if (type === 'ice-neptune') {
        const swirl = wrapFbm(x, y, 4, 0.014);
        const t = swirl;
        r = lerp(28, 95, t); g = lerp(65, 140, t); b = lerp(165, 230, t);
        // Dark spot
        const spotX = (x / w - 0.4), spotY = (lat + 0.2);
        const spot = Math.exp(-(spotX * spotX * 100 + spotY * spotY * 500));
        r = lerp(r, 15, spot * 0.8); g = lerp(g, 25, spot * 0.8); b = lerp(b, 70, spot * 0.8);
      } else if (type === 'sun') {
        const turb = fbm(n, x * 0.03, y * 0.03, 5);
        const granul = fbm(n, x * 0.15, y * 0.15, 3);
        const hot = turb * 0.7 + granul * 0.3;
        r = 255;
        g = lerp(150, 230, hot);
        b = lerp(40, 130, hot);
      } else {
        const elev = wrapFbm(x, y, 5, 0.018);
        r = lerp(baseColor[0] * 0.5, baseColor[0], elev);
        g = lerp(baseColor[1] * 0.5, baseColor[1], elev);
        b = lerp(baseColor[2] * 0.5, baseColor[2], elev);
      }
      const idx = (y * w + x) * 4;
      img.data[idx] = Math.max(0, Math.min(255, r | 0));
      img.data[idx + 1] = Math.max(0, Math.min(255, g | 0));
      img.data[idx + 2] = Math.max(0, Math.min(255, b | 0));
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}
const planetTextures = {
  sun:     makePlanetTexture({ type: 'sun', seed: 3 }),
  earth:   makePlanetTexture({ type: 'earth', seed: 7 }),
  mars:    makePlanetTexture({ type: 'mars', seed: 13 }),
  jupiter: makePlanetTexture({ type: 'gas-jupiter', seed: 21 }),
  saturn:  makePlanetTexture({ type: 'gas-saturn', seed: 31 }),
  uranus:  makePlanetTexture({ type: 'ice-uranus', seed: 41 }),
  neptune: makePlanetTexture({ type: 'ice-neptune', seed: 51 }),
};

// ---------- Solar System Definition ----------
// Compressed scale for playability
// orbitAngle = current angular position around the Sun (radians).
// Planets are placed at polar coords: world = (R*cos(θ), 0, R*sin(θ))
const PLANETS = [
  { key: 'sun',     name: 'SUN',     x: 0,      r: 220, orbitAngle: 0,    color: 0xffcc66, emissive: 0xffaa33, isStar: true },
  { key: 'earth',   name: 'EARTH',   x: 2000,   r: 36,  orbitAngle: 0.0,  color: 0x3a78d8, atmoColor: 0x6ab0ff, atmoStrength: 1.4, atmoPower: 2.2, hasGate: true,  module: 'BIO-SEED' },
  { key: 'mars',    name: 'MARS',    x: 3200,   r: 26,  orbitAngle: 0.85, color: 0xc1542a, atmoColor: 0xffaa66, atmoStrength: 0.5, atmoPower: 3.0, hasGate: true,  module: 'OXIDIZER' },
  { key: 'jupiter', name: 'JUPITER', x: 5800,   r: 130, orbitAngle: 2.10, color: 0xd9a87a, atmoColor: 0xffd9a0, atmoStrength: 0.8, atmoPower: 2.8, hasGate: true,  module: 'GRAV-COMPRESSOR' },
  { key: 'saturn',  name: 'SATURN',  x: 8200,   r: 110, orbitAngle: 3.50, color: 0xe6c98a, atmoColor: 0xffe2a8, atmoStrength: 0.7, atmoPower: 2.8, hasGate: true,  module: 'CRYO-COIL', ring: true },
  { key: 'uranus',  name: 'URANUS',  x: 10800,  r: 60,  orbitAngle: 4.80, color: 0x88e0e6, atmoColor: 0x9ce8ee, atmoStrength: 1.0, atmoPower: 2.4, hasGate: true,  module: 'METHANE-CELL' },
  { key: 'neptune', name: 'NEPTUNE', x: 13500,  r: 58,  orbitAngle: 5.70, color: 0x3a5fd8, atmoColor: 0x5588ff, atmoStrength: 1.2, atmoPower: 2.3, hasGate: true,  module: 'GENESIS-PARTICLE', isFinal: true },
];

const planetMeshes = {};
const gateMeshes = {};
const moduleMeshes = {};
// Sun: uniform-range light (decay 0) so all planets across the system are lit
const sunLight = new THREE.PointLight(0xfff0c0, 1.5, 0, 0);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x2a3458, 0.75));
const fillLight = new THREE.DirectionalLight(0x6688bb, 0.45);
fillLight.position.set(-1, 0.6, 0.5);
scene.add(fillLight);

// Sprite-glow texture (radial gradient)
const glowTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  grd.addColorStop(0.6, 'rgba(255,255,255,0.12)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
})();

for (const p of PLANETS) {
  const geo = new THREE.SphereGeometry(p.r, 64, 40);
  let mat;
  if (p.isStar) {
    mat = new THREE.MeshBasicMaterial({ map: planetTextures[p.key], color: 0xffffff });
  } else {
    mat = new THREE.MeshStandardMaterial({
      map: planetTextures[p.key],
      roughness: 0.85,
      metalness: 0.04,
      emissive: p.color,
      emissiveIntensity: 0.18,
    });
  }
  const mesh = new THREE.Mesh(geo, mat);
  // Polar placement: x = R·cos(θ), z = R·sin(θ). Sun stays at origin (R=0).
  const wx = Math.cos(p.orbitAngle) * p.x;
  const wz = Math.sin(p.orbitAngle) * p.x;
  mesh.position.set(wx, 0, wz);
  scene.add(mesh);
  planetMeshes[p.key] = mesh;

  // Orbital path ring (thin glowing circle around the Sun, like solarsystemscope.com)
  if (!p.isStar) {
    const ringGeo = new THREE.RingGeometry(p.x - 0.5, p.x + 0.5, 256, 1);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x4488cc, transparent: true, opacity: 0.18,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const orbitRing = new THREE.Mesh(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2;
    scene.add(orbitRing);
  }

  if (p.isStar) {
    // Inner corona
    const corona = new THREE.Mesh(
      new THREE.SphereGeometry(p.r * 1.25, 48, 24),
      new THREE.MeshBasicMaterial({ color: 0xffcc66, transparent: true, opacity: 0.30, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    mesh.add(corona);
    const corona2 = new THREE.Mesh(
      new THREE.SphereGeometry(p.r * 1.7, 48, 24),
      new THREE.MeshBasicMaterial({ color: 0xff8833, transparent: true, opacity: 0.14, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    mesh.add(corona2);
    const flare = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: 0xffd066, transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    flare.scale.set(p.r * 6, p.r * 6, 1);
    mesh.add(flare);
    // Outer god-ray halo (subtle, pulses)
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: 0xff8844, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    halo.scale.set(p.r * 14, p.r * 14, 1);
    mesh.add(halo);
    mesh.userData.coronas = [corona, corona2, halo, flare];
  } else {
    // Realistic Fresnel atmosphere (rim glow only)
    const atmoColor = p.atmoColor !== undefined ? p.atmoColor : p.color;
    const atmoMesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.r * 1.18, 48, 32),
      new THREE.ShaderMaterial({
        uniforms: {
          atmoColor: { value: new THREE.Color(atmoColor) },
          atmoStrength: { value: p.atmoStrength || 1.0 },
          atmoPower: { value: p.atmoPower || 2.4 },
        },
        transparent: true, side: THREE.FrontSide, depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vPos = mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 atmoColor;
          uniform float atmoStrength;
          uniform float atmoPower;
          varying vec3 vNormal;
          varying vec3 vPos;
          void main() {
            vec3 vd = normalize(-vPos);
            float fr = 1.0 - max(0.0, dot(vd, vNormal));
            fr = pow(fr, atmoPower);
            gl_FragColor = vec4(atmoColor, fr * atmoStrength);
          }
        `,
      })
    );
    mesh.add(atmoMesh);
  }
  // Earth-style cloud layer (semi-transparent, slow rotation)
  if (p.key === 'earth') {
    const cloudCanvas = document.createElement('canvas');
    cloudCanvas.width = 512; cloudCanvas.height = 256;
    const cctx = cloudCanvas.getContext('2d');
    // Transparent base
    cctx.clearRect(0, 0, 512, 256);
    // Splatter cloud blobs using radial gradients
    for (let i = 0; i < 400; i++) {
      const cx = Math.random() * 512;
      const cy = 30 + Math.random() * 196; // avoid extreme poles
      const radius = 8 + Math.random() * 30;
      const alpha = 0.18 + Math.random() * 0.45;
      const grd = cctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grd.addColorStop(0, `rgba(255,255,255,${alpha})`);
      grd.addColorStop(0.6, `rgba(245,250,255,${alpha * 0.55})`);
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      cctx.fillStyle = grd;
      cctx.beginPath();
      cctx.arc(cx, cy, radius, 0, Math.PI * 2);
      cctx.fill();
    }
    const cloudTex = new THREE.CanvasTexture(cloudCanvas);
    cloudTex.wrapS = cloudTex.wrapT = THREE.RepeatWrapping;
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudTex, transparent: true, opacity: 0.85,
      roughness: 1.0, metalness: 0.0, depthWrite: false,
      alphaTest: 0.02,
    });
    const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(p.r * 1.012, 64, 48), cloudMat);
    cloudMesh.userData.spinRate = 0.012; // slightly faster than planet for parallax
    mesh.add(cloudMesh);
    mesh.userData.clouds = cloudMesh;
  }
  if (p.ring) {
    // Multi-band Saturn ring system
    const ringDefs = [
      { inner: 1.32, outer: 1.50, op: 0.55, c: 0xe8d8a8 },
      { inner: 1.52, outer: 1.78, op: 0.85, c: 0xd8b880 },
      { inner: 1.79, outer: 1.86, op: 0.20, c: 0x705840 }, // Cassini gap (darker)
      { inner: 1.87, outer: 2.10, op: 0.70, c: 0xcca870 },
      { inner: 2.12, outer: 2.30, op: 0.30, c: 0xa88c5c },
    ];
    for (const rd of ringDefs) {
      const ringGeo = new THREE.RingGeometry(p.r * rd.inner, p.r * rd.outer, 96, 1);
      const ringMat = new THREE.MeshBasicMaterial({
        color: rd.c, side: THREE.DoubleSide, transparent: true, opacity: rd.op, depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.3;
      mesh.add(ring);
    }
  }
  if (p.hasGate) {
    // Jump Gate: torus orbiting the planet
    const gateGeo = new THREE.TorusGeometry(p.r * 1.8, 2.5, 12, 48);
    const gateMat = new THREE.MeshBasicMaterial({ color: 0x7cffb1 });
    const gate = new THREE.Mesh(gateGeo, gateMat);
    gate.userData = { planetKey: p.key, type: 'gate' };
    scene.add(gate);
    gateMeshes[p.key] = gate;

    // Core Module: small glowing cube near gate
    const modGeo = new THREE.IcosahedronGeometry(6, 0);
    const modMat = new THREE.MeshBasicMaterial({ color: p.isFinal ? 0xff66ff : 0xffe14f });
    const mod = new THREE.Mesh(modGeo, modMat);
    mod.userData = { planetKey: p.key, type: 'module', name: p.module };
    scene.add(mod);
    moduleMeshes[p.key] = mod;
  }
}

// ---------- Pirate Ship (angular, sinister, blood-red accents) ----------
function makePirateShip() {
  const group = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x18090c, metalness: 0.92, roughness: 0.28,
    emissive: 0x110305, emissiveIntensity: 0.4,
  });
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x2a0a0a, metalness: 0.85, roughness: 0.3,
    emissive: 0xff2244, emissiveIntensity: 0.9,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x100204, metalness: 0.4, roughness: 0.05,
    emissive: 0xff3322, emissiveIntensity: 0.55,
  });

  // Angular wedge fuselage (dart-shape pointing +Z)
  const fuseShape = new THREE.Shape();
  fuseShape.moveTo(0, 0); fuseShape.lineTo(1.3, -0.3); fuseShape.lineTo(1.0, -2.6);
  fuseShape.lineTo(-1.0, -2.6); fuseShape.lineTo(-1.3, -0.3); fuseShape.lineTo(0, 0);
  const fuseGeo = new THREE.ExtrudeGeometry(fuseShape, { depth: 7, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.12, bevelSegments: 1 });
  fuseGeo.translate(0, 0, -3.5);
  const fuse = new THREE.Mesh(fuseGeo, hullMat);
  group.add(fuse);

  // Dorsal ridge / spine (thin glowing red strip)
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 5.5), trimMat);
  spine.position.set(0, 0.9, 0.3);
  group.add(spine);

  // Sharp nose blade
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.55, 3.0, 4), hullMat);
  nose.rotation.x = -Math.PI / 2;
  nose.rotation.z = Math.PI / 4;
  nose.position.z = 5.3;
  group.add(nose);

  // Sinister visor (low slit, deep red glow)
  const visor = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 1.1), glassMat);
  visor.position.set(0, 0.55, 1.6);
  group.add(visor);

  // Asymmetric scythe wings (sweep down)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0.6);
  wingShape.lineTo(5.0, -1.4);
  wingShape.lineTo(5.0, -2.2);
  wingShape.lineTo(2.5, -2.5);
  wingShape.lineTo(0, -1.0);
  wingShape.lineTo(0, 0.6);
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.22, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 1 });
  wingGeo.translate(0, 0, -0.11);
  const wingL = new THREE.Mesh(wingGeo, hullMat);
  wingL.rotation.y = Math.PI / 2;
  wingL.rotation.z = -0.25;
  wingL.position.set(-1.1, -0.2, -0.5);
  group.add(wingL);
  const wingR = new THREE.Mesh(wingGeo, hullMat);
  wingR.rotation.y = -Math.PI / 2;
  wingR.rotation.z = 0.25;
  wingR.position.set(1.1, -0.2, -0.5);
  group.add(wingR);

  // Wingtip blade lights (red)
  const tipMat = new THREE.MeshBasicMaterial({ color: 0xff2233 });
  for (const sx of [-5.7, 5.7]) {
    const tip = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), tipMat);
    tip.position.set(sx, -0.9, -1.6);
    group.add(tip);
  }

  // Underbelly gun cannon (long barrel)
  const gun = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 4.5, 8), hullMat);
  gun.rotation.x = Math.PI / 2;
  gun.position.set(0, -0.85, 1.5);
  group.add(gun);
  const gunTip = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8),
    new THREE.MeshBasicMaterial({ color: 0xff4422 }));
  gunTip.position.set(0, -0.85, 3.7);
  group.add(gunTip);

  // Twin engines (dark) with red exhaust
  for (const ex of [-1.5, 1.5]) {
    const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.4, 2.2, 8), hullMat);
    eng.rotation.x = Math.PI / 2;
    eng.position.set(ex, 0.0, -3.5);
    group.add(eng);
    const nozzle = new THREE.Mesh(
      new THREE.CircleGeometry(0.4, 10),
      new THREE.MeshBasicMaterial({ color: 0xff3322, transparent: true, opacity: 0.9 })
    );
    nozzle.position.set(ex, 0.0, -4.65);
    nozzle.rotation.y = Math.PI;
    group.add(nozzle);
    // Plume
    const plume = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: 0xff3322, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    plume.position.set(ex, 0, -5.4);
    plume.scale.set(1.6, 4.0, 1);
    group.add(plume);
  }

  // Threat lights (blinking red point)
  const threatLight = new THREE.PointLight(0xff2233, 1.2, 22, 2);
  threatLight.position.set(0, 0.6, 1.5);
  group.add(threatLight);
  return group;
}

// ---------- Ship (professional fighter design) ----------
function makeShip(hullColor = 0xe8faff, accent = 0x66ddff) {
  const group = new THREE.Group();

  const hullMat = new THREE.MeshStandardMaterial({
    color: hullColor, metalness: 0.85, roughness: 0.32, emissive: 0x000000
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x1a1f28, metalness: 0.9, roughness: 0.28
  });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x303a48, metalness: 0.7, roughness: 0.4,
    emissive: accent, emissiveIntensity: 0.35
  });

  // Fuselage (main body) - lozenge shape pointing +Z
  const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.5, 7, 14), hullMat);
  fuselage.rotation.x = Math.PI / 2;
  group.add(fuselage);

  // Sharp nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(1.0, 3, 14), hullMat);
  nose.rotation.x = -Math.PI / 2;
  nose.position.z = 5.0;
  group.add(nose);

  // Cockpit dome (dark glass)
  const cockpit = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({
      color: 0x05121f, metalness: 0.4, roughness: 0.05,
      emissive: 0x224466, emissiveIntensity: 0.5
    })
  );
  cockpit.position.set(0, 0.55, 1.4);
  group.add(cockpit);

  // Wings (swept-back)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 1.4);
  wingShape.lineTo(4.5, -0.6);
  wingShape.lineTo(4.5, -1.4);
  wingShape.lineTo(0, -1.4);
  wingShape.lineTo(0, 1.4);
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.25, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 1 });
  wingGeo.translate(0, 0, -0.125);
  const wingL = new THREE.Mesh(wingGeo, accentMat);
  wingL.rotation.y = Math.PI / 2;
  wingL.position.set(-1, 0, -1);
  group.add(wingL);
  const wingR = new THREE.Mesh(wingGeo, accentMat);
  wingR.rotation.y = -Math.PI / 2;
  wingR.position.set(1, 0, -1);
  group.add(wingR);

  // Wingtip lights
  const tipMat = new THREE.MeshBasicMaterial({ color: accent });
  for (const sx of [-5.2, 5.2]) {
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), tipMat);
    tip.position.set(sx, 0, -1.6);
    group.add(tip);
  }

  // Twin engines
  for (const ex of [-1.2, 1.2]) {
    const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 2.4, 12), darkMat);
    eng.rotation.x = Math.PI / 2;
    eng.position.set(ex, 0.05, -3.6);
    group.add(eng);
    // Inner glow nozzle
    const nozzle = new THREE.Mesh(
      new THREE.CircleGeometry(0.42, 16),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.85 })
    );
    nozzle.position.set(ex, 0.05, -4.81);
    nozzle.rotation.y = Math.PI;
    group.add(nozzle);
  }

  // Engine plume sprites (glow trails)
  const plumeMats = [];
  for (const ex of [-1.2, 1.2]) {
    const plumeMat = new THREE.SpriteMaterial({
      map: glowTex, color: accent, transparent: true, opacity: 0.0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const plume = new THREE.Sprite(plumeMat);
    plume.position.set(ex, 0.05, -5.5);
    plume.scale.set(1.6, 4.0, 1);
    group.add(plume);
    plumeMats.push(plumeMat);
  }
  group.userData.plumeMats = plumeMats;

  // Self-illumination so ship is visible in deep space
  const selfLight = new THREE.PointLight(accent, 0.7, 24, 2);
  selfLight.position.set(0, 0.5, -2);
  group.add(selfLight);
  const fillSelf = new THREE.PointLight(0xffffff, 0.25, 18, 2);
  fillSelf.position.set(0, 2, 1);
  group.add(fillSelf);

  return group;
}

// ---------- Ship variants (cosmetic) ----------
function makeShipFalcon(hullColor = 0xfff8e0, accent = 0xffaa44) {
  const group = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({ color: hullColor, metalness: 0.88, roughness: 0.28 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x141820, metalness: 0.92, roughness: 0.25 });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x282d36, metalness: 0.7, roughness: 0.35,
    emissive: accent, emissiveIntensity: 0.45
  });

  // Long sleek fuselage
  const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.4, 8.5, 16), hullMat);
  fuselage.rotation.x = Math.PI / 2;
  group.add(fuselage);
  // Very sharp long nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.85, 4.5, 16), hullMat);
  nose.rotation.x = -Math.PI / 2;
  nose.position.z = 6.0;
  group.add(nose);
  // Cockpit (forward, narrow)
  const cockpit = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x06141f, metalness: 0.4, roughness: 0.05, emissive: 0x224466, emissiveIntensity: 0.5 })
  );
  cockpit.scale.set(1, 1, 1.6);
  cockpit.position.set(0, 0.45, 2.2);
  group.add(cockpit);
  // Wide delta wings (one piece, swept back hard)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 1.8);
  wingShape.lineTo(6.5, -1.8);
  wingShape.lineTo(6.5, -2.4);
  wingShape.lineTo(0, -1.4);
  wingShape.lineTo(0, 1.8);
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.22, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 1 });
  wingGeo.translate(0, 0, -0.11);
  const wingL = new THREE.Mesh(wingGeo, accentMat);
  wingL.rotation.y = Math.PI / 2; wingL.position.set(-0.7, 0, -1.5);
  group.add(wingL);
  const wingR = new THREE.Mesh(wingGeo, accentMat);
  wingR.rotation.y = -Math.PI / 2; wingR.position.set(0.7, 0, -1.5);
  group.add(wingR);
  // Wingtip lights
  const tipMat = new THREE.MeshBasicMaterial({ color: accent });
  for (const sx of [-7.0, 7.0]) {
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), tipMat);
    tip.position.set(sx, 0, -2.5);
    group.add(tip);
  }
  // Single large central engine (Falcon signature)
  const eng = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.85, 3.0, 16), darkMat);
  eng.rotation.x = Math.PI / 2; eng.position.set(0, 0.05, -4.5);
  group.add(eng);
  const nozzle = new THREE.Mesh(
    new THREE.CircleGeometry(0.85, 18),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.9 })
  );
  nozzle.position.set(0, 0.05, -6.05);
  nozzle.rotation.y = Math.PI;
  group.add(nozzle);
  // Single huge plume
  const plumeMats = [];
  const plumeMat = new THREE.SpriteMaterial({
    map: glowTex, color: accent, transparent: true, opacity: 0.0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const plume = new THREE.Sprite(plumeMat);
  plume.position.set(0, 0.05, -7.0);
  plume.scale.set(2.6, 6.0, 1);
  group.add(plume);
  plumeMats.push(plumeMat);
  group.userData.plumeMats = plumeMats;
  // Self-illumination
  const selfLight = new THREE.PointLight(accent, 0.7, 24, 2);
  selfLight.position.set(0, 0.6, 0);
  group.add(selfLight);
  return group;
}

function makeShipPhoenix(hullColor = 0x331111, accent = 0xff4422) {
  const group = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({
    color: hullColor, metalness: 0.95, roughness: 0.22,
    emissive: 0x441100, emissiveIntensity: 0.15,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xddaa44, metalness: 0.95, roughness: 0.18,
    emissive: 0x662200, emissiveIntensity: 0.2,
  });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x0a0608, metalness: 0.95, roughness: 0.2 });
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x1a0a08, metalness: 0.8, roughness: 0.3,
    emissive: accent, emissiveIntensity: 0.6
  });
  // Heavy fuselage (2 stacked sections — gold trim)
  const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.7, 7.5, 16), hullMat);
  fuselage.rotation.x = Math.PI / 2;
  group.add(fuselage);
  // Gold trim ring
  const trim = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.12, 12, 24), goldMat);
  trim.rotation.y = Math.PI / 2;
  trim.position.z = 0.5;
  group.add(trim);
  // Aggressive nose
  const nose = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.8, 16), hullMat);
  nose.rotation.x = -Math.PI / 2;
  nose.position.z = 5.6;
  group.add(nose);
  // Gold nose tip
  const noseTip = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.5, 16), goldMat);
  noseTip.rotation.x = -Math.PI / 2;
  noseTip.position.z = 7.5;
  group.add(noseTip);
  // Cockpit
  const cockpit = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x100200, metalness: 0.4, roughness: 0.05, emissive: 0x661100, emissiveIntensity: 0.6 })
  );
  cockpit.position.set(0, 0.6, 1.6);
  group.add(cockpit);
  // Forward-swept aggressive wings
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 1.0);
  wingShape.lineTo(4.0, 1.8);
  wingShape.lineTo(5.2, -0.4);
  wingShape.lineTo(0, -1.4);
  wingShape.lineTo(0, 1.0);
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.3, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 1 });
  wingGeo.translate(0, 0, -0.15);
  const wingL = new THREE.Mesh(wingGeo, accentMat);
  wingL.rotation.y = Math.PI / 2; wingL.position.set(-1.2, 0, -1);
  group.add(wingL);
  const wingR = new THREE.Mesh(wingGeo, accentMat);
  wingR.rotation.y = -Math.PI / 2; wingR.position.set(1.2, 0, -1);
  group.add(wingR);
  // Wingtip lights (red flame)
  const tipMat = new THREE.MeshBasicMaterial({ color: accent });
  for (const sx of [-6.0, 6.0]) {
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 6), tipMat);
    tip.position.set(sx, 0.5, -1.8);
    group.add(tip);
  }
  // Triple engines (signature)
  const enginePositions = [[-1.5, 0, -3.8], [0, -0.4, -4.2], [1.5, 0, -3.8]];
  const plumeMats = [];
  for (const [ex, ey, ez] of enginePositions) {
    const eng = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.55, 2.6, 14), darkMat);
    eng.rotation.x = Math.PI / 2; eng.position.set(ex, ey, ez);
    group.add(eng);
    const nozzle = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 16),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.95 })
    );
    nozzle.position.set(ex, ey, ez - 1.31);
    nozzle.rotation.y = Math.PI;
    group.add(nozzle);
    const plumeMat = new THREE.SpriteMaterial({
      map: glowTex, color: accent, transparent: true, opacity: 0.0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const plume = new THREE.Sprite(plumeMat);
    plume.position.set(ex, ey, ez - 2.0);
    plume.scale.set(2.0, 4.5, 1);
    group.add(plume);
    plumeMats.push(plumeMat);
  }
  group.userData.plumeMats = plumeMats;
  // Self-illumination (warmer, larger)
  const selfLight = new THREE.PointLight(accent, 1.0, 30, 2);
  selfLight.position.set(0, 0.6, 0);
  group.add(selfLight);
  return group;
}

// Ship variant catalog
const SHIP_VARIANTS = [
  {
    id: 'vanguard', name: 'VANGUARD', tag: 'STANDARD',
    desc: 'Standart razvedka kemasi. Twin-ion engine, balansli.',
    cost: 0, builder: makeShip,
    defaultColors: [0xeef2ff, 0x66ddff],
  },
  {
    id: 'falcon', name: 'FALCON', tag: 'INTERCEPTOR',
    desc: 'Yengil va tez. Bitta katta dvigatel, keng delta qanotlar.',
    cost: 1500, builder: makeShipFalcon,
    defaultColors: [0xfff8e0, 0xffaa44],
  },
  {
    id: 'phoenix', name: 'PHOENIX', tag: 'ASSAULT',
    desc: 'Og\'ir hujum kemasi. Uchta dvigatel, oltin trim, qonli accent.',
    cost: 5000, builder: makeShipPhoenix,
    defaultColors: [0x331111, 0xff4422],
  },
];

function getShipVariant(id) {
  return SHIP_VARIANTS.find(s => s.id === id) || SHIP_VARIANTS[0];
}

function buildPlayerShip() {
  // Defensive: profile may not be declared yet (TDZ) at first call
  let equippedId = 'vanguard';
  let factionId = null;
  try {
    if (profile) {
      equippedId = profile.equippedShip || 'vanguard';
      factionId = profile.faction || null;
    }
  } catch (e) { /* TDZ — profile not declared yet, use defaults */ }
  const variant = getShipVariant(equippedId);
  const f = factionId ? getFaction(factionId) : null;
  const hullColor = variant.defaultColors[0];
  const accentColor = f ? f.accent : variant.defaultColors[1];
  return variant.builder(hullColor, accentColor);
}

let myShip = buildPlayerShip();
scene.add(myShip);

function reEquipShip() {
  // Save transform
  const oldPos = myShip.position.clone();
  const oldQ = myShip.quaternion.clone();
  scene.remove(myShip);
  myShip = buildPlayerShip();
  myShip.position.copy(oldPos);
  myShip.quaternion.copy(oldQ);
  scene.add(myShip);
}

// Player state
const state = {
  pos: new THREE.Vector3(PLANETS[1].x + 80, 0, 0), // Yer yonida
  vel: new THREE.Vector3(0, 0, 0),
  quat: new THREE.Quaternion(),
  o2: 100, fuel: 100, batt: 100, hull: 100,
  maxO2: 100, maxFuel: 100, maxBatt: 100, maxHull: 100,
  solarMult: 1.0, weaponCoolMult: 1.0, ammoMult: 1.0,
  modules: new Set(),
  hvt: false,
  alive: true,
  name: 'Pilot',
  karma: 0,
  kills: 0,
  docking: false,
  launching: false,
  launchT: 0,
  exhaustSprite: null,
};

// Initial heading: face along +X (towards deep space)
const initialEuler = new THREE.Euler(0, -Math.PI / 2, 0, 'YXZ');
state.quat.setFromEuler(initialEuler);

// ---------- Input ----------
const keys = new Set();
let pointerLocked = false;
let mouseDX = 0, mouseDY = 0;

window.addEventListener('keydown', (e) => {
  if (chatInput.style.display === 'block') return;
  keys.add(e.code);
  if (e.code === 'KeyT') {
    e.preventDefault();
    openChat();
  }
  // Weapon selection: 1=Laser, 2=Missile, 3=Mine
  if (e.code === 'Digit1' || e.code === 'Numpad1') selectWeapon(0);
  else if (e.code === 'Digit2' || e.code === 'Numpad2') selectWeapon(1);
  else if (e.code === 'Digit3' || e.code === 'Numpad3') selectWeapon(2);
  else if (e.code === 'KeyG') {
    e.preventDefault();
    openTrade();
  }
  else if (e.code === 'KeyH') {
    e.preventDefault();
    if (typeof sendFriendPing === 'function') sendFriendPing();
  }
  else if (e.code === 'KeyM') {
    e.preventDefault();
    setMuted(!sfxMuted);
  }
  else if (e.code === 'KeyN') {
    // 'N' is also used for trade-decline; only toggle music if no offer pending
    if (typeof pendingIncomingOffer !== 'undefined' && pendingIncomingOffer) return;
    e.preventDefault();
    setMusicMuted(!musicMuted);
  }
});

// Mute button click
document.getElementById('muteBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  setMuted(!sfxMuted);
});
document.getElementById('musicBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  setMusicMuted(!musicMuted);
});
window.addEventListener('keyup', (e) => keys.delete(e.code));

function safeRequestPointerLock() {
  try {
    const p = renderer.domElement.requestPointerLock?.();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch (e) { /* SecurityError if requested too soon after exit */ }
}
renderer.domElement.addEventListener('click', () => {
  if (!state.alive) return;
  if (!pointerLocked) {
    safeRequestPointerLock();
  } else {
    fire();
  }
});
document.addEventListener('pointerlockchange', () => {
  pointerLocked = document.pointerLockElement === renderer.domElement;
  const cp = document.getElementById('clickPrompt');
  if (cp) cp.style.display = pointerLocked ? 'none' : (state.launching || splash.style.display !== 'none' ? 'none' : 'block');
});
document.addEventListener('mousemove', (e) => {
  if (!pointerLocked) return;
  mouseDX += e.movementX;
  mouseDY += e.movementY;
});

// ---------- Chat ----------
function openChat() {
  chatInput.style.display = 'block';
  chatInput.focus();
  document.exitPointerLock?.();
}
function closeChat() {
  chatInput.style.display = 'none';
  chatInput.value = '';
}
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const text = chatInput.value.trim();
    if (text) sendChat(text);
    closeChat();
  } else if (e.key === 'Escape') {
    closeChat();
  }
  e.stopPropagation();
});

function pushChat(name, text, color = '#7cffb1') {
  chatBox.style.display = 'block';
  const line = document.createElement('div');
  line.className = 'line';
  line.innerHTML = `<span class="name" style="color:${color};">${escapeHtml(name)}:</span> ${escapeHtml(text)}`;
  chatBox.appendChild(line);
  while (chatBox.children.length > 8) chatBox.removeChild(chatBox.firstChild);
  // Auto-fade
  setTimeout(() => { line.style.opacity = '0.4'; }, 8000);
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ---------- AIDA ----------
const aidaQueue = [];
let aidaTimer = 0;
function aidaSay(msg, holdMs = 4500) {
  aidaQueue.push({ msg, holdMs });
}
function updateAida(dt) {
  aidaTimer -= dt * 1000;
  if (aidaTimer <= 0 && aidaQueue.length > 0) {
    const { msg, holdMs } = aidaQueue.shift();
    aidaText.textContent = msg;
    aidaTimer = holdMs;
  } else if (aidaTimer <= 0 && aidaQueue.length === 0 && aidaText.textContent.length > 0) {
    // keep last message visible
  }
}

// Trigger lore lines based on distance to planets
const aidaTriggered = new Set();
function aidaCheckProximity() {
  for (const p of PLANETS) {
    const d = state.pos.distanceTo(planetMeshes[p.key].position);
    if (d < p.r * 6 && !aidaTriggered.has(p.key)) {
      aidaTriggered.add(p.key);
      if (p.key === 'sun') aidaSay('Quyoshga juda yaqin keldingiz, pilot. Issiqlik halokatli.');
      else if (p.key === 'earth') aidaSay(`${p.name} sektoridasiz. Jump Gate orqali Marsga oting.`);
      else if (p.isFinal) aidaSay(`${p.name}. Bu yerda — Genesis zarrasi. Modulni oling va ortga qayting.`);
      else aidaSay(`${p.name} sektoriga kirdingiz. Modul: ${p.module}`);
    }
  }
}

// ---------- Multiplayer ----------
const otherPlayers = new Map(); // id -> { mesh, target: {pos, quat}, name, hvt, label }
let myId = null;
let ws = null;
let lastSendT = 0;

function connectWS() {
  setBootStatus('Connecting to server...');
  // Support dynamic WebSocket URL for split deployment (Vercel static + separate WS server)
  // Set window.WS_URL in index.html or configure via Vercel env var
  const wsUrl = window.WS_URL || (location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + location.host;
  ws = new WebSocket(wsUrl);
  ws.onopen = () => {
    aidaSay('Tarmoq ulanishi tiklandi. Boshqa pilotlar ko\'rinmoqda.');
    // Identify persistent cloud UID for online-presence tracking (friends online status)
    try {
      const uid = localStorage.getItem('odyssey.cloudUid');
      if (uid && /^[a-f0-9]{16,64}$/i.test(uid)) {
        ws.send(JSON.stringify({ type: 'hello', uid }));
      }
    } catch {}
    if (state.name) ws.send(JSON.stringify({ type: 'name', name: state.name }));
    if (profile.faction) ws.send(JSON.stringify({ type: 'faction', faction: profile.faction }));
    // Greet user with online friends list (delayed so server processes hello first)
    setTimeout(() => {
      if (typeof fetchFriends !== 'function') return;
      fetchFriends().then((list) => {
        const online = (list || []).filter(f => f.online);
        if (online.length === 0) return;
        const names = online.slice(0, 3).map(f => f.name).join(', ');
        const more = online.length > 3 ? ` +${online.length - 3}` : '';
        aidaSay(`👥 ${online.length} do'st online: ${names}${more}`, 6000);
        // Refresh nearby labels in case any are friends already (after fetchFriends syncs profile.friends)
        for (const o of otherPlayers.values()) refreshOtherPlayerLabel(o);
      }).catch(() => {});
    }, 1200);
  };
  ws.onmessage = (ev) => {
    let m;
    try { m = JSON.parse(ev.data); } catch { return; }
    if (m.type === 'init') {
      myId = m.id;
      for (const p of m.players) addOtherPlayer(p);
      if (m.factionScore) updateFactionScore(m.factionScore);
      if (m.activeEvent) showLiveEvent(m.activeEvent, true);
    } else if (m.type === 'event') {
      handleServerEvent(m);
    } else if (m.type === 'join') {
      addOtherPlayer(m);
      pushChat('SYSTEM', `${m.name} sektorga kirdi`, '#9ad9ff');
    } else if (m.type === 'leave') {
      removeOtherPlayer(m.id);
    } else if (m.type === 'state') {
      updateOtherPlayer(m);
    } else if (m.type === 'snapshot' && Array.isArray(m.players)) {
      // Tick-based AoI snapshot from server
      for (const u of m.players) updateOtherPlayer(u);
    } else if (m.type === 'name') {
      const o = otherPlayers.get(m.id);
      if (o) { o.name = m.name; if (o.label) refreshOtherPlayerLabel(o); }
    } else if (m.type === 'code-update') {
      const o = otherPlayers.get(m.id);
      if (o) { o.code = m.code; if (o.label) refreshOtherPlayerLabel(o); }
    } else if (m.type === 'friend-ping') {
      addFriendPing(m);
    } else if (m.type === 'friend-online') {
      aidaSay(`👥 ${m.name} online — boshlandi!`, 5000);
      pushChat('FRIEND', `${m.name} (${m.code}) sektorga kirdi`, '#7cffb1');
      if (typeof SFX !== 'undefined' && SFX.notify) SFX.notify();
      // Update friendsCache so splash card stays accurate
      const fr = friendsCache.find(f => f.uid === m.uid);
      if (fr) { fr.online = true; if (typeof renderFriendsSplash === 'function') renderFriendsSplash(); }
    } else if (m.type === 'friend-offline') {
      pushChat('FRIEND', `${m.name} (${m.code}) sektorni tark etdi`, '#7cffb1');
      const fr = friendsCache.find(f => f.uid === m.uid);
      if (fr) { fr.online = false; if (typeof renderFriendsSplash === 'function') renderFriendsSplash(); }
    } else if (m.type === 'faction') {
      updateOtherFaction(m.id, m.faction);
    } else if (m.type === 'emote') {
      showEmoteFromOther(m.id, m.emote);
    } else if (m.type === 'pvp-hit') {
      onPvpHit(m);
    } else if (m.type === 'pvp-kill') {
      onPvpKill(m);
    } else if (m.type === 'chat') {
      pushChat(m.name || `Pilot-${m.id}`, m.text);
    } else if (m.type === 'trade-offer') {
      onTradeOffer(m);
    } else if (m.type === 'trade-accept') {
      onTradeAccept(m);
    } else if (m.type === 'trade-decline') {
      onTradeDecline(m);
    }
  };
  ws.onclose = () => {
    aidaSay('Tarmoq uzildi. Solo rejimda davom eting.');
    setTimeout(connectWS, 3000);
  };
  ws.onerror = () => {};
}

function isCodeMyFriend(code) {
  if (!code || !Array.isArray(profile.friends)) return false;
  const lc = code.toLowerCase();
  return profile.friends.some(fr => (fr.uid || '').slice(0, 8).toLowerCase() === lc);
}

function addOtherPlayer(p) {
  if (otherPlayers.has(p.id)) return;
  const f = getFaction(p.faction);
  const colors = f ? [f.color, f.accent] : [0xff99cc, 0xff66cc];
  const mesh = makeShip(colors[0], colors[1]);
  mesh.position.set(p.x, p.y, p.z);
  mesh.quaternion.set(p.qx, p.qy, p.qz, p.qw);
  scene.add(mesh);
  const label = document.createElement('div');
  label.className = 'marker player';
  targetsLayer.appendChild(label);
  const o = {
    mesh,
    target: { pos: mesh.position.clone(), quat: mesh.quaternion.clone() },
    name: p.name || `Pilot-${p.id}`,
    hvt: !!p.hvt,
    faction: p.faction || null,
    code: p.code || null,
    label,
  };
  otherPlayers.set(p.id, o);
  refreshOtherPlayerLabel(o);
}

function refreshOtherPlayerLabel(o) {
  const f = getFaction(o.faction);
  const enemy = f && profile.faction && isEnemy(profile.faction, o.faction);
  const friend = isCodeMyFriend(o.code);
  const colorTag = f ? `<span style="color:${f.cssColor}">${f.icon}</span> ` : '';
  const friendTag = friend ? `<span class="friend-star" title="Friend">★</span> ` : '';
  o.label.innerHTML = `<div class="ring" style="${f ? `border-color:${f.cssColor}` : ''}"></div><div>${friendTag}${colorTag}${escapeHtml(o.name)}</div><div class="dist" data-dist></div>`;
  o.label.classList.toggle('enemy', !!enemy);
  o.label.classList.toggle('friend', !!friend);
}

function updateOtherFaction(id, factionId) {
  const o = otherPlayers.get(id);
  if (!o) return;
  if (o.faction === factionId) return;
  o.faction = factionId;
  // Replace ship mesh with new faction colors
  const f = getFaction(factionId);
  const colors = f ? [f.color, f.accent] : [0xff99cc, 0xff66cc];
  const oldPos = o.mesh.position.clone();
  const oldQ = o.mesh.quaternion.clone();
  scene.remove(o.mesh);
  const newMesh = makeShip(colors[0], colors[1]);
  newMesh.position.copy(oldPos);
  newMesh.quaternion.copy(oldQ);
  scene.add(newMesh);
  o.mesh = newMesh;
  refreshOtherPlayerLabel(o);
}
function removeOtherPlayer(id) {
  const o = otherPlayers.get(id);
  if (!o) return;
  scene.remove(o.mesh);
  o.label.remove();
  otherPlayers.delete(id);
}
function updateOtherPlayer(m) {
  const o = otherPlayers.get(m.id);
  if (!o) { addOtherPlayer(m); return; }
  o.target.pos.set(m.x, m.y, m.z);
  o.target.quat.set(m.qx, m.qy, m.qz, m.qw);
  o.hvt = !!m.hvt;
  o.label.classList.toggle('hvt', o.hvt);
}

function sendState() {
  if (!ws || ws.readyState !== 1) return;
  ws.send(JSON.stringify({
    type: 'state',
    x: state.pos.x, y: state.pos.y, z: state.pos.z,
    qx: state.quat.x, qy: state.quat.y, qz: state.quat.z, qw: state.quat.w,
    hvt: state.hvt,
  }));
}
function sendFaction(factionId) {
  if (!ws || ws.readyState !== 1) return;
  ws.send(JSON.stringify({ type: 'faction', faction: factionId }));
}
function sendChat(text) {
  // /friend command: broadcast your friend code so nearby pilots can add you
  if (text === '/friend' || text === '/fc' || text === '/friendcode') {
    const code = getMyFriendCode();
    if (!code || code.length < 8) {
      pushChat('SYSTEM', t('friends.errGeneric'), '#ff7088');
      return;
    }
    text = `📡 ${t('friends.code')}: ${code} — /add ${code}`;
  }
  // /add CODE — quick add friend without opening modal
  const addMatch = /^\/add\s+([a-f0-9]{8})$/i.exec(text);
  if (addMatch) {
    const code = addMatch[1];
    pushChat('SYSTEM', `→ /add ${code.toUpperCase()}`, '#7cffb1');
    addFriendByCode(code).then(result => {
      if (result.ok) {
        pushChat('SYSTEM', t('friends.added', { name: result.friend.name }), '#7cffb1');
        if (typeof renderFriendsSplash === 'function') renderFriendsSplash();
      } else {
        const err = result.error;
        let msg;
        if (err === 'self')                msg = t('friends.errSelf');
        else if (err === 'already_friend') msg = t('friends.errExists');
        else if (err === 'not_found')      msg = t('friends.errNotFound');
        else if (err === 'rate_limit')     msg = t('friends.errRateLimit');
        else if (err === 'limit_reached')  msg = t('friends.errLimitMax', { n: 200 });
        else                               msg = t('friends.errGeneric');
        pushChat('SYSTEM', msg, '#ff7088');
      }
    });
    return;
  }
  if (!ws || ws.readyState !== 1) {
    pushChat(state.name, text, '#ffe14f'); return;
  }
  ws.send(JSON.stringify({ type: 'chat', text }));
  pushChat(state.name, text, '#ffe14f');
}

// ---------- Launch ----------
launchBtn.addEventListener('click', () => {
  state.name = (nameInput.value || `Pilot-${Math.floor(Math.random()*9999)}`).slice(0, 20);
  splash.style.display = 'none';
  // Save name for next session
  profile.name = state.name;
  saveProfile();
  // Initialize audio (must be triggered by user gesture)
  ensureAudio();
  startEngineHum();
  startAmbientMusic();
  applySettings();
  SFX.jump();
  applyUpgrades();
  startLaunch();
  startRunTracking();
  connectWS();
  aidaSay(`Xush kelibsiz, ${state.name}. T-minus 5... Dvigatellar ishga tushdi.`);
  aidaSay('🚀 Yer atmosferasidan chiqamiz. Boshqaruv keyin sizga o\'tadi.');
  // Show tutorial after launch completes (~7s)
  if (!profile.tutorialDone) {
    setTimeout(() => startTutorial(), 8500);
  }
});

// Click-to-control overlay (browser requires user gesture for pointer lock)
const clickPrompt = document.createElement('div');
clickPrompt.id = 'clickPrompt';
clickPrompt.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:24px 44px;background:rgba(8,24,48,0.92);border:2px solid #7cffb1;color:#cfffd8;font-family:Consolas,monospace;font-size:18px;letter-spacing:3px;text-align:center;z-index:9999;cursor:pointer;display:none;backdrop-filter:blur(6px);text-shadow:0 0 10px rgba(120,255,180,0.7);box-shadow:0 0 40px rgba(120,255,180,0.35);animation:blink 1.4s ease-in-out infinite;';
clickPrompt.innerHTML = '▶ SICHQONCHANI BOSING<br><span style="font-size:11px;opacity:0.7;letter-spacing:2px;">to take flight controls</span>';
document.body.appendChild(clickPrompt);
clickPrompt.addEventListener('click', (e) => {
  e.stopPropagation();
  safeRequestPointerLock();
  clickPrompt.style.display = 'none';
});

// ---------- Game Loop ----------
const clock = new THREE.Clock();
const tmpVec = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();
const tmpQ2 = new THREE.Quaternion();
const fwd = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3();

let _firstFrameRendered = false;
function tick() {
  if (perfStats) perfStats.begin();
  const dt = Math.min(clock.getDelta(), 0.05);
  if (!_firstFrameRendered) {
    _firstFrameRendered = true;
    setBootStatus('Ready');
    setTimeout(hideBootLoader, 100);
  }

  // Launch sequence has its own simplified flow
  if (state.launching) {
    handleLaunch(dt);
    updateLaunchCamera();
    updateHUD();
    updateAida(dt);
    animateWorld(dt);
    composer.render();
    if (perfStats) perfStats.end();
    requestAnimationFrame(tick);
    return;
  }

  if (state.alive && splash.style.display === 'none' && !state.paused) {
    // Respawn invulnerability: keep hull at 100 so transient damage doesn't kill again
    if (state.invulT > 0) {
      state.invulT -= dt;
      state.hull = state.maxHull;
    }
    handleControls(dt);
    applyPhysics(dt);
    applyBlackHole(dt);
    updateResources(dt);
    updateAsteroids(dt);
    updateStorm(dt);
    updatePirates(dt);
    updateLasers(dt);
    updateMissiles(dt);
    updateMines(dt);
    updateBoss(dt);
    checkBossProjectileHits();
    updateBossHUD();
    updateDarkZone(dt);
    updateSOS(dt);
    updateSalvages(dt);
    updateExplosions(dt);
    updateHitFeedback(dt);
    updateShipDamage(dt);
    tickProfile(dt);
    if (state.weaponCool > 0) state.weaponCool = Math.max(0, state.weaponCool - dt);
    updateFlare(dt);
    updateProbes(dt);
    checkDocking(dt);
    aidaCheckProximity();
    checkInteractions();
    checkWin();
  }

  // Cosmic ambient effects (always running, even when paused/dead)
  updateSupernovae(dt);
  updateShootingStars(dt);
  if (typeof tickTutorial === 'function') tickTutorial(dt);

  updateOthers(dt);
  updateCamera();
  updateHUD();
  updateAida(dt);
  animateWorld(dt);

  // Network send ~12 Hz
  lastSendT += dt;
  if (lastSendT > 0.08) { sendState(); lastSendT = 0; }

  composer.render();
  if (perfStats) perfStats.end();
  requestAnimationFrame(tick);
}

function handleControls(dt) {
  // Apply touch-look (right joystick) into mouseDX/DY for unified processing
  if (touchLook.x !== 0 || touchLook.y !== 0) {
    const tFactor = 14 * dt * 60;
    mouseDX += touchLook.x * tFactor;
    mouseDY += touchLook.y * tFactor;
  }
  // Mouse pitch/yaw (also for touch-mode without pointer-lock)
  if (pointerLocked || isTouchDevice) {
    const sens = 0.0022 * (profile?.settings?.sensitivity ?? 1.0);
    if (mouseDX !== 0 || mouseDY !== 0) {
      tmpQ.setFromAxisAngle(new THREE.Vector3(0,1,0), -mouseDX * sens);
      state.quat.multiply(tmpQ);
      tmpQ.setFromAxisAngle(new THREE.Vector3(1,0,0), mouseDY * sens);
      state.quat.multiply(tmpQ);
      state.quat.normalize();
      mouseDX = 0; mouseDY = 0;
    }
  }
  // Keyboard yaw/roll
  const yawSpeed = 1.2, rollSpeed = 1.6;
  if (keys.has('KeyA')) { tmpQ.setFromAxisAngle(new THREE.Vector3(0,1,0),  yawSpeed * dt); state.quat.multiply(tmpQ); }
  if (keys.has('KeyD')) { tmpQ.setFromAxisAngle(new THREE.Vector3(0,1,0), -yawSpeed * dt); state.quat.multiply(tmpQ); }
  if (keys.has('KeyQ')) { tmpQ.setFromAxisAngle(new THREE.Vector3(0,0,1),  rollSpeed * dt); state.quat.multiply(tmpQ); }
  if (keys.has('KeyE')) { tmpQ.setFromAxisAngle(new THREE.Vector3(0,0,1), -rollSpeed * dt); state.quat.multiply(tmpQ); }
  state.quat.normalize();

  // Forward thrust
  fwd.set(0, 0, 1).applyQuaternion(state.quat);
  let thrust = 0;
  const boost = keys.has('ShiftLeft') || keys.has('ShiftRight');
  // Empty-fuel emergency thrust: 25% power so player is never stranded
  const fuelMul = state.fuel > 0 ? 1.0 : 0.25;
  if (keys.has('KeyW')) thrust += (boost ? 220 : 60) * fuelMul;
  if (keys.has('KeyS')) thrust -= 35 * fuelMul;
  if (thrust !== 0) {
    state.vel.addScaledVector(fwd, thrust * dt);
    if (state.fuel > 0) {
      // Cheaper consumption: ~91s full boost, ~5+ min normal
      state.fuel -= Math.abs(thrust) * dt * 0.005;
      if (state.fuel < 0) state.fuel = 0;
    }
    const target = boost ? 0.65 : 0.38;
    for (const m of myShip.userData.plumeMats) m.opacity = target * (state.fuel > 0 ? 1 : 0.4);
    setEngineLevel(true, boost && thrust > 0);
  } else {
    for (const m of myShip.userData.plumeMats) m.opacity *= 0.9;
    setEngineLevel(false, false);
  }

  // Brake — Space. Strong with battery, weak fallback without.
  if (keys.has('Space')) {
    if (state.batt > 0) {
      // Strong: half-life ~0.13s (drops to ~5% in 0.6s)
      state.vel.multiplyScalar(Math.pow(0.02, dt));
      state.batt -= dt * 2;
      if (state.batt < 0) state.batt = 0;
    } else {
      // Passive thrusters (no battery): slower but always works
      state.vel.multiplyScalar(Math.pow(0.45, dt));
    }
  }
}

function applyPhysics(dt) {
  // No long-range gravity (arcade flight). Only handle planet collision.
  for (const p of PLANETS) {
    const m = planetMeshes[p.key];
    tmpVec.copy(m.position).sub(state.pos);
    const d2 = Math.max(tmpVec.lengthSq(), 1);
    const d = Math.sqrt(d2);
    // Collision with planet
    if (d < p.r + 2) {
      // bounce + damage
      const n = tmpVec.set(state.pos.x - m.position.x, state.pos.y - m.position.y, state.pos.z - m.position.z).normalize();
      state.pos.copy(m.position).addScaledVector(n, p.r + 2.5);
      const vn = state.vel.dot(n);
      if (vn < 0) state.vel.addScaledVector(n, -2 * vn);
      state.vel.multiplyScalar(0.5);
      state.hull -= 6;
      if (state.hull <= 0) gameOver('Korpus yo\'q qilindi');
      else aidaSay('⚠  To\'qnashuv! Korpus shikastlandi.');
    }
  }
  state.pos.addScaledVector(state.vel, dt);
}

function updateResources(dt) {
  // Oxygen drains slowly
  state.o2 -= dt * 0.15;
  if (state.o2 < 0) { state.o2 = 0; gameOver('Kislorod tugadi'); }

  // Battery: solar recharge depends on distance to sun
  const dSun = state.pos.distanceTo(planetMeshes['sun'].position);
  const solar = Math.max(0, (8 - dSun / 2000)) * 1.5 * state.solarMult; // closer = better
  state.batt += (solar - 0.4) * dt;
  state.batt = Math.max(0, Math.min(state.maxBatt, state.batt));

  // Sun damage when too close
  if (dSun < 600) {
    const burn = (600 - dSun) * 0.04 * dt;
    state.hull -= burn;
    if (state.hull <= 0) gameOver('Quyosh nurida yondingiz');
  }
}

function checkInteractions() {
  // Module pickup
  for (const p of PLANETS) {
    const mod = moduleMeshes[p.key];
    if (!mod || !mod.visible) continue;
    if (state.pos.distanceTo(mod.position) < 14) {
      mod.visible = false;
      state.modules.add(p.key);
      SFX.pickup();
      profileOnModule(p.isFinal);
      aidaSay(`✓ Modul olindi: ${p.module}. Jami: ${state.modules.size}/${PLANETS.filter(x=>x.module).length}`);
      if (p.isFinal) {
        state.hvt = true;
        aidaSay('⚠  Genesis zarrasi sizda. Hammaga sizning joylashuvingiz uzatilmoqda. Yerga qayting!');
      }
    }
  }
  // Jump gate "use" with F (only Earth gate is meaningful for MVP — teleports between sectors)
  if (keys.has('KeyF')) {
    keys.delete('KeyF');
    let nearestGate = null, nearestD = Infinity;
    for (const p of PLANETS) {
      const g = gateMeshes[p.key]; if (!g) continue;
      const d = state.pos.distanceTo(g.position);
      if (d < 80 && d < nearestD) { nearestD = d; nearestGate = p; }
    }
    if (nearestGate) {
      // Cycle to next planet's gate (simple progression)
      const i = PLANETS.findIndex(x => x.key === nearestGate.key);
      const next = PLANETS[Math.min(i + 1, PLANETS.length - 1)];
      const g = gateMeshes[next.key];
      if (g) {
        state.pos.copy(g.position).add(new THREE.Vector3(40, 0, 0));
        state.vel.set(0, 0, 0);
        SFX.jump();
        aidaSay(`Jump qilindi → ${next.name}`);
      }
    }
  }
}

// Render at most N nearest other players (rest are hidden but state still tracked)
const MAX_VISIBLE_OTHERS = 50;

function updateOthers(dt) {
  // Build distance-sorted list (only when we have many players)
  const total = otherPlayers.size;
  let visibleSet = null;
  if (total > MAX_VISIBLE_OTHERS) {
    const arr = [];
    for (const o of otherPlayers.values()) {
      arr.push([state.pos.distanceToSquared(o.target.pos), o]);
    }
    arr.sort((a, b) => a[0] - b[0]);
    visibleSet = new Set();
    for (let i = 0; i < MAX_VISIBLE_OTHERS && i < arr.length; i++) {
      visibleSet.add(arr[i][1]);
    }
  }
  // Lerp factor tuned for 15Hz snapshots: ~5 (smoother) up to ~10 (snappier)
  const lerpRate = 6;
  for (const o of otherPlayers.values()) {
    const visible = !visibleSet || visibleSet.has(o);
    o.mesh.visible = visible;
    if (o.label) o.label.style.display = visible ? '' : 'none';
    if (!visible) continue;
    o.mesh.position.lerp(o.target.pos, Math.min(1, dt * lerpRate));
    o.mesh.quaternion.slerp(o.target.quat, Math.min(1, dt * lerpRate));
  }
}

// Camera rig: 100% RIGID. No lerp/slerp. Zero jitter possible.
const CAM_OFFSET_LOCAL = new THREE.Vector3(0, 9, -42);
const CAM_YAW180 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
const camOffsetTmp = new THREE.Vector3();
// ---------- KILLCAM (PvP death replay — 4s orbit around killer) ----------
let killcamActive = false;
let killcamData = null; // { killerId, killerName, killerFaction, weapon, deathPos, startT }
const killcamTmp = new THREE.Vector3();

function startKillcam(killerId, killerName, killerFaction, weapon, killerCode) {
  if (killcamActive) return;
  // Killer must still be visible in our AoI
  const killer = otherPlayers.get(killerId);
  if (!killer) return; // Fallback: no killcam (server too far / disconnected)
  killcamActive = true;
  killcamData = {
    killerId,
    killerName: killerName || `Pilot-${killerId}`,
    killerFaction: killerFaction || null,
    killerCode: killerCode || null,
    weapon: weapon || 'LASER',
    deathPos: state.pos.clone(),
    killerPos: killer.mesh.position.clone(),
    startT: performance.now(),
  };
  showKillcamOverlay();
}
function endKillcam() {
  killcamActive = false;
  killcamData = null;
  const ov = document.getElementById('killcam-overlay');
  if (ov) ov.remove();
}
function updateKillcam(dt) {
  if (!killcamActive || !killcamData) return false;
  const elapsed = (performance.now() - killcamData.startT) / 1000;
  // Position: orbit around killer's current position (or fallback to last known)
  const killer = otherPlayers.get(killcamData.killerId);
  const killerPos = killer ? killer.mesh.position : killcamData.killerPos;
  // Orbit angle: time-based, full revolution in 16s (slow)
  const ang = elapsed * 0.4;
  const dist = 38;
  const height = 12;
  killcamTmp.set(
    killerPos.x + Math.cos(ang) * dist,
    killerPos.y + height,
    killerPos.z + Math.sin(ang) * dist
  );
  camera.position.copy(killcamTmp);
  camera.lookAt(killerPos);
  camera.fov = 50; // tighter, cinematic
  camera.updateProjectionMatrix();
  // Update HUD distance text
  const distEl = document.getElementById('kc-dist');
  if (distEl) distEl.textContent = `${killcamData.deathPos.distanceTo(killerPos).toFixed(0)}u`;
  return true;
}

function showKillcamOverlay() {
  let ov = document.getElementById('killcam-overlay');
  if (ov) return;
  ov = document.createElement('div');
  ov.id = 'killcam-overlay';
  const f = getFaction(killcamData.killerFaction);
  const factionTxt = f ? f.name : 'UNKNOWN';
  const factionColor = f ? f.cssColor : '#ff7766';
  // Check if killer is already a friend (don't show button if so)
  const alreadyFriend = killcamData.killerCode
    && Array.isArray(profile.friends)
    && profile.friends.some(f => (f.uid || '').slice(0, 8).toLowerCase() === killcamData.killerCode.toLowerCase());
  const friendBtnHtml = (killcamData.killerCode && !alreadyFriend)
    ? `<button class="kc-friend-btn" id="kc-add-friend" data-code="${killcamData.killerCode}" type="button">+ ${t('friends.addBtn').replace('+ ', '')} ${killcamData.killerCode}</button>`
    : '';
  ov.innerHTML = `
    <div class="kc-vignette"></div>
    <div class="kc-top">
      <div class="kc-tag">PvP KILLCAM</div>
      <div class="kc-timer"><span id="kc-timer-fill"></span></div>
    </div>
    <div class="kc-bottom">
      <div class="kc-eliminated">ELIMINATED</div>
      <div class="kc-killer">
        <span class="kc-by">BY</span>
        <span class="kc-name">${escapeHtml(killcamData.killerName)}</span>
      </div>
      <div class="kc-meta">
        <span class="kc-faction" style="color:${factionColor};">⚑ ${factionTxt}</span>
        <span class="kc-weapon">⚔ ${killcamData.weapon}</span>
        <span class="kc-distance"><span id="kc-dist">—</span></span>
      </div>
      ${friendBtnHtml}
    </div>
  `;
  // Wire + Add Friend button (clickable through pointer-events override on .kc-friend-btn)
  const fbtn = ov.querySelector('#kc-add-friend');
  if (fbtn) {
    fbtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const code = fbtn.dataset.code;
      fbtn.disabled = true;
      fbtn.textContent = '...';
      const result = await addFriendByCode(code);
      if (result.ok) {
        fbtn.textContent = `✓ ${result.friend.name}`;
        fbtn.classList.add('ok');
        if (typeof renderFriendsSplash === 'function') renderFriendsSplash();
      } else {
        const err = result.error;
        let msg;
        if (err === 'self')                msg = t('friends.errSelf');
        else if (err === 'already_friend') msg = t('friends.errExists');
        else if (err === 'not_found')      msg = t('friends.errNotFound');
        else if (err === 'rate_limit')     msg = t('friends.errRateLimit');
        else if (err === 'limit_reached')  msg = t('friends.errLimitMax', { n: 200 });
        else                               msg = t('friends.errGeneric');
        fbtn.textContent = '✕ ' + msg.split(' ').slice(0, 4).join(' ');
        fbtn.classList.add('err');
      }
    });
  }
  document.body.appendChild(ov);
}

function updateCamera() {
  // Killcam overrides normal camera
  if (updateKillcam(0)) return;
  myShip.position.copy(state.pos);
  myShip.quaternion.copy(state.quat);
  // Camera orientation = ship orientation rotated 180° around Y (camera looks where ship points)
  camera.quaternion.copy(state.quat).multiply(CAM_YAW180);
  // Position: ship.pos + offset(local).rotated_by(ship.quat)
  camOffsetTmp.copy(CAM_OFFSET_LOCAL).applyQuaternion(state.quat);
  camera.position.copy(state.pos).add(camOffsetTmp);
  // Dynamic FOV for boost feel
  const baseFov = profile?.settings?.fov ?? 62;
  const targetFov = (keys.has('ShiftLeft') || keys.has('ShiftRight')) && keys.has('KeyW') ? baseFov + 14 : baseFov;
  camera.fov += (targetFov - camera.fov) * 0.1;
  camera.updateProjectionMatrix();
  // Damage screen shake (additive offset)
  applyCameraShake();
}

// Weapon HUD: click to select + update active state and cooldown bars every frame
const wslots = document.querySelectorAll('.wslot');
wslots.forEach((el) => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    selectWeapon(parseInt(el.dataset.slot, 10));
  });
});
function updateWeaponHUD() {
  wslots.forEach((el, i) => {
    el.classList.toggle('active', i === state.weapon);
    const ammoEl = el.querySelector('[data-ammo]');
    if (ammoEl) {
      const w = WEAPONS[i];
      const a = state.ammo[i];
      ammoEl.textContent = `${a === Infinity ? '∞' : a} • ${w.batt}⚡`;
    }
    const coolEl = el.querySelector('.cool');
    if (i === state.weapon) {
      const w = WEAPONS[i];
      const pct = w.cool > 0 ? (state.weaponCool / w.cool) * 100 : 0;
      coolEl.style.width = Math.max(0, Math.min(100, pct)) + '%';
    } else {
      coolEl.style.width = '0%';
    }
  });
}

// ---------- MINIMAP (top-down system map) ----------
const minimapCanvas = document.getElementById('minimap');
const minimapCtx = minimapCanvas ? minimapCanvas.getContext('2d') : null;
const MINIMAP_RANGE = 14500; // world units → fits Neptune (13500) with margin
function drawMinimap() {
  if (!minimapCtx) return;
  const W = minimapCanvas.width, H = minimapCanvas.height;
  const cx = W / 2, cy = H / 2;
  const scale = (W * 0.45) / MINIMAP_RANGE;
  const ctx = minimapCtx;
  ctx.clearRect(0, 0, W, H);

  // Subtle radial grid
  ctx.strokeStyle = 'rgba(80,140,200,0.12)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath();
    ctx.arc(cx, cy, (W * 0.45 / 4) * i, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Cross hairs
  ctx.strokeStyle = 'rgba(80,140,200,0.10)';
  ctx.beginPath();
  ctx.moveTo(0, cy); ctx.lineTo(W, cy);
  ctx.moveTo(cx, 0); ctx.lineTo(cx, H);
  ctx.stroke();

  // Planet orbit rings (subtle)
  ctx.strokeStyle = 'rgba(120,180,240,0.18)';
  ctx.lineWidth = 0.8;
  for (const p of PLANETS) {
    if (p.isStar) continue;
    ctx.beginPath();
    ctx.arc(cx, cy, p.x * scale, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Sun
  ctx.fillStyle = '#ffd060';
  ctx.shadowColor = '#ffaa44';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Planets at world position (top-down: x→x, z→y)
  const planetColors = {
    earth: '#4fa9ff', mars: '#e08055', jupiter: '#e6c690',
    saturn: '#f0d99c', uranus: '#9be0e6', neptune: '#5b88ff',
  };
  for (const p of PLANETS) {
    if (p.isStar) continue;
    const pp = planetMeshes[p.key].position;
    const px = cx + pp.x * scale;
    const py = cy + pp.z * scale;
    ctx.fillStyle = planetColors[p.key] || '#88ccee';
    ctx.beginPath();
    ctx.arc(px, py, p.r > 100 ? 3.2 : 2.4, 0, Math.PI * 2);
    ctx.fill();
    // Module dot if not collected
    if (p.module && !state.modules.has(p.key)) {
      ctx.strokeStyle = p.isFinal ? '#ff66ff' : '#ffe14f';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Dark Zone Nebula (purple haze)
  if (typeof DARK_ZONE !== 'undefined') {
    const dzx = cx + DARK_ZONE.center.x * scale;
    const dzy = cy + DARK_ZONE.center.z * scale;
    const dzr = DARK_ZONE.radius * scale;
    const dzGrad = ctx.createRadialGradient(dzx, dzy, 0, dzx, dzy, dzr);
    dzGrad.addColorStop(0, 'rgba(170,90,220,0.45)');
    dzGrad.addColorStop(1, 'rgba(120,60,180,0)');
    ctx.fillStyle = dzGrad;
    ctx.beginPath(); ctx.arc(dzx, dzy, dzr, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(170,100,220,0.5)';
    ctx.lineWidth = 0.6;
    ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.arc(dzx, dzy, dzr, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
  }

  // Black Hole (red event horizon)
  if (typeof BLACK_HOLE !== 'undefined') {
    const bhx = cx + BLACK_HOLE.pos.x * scale;
    const bhy = cy + BLACK_HOLE.pos.z * scale;
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(bhx, bhy, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,80,80,0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(bhx, bhy, 5.5, 0, Math.PI * 2); ctx.stroke();
  }

  // Salvage containers (green tiny squares)
  if (typeof salvages !== 'undefined') {
    ctx.fillStyle = '#66ff99';
    for (const s of salvages) {
      const sx = cx + s.mesh.position.x * scale;
      const sy = cy + s.mesh.position.z * scale;
      ctx.fillRect(sx - 1.2, sy - 1.2, 2.4, 2.4);
    }
  }

  // SOS distress (pulsing red ring + cross)
  if (typeof sos !== 'undefined' && sos) {
    const sx = cx + sos.pos.x * scale;
    const sy = cy + sos.pos.z * scale;
    const pulse = (Math.sin(performance.now() * 0.005) + 1) * 0.5;
    ctx.strokeStyle = `rgba(255, 80, 100, ${0.55 + pulse * 0.4})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(sx, sy, 6 + pulse * 3, 0, Math.PI * 2); ctx.stroke();
    // Cross
    ctx.beginPath();
    ctx.moveTo(sx - 3, sy); ctx.lineTo(sx + 3, sy);
    ctx.moveTo(sx, sy - 3); ctx.lineTo(sx, sy + 3);
    ctx.stroke();
  }

  // Pirates (color-coded by kind: scout=red, interceptor=pink, tank=orange)
  for (const p of pirates) {
    const px = cx + p.mesh.position.x * scale;
    const py = cy + p.mesh.position.z * scale;
    if (p.kindKey === 'tank') {
      ctx.fillStyle = '#ffaa44';
      ctx.beginPath();
      ctx.arc(px, py, 2.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.kindKey === 'interceptor') {
      ctx.fillStyle = '#ff6688';
      ctx.beginPath();
      ctx.arc(px, py, 1.4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#ff4466';
      ctx.beginPath();
      ctx.arc(px, py, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Boss (magenta diamond)
  if (boss) {
    const bx = cx + boss.mesh.position.x * scale;
    const by = cy + boss.mesh.position.z * scale;
    ctx.fillStyle = '#ff44ff';
    ctx.shadowColor = '#ff44ff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(bx, by - 4);
    ctx.lineTo(bx + 4, by);
    ctx.lineTo(bx, by + 4);
    ctx.lineTo(bx - 4, by);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Other players (cyan dots)
  ctx.fillStyle = '#7cd4ff';
  for (const o of otherPlayers.values()) {
    const px = cx + o.mesh.position.x * scale;
    const py = cy + o.mesh.position.z * scale;
    ctx.beginPath();
    ctx.arc(px, py, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Player ship (cyan triangle pointing in heading direction)
  const px = cx + state.pos.x * scale;
  const py = cy + state.pos.z * scale;
  // Heading: project forward vector onto XZ plane
  const fwdMM = new THREE.Vector3(0, 0, 1).applyQuaternion(state.quat);
  const ang = Math.atan2(fwdMM.z, fwdMM.x);
  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(ang);
  ctx.fillStyle = '#aef0ff';
  ctx.shadowColor = '#7cd4ff';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(6, 0);
  ctx.lineTo(-4, -3);
  ctx.lineTo(-4, 3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.shadowBlur = 0;

  // Frame border accent
  ctx.strokeStyle = 'rgba(120,200,255,0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
}

// ---------- MISSION OBJECTIVES (dynamic checklist) ----------
const objListEl = document.getElementById('objList');
let lastObjHash = '';
function updateObjectives() {
  if (!objListEl) return;
  // Don't refresh every frame to save DOM work — every 3rd frame is fine
  const objs = computeObjectives();
  // Build a quick hash to detect changes
  const hash = objs.map(o => `${o.id}|${o.done?1:0}|${o.urgent?1:0}|${o.text}`).join('§');
  if (hash === lastObjHash) return;
  lastObjHash = hash;
  objListEl.innerHTML = objs.map(o => `
    <div class="obj ${o.done ? 'done' : ''} ${o.urgent ? 'urgent' : ''}">
      <div class="ic">${o.done ? '✓' : o.icon}</div>
      <div class="tx">${o.text}</div>
    </div>
  `).join('');
}

function computeObjectives() {
  const list = [];
  const totalModules = PLANETS.filter(x => x.module).length;
  const haveGenesis = state.modules.has('neptune');
  const moduleCount = state.modules.size;

  // 1. Launch
  if (state.launching) {
    list.push({ id: 'launch', icon: '🚀', text: 'Yer atmosferasidan chiqing' });
  } else {
    list.push({ id: 'launch', icon: '🚀', text: 'Yer atmosferasidan chiqing', done: true });
  }

  // 2. Main collection objective
  if (haveGenesis) {
    // Won/winning state — return to Earth
    const earthD = state.pos.distanceTo(planetMeshes['earth'].position) - PLANETS[1].r;
    list.push({
      id: 'genesis', icon: '★',
      text: `Genesis bilan Yerga qayting (${earthD.toFixed(0)}u)`,
      urgent: true,
    });
  } else if (moduleCount === 0) {
    list.push({ id: 'first', icon: '✦', text: 'Birinchi modulni toping' });
  } else if (moduleCount < totalModules) {
    list.push({
      id: 'modules', icon: '✪',
      text: `Modullarni yig'ing (${moduleCount}/${totalModules})`,
    });
  } else {
    list.push({ id: 'modules', icon: '✪', text: 'Barcha modullar yig\'ildi', done: true });
  }

  // 3. Boss objective (after 3+ modules and not yet defeated)
  if (typeof bossDefeated !== 'undefined') {
    if (bossDefeated) {
      list.push({ id: 'boss', icon: '⬢', text: 'Xenomorph Sentinel mag\'lub', done: true });
    } else if (moduleCount >= 3 || (typeof boss !== 'undefined' && boss)) {
      const isLive = (typeof boss !== 'undefined' && boss);
      list.push({
        id: 'boss', icon: '⬢',
        text: isLive ? 'Bossni yo\'q qiling — Neptun yaqinida!' : 'Neptun zonasida boss kutmoqda',
        urgent: isLive,
      });
    }
  }

  // 4. Probe objective (cartography)
  if (typeof probeObjects !== 'undefined') {
    const visited = probeObjects.filter(p => p.visited).length;
    const total = probeObjects.length;
    if (visited >= total) {
      list.push({ id: 'probes', icon: '◎', text: `Barcha zondlar topildi (${visited}/${total})`, done: true });
    } else if (moduleCount >= 1) {
      list.push({ id: 'probes', icon: '◎', text: `Zondlarni o'rganing (${visited}/${total})` });
    }
  }

  // 5. Active SOS (situational, only if active)
  if (typeof sos !== 'undefined' && sos) {
    list.push({
      id: 'sos', icon: '✚',
      text: `Distress signal! (${Math.ceil(sos.expireT)}s)`,
      urgent: true,
    });
  }

  // 6. Critical resource warnings
  if (state.alive && !state.launching) {
    if (state.o2 < 25) {
      list.push({ id: 'o2', icon: '⚠', text: `O₂ tugamoqda (${state.o2.toFixed(0)}%) — sayyoraga doking qiling`, urgent: true });
    }
    if (state.fuel < 15) {
      list.push({ id: 'fuel', icon: '⚠', text: `Yoqilg'i kam (${state.fuel.toFixed(0)}%)`, urgent: true });
    }
    if (state.hull < 25) {
      list.push({ id: 'hull', icon: '⚠', text: `Korpus shikastlangan (${state.hull.toFixed(0)}%)`, urgent: true });
    }
  }

  return list;
}

function updateHUD() {
  // Click-to-control prompt: re-evaluate every frame
  const needPrompt = !pointerLocked && !state.launching && state.alive && splash.style.display === 'none';
  clickPrompt.style.display = needPrompt ? 'block' : 'none';
  updateWeaponHUD();
  updateObjectives();
  drawMinimap();

  $('o2val').textContent = state.o2.toFixed(0) + (state.maxO2 > 100 ? `/${state.maxO2}` : '%');
  $('o2bar').style.width = (state.o2 / state.maxO2 * 100) + '%';
  $('fuelval').textContent = state.fuel.toFixed(0) + (state.maxFuel > 100 ? `/${state.maxFuel}` : '%');
  $('fuelbar').style.width = (state.fuel / state.maxFuel * 100) + '%';
  $('battval').textContent = state.batt.toFixed(0) + (state.maxBatt > 100 ? `/${state.maxBatt}` : '%');
  $('battbar').style.width = (state.batt / state.maxBatt * 100) + '%';
  $('hullval').textContent = state.hull.toFixed(0) + (state.maxHull > 100 ? `/${state.maxHull}` : '%');
  $('hullbar').style.width = Math.max(0, state.hull / state.maxHull * 100) + '%';

  $('vel').textContent = state.vel.length().toFixed(1);
  $('players').textContent = otherPlayers.size + 1;
  $('modules').textContent = `${state.modules.size} / ${PLANETS.filter(x=>x.module).length}`;
  const k = state.karma;
  const karmaEl = $('karma');
  karmaEl.textContent = (k >= 0 ? '+' : '') + k + (k > 0 ? ' (SAVIOR)' : k < 0 ? ' (RAIDER)' : '');
  karmaEl.style.color = k > 0 ? '#7cd4ff' : k < 0 ? '#ff7c7c' : '#b8e8ff';
  $('kills').textContent = state.kills;
  $('dockTag').style.display = state.docking ? 'block' : 'none';
  $('hvtTag').style.display = state.hvt ? 'block' : 'none';

  // Nearest planet
  let nearest = null, nearestD = Infinity;
  for (const p of PLANETS) {
    const d = state.pos.distanceTo(planetMeshes[p.key].position);
    if (d < nearestD) { nearestD = d; nearest = p; }
  }
  if (nearest) {
    $('nearest').textContent = `${nearest.name} (${(nearestD - nearest.r).toFixed(0)})`;
    $('sector').textContent = `${nearest.name} SECTOR`;
  }

  // Heading vector compactly
  fwd.set(0,0,1).applyQuaternion(state.quat);
  $('heading').textContent = `${fwd.x.toFixed(2)}, ${fwd.y.toFixed(2)}, ${fwd.z.toFixed(2)}`;

  // Off-screen markers for planets, gates, players
  updateMarkers();
  // Friend pings (HUD beacons)
  if (typeof updateFriendPings === 'function') updateFriendPings();
  // Emote bubbles tracked to ships
  if (typeof updateEmoteBubbles === 'function') updateEmoteBubbles();
  // Sun lens flare
  if (typeof updateLensFlare === 'function') updateLensFlare();
}

// Markers — track planets & players via screen projection
const markerPool = new Map(); // key -> {el}
function ensureMarker(key, kind, label) {
  let m = markerPool.get(key);
  if (!m) {
    const el = document.createElement('div');
    el.className = `marker ${kind}`;
    el.innerHTML = `<div class="ring"></div><div class="t"></div><div class="dist"></div>`;
    targetsLayer.appendChild(el);
    m = { el };
    markerPool.set(key, m);
  }
  m.el.querySelector('.t').textContent = label;
  return m;
}
function projectToScreen(worldPos, out) {
  out.copy(worldPos).project(camera);
  const onScreen = out.z > -1 && out.z < 1 && Math.abs(out.x) < 1.05 && Math.abs(out.y) < 1.05;
  out.x = (out.x * 0.5 + 0.5) * window.innerWidth;
  out.y = (-out.y * 0.5 + 0.5) * window.innerHeight;
  return onScreen;
}
const projTmp = new THREE.Vector3();
function updateMarkers() {
  // Planets
  for (const p of PLANETS) {
    if (p.isStar) continue;
    const d = state.pos.distanceTo(planetMeshes[p.key].position);
    const m = ensureMarker('p_' + p.key, 'planet', p.name);
    const onScreen = projectToScreen(planetMeshes[p.key].position, projTmp);
    placeMarker(m.el, projTmp, onScreen);
    m.el.querySelector('.dist').textContent = (d - p.r).toFixed(0);
  }
  // Gates
  for (const p of PLANETS) {
    const g = gateMeshes[p.key]; if (!g) continue;
    const m = ensureMarker('g_' + p.key, 'gate', `▣ ${p.name} GATE`);
    const onScreen = projectToScreen(g.position, projTmp);
    placeMarker(m.el, projTmp, onScreen);
    m.el.querySelector('.dist').textContent = state.pos.distanceTo(g.position).toFixed(0);
  }
  // Players
  for (const [id, o] of otherPlayers) {
    const onScreen = projectToScreen(o.mesh.position, projTmp);
    o.label.classList.toggle('hvt', o.hvt);
    placeMarker(o.label, projTmp, onScreen);
    const distEl = o.label.querySelector('[data-dist]');
    if (distEl) distEl.textContent = state.pos.distanceTo(o.mesh.position).toFixed(0);
    // Update name text node (2nd child)
    const nameDiv = o.label.children[1];
    if (nameDiv) nameDiv.textContent = (o.hvt ? '★ ' : '') + o.name;
  }
}
function placeMarker(el, p, onScreen) {
  if (!onScreen) {
    // Clamp to edges
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let dx = p.x - cx, dy = p.y - cy;
    // If projected behind camera, flip
    if (p.z > 1 || p.z < -1) { dx = -dx; dy = -dy; }
    const margin = 40;
    const maxX = cx - margin, maxY = cy - margin;
    const scale = Math.min(maxX / Math.abs(dx || 0.001), maxY / Math.abs(dy || 0.001));
    p.x = cx + dx * scale;
    p.y = cy + dy * scale;
    el.style.opacity = '0.5';
  } else {
    el.style.opacity = '1';
  }
  el.style.left = p.x + 'px';
  el.style.top = p.y + 'px';
}

function animateWorld(dt) {
  // Adaptive music intensity (combat layer fade)
  if (typeof updateAdaptiveMusic === 'function') updateAdaptiveMusic(dt);
  // Cosmic dust drift + recenter on player
  updateCosmicDust(dt);
  // Sun corona breathing pulse (subtle cinematic vibe)
  const sunMesh = planetMeshes['sun'];
  if (sunMesh && sunMesh.userData.coronas) {
    const t = performance.now() * 0.001;
    const pulse = 1.0 + Math.sin(t * 0.6) * 0.08;
    const pulse2 = 1.0 + Math.sin(t * 0.4 + 1.2) * 0.05;
    sunMesh.userData.coronas[0].scale.setScalar(pulse);    // inner corona
    sunMesh.userData.coronas[1].scale.setScalar(pulse2);   // outer corona
    // Halo flicker
    const halo = sunMesh.userData.coronas[2];
    if (halo && halo.material) {
      halo.material.opacity = 0.30 + Math.sin(t * 0.8) * 0.06;
    }
  }
  // Spin gates
  for (const k in gateMeshes) {
    gateMeshes[k].rotation.y += dt * 0.4;
    gateMeshes[k].rotation.x += dt * 0.2;
    // Orbit gate around planet (anchored to planet's actual world position)
    const pl = PLANETS.find(p => p.key === k);
    const planetPos = planetMeshes[k].position;
    const t = performance.now() * 0.0002 + (pl.x * 0.01);
    const orbitR = pl.r * 2.4;
    gateMeshes[k].position.set(
      planetPos.x + Math.cos(t) * orbitR,
      planetPos.y + Math.sin(t * 0.7) * pl.r * 0.6,
      planetPos.z + Math.sin(t) * orbitR
    );
    // Module near gate
    const mod = moduleMeshes[k];
    if (mod) {
      mod.position.copy(gateMeshes[k].position).add(new THREE.Vector3(0, pl.r * 0.5, 0));
      mod.rotation.y += dt * 1.5;
      mod.rotation.x += dt * 0.7;
    }
  }
  // Subtle planet rotation + cloud parallax
  for (const p of PLANETS) {
    if (p.isStar) continue;
    const m = planetMeshes[p.key];
    m.rotation.y += dt * 0.05;
    if (m.userData.clouds) m.userData.clouds.rotation.y += dt * 0.018; // slight parallax
  }
}

// Brief invulnerability window after respawn to avoid instant re-death
state.invulT = 0;
let respawnTimerId = null;

// ---------- SHIP DAMAGE VISUALS (smoke + sparks + tinted plume when hull low) ----------
const damageParticles = [];
let smokeT = 0;
let sparkT = 0;
const _dmgFwd = new THREE.Vector3();
const _dmgRight = new THREE.Vector3();
const _dmgUp = new THREE.Vector3();

function updateShipDamage(dt) {
  if (!state.alive || state.launching) return;
  const hullPct = state.hull / state.maxHull;

  // Tint engine plumes when hull is critical (red glow)
  if (myShip.userData.plumeMats) {
    const baseColor = new THREE.Color(0x66ddff);
    const dangerColor = new THREE.Color(0xff5544);
    const dangerLerp = Math.max(0, 1 - hullPct / 0.35);
    const blended = baseColor.clone().lerp(dangerColor, dangerLerp);
    for (const m of myShip.userData.plumeMats) m.color.copy(blended);
  }

  // Smoke trail spawning (faster as hull drops)
  if (hullPct < 0.7) {
    smokeT -= dt;
    const rate = hullPct < 0.20 ? 0.04 : hullPct < 0.40 ? 0.10 : hullPct < 0.55 ? 0.18 : 0.30;
    if (smokeT <= 0) {
      smokeT = rate;
      spawnSmokePuff(hullPct);
    }
  }

  // Sparks for low hull
  if (hullPct < 0.40) {
    sparkT -= dt;
    const rate = hullPct < 0.20 ? 0.18 : 0.40;
    if (sparkT <= 0) {
      sparkT = rate;
      // 1-3 sparks burst
      const n = hullPct < 0.20 ? 3 : 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) spawnDamageSpark();
    }
  }

  // Update particles
  for (let i = damageParticles.length - 1; i >= 0; i--) {
    const p = damageParticles[i];
    p.life -= dt;
    p.mesh.position.addScaledVector(p.vel, dt);
    if (p.kind === 'smoke') {
      const t = 1 - p.life / p.maxLife;
      const sz = p.startScale * (1 + t * 1.4);
      p.mesh.scale.set(sz, sz, 1);
      p.mesh.material.opacity = (1 - t) * p.maxOpacity;
    } else {
      // Spark: bright then fade
      const t = 1 - p.life / p.maxLife;
      p.mesh.material.opacity = Math.max(0, 1 - t);
      p.mesh.scale.setScalar(p.startScale * (1 - t * 0.4));
      // gravity-like decay (slow down)
      p.vel.multiplyScalar(Math.pow(0.4, dt));
    }
    if (p.life <= 0) {
      scene.remove(p.mesh);
      damageParticles.splice(i, 1);
    }
  }
}

function spawnSmokePuff(hullPct) {
  // Darker smoke at lower hull, with red tint at critical
  const tone = hullPct < 0.25 ? 0x664433 : hullPct < 0.5 ? 0x554444 : 0x444444;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: tone, transparent: true,
    opacity: 0.55, blending: THREE.NormalBlending, depthWrite: false,
  }));
  // Position on ship: random offset on hull, biased rear
  _dmgFwd.set(0, 0, 1).applyQuaternion(state.quat);
  _dmgRight.set(1, 0, 0).applyQuaternion(state.quat);
  _dmgUp.set(0, 1, 0).applyQuaternion(state.quat);
  sp.position.copy(state.pos)
    .addScaledVector(_dmgFwd, -2.8 + (Math.random() - 0.5) * 4.5)
    .addScaledVector(_dmgRight, (Math.random() - 0.5) * 2.2)
    .addScaledVector(_dmgUp, (Math.random() - 0.5) * 1.0);
  // Drift backward (relative to ship velocity) and slightly outward
  const vel = state.vel.clone().multiplyScalar(-0.15);
  vel.addScaledVector(_dmgUp, 0.5 + Math.random() * 1.0);
  vel.x += (Math.random() - 0.5) * 1.5;
  vel.z += (Math.random() - 0.5) * 1.5;
  scene.add(sp);
  const startScale = 1.6 + Math.random() * 1.2;
  sp.scale.set(startScale, startScale, 1);
  damageParticles.push({
    mesh: sp, vel, kind: 'smoke',
    life: 1.6 + Math.random() * 0.6, maxLife: 2.0,
    startScale, maxOpacity: 0.5,
  });
}

function spawnDamageSpark() {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: Math.random() < 0.5 ? 0xffcc44 : 0xff7733, transparent: true,
    opacity: 1.0, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  _dmgFwd.set(0, 0, 1).applyQuaternion(state.quat);
  sp.position.copy(state.pos).addScaledVector(_dmgFwd, -1 + (Math.random() - 0.5) * 4);
  const vel = new THREE.Vector3(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 12,
  );
  // Bias velocity backward relative to ship motion
  vel.addScaledVector(state.vel, -0.2);
  scene.add(sp);
  const startScale = 1.6 + Math.random() * 0.8;
  sp.scale.set(startScale, startScale, 1);
  damageParticles.push({
    mesh: sp, vel, kind: 'spark',
    life: 0.45 + Math.random() * 0.2, maxLife: 0.6,
    startScale,
  });
}

// ---------- HIT FEEDBACK (shake + flash + hull watcher) ----------
state.shakeT = 0;
state.shakeAmp = 0;
state.flashT = 0;
state.flashMax = 0;
state._lastHull = 100;
const hitFlashEl = document.getElementById('hit-flash');

function triggerHitFeedback(amount) {
  // amount: hull damage; scale shake/flash by it
  SFX.hitThud();
  const intensity = Math.max(0, Math.min(1, amount / 18));
  state.shakeT = 0.30;
  state.shakeAmp = Math.max(state.shakeAmp, 0.6 + intensity * 3.4);
  const newFlash = 0.32 + intensity * 0.55;
  if (newFlash > state.flashT) {
    state.flashT = newFlash;
    state.flashMax = newFlash;
  }
}

function updateHitFeedback(dt) {
  // Detect any hull drop (any damage source) and trigger feedback
  if (state.alive && state.invulT <= 0) {
    const dh = state._lastHull - state.hull;
    if (dh > 0.05) triggerHitFeedback(dh);
  }
  state._lastHull = state.hull;

  // Decay shake
  if (state.shakeT > 0) {
    state.shakeT -= dt;
    if (state.shakeT < 0) state.shakeT = 0;
    state.shakeAmp *= Math.pow(0.05, dt); // fast decay
  }
  // Decay flash
  if (state.flashT > 0) {
    state.flashT -= dt * 1.6; // ~0.6s full fade
    if (state.flashT < 0) state.flashT = 0;
  }
  if (hitFlashEl) {
    const op = state.flashMax > 0 ? state.flashT / state.flashMax * state.flashMax : 0;
    hitFlashEl.style.opacity = Math.max(0, Math.min(0.9, op));
  }
}

// Apply camera shake (called from updateCamera AFTER position is set)
function applyCameraShake() {
  if (state.shakeT <= 0 || state.shakeAmp <= 0.01) return;
  const a = state.shakeAmp;
  // Random offset in camera-local space
  const ox = (Math.random() - 0.5) * 2 * a;
  const oy = (Math.random() - 0.5) * 2 * a;
  const oz = (Math.random() - 0.5) * 2 * a * 0.4;
  // Transform to world space using camera quaternion
  const offset = new THREE.Vector3(ox, oy, oz).applyQuaternion(camera.quaternion);
  camera.position.add(offset);
}

function gameOver(reason) {
  if (!state.alive) return;
  state.alive = false;
  state.launching = false;
  profileOnDeath();
  aidaSay(`✗ HALOK: ${reason}. Yerga qaytib qayta tirilish... (4s)`, 8000);
  document.exitPointerLock?.();
  showDeathOverlay(reason);
  // Auto-respawn after 4s (modules and karma are preserved)
  respawnTimerId = setTimeout(() => respawn(), 4000);
}

function respawn() {
  hideDeathOverlay();
  if (typeof endKillcam === 'function') endKillcam();
  // Reset position near Earth (just outside surface, clear of asteroids)
  const earthPos = planetMeshes['earth'].position;
  const offset = new THREE.Vector3(PLANETS[1].r + 60, 0, 30);
  state.pos.copy(earthPos).add(offset);
  state.vel.set(0, 0, 0);
  state.quat.identity();
  // Full resources
  state.o2 = state.maxO2; state.fuel = state.maxFuel; state.batt = state.maxBatt; state.hull = state.maxHull;
  state.alive = true;
  state.invulT = 5; // 5 seconds of damage immunity
  // Clear nearby pirates so respawn isn't instant death
  for (let i = pirates.length - 1; i >= 0; i--) {
    if (pirates[i].mesh.position.distanceTo(state.pos) < 600) {
      scene.remove(pirates[i].mesh);
      pirates.splice(i, 1);
    }
  }
  // Despawn active boss (will re-arm when player returns to Neptune zone)
  if (boss) {
    despawnBoss(false);
    bossSpawnArmed = false;
  }
  // Clear in-flight projectiles
  for (const l of bossLasers) scene.remove(l.mesh);
  bossLasers.length = 0;
  aidaSay('✦ Qayta tirildingiz. Modullar saqlangan. 5s immunitet.', 6000);
}

function showDeathOverlay(reason) {
  // Suppress generic death overlay when killcam is showing its own UI
  if (typeof killcamActive !== 'undefined' && killcamActive) return;
  let div = document.getElementById('deathOverlay');
  if (!div) {
    div = document.createElement('div');
    div.id = 'deathOverlay';
    div.style.cssText = `
      position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
      background: radial-gradient(ellipse at center, rgba(40,4,4,0.7), rgba(0,0,0,0.85));
      z-index: 9999; pointer-events: none; color: #ff8888;
      font-family: 'Courier New', monospace; text-align: center;
    `;
    document.body.appendChild(div);
  }
  div.innerHTML = `
    <div style="border:1px solid rgba(255,80,80,0.5); padding:30px 50px; background:rgba(20,0,0,0.6); box-shadow:0 0 40px rgba(255,40,40,0.3); pointer-events:auto;">
      <div style="font-size:11px; letter-spacing:6px; color:#ff4444;">MISSION FAILED</div>
      <div style="font-size:22px; margin:14px 0; color:#ffcccc; letter-spacing:2px;">${escapeHtml(reason)}</div>
      <div style="font-size:11px; opacity:0.8;">Modullar: ${state.modules.size}/${PLANETS.filter(x=>x.module).length} · Karma: ${state.karma}</div>
      <div style="font-size:10px; opacity:0.6; margin-top:10px;">Qayta tug'ilish 4 sekundda...</div>
      <button id="deathShareBtn" style="margin-top:14px; padding:8px 20px; background:rgba(255,80,80,0.15); border:1px solid rgba(255,80,80,0.5); color:#ffcccc; font-family:inherit; font-size:11px; letter-spacing:3px; cursor:pointer;">𝕏  ULASHISH</button>
    </div>
  `;
  div.style.display = 'flex';
  const sb = div.querySelector('#deathShareBtn');
  if (sb) sb.addEventListener('click', () => shareDeath(reason));
}
function hideDeathOverlay() {
  const div = document.getElementById('deathOverlay');
  if (div) div.style.display = 'none';
}

// =============================================================
// PHASE 3: Parvoz, Qora tuynuk, Asteroid yomg'iri, Haqiqiy zondlar
// =============================================================

// ---------- LAUNCH FROM EARTH ----------
const LAUNCH_DURATION = 7.0;
let launchPad = null;
function startLaunch() {
  const earthPos = planetMeshes['earth'].position;
  const surfaceUp = new THREE.Vector3(0, 1, 0);
  state.pos.copy(earthPos).addScaledVector(surfaceUp, PLANETS[1].r + 5);
  state.vel.set(0, 0, 0);
  // Orient ship: local +Z (forward) along world +Y (up)
  state.quat.setFromUnitVectors(new THREE.Vector3(0, 0, 1), surfaceUp);
  state.launching = true;
  state.launchT = 0;

  // Launch pad (small platform on Earth surface)
  launchPad = new THREE.Group();
  const padBase = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 11, 2.5, 18),
    new THREE.MeshStandardMaterial({ color: 0x4a4a52, metalness: 0.7, roughness: 0.4 })
  );
  launchPad.add(padBase);
  const padTop = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 8, 1.2, 18),
    new THREE.MeshStandardMaterial({ color: 0x2a2a30, metalness: 0.8, roughness: 0.3, emissive: 0xff6622, emissiveIntensity: 0.15 })
  );
  padTop.position.y = 1.4;
  launchPad.add(padTop);
  // Tower
  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 14, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x666672, metalness: 0.8, roughness: 0.3 })
  );
  tower.position.set(7, 7, 0);
  launchPad.add(tower);
  launchPad.position.copy(earthPos).addScaledVector(surfaceUp, PLANETS[1].r + 0.5);
  scene.add(launchPad);

  // Big rocket exhaust glow under ship
  const exhaustMat = new THREE.SpriteMaterial({
    map: glowTex, color: 0xff9944, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const exhaust = new THREE.Sprite(exhaustMat);
  exhaust.scale.set(18, 45, 1);
  scene.add(exhaust);
  state.exhaustSprite = exhaust;
}

function handleLaunch(dt) {
  state.launchT += dt;
  // Rocket physics: increasing acceleration along world +Y
  const t = state.launchT;
  const accel = 18 + t * t * 4;
  state.vel.y += accel * dt;
  // Slight drift to simulate Earth rotation push
  state.vel.x += 1.5 * dt;
  state.pos.addScaledVector(state.vel, dt);

  // Engine plumes max
  for (const m of myShip.userData.plumeMats) m.opacity = 1.0;

  // Sync ship transform now (camera will read it)
  myShip.position.copy(state.pos);
  myShip.quaternion.copy(state.quat);

  // Update exhaust sprite below ship
  if (state.exhaustSprite) {
    state.exhaustSprite.position.copy(state.pos).addScaledVector(new THREE.Vector3(0, 1, 0), -8);
    state.exhaustSprite.material.opacity = Math.max(0, 0.95 - t * 0.08);
    state.exhaustSprite.scale.y = Math.max(8, 45 - t * 5);
  }

  if (t >= LAUNCH_DURATION) {
    state.launching = false;
    if (state.exhaustSprite) {
      scene.remove(state.exhaustSprite);
      state.exhaustSprite = null;
    }
    // Cap end-of-launch velocity so player isn't flung at 600 u/s
    if (state.vel.length() > 120) state.vel.setLength(120);
    aidaSay('✓ Atmosferadan chiqdik! Boshqaruv sizda. Marsga yo\'l oling.', 6000);
    aidaSay('W/S — gaz, Sichqoncha — qarash, LMB — lazer, F — Jump Gate', 6000);
  }
}

function updateLaunchCamera() {
  const t = Math.min(1, state.launchT / LAUNCH_DURATION);
  // Cinematic orbit camera that pulls back
  const earthPos = planetMeshes['earth'].position;
  const baseR = 60 + t * 240;
  const ang = state.launchT * 0.35;
  const camPos = new THREE.Vector3(
    state.pos.x + Math.cos(ang) * baseR,
    state.pos.y + 30 + t * 80 - 50 * (1 - t),
    state.pos.z + Math.sin(ang) * baseR
  );
  camera.position.lerp(camPos, 0.06);
  camera.up.set(0, 1, 0);
  camera.lookAt(state.pos);
}

// ---------- BLACK HOLE ----------
const BLACK_HOLE = { pos: new THREE.Vector3(-7000, 1500, 5500), r: 180 };
let blackHoleDisc = null;
(function makeBlackHole() {
  const g = new THREE.Group();
  // Event horizon
  const eh = new THREE.Mesh(
    new THREE.SphereGeometry(BLACK_HOLE.r, 48, 32),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  g.add(eh);
  // Animated accretion disc (shader)
  const discMat = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    transparent: true, side: THREE.DoubleSide, depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float time;
      void main() {
        vec2 p = vUv - 0.5;
        float r = length(p) * 2.0;
        float ang = atan(p.y, p.x);
        float swirl = sin(ang * 5.0 - time * 3.0 + r * 16.0) * 0.5 + 0.5;
        float a = smoothstep(1.0, 0.55, r) * smoothstep(0.0, 0.40, r);
        vec3 hot  = mix(vec3(1.0, 0.45, 0.08), vec3(1.0, 0.95, 0.65), swirl);
        vec3 cool = mix(vec3(0.5, 0.2, 0.7),   vec3(0.85, 0.45, 0.95), swirl);
        vec3 col  = mix(hot, cool, smoothstep(0.4, 0.95, r));
        gl_FragColor = vec4(col * (1.0 + swirl * 0.5), a * 0.95);
      }
    `
  });
  blackHoleDisc = new THREE.Mesh(
    new THREE.RingGeometry(BLACK_HOLE.r * 1.3, BLACK_HOLE.r * 4.5, 96, 1),
    discMat
  );
  blackHoleDisc.rotation.x = Math.PI / 2.3;
  blackHoleDisc.rotation.z = 0.3;
  g.add(blackHoleDisc);
  // Lensing halo
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xff7733, transparent: true, opacity: 0.65,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  halo.scale.set(BLACK_HOLE.r * 5, BLACK_HOLE.r * 5, 1);
  g.add(halo);
  g.position.copy(BLACK_HOLE.pos);
  scene.add(g);
})();
function applyBlackHole(dt) {
  if (blackHoleDisc) blackHoleDisc.material.uniforms.time.value += dt;
  const toBH = new THREE.Vector3().copy(BLACK_HOLE.pos).sub(state.pos);
  const d = toBH.length();
  if (d < 5000) {
    toBH.divideScalar(Math.max(d, 0.001));
    const G = 6.5e6;
    const a = G / (d * d);
    state.vel.addScaledVector(toBH, a * dt);
    if (d < 800) aidaSay('⚠  Qora tuynuk gravitatsiyasi sizni tortmoqda!', 4000);
  }
  if (d < BLACK_HOLE.r * 1.05) {
    gameOver('Qora tuynukka tushdingiz');
  }
}

// ---------- DARK ZONE NEBULA (between Uranus & Neptune) ----------
const DARK_ZONE = {
  center: new THREE.Vector3(),
  radius: 1300,
  inside: false,
  warned: false,
  cloudGroup: null,
  fogTarget: 0,
  fogCurrent: 0,
};
(function buildDarkZone() {
  // Place midway between Uranus and Neptune (orbital positions)
  const u = planetMeshes['uranus'].position;
  const n = planetMeshes['neptune'].position;
  DARK_ZONE.center.copy(u).lerp(n, 0.5);
  DARK_ZONE.center.y = 80;

  const grp = new THREE.Group();
  grp.position.copy(DARK_ZONE.center);

  // Cloud sprite texture (purple-cyan tinted soft puff)
  const cc = document.createElement('canvas');
  cc.width = cc.height = 256;
  const cx = cc.getContext('2d');
  const grad = cx.createRadialGradient(128, 128, 4, 128, 128, 128);
  grad.addColorStop(0,    'rgba(180,120,220,0.55)');
  grad.addColorStop(0.35, 'rgba(120,80,180,0.30)');
  grad.addColorStop(0.7,  'rgba(60,40,100,0.14)');
  grad.addColorStop(1,    'rgba(30,20,60,0.0)');
  cx.fillStyle = grad;
  cx.fillRect(0, 0, 256, 256);
  const cloudTex = new THREE.CanvasTexture(cc);

  // Layered cloud puffs — randomized within sphere
  const puffMat1 = new THREE.SpriteMaterial({
    map: cloudTex, color: 0xaa66ee, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const puffMat2 = new THREE.SpriteMaterial({
    map: cloudTex, color: 0x4488ff, transparent: true, opacity: 0.45,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const puffs = [];
  for (let i = 0; i < 110; i++) {
    const r = Math.cbrt(Math.random()) * DARK_ZONE.radius * 0.95;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.6; // somewhat flat
    const px = Math.cos(theta) * Math.cos(phi) * r;
    const py = Math.sin(phi) * r;
    const pz = Math.sin(theta) * Math.cos(phi) * r;
    const sp = new THREE.Sprite(Math.random() < 0.6 ? puffMat1.clone() : puffMat2.clone());
    sp.position.set(px, py, pz);
    const s = 240 + Math.random() * 480;
    sp.scale.set(s, s, 1);
    sp.userData = { driftSpeed: 0.05 + Math.random() * 0.08, driftAxis: Math.random() * Math.PI * 2 };
    grp.add(sp);
    puffs.push(sp);
  }
  DARK_ZONE.cloudGroup = grp;
  DARK_ZONE.puffs = puffs;
  scene.add(grp);

  // Marker outside hub: a faint glowing ring at zone boundary so player sees it
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x9966ff, transparent: true, opacity: 0.12,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(DARK_ZONE.radius * 0.95, DARK_ZONE.radius * 1.0, 80, 1),
    ringMat
  );
  ring.rotation.x = Math.PI / 2;
  grp.add(ring);
})();

const dzLightnings = []; // active lightning bolts
let dzLightningT = 0;
function spawnLightning() {
  // Pick two random points inside the zone
  const a = DARK_ZONE.center.clone();
  const b = DARK_ZONE.center.clone();
  const off = (max) => (Math.random() - 0.5) * 2 * max * 0.7;
  a.x += off(DARK_ZONE.radius); a.y += off(DARK_ZONE.radius); a.z += off(DARK_ZONE.radius);
  b.x += off(DARK_ZONE.radius); b.y += off(DARK_ZONE.radius); b.z += off(DARK_ZONE.radius);
  // Build jagged polyline between them
  const segments = 8;
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3().lerpVectors(a, b, t);
    if (i > 0 && i < segments) {
      p.x += (Math.random() - 0.5) * 80;
      p.y += (Math.random() - 0.5) * 80;
      p.z += (Math.random() - 0.5) * 80;
    }
    pts.push(p);
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({
    color: 0xeeaaff, transparent: true, opacity: 1.0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const line = new THREE.Line(geo, mat);
  scene.add(line);
  // Flash sprite at midpoint
  const mid = a.clone().lerp(b, 0.5);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xffaaff, transparent: true, opacity: 1.0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  flash.position.copy(mid);
  flash.scale.set(180, 180, 1);
  scene.add(flash);
  dzLightnings.push({ line, flash, life: 0.35 });
  // Damage if player is near the bolt path (within 60u of midpoint)
  if (state.pos.distanceTo(mid) < 90 && state.invulT <= 0) {
    state.hull -= 6;
    state.batt = Math.max(0, state.batt - 8);
    aidaSay('⚡ Chaqmoq! -6 korpus, -8 batareya');
    if (state.hull <= 0) gameOver('Nebula chaqmog\'i sizni urdi');
  }
}

function updateDarkZone(dt) {
  // Drift cloud puffs subtly
  if (DARK_ZONE.puffs) {
    const t = performance.now() * 0.0001;
    for (const sp of DARK_ZONE.puffs) {
      const u = sp.userData;
      sp.position.x += Math.cos(t * u.driftSpeed + u.driftAxis) * dt * 1.2;
      sp.position.z += Math.sin(t * u.driftSpeed + u.driftAxis) * dt * 1.2;
    }
  }
  // Slowly rotate cloud group for atmosphere
  if (DARK_ZONE.cloudGroup) DARK_ZONE.cloudGroup.rotation.y += dt * 0.015;

  // Inside-check
  const d = state.pos.distanceTo(DARK_ZONE.center);
  const inside = d < DARK_ZONE.radius;
  if (inside && !DARK_ZONE.inside) {
    DARK_ZONE.inside = true;
    aidaSay('⚠  DARK ZONE: Tuman radarni buzmoqda. Tezroq chiqing — chaqmoqlar bor!', 7000);
  } else if (!inside && DARK_ZONE.inside) {
    DARK_ZONE.inside = false;
    aidaSay('✓ Tumandan chiqdingiz', 4000);
  }

  // Smoothly fade fog when inside
  DARK_ZONE.fogTarget = inside ? 1 : 0;
  DARK_ZONE.fogCurrent += (DARK_ZONE.fogTarget - DARK_ZONE.fogCurrent) * Math.min(1, dt * 1.5);
  if (DARK_ZONE.fogCurrent > 0.02) {
    if (!scene.fog) scene.fog = new THREE.FogExp2(0x331a55, 0);
    scene.fog.density = DARK_ZONE.fogCurrent * 0.0014;
    scene.background = new THREE.Color().lerpColors(
      new THREE.Color(0x02030a), new THREE.Color(0x1a0a2a),
      DARK_ZONE.fogCurrent
    );
  } else if (scene.fog) {
    scene.fog = null;
    scene.background = new THREE.Color(0x02030a);
  }

  if (inside && state.invulT <= 0) {
    // Extra battery drain
    state.batt = Math.max(0, state.batt - dt * 1.4);
    // Lightning timer
    dzLightningT -= dt;
    if (dzLightningT <= 0) {
      dzLightningT = 3 + Math.random() * 4;
      spawnLightning();
      SFX.lightning();
    }
  }

  // Update active lightning bolts
  for (let i = dzLightnings.length - 1; i >= 0; i--) {
    const l = dzLightnings[i];
    l.life -= dt;
    const t = Math.max(0, l.life / 0.35);
    l.line.material.opacity = t;
    l.flash.material.opacity = t;
    l.flash.scale.setScalar(180 + (1 - t) * 220);
    if (l.life <= 0) {
      scene.remove(l.line);
      scene.remove(l.flash);
      l.line.geometry.dispose();
      dzLightnings.splice(i, 1);
    }
  }
}

// ---------- ASTEROID STORM ----------
let stormT = 80 + Math.random() * 40;
let stormWarned = false;
const stormAsteroids = [];
const stormGeo = new THREE.IcosahedronGeometry(1, 0);
const stormMat = new THREE.MeshStandardMaterial({ color: 0x988a72, roughness: 0.95, metalness: 0.05 });
function spawnStorm() {
  const dir = new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5)*0.4, (Math.random()-0.5)).normalize();
  let t1 = new THREE.Vector3();
  if (Math.abs(dir.y) < 0.9) t1.set(0,1,0).cross(dir).normalize();
  else t1.set(1,0,0).cross(dir).normalize();
  const t2 = new THREE.Vector3().crossVectors(dir, t1);
  for (let i = 0; i < 32; i++) {
    const lat = (Math.random() - 0.5) * 700;
    const lon = (Math.random() - 0.5) * 700;
    const start = state.pos.clone()
      .addScaledVector(dir, 1500 + Math.random() * 700)
      .addScaledVector(t1, lat)
      .addScaledVector(t2, lon);
    const v = dir.clone().multiplyScalar(-(70 + Math.random() * 50));
    v.x += (Math.random()-0.5) * 6;
    v.y += (Math.random()-0.5) * 6;
    v.z += (Math.random()-0.5) * 6;
    const size = 3 + Math.random() * 7;
    const m = new THREE.Mesh(stormGeo, stormMat);
    m.position.copy(start);
    m.scale.setScalar(size);
    m.userData = { vel: v, life: 28, size, spin: 1 + Math.random() * 2 };
    scene.add(m);
    stormAsteroids.push(m);
  }
}
function updateStorm(dt) {
  stormT -= dt;
  if (stormT <= 8 && !stormWarned) {
    stormWarned = true;
    aidaSay('⚠  ASTEROID YOMG\'IRI YAQINLASHMOQDA — 8 SONIYA!', 7000);
  }
  if (stormT <= 0) {
    spawnStorm();
    aidaSay('☄️ ASTEROID YOMG\'IRI BOSHLANDI — chetlanglar!', 5000);
    stormT = 110 + Math.random() * 80;
    stormWarned = false;
  }
  for (let i = stormAsteroids.length - 1; i >= 0; i--) {
    const a = stormAsteroids[i];
    a.position.addScaledVector(a.userData.vel, dt);
    a.rotation.x += a.userData.spin * dt;
    a.rotation.y += a.userData.spin * 0.7 * dt;
    a.userData.life -= dt;
    if (state.pos.distanceTo(a.position) < a.userData.size + 2.5) {
      state.hull -= 8;
      aidaSay('⚠  Asteroid yomg\'iri zarbasi!');
      if (state.hull <= 0) gameOver('Asteroid yomg\'iri yo\'q qildi');
      scene.remove(a);
      stormAsteroids.splice(i, 1);
      continue;
    }
    if (a.userData.life <= 0) { scene.remove(a); stormAsteroids.splice(i, 1); }
  }
}

// ---------- MINI-EVENTS: SOS DISTRESS + SALVAGE ----------

// SOS: disabled ship broadcasting distress. Save before timer expires for big reward.
let sos = null;
let sosNextT = 70 + Math.random() * 60;

function makeSOSMesh() {
  const grp = new THREE.Group();
  // Small disabled hull (gray, no lights)
  const hull = new THREE.Mesh(
    new THREE.ConeGeometry(2.2, 6, 8),
    new THREE.MeshStandardMaterial({ color: 0x556070, roughness: 0.9, metalness: 0.4, emissive: 0x111820 })
  );
  hull.rotation.x = Math.PI / 2;
  grp.add(hull);
  // Red flashing distress beacon
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0xff3344 })
  );
  beacon.position.set(0, 1.6, 0);
  grp.add(beacon);
  const beaconGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xff5566, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  beaconGlow.scale.set(8, 8, 1);
  beaconGlow.position.copy(beacon.position);
  grp.add(beaconGlow);
  // Faint smoke trail
  const smoke = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0x444444, transparent: true, opacity: 0.4,
    blending: THREE.NormalBlending, depthWrite: false,
  }));
  smoke.scale.set(14, 14, 1);
  smoke.position.set(0, 0, -3);
  grp.add(smoke);
  // Wide pulsing ring marker (visible from distance)
  const ringMarker = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xff6677, transparent: true, opacity: 0.4,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  ringMarker.scale.set(60, 60, 1);
  grp.add(ringMarker);
  grp.userData = { beacon, beaconGlow, ringMarker };
  return grp;
}

function spawnSOS() {
  if (sos) return;
  // Spawn at random angle around sun, between Mars and Saturn orbits (player accessible)
  const angle = Math.random() * Math.PI * 2;
  const r = 3500 + Math.random() * 4000;
  const pos = new THREE.Vector3(Math.cos(angle) * r, (Math.random() - 0.5) * 200, Math.sin(angle) * r);
  const mesh = makeSOSMesh();
  mesh.position.copy(pos);
  scene.add(mesh);
  sos = {
    mesh, pos, expireT: 75, // 75s to rescue
    rescued: false, light: 0,
  };
  aidaSay('📡 DISTRESS SIGNAL: Pilot kemada nosozlik. Yordam zarur — 75s ichida yetib boring!', 9000);
  if (typeof SFX !== 'undefined') SFX.warn();
}

function updateSOS(dt) {
  // Spawn schedule
  if (!sos) {
    sosNextT -= dt;
    if (sosNextT <= 0 && state.alive && !state.launching) {
      spawnSOS();
      sosNextT = 110 + Math.random() * 80;
    }
    return;
  }
  // Beacon flash (0.5s on/off)
  sos.light = (sos.light + dt) % 1.0;
  const flash = sos.light < 0.5 ? 1.0 : 0.25;
  sos.mesh.userData.beacon.material.color.setScalar(flash);
  sos.mesh.userData.beacon.material.color.r = 1.0;
  sos.mesh.userData.beaconGlow.material.opacity = flash * 0.9;
  // Pulsing ring
  const pulse = (Math.sin(performance.now() * 0.003) + 1) * 0.5; // 0..1
  sos.mesh.userData.ringMarker.scale.setScalar(50 + pulse * 30);
  sos.mesh.userData.ringMarker.material.opacity = 0.25 + pulse * 0.35;

  sos.expireT -= dt;
  // Rescue check
  if (state.pos.distanceTo(sos.pos) < 28) {
    sos.rescued = true;
    state.karma += 10;
    state.fuel = Math.min(state.maxFuel, state.fuel + 30);
    state.batt = Math.min(state.maxBatt, state.batt + 30);
    state.o2 = Math.min(state.maxO2, state.o2 + 20);
    if (typeof SFX !== 'undefined') SFX.pickup();
    aidaSay('✓ Pilot qutqarildi! Karma +10, +30% fuel, +30% batt, +20% O₂', 8000);
    if (typeof unlockAchievement === 'function') unlockAchievement('rescuer');
    if (typeof profileOnSosRescued === 'function') profileOnSosRescued();
    despawnSOS();
    return;
  }
  if (sos.expireT <= 0) {
    aidaSay('✗ Distress signal o\'chdi. Pilot halok bo\'ldi...', 6000);
    despawnSOS();
  }
}

function despawnSOS() {
  if (!sos) return;
  scene.remove(sos.mesh);
  sos = null;
}

// SALVAGE: drifting containers with random resource bonus
const salvages = [];
let salvageNextT = 25 + Math.random() * 25;
const SALVAGE_MAX = 4;

function makeSalvageMesh() {
  const grp = new THREE.Group();
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 3.0, 3.0),
    new THREE.MeshStandardMaterial({ color: 0x2a4a30, roughness: 0.6, metalness: 0.7, emissive: 0x224422, emissiveIntensity: 0.6 })
  );
  grp.add(box);
  // Striped detail (cube edges)
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(3.05, 3.05, 3.05)),
    new THREE.LineBasicMaterial({ color: 0x66ff99, transparent: true, opacity: 0.85 })
  );
  grp.add(wire);
  // Green halo for visibility
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0x66ff99, transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  halo.scale.set(18, 18, 1);
  grp.add(halo);
  return grp;
}

function spawnSalvage() {
  if (salvages.length >= SALVAGE_MAX) return;
  // Random within asteroid belt or near a random planet (not sun)
  const accessiblePlanets = PLANETS.filter(p => !p.isStar && p.module);
  const useNearPlanet = Math.random() < 0.5;
  let pos;
  if (useNearPlanet) {
    const pl = accessiblePlanets[Math.floor(Math.random() * accessiblePlanets.length)];
    const planetPos = planetMeshes[pl.key].position;
    const dir = new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5)*0.3, (Math.random()-0.5)).normalize();
    pos = planetPos.clone().addScaledVector(dir, pl.r + 200 + Math.random() * 600);
  } else {
    // Asteroid belt area (between Mars and Jupiter)
    const angle = Math.random() * Math.PI * 2;
    const r = 4400 + Math.random() * 700;
    pos = new THREE.Vector3(Math.cos(angle) * r, (Math.random() - 0.5) * 80, Math.sin(angle) * r);
  }
  const mesh = makeSalvageMesh();
  mesh.position.copy(pos);
  // Slow drift
  const vel = new THREE.Vector3((Math.random()-0.5)*1.4, (Math.random()-0.5)*0.6, (Math.random()-0.5)*1.4);
  scene.add(mesh);
  salvages.push({
    mesh, vel, life: 180, // 3 minutes lifespan
    spin: (Math.random() - 0.5) * 1.2,
  });
}

function updateSalvages(dt) {
  // Spawn schedule
  salvageNextT -= dt;
  if (salvageNextT <= 0 && state.alive && !state.launching) {
    spawnSalvage();
    salvageNextT = 28 + Math.random() * 35;
  }
  for (let i = salvages.length - 1; i >= 0; i--) {
    const s = salvages[i];
    s.mesh.position.addScaledVector(s.vel, dt);
    s.mesh.rotation.y += s.spin * dt;
    s.mesh.rotation.x += s.spin * 0.7 * dt;
    s.life -= dt;
    // Pickup
    if (state.pos.distanceTo(s.mesh.position) < 12) {
      // Random reward
      const roll = Math.random();
      if (roll < 0.30) {
        state.fuel = Math.min(state.maxFuel, state.fuel + 25);
        aidaSay('✦ Salvage: +25% YOQILG\'I');
      } else if (roll < 0.55) {
        state.batt = Math.min(state.maxBatt, state.batt + 25);
        aidaSay('✦ Salvage: +25% BATAREYA');
      } else if (roll < 0.75) {
        state.o2 = Math.min(state.maxO2, state.o2 + 20);
        aidaSay('✦ Salvage: +20% KISLOROD');
      } else if (roll < 0.92) {
        state.ammo[1] = Math.min(20, state.ammo[1] + 4);
        aidaSay('✦ Salvage: +4 MISSILE o\'qi');
      } else {
        state.ammo[2] = Math.min(15, state.ammo[2] + 3);
        aidaSay('✦ Salvage: +3 MINE');
      }
      profile.totalSalvage = (profile.totalSalvage || 0) + 1;
      if (profile.totalSalvage >= 10 && typeof unlockAchievement === 'function') {
        unlockAchievement('scavenger');
      }
      if (typeof profileOnSalvage === 'function') profileOnSalvage();
      saveProfile();
      if (typeof SFX !== 'undefined') SFX.pickup();
      scene.remove(s.mesh);
      salvages.splice(i, 1);
      continue;
    }
    if (s.life <= 0) {
      scene.remove(s.mesh);
      salvages.splice(i, 1);
    }
  }
}

// ---------- REAL PROBES ----------
const PROBES = [
  { name: 'ISS',           parent: 'earth',   offset: [62, 8, 24],     orbit: true,  lore: 'Xalqaro Kosmik Stansiya — 1998-yildan beri 400 km balandlikda, 7 km/s tezlikda.' },
  { name: 'HUBBLE',        parent: 'earth',   offset: [-55, 22, -32],  orbit: true,  lore: 'Hubble Kosmik Teleskopi (1990) — koinotning chuqurliklarini ochib bergan ko\'z.' },
  { name: 'JAMES WEBB',    parent: 'earth',   offset: [220, 0, 0],     orbit: false, lore: 'James Webb Teleskopi (2021) — infraqizil, L2 nuqtasi, 1.5 mln km uzoqda.' },
  { name: 'PARKER PROBE',  pos: [420, 30, 90],                          orbit: false, lore: 'Parker Solar Probe (2018) — Quyoshga eng yaqin uchgan apparat, 700 ming km tezlik.' },
  { name: 'JUNO',          parent: 'jupiter', offset: [220, 40, 110],  orbit: true,  lore: 'Juno (2011) — Yupiter atrofida polyar orbita, magnit maydonni o\'rganadi.' },
  { name: 'CASSINI',       parent: 'saturn',  offset: [-185, -8, 95],  orbit: true,  lore: 'Cassini-Huygens (1997-2017) — Saturn halqalarining sirlarini ochdi.' },
  { name: 'VOYAGER 2',     pos: [PLANETS[5].x + 1100, -150, -400],     orbit: false, lore: 'Voyager 2 (1977) — 4 sayyorada uchgan yagona kema. Hozir yulduzlararo kosmosda.' },
  { name: 'VOYAGER 1',     pos: [PLANETS[6].x + 1800, 240, 700],       orbit: false, lore: 'Voyager 1 (1977) — inson zoti yuborgan eng uzoq jism. "Pale Blue Dot" suratini olgan.' },
  { name: 'NEW HORIZONS',  pos: [PLANETS[6].x + 2400, 200, 800],       orbit: false, lore: 'New Horizons (2006) — Pluton va Kuyper kamarini o\'rgandi.' },
  { name: 'PIONEER 10',    pos: [PLANETS[6].x + 3500, -800, -1500],    orbit: false, lore: 'Pioneer 10 (1972) — Yupiterni o\'rgangan birinchi apparat. 11 mlrd km uzoqda.' },
];
function makeProbeMesh(small) {
  const s = small ? 0.7 : 1.0;
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2 * s, 1.2 * s, 1.5 * s),
    new THREE.MeshStandardMaterial({ color: 0xddddee, metalness: 0.7, roughness: 0.3 })
  );
  g.add(body);
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x223388, metalness: 0.5, roughness: 0.4,
    emissive: 0x1144aa, emissiveIntensity: 0.35,
  });
  for (const sx of [-3.4 * s, 3.4 * s]) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(4 * s, 0.06 * s, 1.4 * s), panelMat);
    panel.position.x = sx;
    g.add(panel);
    // Solar panel grid lines
    const grid = new THREE.Mesh(
      new THREE.BoxGeometry(4 * s, 0.07 * s, 0.04 * s),
      new THREE.MeshBasicMaterial({ color: 0x8899ff })
    );
    grid.position.set(sx, 0, 0);
    g.add(grid);
  }
  // Dish antenna
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.85 * s, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0xeeeeee, side: THREE.DoubleSide, metalness: 0.4, roughness: 0.4 })
  );
  dish.position.y = 1.2 * s;
  dish.rotation.x = Math.PI;
  g.add(dish);
  // Antenna mast
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04 * s, 0.04 * s, 2 * s),
    new THREE.MeshStandardMaterial({ color: 0x999999 })
  );
  mast.position.y = -1.2 * s;
  g.add(mast);
  // Blinking beacon
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.22 * s, 10, 6),
    new THREE.MeshBasicMaterial({ color: 0xff4444 })
  );
  beacon.position.y = 0.85 * s;
  g.add(beacon);
  g.userData.beacon = beacon;
  return g;
}
const probeObjects = [];
for (const pr of PROBES) {
  const small = pr.parent === 'earth';
  const mesh = makeProbeMesh(small);
  if (pr.parent) {
    const planetPos = planetMeshes[pr.parent].position;
    mesh.position.set(planetPos.x + pr.offset[0], planetPos.y + pr.offset[1], planetPos.z + pr.offset[2]);
  } else {
    // Rotate absolute-positioned probes around Y by Neptune's orbital angle
    // (originally placed on +X axis assuming planets were linear).
    const neptune = PLANETS.find(pp => pp.key === 'neptune');
    const isOuter = pr.pos[0] > 1500; // Voyager / Pioneer / New Horizons
    const a = isOuter ? neptune.orbitAngle : 0;
    const rx = pr.pos[0] * Math.cos(a) - pr.pos[2] * Math.sin(a);
    const rz = pr.pos[0] * Math.sin(a) + pr.pos[2] * Math.cos(a);
    mesh.position.set(rx, pr.pos[1], rz);
  }
  scene.add(mesh);
  probeObjects.push({
    spec: pr, mesh, visited: false,
    orbitT: Math.random() * Math.PI * 2,
    blinkT: Math.random() * 2,
  });
}
function updateProbes(dt) {
  for (const o of probeObjects) {
    o.blinkT += dt * 4;
    const blink = (Math.sin(o.blinkT) * 0.5 + 0.5);
    o.mesh.userData.beacon.material.color.setRGB(blink, blink * 0.2, blink * 0.2);
    o.mesh.rotation.y += dt * 0.3;
    if (o.spec.parent && o.spec.orbit) {
      const planetPos = planetMeshes[o.spec.parent].position;
      const baseR = Math.hypot(o.spec.offset[0], o.spec.offset[2]);
      o.orbitT += dt * 0.18;
      o.mesh.position.set(
        planetPos.x + Math.cos(o.orbitT) * baseR,
        planetPos.y + o.spec.offset[1],
        planetPos.z + Math.sin(o.orbitT) * baseR
      );
    }
    if (!o.visited && state.pos.distanceTo(o.mesh.position) < 35) {
      o.visited = true;
      profileOnProbe();
      state.fuel = Math.min(state.maxFuel, state.fuel + 8);
      state.batt = Math.min(state.maxBatt, state.batt + 12);
      state.o2 = Math.min(state.maxO2, state.o2 + 6);
      aidaSay(`✦ ${o.spec.name}: ${o.spec.lore}`, 9000);
    }
  }
}

// =============================================================
// PHASE 2: Asteroidlar, Qaroqchilar, Lazerlar, Voyager, Flare, Docking, G'alaba
// =============================================================

// ---------- ASTEROIDS (Mars↔Yupiter belti) ----------
const asteroids = [];
function buildAsteroidBelt() {
  const beltR = (PLANETS[2].x + PLANETS[3].x) / 2;
  const beltSpread = 1200;
  const N = 380;
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0xb09878, roughness: 0.92, metalness: 0.1, emissive: 0x553322, emissiveIntensity: 0.15 });
  for (let i = 0; i < N; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = beltR + (Math.random() - 0.5) * beltSpread;
    const y = (Math.random() - 0.5) * 220;
    const size = 4 + Math.random() * 18;
    const m = new THREE.Mesh(geo, mat);
    m.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
    m.scale.setScalar(size);
    m.userData = {
      angle, r, y, size,
      angVel: 0.02 / Math.sqrt(r / 1000) * (Math.random() < 0.5 ? 1 : -1),
      spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.5),
    };
    scene.add(m);
    asteroids.push(m);
  }
  // Additional near-Earth asteroid cloud (scattered around Earth)
  const earthPos = planetMeshes['earth'].position;
  for (let i = 0; i < 80; i++) {
    const ang = Math.random() * Math.PI * 2;
    const dist = 250 + Math.random() * 1300;
    const x = earthPos.x + Math.cos(ang) * dist;
    const y = (Math.random() - 0.5) * 400;
    const z = earthPos.z + Math.sin(ang) * dist;
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    const s = 4 + Math.random() * 9;
    m.scale.setScalar(s);
    m.rotation.set(Math.random()*6, Math.random()*6, Math.random()*6);
    m.userData = { angV: new THREE.Vector3((Math.random()-0.5)*0.4, (Math.random()-0.5)*0.4, (Math.random()-0.5)*0.4), size: s, orbit: false };
    scene.add(m);
    asteroids.push(m);
  }
}
buildAsteroidBelt();

function updateAsteroids(dt) {
  for (const a of asteroids) {
    if (a.userData.angVel !== undefined) {
      // Belt asteroid: orbital motion
      a.userData.angle += a.userData.angVel * dt;
      a.position.x = Math.cos(a.userData.angle) * a.userData.r;
      a.position.z = Math.sin(a.userData.angle) * a.userData.r;
      a.rotation.x += a.userData.spin.x * dt;
      a.rotation.y += a.userData.spin.y * dt;
    } else if (a.userData.angV) {
      // Near-Earth scattered: just tumble in place
      a.rotation.x += a.userData.angV.x * dt;
      a.rotation.y += a.userData.angV.y * dt;
      a.rotation.z += a.userData.angV.z * dt;
    }
    // Player collision (faqat yaqin asteroidlar uchun)
    const dx = state.pos.x - a.position.x;
    if (Math.abs(dx) > 50) continue;
    const d = state.pos.distanceTo(a.position);
    if (d < a.userData.size + 2.5) {
      const n = tmpVec.copy(state.pos).sub(a.position).normalize();
      state.pos.copy(a.position).addScaledVector(n, a.userData.size + 3);
      const vn = state.vel.dot(n);
      if (vn < 0) state.vel.addScaledVector(n, -1.7 * vn);
      state.hull -= 4;
      if (state.hull <= 0) gameOver('Asteroidga urildingiz');
      else aidaSay('⚠  Asteroid! Korpus shikastlandi.');
    }
  }
}

// ---------- WEAPONS (multi-weapon registry) ----------
const WEAPONS = [
  { key: 'LASER',   color: '#7cffb1', batt: 3,  cool: 0.18, ammo: Infinity, hint: 'Tezkor, kam zarar' },
  { key: 'MISSILE', color: '#ffaa44', batt: 12, cool: 1.50, ammo: 12,       hint: 'Homing, kuchli portlash' },
  { key: 'MINE',    color: '#ff4488', batt: 8,  cool: 2.20, ammo: 8,        hint: 'Joyga qo\'yish, areal' },
];
state.weapon = 0;
state.weaponCool = 0;
state.ammo = WEAPONS.map(w => w.ammo);
function selectWeapon(idx) {
  if (idx < 0 || idx >= WEAPONS.length) return;
  if (state.weapon === idx) return;
  state.weapon = idx;
  aidaSay(`▸ Qurol: ${WEAPONS[idx].key} — ${WEAPONS[idx].hint}`);
}
function fire() {
  if (!state.alive) return;
  if (state.weaponCool > 0) return;
  const w = WEAPONS[state.weapon];
  if (state.batt < w.batt) {
    aidaSay(`⚠  Batareya yetmaydi (${w.key}: ${w.batt}%)`);
    return;
  }
  if (state.ammo[state.weapon] <= 0) {
    aidaSay(`⚠  ${w.key} o'qlari tugadi`);
    return;
  }
  state.batt -= w.batt;
  state.weaponCool = w.cool * state.weaponCoolMult;
  if (state.ammo[state.weapon] !== Infinity) state.ammo[state.weapon] -= 1;
  if (state.weapon === 0) { fireLaser(); SFX.laser(); }
  else if (state.weapon === 1) { fireMissile(); SFX.missile(); }
  else if (state.weapon === 2) { fireMine(); SFX.mine(); }
  if (typeof trackCombatPulse === 'function') trackCombatPulse();
}

// ---------- LASERS (glowing additive) ----------
const lasers = [];
const laserGeo = new THREE.CylinderGeometry(0.18, 0.18, 7, 8);
const laserCoreMat = new THREE.MeshBasicMaterial({
  color: 0xccffdd, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending, depthWrite: false
});
const laserGlowMat = new THREE.SpriteMaterial({
  map: glowTex, color: 0x66ff99, transparent: true, opacity: 0.85,
  blending: THREE.AdditiveBlending, depthWrite: false,
});
function fireLaser() {
  const fwdV = new THREE.Vector3(0, 0, 1).applyQuaternion(state.quat);
  const grp = new THREE.Group();
  const core = new THREE.Mesh(laserGeo, laserCoreMat);
  core.rotateX(Math.PI / 2);
  grp.add(core);
  const glow = new THREE.Sprite(laserGlowMat.clone());
  glow.scale.set(2.2, 9, 1);
  grp.add(glow);
  grp.position.copy(state.pos).addScaledVector(fwdV, 8);
  grp.quaternion.copy(state.quat);
  scene.add(grp);
  const speed = 360 + state.vel.length();
  lasers.push({ mesh: grp, vel: fwdV.clone().multiplyScalar(speed).add(state.vel), life: 2.0 });
}

function updateLasers(dt) {
  for (let i = lasers.length - 1; i >= 0; i--) {
    const l = lasers[i];
    l.mesh.position.addScaledVector(l.vel, dt);
    l.life -= dt;
    let dead = l.life <= 0;

    // Pirate hit
    if (!dead) {
      for (let j = pirates.length - 1; j >= 0; j--) {
        const p = pirates[j];
        if (l.mesh.position.distanceTo(p.mesh.position) < 6) {
          p.hull -= 28;
          dead = true;
          if (p.hull <= 0) {
            const kKey = p.kindKey;
            scene.remove(p.mesh);
            pirates.splice(j, 1);
            state.karma += 5;
            state.kills += 1;
            profileOnKill(kKey);
            aidaSay(`✓ Qaroqchi yo'q qilindi. Karma +5 (jami ${state.karma})`);
          } else {
            aidaSay('▸ Qaroqchini urdingiz');
          }
          break;
        }
      }
    }
    // Asteroid hit
    if (!dead) {
      for (const a of asteroids) {
        if (Math.abs(l.mesh.position.x - a.position.x) > 40) continue;
        if (l.mesh.position.distanceTo(a.position) < a.userData.size + 1) { dead = true; break; }
      }
    }
    // Enemy faction player hit (PvP)
    if (!dead && profile.faction) {
      for (const [pid, o] of otherPlayers) {
        if (!isEnemy(profile.faction, o.faction)) continue;
        if (l.mesh.position.distanceTo(o.mesh.position) < 6) {
          dead = true;
          sendPvpHit(pid, 28, 'LASER');
          spawnPvpHitSpark(l.mesh.position);
          break;
        }
      }
    }
    if (dead) {
      scene.remove(l.mesh);
      lasers.splice(i, 1);
    }
  }
}

// ---------- PvP NETWORK ----------
function sendPvpHit(targetId, dmg, weapon) {
  if (!ws || ws.readyState !== 1) return;
  ws.send(JSON.stringify({ type: 'pvp-hit', to: targetId, dmg, weapon }));
}
function sendPvpKill(victimId, weapon) {
  if (!ws || ws.readyState !== 1) return;
  ws.send(JSON.stringify({ type: 'pvp-kill', victim: victimId, weapon }));
}
function spawnPvpHitSpark(pos) {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xff5544, transparent: true, opacity: 1.0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  sp.position.copy(pos);
  sp.scale.set(6, 6, 1);
  scene.add(sp);
  explosions.push({ mesh: sp, life: 0.30, max: 0.30, scale: 6 });
}

// Killstreak tracking (per run)
let pvpStreak = 0;

function onPvpHit(m) {
  // Validate enemy faction (server already checks but defensive)
  if (!profile.faction || m.fromFaction === profile.faction) return;
  if (state.invulT > 0 || !state.alive) return;
  const dmg = Math.max(1, Math.min(120, +m.dmg || 0));
  state.hull -= dmg;
  // Visual feedback: flash + spark on own ship
  spawnPvpHitSpark(state.pos);
  if (typeof SFX !== 'undefined' && SFX.hit) SFX.hit();
  aidaSay(`⚠ ${m.fromName || 'Dushman'} (${m.fromFaction}) hujum qilmoqda!`, 3000);
  // Death by player — submit kill before gameOver runs
  if (state.hull <= 0 && state.alive) {
    sendPvpKill(m.from, m.weapon || 'LASER');
    profile.factionDeaths = (profile.factionDeaths || 0) + 1;
    pvpStreak = 0;
    saveProfile();
    // Try to start killcam (only if killer is in AoI)
    if (typeof startKillcam === 'function') {
      startKillcam(m.from, m.fromName, m.fromFaction, m.weapon || 'LASER', m.fromCode || null);
    }
    gameOver(`${m.fromName || 'Dushman'} (${m.fromFaction}) tomonidan o'ldirildingiz`);
  }
}

function onPvpKill(m) {
  const isMyKill   = m.killer === myId;
  const isMyDeath  = m.victim === myId;
  const killerF    = getFaction(m.killerFaction);
  const victimF    = getFaction(m.victimFaction);
  const killerCol  = killerF ? killerF.cssColor : '#cfeaff';
  // Global feed
  pushChat('PvP',
    `${m.killerName || 'Pilot'} ${killerF ? killerF.icon : '✦'} → ${m.victimName || 'Pilot'} ${victimF ? victimF.icon : '✦'}`,
    killerCol);
  // Update server-authoritative faction score
  if (m.score) updateFactionScore(m.score);
  if (isMyKill) {
    profile.factionKills = (profile.factionKills || 0) + 1;
    pvpStreak += 1;
    let reward = 50;
    let streakLabel = '';
    if (pvpStreak === 3)      { reward = 100; streakLabel = ' • TRIPLE'; }
    else if (pvpStreak === 5) { reward = 200; streakLabel = ' • RAMPAGE'; }
    else if (pvpStreak === 10){ reward = 500; streakLabel = ' • ACE PILOT'; }
    // Genesis Pulse 2x reward bonus (matches server)
    if (currentLiveEvent && currentLiveEvent.id === 'genesis-pulse') {
      reward *= 2;
      streakLabel += ' (GENESIS x2)';
    }
    addCredits(reward, `PvP KILL${streakLabel}`);
    addBattleXp(50, 'pvp_kill');
    saveProfile();
    aidaSay(`✦ ${m.victimName} eliminated. +${reward}⬢${streakLabel}`, 4000);
    if (typeof renderFactionSplash === 'function') renderFactionSplash();
  }
}

// ---------- LIVE EVENTS (server broadcast) ----------
let currentLiveEvent = null;
function handleServerEvent(m) {
  if (m.kind === 'event-start' && m.event) {
    showLiveEvent(m.event, false);
  } else if (m.kind === 'event-end' && m.event) {
    hideLiveEvent(m.event);
  } else if (m.kind === 'daily-rollover') {
    const winF = getFaction(m.winner);
    const msg = winF
      ? `${winF.icon} ${winF.name} kunlik g'olib! (${m.asc} vs ${m.nih})`
      : `Kunlik tugadi: durang (${m.asc} vs ${m.nih})`;
    pushChat('FACTION WAR', msg, winF ? winF.cssColor : '#aef0ff');
    // Bonus for winning faction members
    if (winF && profile.faction === winF.id) {
      addCredits(200, 'FACTION DAILY WIN');
    }
    updateFactionScore({ ASCENDANT: 0, NIHILIST: 0 });
  }
}
function showLiveEvent(event, silent) {
  currentLiveEvent = event;
  let banner = document.getElementById('live-event-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'live-event-banner';
    document.body.appendChild(banner);
  }
  const remaining = Math.max(0, Math.floor(((event.expiresAt || 0) - Date.now()) / 1000));
  banner.style.borderColor = event.color || '#ffd060';
  banner.style.color = event.color || '#ffd060';
  banner.innerHTML = `
    <div class="le-icon">⚡</div>
    <div class="le-body">
      <div class="le-name">LIVE EVENT: ${event.name}</div>
      <div class="le-creed">${event.creed}</div>
    </div>
    <div class="le-timer" data-expires="${event.expiresAt || 0}">${remaining}s</div>`;
  if (!silent) {
    pushChat('LIVE EVENT', `${event.name} — ${event.creed}`, event.color || '#ffd060');
    if (typeof SFX !== 'undefined' && SFX.alert) SFX.alert();
  }
}
function hideLiveEvent(event) {
  currentLiveEvent = null;
  const banner = document.getElementById('live-event-banner');
  if (banner) {
    banner.classList.add('fading');
    setTimeout(() => banner.remove(), 600);
  }
  pushChat('LIVE EVENT', `${event.name} tugadi.`, '#aef0ff');
}
// Tick down event timer
setInterval(() => {
  const banner = document.getElementById('live-event-banner');
  if (!banner || !currentLiveEvent) return;
  const remaining = Math.max(0, Math.floor((currentLiveEvent.expiresAt - Date.now()) / 1000));
  const t = banner.querySelector('.le-timer');
  if (t) t.textContent = remaining + 's';
}, 1000);

// ---------- FACTION SCORE (today's global) ----------
let liveFactionScore = { ASCENDANT: 0, NIHILIST: 0 };
function updateFactionScore(score) {
  liveFactionScore = { ...liveFactionScore, ...score };
  renderFactionScoreSplash();
}
function renderFactionScoreSplash() {
  if (!splash) return;
  let panel = document.getElementById('fscore-splash');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'fscore-splash';
    splash.appendChild(panel);
  }
  const total = (liveFactionScore.ASCENDANT || 0) + (liveFactionScore.NIHILIST || 0);
  const ascPct = total > 0 ? (liveFactionScore.ASCENDANT / total * 100) : 50;
  const nihPct = 100 - ascPct;
  const fa = FACTIONS.ASCENDANT, fn = FACTIONS.NIHILIST;
  panel.innerHTML = `
    <div class="fsc-title">⚔ BUGUNGI FRAKSIYA URUSHI</div>
    <div class="fsc-bar">
      <div class="fsc-asc" style="width:${ascPct}%; background:${fa.cssColor};"></div>
      <div class="fsc-nih" style="width:${nihPct}%; background:${fn.cssColor};"></div>
    </div>
    <div class="fsc-counts">
      <span style="color:${fa.cssColor}">${fa.icon} ${fa.name}: ${liveFactionScore.ASCENDANT || 0}</span>
      <span style="color:${fn.cssColor}">${fn.icon} ${fn.name}: ${liveFactionScore.NIHILIST || 0}</span>
    </div>
  `;
}

// ---------- MISSILES (homing, areal damage) ----------
const missiles = [];
const missileBodyGeo = new THREE.ConeGeometry(0.4, 2.0, 10);
const missileBodyMat = new THREE.MeshStandardMaterial({
  color: 0xddeeff, metalness: 0.6, roughness: 0.3, emissive: 0x444444, emissiveIntensity: 0.2
});
const missileTrailMat = new THREE.SpriteMaterial({
  map: glowTex, color: 0xffaa44, transparent: true, opacity: 0.95,
  blending: THREE.AdditiveBlending, depthWrite: false,
});
function fireMissile() {
  const fwdV = new THREE.Vector3(0, 0, 1).applyQuaternion(state.quat);
  const grp = new THREE.Group();
  const body = new THREE.Mesh(missileBodyGeo, missileBodyMat);
  body.rotateX(Math.PI / 2);
  grp.add(body);
  const trail = new THREE.Sprite(missileTrailMat.clone());
  trail.scale.set(3, 8, 1);
  trail.position.z = -2.5;
  grp.add(trail);
  grp.position.copy(state.pos).addScaledVector(fwdV, 10);
  grp.quaternion.copy(state.quat);
  scene.add(grp);
  // Initial velocity = ship velocity + forward boost
  const vel = fwdV.clone().multiplyScalar(60).add(state.vel);
  missiles.push({ mesh: grp, vel, life: 6.0, target: null, retargetT: 0 });
  aidaSay('▸ Missile uchirildi');
}
function updateMissiles(dt) {
  for (let i = missiles.length - 1; i >= 0; i--) {
    const m = missiles[i];
    m.life -= dt;
    m.retargetT -= dt;
    // Find/refresh target (nearest pirate OR enemy faction player within 800u)
    if (m.retargetT <= 0 || !m.target || (m.target.kind === 'pirate' && pirates.indexOf(m.target.ref) === -1)) {
      m.retargetT = 0.5;
      let best = null, bestD = 800 * 800;
      for (const p of pirates) {
        const dsq = m.mesh.position.distanceToSquared(p.mesh.position);
        if (dsq < bestD) { bestD = dsq; best = { kind: 'pirate', ref: p, pos: p.mesh.position }; }
      }
      if (profile.faction) {
        for (const [pid, o] of otherPlayers) {
          if (!isEnemy(profile.faction, o.faction)) continue;
          const dsq = m.mesh.position.distanceToSquared(o.mesh.position);
          if (dsq < bestD) { bestD = dsq; best = { kind: 'pvp', ref: o, id: pid, pos: o.mesh.position }; }
        }
      }
      m.target = best;
    }
    // Homing: steer velocity toward target
    if (m.target) {
      const desired = tmpVec.copy(m.target.pos).sub(m.mesh.position);
      const distT = desired.length();
      if (distT > 0.1) desired.divideScalar(distT);
      // Blend velocity direction
      const speed = Math.max(120, m.vel.length() + 80 * dt);
      m.vel.lerp(desired.multiplyScalar(speed), Math.min(1, dt * 2.5));
      m.vel.setLength(speed);
      // Orient mesh
      const lookM = new THREE.Matrix4().lookAt(m.mesh.position, tmpVec.copy(m.mesh.position).add(m.vel), new THREE.Vector3(0,1,0));
      m.mesh.quaternion.setFromRotationMatrix(lookM);
    }
    m.mesh.position.addScaledVector(m.vel, dt);
    let dead = m.life <= 0;
    let detonate = false;
    let pvpTargetId = null;
    // Proximity to pirate
    if (!dead) {
      for (const p of pirates) {
        if (m.mesh.position.distanceTo(p.mesh.position) < 14) { detonate = true; break; }
      }
    }
    // Proximity to enemy faction player (PvP)
    if (!dead && !detonate && profile.faction) {
      for (const [pid, o] of otherPlayers) {
        if (!isEnemy(profile.faction, o.faction)) continue;
        if (m.mesh.position.distanceTo(o.mesh.position) < 14) {
          detonate = true; pvpTargetId = pid; break;
        }
      }
    }
    if (detonate || (dead && m.life <= 0 && m.target && m.mesh.position.distanceTo(m.target.pos) < 60)) {
      explode(m.mesh.position, 70, 60);
      // PvP areal damage to enemies in blast
      if (profile.faction) {
        for (const [pid, o] of otherPlayers) {
          if (!isEnemy(profile.faction, o.faction)) continue;
          const d = m.mesh.position.distanceTo(o.mesh.position);
          if (d < 70) {
            const dmg = Math.round(60 * (1 - d / 70));
            if (dmg > 0) sendPvpHit(pid, dmg, 'MISSILE');
          }
        }
      }
      dead = true;
    }
    if (dead) {
      scene.remove(m.mesh);
      missiles.splice(i, 1);
    }
  }
}

// ---------- MINES (proximity, drop in place) ----------
const mines = [];
const mineGeo = new THREE.OctahedronGeometry(2.2, 0);
function fireMine() {
  const mat = new THREE.MeshStandardMaterial({
    color: 0x442233, metalness: 0.8, roughness: 0.4,
    emissive: 0xff2266, emissiveIntensity: 0.3,
  });
  const mesh = new THREE.Mesh(mineGeo, mat);
  mesh.position.copy(state.pos);
  // Drift with ship's current velocity (so it doesn't collide with player immediately)
  const vel = state.vel.clone().multiplyScalar(0.3);
  // Beacon
  const beacon = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xff2266, transparent: true, opacity: 0.7,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  beacon.scale.set(8, 8, 1);
  mesh.add(beacon);
  scene.add(mesh);
  mines.push({ mesh, mat, beacon, vel, armT: 1.5, life: 35 });
  aidaSay('▸ Mina qo\'yildi (1.5s ichida faollashadi)');
}
function updateMines(dt) {
  for (let i = mines.length - 1; i >= 0; i--) {
    const mn = mines[i];
    mn.armT -= dt;
    mn.life -= dt;
    mn.mesh.position.addScaledVector(mn.vel, dt);
    // Slow down to drift
    mn.vel.multiplyScalar(Math.pow(0.6, dt));
    mn.mesh.rotation.y += dt * 0.8;
    // Visual pulse when armed
    if (mn.armT <= 0) {
      const pulse = Math.sin(performance.now() * 0.012) * 0.5 + 0.5;
      mn.mat.emissiveIntensity = 0.4 + pulse * 0.8;
      mn.beacon.material.opacity = 0.5 + pulse * 0.5;
    }
    let dead = mn.life <= 0;
    let detonate = false;
    if (mn.armT <= 0) {
      // Check proximity to pirates
      for (const p of pirates) {
        if (mn.mesh.position.distanceTo(p.mesh.position) < 55) { detonate = true; break; }
      }
    }
    if (detonate) {
      explode(mn.mesh.position, 90, 75);
      dead = true;
    }
    if (dead) {
      scene.remove(mn.mesh);
      mines.splice(i, 1);
    }
  }
}

// ---------- EXPLOSION FX + areal damage ----------
const explosions = [];
function explode(pos, damage, radius) {
  // Visual flash
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xffcc66, transparent: true, opacity: 1.0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  flash.position.copy(pos);
  flash.scale.set(radius * 1.4, radius * 1.4, 1);
  scene.add(flash);
  explosions.push({ mesh: flash, life: 0.8, max: 0.8, scale: radius * 1.4 });
  // Audio (only if near player to avoid distant spam)
  if (state.pos.distanceTo(pos) < 800) SFX.explosion();
  // Areal damage to pirates
  for (let j = pirates.length - 1; j >= 0; j--) {
    const p = pirates[j];
    const d = pos.distanceTo(p.mesh.position);
    if (d < radius) {
      const falloff = 1 - d / radius;
      p.hull -= damage * falloff;
      if (p.hull <= 0) {
        const kKey = p.kindKey;
        scene.remove(p.mesh);
        pirates.splice(j, 1);
        state.karma += 5;
        state.kills += 1;
        profileOnKill(kKey);
      }
    }
  }
  // Damage to player if too close
  const ds = pos.distanceTo(state.pos);
  if (ds < radius * 0.7) {
    const fall = 1 - ds / (radius * 0.7);
    state.hull -= damage * 0.3 * fall;
    if (state.hull <= 0) gameOver('O\'zingizning portlashingizdan halok bo\'ldingiz');
  }
}
function updateExplosions(dt) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const e = explosions[i];
    e.life -= dt;
    const t = 1 - e.life / e.max;
    e.mesh.material.opacity = Math.max(0, 1 - t);
    e.mesh.scale.set(e.scale * (0.6 + t * 0.6), e.scale * (0.6 + t * 0.6), 1);
    if (e.life <= 0) {
      scene.remove(e.mesh);
      explosions.splice(i, 1);
    }
  }
}

// ---------- PIRATES (AI dushman) — 3 kinds: Scout / Interceptor / Tank ----------
const pirates = [];
let pirateSpawnT = 12;

const PIRATE_KINDS = {
  scout: {
    name: 'Scout', hull: 60, maxSpeed: 38, accel: 22,
    fireMin: 1.8, fireMax: 3.2, fireRange: 320,
    projColor: 0xff5522, projSpeed: 140, projDmg: 4, projScale: [2.4, 6.0],
    scale: 1.0, beaconColor: 0xff2233, beaconSize: 28,
  },
  interceptor: {
    name: 'Interceptor', hull: 30, maxSpeed: 62, accel: 38,
    fireMin: 0.9, fireMax: 1.5, fireRange: 280,
    projColor: 0xff3344, projSpeed: 200, projDmg: 2, projScale: [1.6, 5.0],
    scale: 0.72, beaconColor: 0xff4466, beaconSize: 22, strafe: true,
  },
  tank: {
    name: 'Tank', hull: 140, maxSpeed: 22, accel: 12,
    fireMin: 3.2, fireMax: 4.6, fireRange: 380,
    projColor: 0xffcc44, projSpeed: 100, projDmg: 9, projScale: [3.4, 8.0],
    scale: 1.55, beaconColor: 0xffaa44, beaconSize: 38,
  },
};

function pickPirateKind() {
  // Probability adjusted by HVT and module count
  const r = Math.random();
  const lateGame = state.modules.size >= 4;
  if (state.hvt) {
    if (r < 0.40) return 'scout';
    if (r < 0.75) return 'interceptor';
    return 'tank';
  }
  if (lateGame) {
    if (r < 0.55) return 'scout';
    if (r < 0.85) return 'interceptor';
    return 'tank';
  }
  // Early game
  if (r < 0.72) return 'scout';
  if (r < 0.95) return 'interceptor';
  return 'tank';
}

function tintMeshEmissive(mesh, color) {
  mesh.traverse((c) => {
    if (c.material && c.material.emissive) {
      c.material = c.material.clone();
      c.material.emissive = new THREE.Color(color);
    }
  });
}

function spawnPirate(near) {
  const kindKey = pickPirateKind();
  const kind = PIRATE_KINDS[kindKey];
  const offset = new THREE.Vector3(
    (Math.random() - 0.5) * 500,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 600
  );
  if (offset.length() < 200) offset.normalize().multiplyScalar(220);
  const mesh = makePirateShip();
  mesh.scale.setScalar(kind.scale);
  // Tint emissive of trim/visor materials per kind
  if (kindKey === 'tank') tintMeshEmissive(mesh, 0xffaa44);
  else if (kindKey === 'interceptor') tintMeshEmissive(mesh, 0xff4466);
  // Tank: add visible armor plates on belly
  if (kindKey === 'tank') {
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x2a1410, metalness: 0.85, roughness: 0.5,
      emissive: 0xffaa44, emissiveIntensity: 0.25,
    });
    for (const dz of [-1.2, 0.4, 2.0]) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 1.0), plateMat);
      plate.position.set(0, -1.0, dz);
      mesh.add(plate);
    }
    // Twin barrel cannons
    for (const dx of [-1.3, 1.3]) {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 3.6, 6),
        new THREE.MeshStandardMaterial({ color: 0x1a0a0a, metalness: 0.9, roughness: 0.3 }));
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(dx, -0.3, 2.4);
      mesh.add(barrel);
    }
  }
  mesh.position.copy(near).add(offset);
  // Bright beacon so player can SEE the pirate type from afar
  const beacon = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: kind.beaconColor, transparent: true, opacity: 0.9,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  beacon.scale.set(kind.beaconSize, kind.beaconSize, 1);
  mesh.add(beacon);
  scene.add(mesh);
  pirates.push({
    mesh, vel: new THREE.Vector3(),
    hull: kind.hull, kindKey, kind,
    fireT: kind.fireMin + Math.random() * (kind.fireMax - kind.fireMin),
    beacon, strafePhase: Math.random() * Math.PI * 2,
  });
  const labels = { scout: 'qaroqchi Scout', interceptor: 'tezkor Interceptor', tank: 'og\'ir Tank' };
  aidaSay(`⚠  ${labels[kindKey]} aniqlandi!`);
}

function updatePirates(dt) {
  pirateSpawnT -= dt;
  const maxPirates = state.hvt ? 6 : 3;
  if (pirateSpawnT <= 0 && pirates.length < maxPirates) {
    spawnPirate(state.pos);
    pirateSpawnT = state.hvt ? 8 : 20;
  }

  const lookM = new THREE.Matrix4();
  for (let i = pirates.length - 1; i >= 0; i--) {
    const p = pirates[i];
    const k = p.kind;
    const toPlayer = tmpVec.copy(state.pos).sub(p.mesh.position);
    const d = toPlayer.length();
    if (d > 1) toPlayer.divideScalar(d);

    p.vel.addScaledVector(toPlayer, k.accel * dt);
    // Interceptor strafing: tangent oscillation
    if (k.strafe) {
      p.strafePhase += dt * 1.8;
      // Build tangent perpendicular to toPlayer
      const up = new THREE.Vector3(0, 1, 0);
      const tang = new THREE.Vector3().crossVectors(toPlayer, up).normalize();
      p.vel.addScaledVector(tang, Math.sin(p.strafePhase) * 25 * dt);
    }
    p.vel.multiplyScalar(Math.pow(0.7, dt));
    const sp = p.vel.length();
    if (sp > k.maxSpeed) p.vel.multiplyScalar(k.maxSpeed / sp);
    p.mesh.position.addScaledVector(p.vel, dt);

    lookM.lookAt(p.mesh.position, state.pos, new THREE.Vector3(0, 1, 0));
    p.mesh.quaternion.setFromRotationMatrix(lookM);

    if (d > 2000) {
      scene.remove(p.mesh);
      pirates.splice(i, 1);
      continue;
    }
    p.fireT -= dt;
    if (p.fireT <= 0 && d < k.fireRange) {
      p.fireT = k.fireMin + Math.random() * (k.fireMax - k.fireMin);
      pirateFire(p);
    }
  }
  updatePirateLasers(dt);
}

// ---------- PIRATE PROJECTILES (visible orange laser bolts) ----------
const pirateLasers = [];
const pirateLaserMat = new THREE.SpriteMaterial({
  map: glowTex, color: 0xff5522, transparent: true, opacity: 1.0,
  blending: THREE.AdditiveBlending, depthWrite: false,
});
function pirateFire(p) {
  const k = p.kind || PIRATE_KINDS.scout;
  // Distance-attenuated SFX so faraway pirates aren't loud
  const dPlayer = p.mesh.position.distanceTo(state.pos);
  if (dPlayer < 600) SFX.pirateFire();
  // Lead the player position
  const leadFactor = k.projSpeed > 0 ? Math.min(0.6, dPlayer / k.projSpeed) : 0.25;
  const targetPos = state.pos.clone().addScaledVector(state.vel, leadFactor);
  const muzzle = p.mesh.position.clone();
  const fwdP = new THREE.Vector3(0, 0, 1).applyQuaternion(p.mesh.quaternion);
  muzzle.add(fwdP.clone().multiplyScalar(4 * (k.scale || 1)));
  muzzle.y -= 0.8 * (k.scale || 1);
  const dir = targetPos.sub(muzzle).normalize();
  // Spread: smaller for tank (accurate), larger for interceptor (rapid bursts)
  const spread = k === PIRATE_KINDS.tank ? 0.025 : (k === PIRATE_KINDS.interceptor ? 0.07 : 0.05);
  dir.x += (Math.random() - 0.5) * spread;
  dir.y += (Math.random() - 0.5) * spread;
  dir.z += (Math.random() - 0.5) * spread;
  dir.normalize();
  const proj = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: k.projColor, transparent: true, opacity: 1.0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  proj.position.copy(muzzle);
  proj.scale.set(k.projScale[0], k.projScale[1], 1);
  scene.add(proj);
  pirateLasers.push({
    mesh: proj, vel: dir.multiplyScalar(k.projSpeed),
    life: 3.5, dmg: k.projDmg, kindKey: p.kindKey,
  });
  // Muzzle flash (tinted by kind)
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: k.projColor, transparent: true, opacity: 1.0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  flash.position.copy(muzzle);
  const flashSize = 8 * (k.scale || 1);
  flash.scale.set(flashSize, flashSize, 1);
  scene.add(flash);
  explosions.push({ mesh: flash, life: 0.18, max: 0.18, scale: flashSize });
}

function updatePirateLasers(dt) {
  for (let i = pirateLasers.length - 1; i >= 0; i--) {
    const l = pirateLasers[i];
    l.mesh.position.addScaledVector(l.vel, dt);
    l.life -= dt;
    let dead = l.life <= 0;
    // Player hit
    if (!dead && l.mesh.position.distanceTo(state.pos) < 7) {
      if (state.invulT <= 0) {
        state.hull -= l.dmg;
        // Spark impact at hit position
        const spark = new THREE.Sprite(new THREE.SpriteMaterial({
          map: glowTex, color: 0xffcc66, transparent: true, opacity: 1.0,
          blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        spark.position.copy(l.mesh.position);
        spark.scale.set(14, 14, 1);
        scene.add(spark);
        explosions.push({ mesh: spark, life: 0.35, max: 0.35, scale: 14 });
        if (state.hull <= 0) gameOver('Qaroqchilar sizni yo\'q qildi');
        else aidaSay('⚠  Korpusga zarba!');
      }
      dead = true;
    }
    if (dead) {
      scene.remove(l.mesh);
      pirateLasers.splice(i, 1);
    }
  }
}


// ---------- ALIEN BOSS (endgame) ----------
let boss = null;
let bossSpawnArmed = false;
let bossDefeated = false;

function makeBossMesh() {
  const grp = new THREE.Group();

  // Outer shell: dark obsidian dodecahedron
  const shellMat = new THREE.MeshStandardMaterial({
    color: 0x05080f, metalness: 0.98, roughness: 0.15,
    emissive: 0x220033, emissiveIntensity: 0.4,
  });
  const shell = new THREE.Mesh(new THREE.DodecahedronGeometry(18, 0), shellMat);
  grp.add(shell);
  grp.userData.shell = shell;

  // Pulsating central eye (sphere with intense magenta emissive)
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x440044, metalness: 0.5, roughness: 0.05,
    emissive: 0xff22cc, emissiveIntensity: 2.4,
  });
  const eye = new THREE.Mesh(new THREE.SphereGeometry(7, 32, 24), eyeMat);
  grp.add(eye);
  grp.userData.core = eye;
  grp.userData.coreMat = eyeMat;

  // Inner pupil (smaller, near-white core for "stare" feel)
  const pupil = new THREE.Mesh(
    new THREE.SphereGeometry(2.6, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xffccff })
  );
  grp.add(pupil);
  grp.userData.pupil = pupil;

  // 3 layered spinning rings (different axes)
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a14, metalness: 0.95, roughness: 0.22,
    emissive: 0x6622aa, emissiveIntensity: 0.6,
  });
  const plates = [];
  for (let i = 0; i < 3; i++) {
    const r = 22 + i * 5;
    const plate = new THREE.Mesh(new THREE.TorusGeometry(r, 0.9, 10, 80), plateMat);
    plate.rotation.x = Math.PI / 3 * i;
    plate.rotation.y = Math.PI / 4 * i;
    grp.add(plate);
    plates.push(plate);
    // Glowing nodes on each ring
    for (let j = 0; j < 6; j++) {
      const nodeAng = (j / 6) * Math.PI * 2;
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xff44ff })
      );
      node.position.set(Math.cos(nodeAng) * r, 0, Math.sin(nodeAng) * r);
      plate.add(node);
    }
  }
  grp.userData.plates = plates;

  // 6 tendril spikes radiating outward (jagged)
  const spikeMat = new THREE.MeshStandardMaterial({
    color: 0x110018, metalness: 0.9, roughness: 0.3,
    emissive: 0xaa0066, emissiveIntensity: 0.7,
  });
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(1.4, 14, 4), spikeMat);
    spike.position.set(Math.cos(ang) * 16, Math.sin(i * 0.7) * 4, Math.sin(ang) * 16);
    spike.lookAt(Math.cos(ang) * 60, Math.sin(i * 0.7) * 14, Math.sin(ang) * 60);
    spike.rotateX(Math.PI / 2);
    grp.add(spike);
  }

  // Twin heavy gun pods
  const gunMat = new THREE.MeshStandardMaterial({
    color: 0x180008, metalness: 0.95, roughness: 0.25,
    emissive: 0xff2266, emissiveIntensity: 0.9,
  });
  for (const sx of [-16, 16]) {
    const gun = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.6, 8, 12), gunMat);
    gun.position.set(sx, 0, 6);
    gun.rotation.x = Math.PI / 2;
    grp.add(gun);
    const gunGlow = new THREE.Mesh(
      new THREE.CircleGeometry(1.5, 16),
      new THREE.MeshBasicMaterial({ color: 0xff4488, transparent: true, opacity: 0.9 })
    );
    gunGlow.position.set(sx, 0, 10.1);
    gunGlow.rotation.y = Math.PI;
    grp.add(gunGlow);
  }

  // Massive beacon visible from far
  const beacon = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xff44ff, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  beacon.scale.set(180, 180, 1);
  grp.add(beacon);
  grp.userData.beacon = beacon;

  // Inner halo (tighter)
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0xff88ff, transparent: true, opacity: 0.6,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  halo.scale.set(70, 70, 1);
  grp.add(halo);
  grp.userData.halo = halo;

  // Self-illumination
  const light = new THREE.PointLight(0xff66ff, 3.5, 600, 1.4);
  grp.add(light);
  return grp;
}

function spawnBoss() {
  if (boss || bossDefeated) return;
  const neptunePos = planetMeshes['neptune'].position;
  // Place between player and Neptune at safe distance
  const dir = tmpVec.copy(state.pos).sub(neptunePos).normalize();
  const spawnPos = neptunePos.clone().addScaledVector(dir, 350);
  const mesh = makeBossMesh();
  mesh.position.copy(spawnPos);
  scene.add(mesh);
  boss = {
    mesh, hull: 700, hullMax: 700,
    fireT: 4, teleportT: 12, phase: 1,
    vel: new THREE.Vector3(),
    summonT: 0,
  };
  SFX.bossSpawn();
  aidaSay('☠ ANOMALIYA: noma\'lum kema Neptun yaqinida paydo bo\'ldi. KATTA TAHDID!', 9000);
  // Show boss HUD
  const bh = document.getElementById('bossHud');
  if (bh) bh.style.display = 'block';
}

function despawnBoss(killed) {
  if (!boss) return;
  const lastPos = boss.mesh.position.clone();
  scene.remove(boss.mesh);
  boss = null;
  const bh = document.getElementById('bossHud');
  if (bh) bh.style.display = 'none';
  if (killed) {
    bossDefeated = true;
    state.karma += 50;
    state.kills += 5;
    state.alienCore = true;
    profileOnBossKilled();
    explode(lastPos, 0, 220); // big visual flash, no damage
    aidaSay('★ BOSS YO\'Q QILINDI! Alien-Core olindi. Karma +50. Yerga qaytib mukofotni oling!', 12000);
  }
}

const bossLasers = [];
function bossFire() {
  if (!boss) return;
  SFX.bossFire();
  const targetPos = state.pos.clone().addScaledVector(state.vel, 0.4); // lead target
  const dir = targetPos.sub(boss.mesh.position).normalize();
  // Triple-shot spread
  const shots = boss.phase === 2 ? 5 : 3;
  for (let i = 0; i < shots; i++) {
    const spread = (i - (shots - 1) / 2) * 0.04;
    const v = dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), spread);
    const proj = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: 0xff3399, transparent: true, opacity: 1.0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    proj.scale.set(4, 4, 1);
    proj.position.copy(boss.mesh.position);
    scene.add(proj);
    bossLasers.push({ mesh: proj, vel: v.multiplyScalar(180), life: 4.5 });
  }
}

function updateBossLasers(dt) {
  for (let i = bossLasers.length - 1; i >= 0; i--) {
    const l = bossLasers[i];
    l.mesh.position.addScaledVector(l.vel, dt);
    l.life -= dt;
    let dead = l.life <= 0;
    if (!dead && l.mesh.position.distanceTo(state.pos) < 8) {
      if (state.invulT <= 0) {
        state.hull -= 12;
        // Big magenta spark on impact
        const spark = new THREE.Sprite(new THREE.SpriteMaterial({
          map: glowTex, color: 0xff66cc, transparent: true, opacity: 1.0,
          blending: THREE.AdditiveBlending, depthWrite: false,
        }));
        spark.position.copy(l.mesh.position);
        spark.scale.set(28, 28, 1);
        scene.add(spark);
        explosions.push({ mesh: spark, life: 0.45, max: 0.45, scale: 28 });
        aidaSay('⚠  Boss zarbasi! -12 korpus');
        if (state.hull <= 0) gameOver('Alien boss sizni yo\'q qildi');
      }
      dead = true;
    }
    if (dead) {
      scene.remove(l.mesh);
      bossLasers.splice(i, 1);
    }
  }
}

function updateBoss(dt) {
  // Spawn condition: player has 3+ modules AND is within 5000u of Neptune
  if (!boss && !bossDefeated && state.modules.size >= 3) {
    const dN = state.pos.distanceTo(planetMeshes['neptune'].position);
    if (dN < 5000 && !bossSpawnArmed) {
      bossSpawnArmed = true;
      spawnBoss();
    }
  }
  updateBossLasers(dt);
  if (!boss) return;

  // Spin animation
  boss.mesh.userData.core.rotation.y += dt * 1.2;
  boss.mesh.userData.core.rotation.x += dt * 0.4;
  for (let i = 0; i < boss.mesh.userData.plates.length; i++) {
    const pl = boss.mesh.userData.plates[i];
    pl.rotation.y += dt * (0.5 + i * 0.3) * (i % 2 ? 1 : -1);
    pl.rotation.z += dt * 0.2 * (i % 2 ? -1 : 1);
  }
  // Beacon pulse
  const pulse = Math.sin(performance.now() * 0.005) * 0.5 + 0.5;
  boss.mesh.userData.beacon.material.opacity = 0.6 + pulse * 0.4;

  // Phase transition at 50% HP
  if (boss.phase === 1 && boss.hull < boss.hullMax * 0.5) {
    boss.phase = 2;
    boss.mesh.userData.coreMat.emissive.setHex(0xff2244);
    aidaSay('⚠  Boss ENRAGED! Tezroq o\'q otmoqda, teleport qilmoqda!', 7000);
  }

  // Movement: orbit player at preferred distance
  const toPlayer = tmpVec.copy(state.pos).sub(boss.mesh.position);
  const d = toPlayer.length();
  const preferDist = boss.phase === 2 ? 140 : 220;
  // Approach if too far, retreat if too close
  if (d > preferDist + 40) {
    boss.vel.addScaledVector(toPlayer.normalize(), 30 * dt);
  } else if (d < preferDist - 40) {
    boss.vel.addScaledVector(toPlayer.normalize(), -25 * dt);
  } else {
    // Strafe perpendicular
    const perp = new THREE.Vector3(-toPlayer.z, 0, toPlayer.x).normalize();
    boss.vel.addScaledVector(perp, 18 * dt);
  }
  boss.vel.multiplyScalar(Math.pow(0.6, dt));
  const maxSp = boss.phase === 2 ? 55 : 38;
  if (boss.vel.length() > maxSp) boss.vel.setLength(maxSp);
  boss.mesh.position.addScaledVector(boss.vel, dt);

  // Face player
  const lookM = new THREE.Matrix4();
  lookM.lookAt(boss.mesh.position, state.pos, new THREE.Vector3(0, 1, 0));
  tmpQ.setFromRotationMatrix(lookM);
  boss.mesh.quaternion.slerp(tmpQ, Math.min(1, dt * 2));

  // Fire
  boss.fireT -= dt;
  if (boss.fireT <= 0 && d < 700) {
    boss.fireT = boss.phase === 2 ? 1.6 : 3.0;
    bossFire();
  }

  // Phase 2: teleport
  if (boss.phase === 2) {
    boss.teleportT -= dt;
    if (boss.teleportT <= 0) {
      boss.teleportT = 9 + Math.random() * 4;
      // Teleport to random point 250-400u from player
      const ang = Math.random() * Math.PI * 2;
      const dist = 250 + Math.random() * 150;
      const newPos = state.pos.clone();
      newPos.x += Math.cos(ang) * dist;
      newPos.z += Math.sin(ang) * dist;
      newPos.y += (Math.random() - 0.5) * 80;
      // Brief flash at old position
      const flash = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, color: 0xff44ff, transparent: true, opacity: 1.0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      flash.position.copy(boss.mesh.position);
      flash.scale.set(80, 80, 1);
      scene.add(flash);
      explosions.push({ mesh: flash, life: 0.6, max: 0.6, scale: 80 });
      boss.mesh.position.copy(newPos);
      boss.vel.set(0, 0, 0);
    }

    // Phase 2: summon wingmen occasionally
    boss.summonT -= dt;
    if (boss.summonT <= 0 && pirates.length < 6) {
      boss.summonT = 18;
      spawnPirate(boss.mesh.position);
    }
  }

  // Death check
  if (boss.hull <= 0) {
    explode(boss.mesh.position, 0, 250); // visual + areal nothing (no enemies left)
    despawnBoss(true);
  }
}

// Hook boss laser collision into player + ensure boss takes damage from lasers/missiles/mines.
// We extend laser hit logic by also checking boss in updateLasers loop below — patch via wrapper.
// Simpler: directly check boss in those updates by adding boss to a "damageable" target list.
// To avoid touching the existing functions twice, we run a post-step that checks projectiles vs boss.
function checkBossProjectileHits() {
  if (!boss) return;
  // Lasers
  for (let i = lasers.length - 1; i >= 0; i--) {
    const l = lasers[i];
    if (l.mesh.position.distanceTo(boss.mesh.position) < 22) {
      boss.hull -= 14;
      scene.remove(l.mesh);
      lasers.splice(i, 1);
    }
  }
  // Missiles (bigger damage)
  for (let i = missiles.length - 1; i >= 0; i--) {
    const m = missiles[i];
    if (m.mesh.position.distanceTo(boss.mesh.position) < 28) {
      boss.hull -= 90;
      explode(m.mesh.position, 0, 50); // visual only (areal handled by boss directly)
      scene.remove(m.mesh);
      missiles.splice(i, 1);
    }
  }
  // Mines
  for (let i = mines.length - 1; i >= 0; i--) {
    const mn = mines[i];
    if (mn.armT <= 0 && mn.mesh.position.distanceTo(boss.mesh.position) < 75) {
      boss.hull -= 120;
      explode(mn.mesh.position, 0, 80);
      scene.remove(mn.mesh);
      mines.splice(i, 1);
    }
  }
}

function updateBossHUD() {
  if (!boss) return;
  const bar = document.getElementById('bossBar');
  const txt = document.getElementById('bossHull');
  if (bar) bar.style.width = (boss.hull / boss.hullMax * 100) + '%';
  if (txt) txt.textContent = `${Math.max(0, boss.hull|0)} / ${boss.hullMax}`;
}

// ---------- SOLAR FLARE ----------
let flareT = 75 + Math.random() * 60;
let flareWarned = false;
function updateFlare(dt) {
  flareT -= dt;
  if (flareT <= 10 && !flareWarned) {
    flareWarned = true;
    aidaSay('⚠  QUYOSH PORTLASHI 10s! Sayyora ortiga yashiring!', 9500);
  }
  if (flareT <= 0) {
    const dSun = state.pos.distanceTo(planetMeshes['sun'].position);
    const toSun = tmpVec.copy(planetMeshes['sun'].position).sub(state.pos);
    const sunDist = toSun.length();
    toSun.divideScalar(sunDist);
    let shielded = false;
    for (const p of PLANETS) {
      if (p.isStar) continue;
      const m = planetMeshes[p.key];
      const toPl = new THREE.Vector3().copy(m.position).sub(state.pos);
      const t = toPl.dot(toSun);
      if (t > 0 && t < sunDist) {
        const closest = new THREE.Vector3().copy(state.pos).addScaledVector(toSun, t);
        if (closest.distanceTo(m.position) < p.r) { shielded = true; break; }
      }
    }
    if (!shielded) {
      const dmg = Math.max(2, 35 - dSun / 350);
      state.hull -= dmg;
      state.batt = Math.max(0, state.batt - 25);
      aidaSay(`⚠  Portlashdan zarar: -${dmg.toFixed(0)} korpus, -25 batareya`, 5000);
      if (state.hull <= 0) gameOver('Quyosh portlashi yo\'q qildi');
    } else {
      aidaSay('✓ Sayyora ortida himoyalandingiz', 4000);
    }
    flareT = 100 + Math.random() * 80;
    flareWarned = false;
  }
}

// ---------- DOCKING (sayyora yaqinida sekin uchish = avto-tiklash) ----------
function checkDocking(dt) {
  let docked = false, dockedPlanet = null;
  for (const p of PLANETS) {
    if (p.isStar) continue;
    const d = state.pos.distanceTo(planetMeshes[p.key].position) - p.r;
    if (d < 80 && d > 4 && state.vel.length() < 12) {
      docked = true; dockedPlanet = p; break;
    }
  }
  state.docking = docked;
  if (docked) {
    state.o2 = Math.min(state.maxO2, state.o2 + dt * 14);
    state.fuel = Math.min(state.maxFuel, state.fuel + dt * 11);
    state.hull = Math.min(state.maxHull, state.hull + dt * 7);
    state.batt = Math.min(state.maxBatt, state.batt + dt * 8);
  }
}

// ---------- WIN CONDITION ----------
let won = false;
function checkWin() {
  if (won) return;
  if (!state.modules.has('neptune')) return;
  const earthD = state.pos.distanceTo(planetMeshes['earth'].position) - PLANETS[1].r;
  if (earthD < 80) {
    won = true;
    state.alive = false;
    profileOnWin();
    document.exitPointerLock?.();
    showVictory();
  }
}
function showVictory() {
  const div = document.createElement('div');
  div.id = 'victory';
  const karmaLabel = state.karma >= 0 ? `+${state.karma} (◆ SAVIOR)` : `${state.karma} (◆ RAIDER)`;
  div.innerHTML = `
    <h1>✦ MISSION COMPLETE ✦</h1>
    <h2>HUMANITY SAVED</h2>
    <p>${escapeHtml(state.name)}, siz <b>Genesis zarrasini</b> Yerga olib qaytdingiz.</p>
    <p>Insoniyat omon qoldi. Sizning oltin yodgorligingiz Yer orbitasida o'rnatildi.</p>
    <div class="stats">
      <div>KARMA: <b>${karmaLabel}</b></div>
      <div>QAROQCHI YO'Q QILINDI: <b>${state.kills}</b></div>
      <div>YIG'ILGAN MODULLAR: <b>${state.modules.size}/${PLANETS.filter(x=>x.module).length}</b></div>
      <div>ZONDLAR TOPILDI: <b>${probeObjects.filter(o=>o.visited).length}/${probeObjects.length}</b></div>
    </div>
    <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:14px;">
      <button id="victoryShareBtn">𝕏  ULASHISH</button>
      <button onclick="location.reload()">▶ NEW GAME</button>
    </div>
  `;
  document.body.appendChild(div);
  const sb = div.querySelector('#victoryShareBtn');
  if (sb) sb.addEventListener('click', shareVictory);
}

// ---------- SOCIAL SHARE (Canvas card → Twitter/X / download / clipboard) ----------
function generateShareCard({ title, subtitle, stats, accent, faction }) {
  const W = 1200, H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Deep space gradient
  const bg = ctx.createRadialGradient(W/2, H*0.55, 80, W/2, H/2, 760);
  bg.addColorStop(0, '#091a36');
  bg.addColorStop(0.55, '#040818');
  bg.addColorStop(1, '#000000');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Starfield (deterministic so it stays consistent looking)
  let seed = 12345;
  const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let i = 0; i < 220; i++) {
    const x = rand() * W, y = rand() * H;
    const sz = rand() * 1.6 + 0.4;
    const a = rand() * 0.7 + 0.2;
    ctx.fillStyle = `rgba(${180 + rand()*70}, ${200 + rand()*55}, 255, ${a})`;
    ctx.fillRect(x, y, sz, sz);
  }

  // Faction glow corner (if faction set)
  if (faction) {
    const fc = getFaction(faction);
    if (fc) {
      const gr = ctx.createRadialGradient(W - 200, H - 200, 30, W - 200, H - 200, 380);
      gr.addColorStop(0, fc.cssColor + '55');
      gr.addColorStop(1, fc.cssColor + '00');
      ctx.fillStyle = gr;
      ctx.fillRect(W - 600, H - 600, 600, 600);
    }
  }

  // Outer frame
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.strokeStyle = accent + '40';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  // Game title (top)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#7cd4ff';
  ctx.font = 'bold 22px Consolas, "Courier New", monospace';
  ctx.fillText('ODYSSEY  ·  SOL\'S LAST BREATH', W / 2, 78);

  // Big title
  ctx.shadowColor = accent;
  ctx.shadowBlur = 28;
  ctx.fillStyle = accent;
  ctx.font = 'bold 96px Consolas, "Courier New", monospace';
  ctx.fillText(title, W / 2, 220);
  ctx.shadowBlur = 0;

  // Subtitle (pilot name + faction)
  ctx.fillStyle = '#cfeaff';
  ctx.font = '26px Consolas, "Courier New", monospace';
  ctx.fillText(subtitle, W / 2, 268);

  // Faction badge (if set)
  if (faction) {
    const fc = getFaction(faction);
    if (fc) {
      ctx.fillStyle = fc.cssColor;
      ctx.font = 'bold 18px Consolas, monospace';
      ctx.fillText(`${fc.icon}  ${fc.name}`, W / 2, 310);
    }
  }

  // Stats grid (2 columns)
  const keys = Object.keys(stats);
  const cols = 2;
  const rows = Math.ceil(keys.length / cols);
  const gridStartY = 380;
  const colW = 360;
  const rowH = 78;
  ctx.textAlign = 'center';
  for (let i = 0; i < keys.length; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    const x = W / 2 + (col === 0 ? -colW / 2 - 30 : colW / 2 + 30);
    const y = gridStartY + row * rowH;
    ctx.fillStyle = '#7cd4ff';
    ctx.font = '14px Consolas, monospace';
    ctx.fillText(keys[i], x, y);
    ctx.fillStyle = '#ffd060';
    ctx.font = 'bold 38px Consolas, monospace';
    ctx.fillText(stats[keys[i]], x, y + 42);
  }

  // Footer URL
  ctx.fillStyle = '#aef0ff';
  ctx.font = '15px Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(location.host || 'odyssey.game', W / 2, H - 50);

  return canvas;
}

function shareToTwitter(text) {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
function downloadCanvasPng(canvas, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, 'image/png');
}
async function copyToClipboardSafe(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); ta.remove(); return true; }
    catch { ta.remove(); return false; }
  }
}

// Web Share API (mobile native share sheet)
async function tryNativeShare(canvas, text) {
  if (!navigator.share) return false;
  try {
    const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
    if (!blob) return false;
    const file = new File([blob], 'odyssey-run.png', { type: 'image/png' });
    if (navigator.canShare && !navigator.canShare({ files: [file] })) {
      // Fallback: text only
      await navigator.share({ text });
      return true;
    }
    await navigator.share({ text, files: [file] });
    return true;
  } catch { return false; }
}

function openShareModal({ title, subtitle, stats, tweetText, accent, faction }) {
  // Remove existing
  const existing = document.getElementById('share-modal');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'share-modal';

  const canvas = generateShareCard({ title, subtitle, stats, accent: accent || '#ffd060', faction });
  const previewSrc = canvas.toDataURL('image/png');

  overlay.innerHTML = `
    <div class="sm-inner">
      <button class="sm-close" type="button">✕</button>
      <div class="sm-title">SHARE YOUR RUN</div>
      <img class="sm-preview" src="${previewSrc}" alt="Run summary card"/>
      <div class="sm-text-row">
        <textarea class="sm-text" rows="3" maxlength="280">${tweetText}</textarea>
      </div>
      <div class="sm-actions">
        <button class="sm-btn sm-twitter" data-act="twitter">𝕏  TWEET</button>
        <button class="sm-btn sm-copy" data-act="copy">⎘  COPY TEXT</button>
        <button class="sm-btn sm-download" data-act="download">⬇  DOWNLOAD PNG</button>
        <button class="sm-btn sm-native" data-act="native" style="display:${navigator.share ? '' : 'none'};">⤴  SHARE…</button>
      </div>
      <div class="sm-hint">Yer'ni qutqarish — yoki halok bo'lish — sizning hikoyangiz. Ulashing.</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const ta = overlay.querySelector('.sm-text');
  const flash = (msg, ok = true) => {
    const hint = overlay.querySelector('.sm-hint');
    const old = hint.textContent;
    hint.textContent = msg;
    hint.style.color = ok ? '#7cffb1' : '#ff7766';
    setTimeout(() => { hint.textContent = old; hint.style.color = ''; }, 2500);
  };

  overlay.querySelector('.sm-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.querySelectorAll('[data-act]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const act = btn.dataset.act;
      if (act === 'twitter') {
        shareToTwitter(ta.value);
      } else if (act === 'copy') {
        const ok = await copyToClipboardSafe(ta.value);
        flash(ok ? '✓ Matn ko\'chirildi' : '✗ Ko\'chirib bo\'lmadi', ok);
      } else if (act === 'download') {
        downloadCanvasPng(canvas, `odyssey-${Date.now()}.png`);
        flash('✓ PNG yuklab olinmoqda...', true);
      } else if (act === 'native') {
        const ok = await tryNativeShare(canvas, ta.value);
        if (!ok) flash('✗ Ulashish bekor qilindi', false);
      }
    });
  });
}

// Helpers to build run-summary share modals
function shareVictory() {
  const f = getFaction(profile.faction);
  const accent = f ? f.cssColor : '#ffd060';
  const elapsed = profile.bestTimeSec ? Math.floor(profile.bestTimeSec) : 0;
  const m = Math.floor(elapsed / 60), s = elapsed % 60;
  const timeStr = elapsed > 0 ? `${m}m ${s}s` : '—';
  openShareModal({
    title: '✦ HUMANITY SAVED',
    subtitle: `${state.name || 'PILOT'} — Genesis returned to Earth`,
    stats: {
      'BEST TIME':       timeStr,
      'PIRATE KILLS':    String(state.kills),
      'MODULES':         `${state.modules.size}/${PLANETS.filter(x=>x.module).length}`,
      'KARMA':           String(state.karma),
    },
    tweetText: `Yer'ni qutqardim! ⏱ ${timeStr} · ${state.kills} qaroqchi · ${state.modules.size}/7 modul\n\nODYSSEY: SOL'S LAST BREATH\n${location.origin || ''}`,
    accent, faction: profile.faction,
  });
}

function shareDeath(reason) {
  const f = getFaction(profile.faction);
  const accent = f ? f.cssColor : '#ff5544';
  openShareModal({
    title: '✗ MISSION FAILED',
    subtitle: `${state.name || 'PILOT'} — ${reason}`,
    stats: {
      'TOTAL DEATHS':    String(profile.totalDeaths || 0),
      'KILLS THIS RUN':  String(state.kills),
      'MODULES':         `${state.modules.size}/${PLANETS.filter(x=>x.module).length}`,
      'PvP K/D':         `${profile.factionKills || 0} / ${profile.factionDeaths || 0}`,
    },
    tweetText: `Halok bo'ldim: ${reason}\n${state.kills} qaroqchi · ${state.modules.size}/7 modul\n\nODYSSEY: SOL'S LAST BREATH\n${location.origin || ''}`,
    accent, faction: profile.faction,
  });
}

// ---------- TRADE SYSTEM (multiplayer resource exchange) ----------
const TRADE_RANGE = 250; // u
const TRADE_AMOUNT = 25; // % per trade
const tradeUI = {
  panel: document.getElementById('trade-panel'),
  prompt: document.getElementById('trade-prompt'),
  targetName: document.getElementById('trade-target-name'),
};
let pendingIncomingOffer = null; // { from, fromName, item, expiresAt }
let pendingOutgoingTo = null;     // id we sent an offer to (awaiting response)
let promptTimerId = null;

function findNearestPlayer() {
  let best = null, bestD = TRADE_RANGE;
  for (const [id, o] of otherPlayers) {
    const d = state.pos.distanceTo(o.mesh.position);
    if (d < bestD) { bestD = d; best = { id, name: o.name || `Pilot-${id}`, dist: d }; }
  }
  return best;
}

function openTrade() {
  if (!state.alive || splash.style.display !== 'none' && state.launching) return;
  const target = findNearestPlayer();
  if (!target) {
    aidaSay(`⚠  Yaqin atrofda pilot yo'q (${TRADE_RANGE}u)`, 4000);
    return;
  }
  tradeUI.targetName.textContent = `${target.name}  (${target.dist.toFixed(0)}u)`;
  tradeUI.panel.style.display = 'block';
  tradeUI.panel.dataset.targetId = target.id;
  // Disable buttons that would over-deduct
  for (const btn of tradeUI.panel.querySelectorAll('[data-trade]')) {
    const item = btn.dataset.trade;
    let cur = state[item] ?? 0;
    if (item === 'hull') cur = state.hull;
    btn.disabled = cur < TRADE_AMOUNT;
  }
  document.exitPointerLock?.();
}

window.closeTrade = function() {
  tradeUI.panel.style.display = 'none';
};

for (const btn of tradeUI.panel.querySelectorAll('[data-trade]')) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const item = btn.dataset.trade;
    const targetId = Number(tradeUI.panel.dataset.targetId);
    if (!targetId) return;
    if (!ws || ws.readyState !== 1) {
      aidaSay('⚠  Tarmoq mavjud emas');
      return;
    }
    // Check current resource
    const cur = item === 'hull' ? state.hull : state[item];
    if (cur < TRADE_AMOUNT) {
      aidaSay(`⚠  ${item.toUpperCase()} yetarli emas`);
      return;
    }
    // Deduct optimistically; refund on decline/timeout
    if (item === 'hull') state.hull -= TRADE_AMOUNT;
    else state[item] -= TRADE_AMOUNT;
    pendingOutgoingTo = { id: targetId, item, amount: TRADE_AMOUNT, t: performance.now() };
    ws.send(JSON.stringify({
      type: 'trade-offer', to: targetId, item, amount: TRADE_AMOUNT,
    }));
    aidaSay(`▸ Taklif yuborildi: ${item.toUpperCase()} +${TRADE_AMOUNT}%`);
    window.closeTrade();
    // Auto-refund after 20s if no response
    setTimeout(() => {
      if (pendingOutgoingTo && pendingOutgoingTo.id === targetId && pendingOutgoingTo.item === item) {
        // refund
        if (item === 'hull') state.hull = Math.min(100, state.hull + TRADE_AMOUNT);
        else state[item] = Math.min(100, state[item] + TRADE_AMOUNT);
        pendingOutgoingTo = null;
        aidaSay(`◯ Taklif javobsiz qoldi — ${item.toUpperCase()} qaytarildi`);
      }
    }, 20000);
  });
}

function onTradeOffer(m) {
  // Show prompt with accept (Y) / decline (N) hints
  pendingIncomingOffer = { from: m.from, fromName: m.fromName, item: m.item, amount: m.amount };
  const labels = { fuel: 'YOQILG\'I', batt: 'BATAREYA', o2: 'KISLOROD', hull: 'KORPUS' };
  tradeUI.prompt.innerHTML = `
    <div><b>${m.fromName}</b> sizga ${labels[m.item] || m.item} +${m.amount}% taklif qilmoqda</div>
    <div class="actions">[Y] Qabul qilish · [N] Rad etish · 15s</div>
  `;
  tradeUI.prompt.style.display = 'block';
  if (promptTimerId) clearTimeout(promptTimerId);
  promptTimerId = setTimeout(() => {
    if (pendingIncomingOffer) {
      respondTrade(false);
    }
  }, 15000);
}

function respondTrade(accept) {
  if (!pendingIncomingOffer || !ws || ws.readyState !== 1) return;
  const off = pendingIncomingOffer;
  ws.send(JSON.stringify({
    type: accept ? 'trade-accept' : 'trade-decline',
    to: off.from, item: off.item, amount: off.amount,
  }));
  if (accept) {
    if (off.item === 'hull') state.hull = Math.min(100, state.hull + off.amount);
    else state[off.item] = Math.min(100, state[off.item] + off.amount);
    SFX.trade();
    profileOnTradeAccepted();
    aidaSay(`✓ ${off.fromName} dan qabul qilindi: ${off.item.toUpperCase()} +${off.amount}%`);
  } else {
    aidaSay(`◯ Taklif rad etildi`);
  }
  pendingIncomingOffer = null;
  tradeUI.prompt.style.display = 'none';
  if (promptTimerId) { clearTimeout(promptTimerId); promptTimerId = null; }
}

function onTradeAccept(m) {
  if (pendingOutgoingTo && pendingOutgoingTo.id === m.from && pendingOutgoingTo.item === m.item) {
    SFX.trade();
    profileOnTradeAccepted();
    aidaSay(`✓ ${m.fromName} taklifni qabul qildi (${m.item.toUpperCase()} +${m.amount}%)`);
    state.karma += 2; // small reward for being a giver
    pendingOutgoingTo = null;
  }
}

function onTradeDecline(m) {
  if (pendingOutgoingTo && pendingOutgoingTo.id === m.from && pendingOutgoingTo.item === m.item) {
    // Refund
    if (m.item === 'hull') state.hull = Math.min(100, state.hull + m.amount);
    else state[m.item] = Math.min(100, state[m.item] + m.amount);
    aidaSay(`◯ ${m.fromName} taklifni rad etdi — qaytarildi`);
    pendingOutgoingTo = null;
  }
}

// Y/N hotkeys when incoming offer is shown
window.addEventListener('keydown', (e) => {
  if (chatInput.style.display === 'block') return;
  if (!pendingIncomingOffer) return;
  if (e.code === 'KeyY') { e.preventDefault(); respondTrade(true); }
  else if (e.code === 'KeyN') { e.preventDefault(); respondTrade(false); }
});

// ---------- PROFILE + ACHIEVEMENTS (localStorage persistence) ----------
const PROFILE_KEY = 'odyssey-profile-v1';
const ACHIEVEMENTS = [
  { id: 'first_flight',  name: 'FIRST FLIGHT',  icon: '🚀', desc: "Yer atmosferasidan chiqing" },
  { id: 'first_module',  name: 'FIRST MODULE',  icon: '✦', desc: "Birinchi modulni yig'ing" },
  { id: 'pirate_5',      name: 'BOUNTY HUNTER', icon: '☠', desc: "5 qaroqchini yo'q qiling (kumulyativ)" },
  { id: 'pirate_25',     name: 'BOUNTY KING',   icon: '👑', desc: "25 qaroqchini yo'q qiling (kumulyativ)" },
  { id: 'trade',         name: 'TRADER',        icon: '⇄', desc: "Boshqa pilot bilan trade qiling" },
  { id: 'dark_zone',     name: 'VOID WALKER',   icon: '☼', desc: "Dark Zone'da 20s tirik qoling" },
  { id: 'all_modules',   name: 'COMPLETE SET',  icon: '✪', desc: "Bir runda 7 modulni yig'ing" },
  { id: 'boss',          name: 'BOSS SLAYER',   icon: '⬢', desc: "Xenomorph Sentinel'ni yo'q qiling" },
  { id: 'all_probes',    name: 'CARTOGRAPHER',  icon: '◎', desc: "Barcha 5 zondni toping" },
  { id: 'rescuer',       name: 'RESCUER',       icon: '✚', desc: "Distress signal'ga javob bering" },
  { id: 'scavenger',     name: 'SCAVENGER',     icon: '◫', desc: "10 ta salvage konteyner toping (kumulyativ)" },
  { id: 'win',           name: 'SAVIOR',        icon: '★', desc: "Genesis bilan Yerga qayting" },
  { id: 'first_friend',  name: 'NEW BOND',      icon: '🤝', desc: "Birinchi do'stingizni qo'shing" },
  { id: 'social_5',      name: 'SQUAD LEADER',  icon: '👥', desc: "5 ta do'st to'plang" },
  { id: 'buddy_kill',    name: 'WINGMAN',       icon: '⚡', desc: "Buddy Boost faolligida dushman o'ldiring" },
];

const defaultProfile = () => ({
  name: '',
  totalKills: 0,
  totalModulesFound: 0,
  totalDeaths: 0,
  totalWins: 0,
  bestTimeSec: null,
  totalPlaytimeSec: 0,
  achievements: {}, // id -> ISO timestamp
  credits: 0,       // permanent currency
  upgrades: {       // levels per upgrade id
    hull: 0, fuel: 0, reactor: 0, weaponTune: 0, ammo: 0,
  },
  settings: {
    fov: 62,           // 50-90
    sensitivity: 1.0,  // 0.3-2.5
    bloomOn: true,
    sfxVolume: 0.55,   // 0.0-1.0
    musicVolume: 0.42, // 0.0-1.0
  },
  tutorialDone: false,
  dailyDate: '',           // YYYY-MM-DD when current daily was generated
  dailyChallenges: [],     // [{id, name, target, reward, hook, progress, claimed}]
  faction: null,           // 'ASCENDANT' | 'NIHILIST' | null (forces selection)
  factionKills: 0,         // PvP kills against opposite faction
  factionDeaths: 0,        // PvP deaths
  equippedShip: 'vanguard',
  ownedShips: ['vanguard'],
  lastLoginDate: '',       // YYYY-MM-DD of last login bonus claim
  loginStreak: 0,          // consecutive days (1-7 cycle)
  bpXp: 0,                 // Battle pass cumulative XP
  bpClaimed: [],           // Array of claimed tier indices (0-based)
  bpPremium: false,        // Premium track unlocked
  bpPremiumClaimed: [],    // Array of claimed premium tier indices
  bpSeasonId: '',          // Tracks current season; reset wipes bp* fields
  friends: [],             // [{uid, name, addedAt}]
});

// Faction definitions (lore-driven)
const FACTIONS = {
  ASCENDANT: {
    id: 'ASCENDANT',
    name: 'KO\'TARILGANLAR',
    creed: 'Yer hayotini tiklash uchun. Genesis = umid.',
    color: 0xffd060,         // gold
    accent: 0x7cd4ff,        // blue
    cssColor: '#ffd060',
    cssAccent: '#7cd4ff',
    icon: '✦',
  },
  NIHILIST: {
    id: 'NIHILIST',
    name: 'YO\'QLIK',
    creed: 'Insoniyat eskirdi. Genesis = aldash.',
    color: 0x550000,         // dark crimson hull
    accent: 0xff3344,        // bright red glow
    cssColor: '#ff3344',
    cssAccent: '#7a0000',
    icon: '☠',
  },
};
function getFaction(id) {
  return FACTIONS[id] || null;
}
function isEnemy(a, b) {
  if (!a || !b) return false;
  if (a === b) return false;
  return !!FACTIONS[a] && !!FACTIONS[b];
}

// Upgrade catalog (max 5 levels for hull, 3 for others)
const UPGRADES = [
  { id: 'hull',       name: 'REINFORCED HULL',  icon: '⛨',
    desc: 'Maksimal korpus +5 har daraja',
    maxLevel: 5, costs: [80, 160, 320, 600, 1000],
    apply: (st, lvl) => { st.maxHull = 100 + lvl * 5; } },
  { id: 'fuel',       name: 'EXTRA FUEL TANK',  icon: '⛽',
    desc: 'Maksimal yoqilg\'i +10 har daraja',
    maxLevel: 3, costs: [100, 220, 450],
    apply: (st, lvl) => { st.maxFuel = 100 + lvl * 10; } },
  { id: 'reactor',    name: 'SOLAR REACTOR Mk.II', icon: '☀',
    desc: 'Quyosh batareyasi tezligi +25% har daraja',
    maxLevel: 3, costs: [120, 260, 540],
    apply: (st, lvl) => { st.solarMult = 1 + lvl * 0.25; } },
  { id: 'weaponTune', name: 'WEAPON TUNING',    icon: '⚙',
    desc: 'Qurol cooldown -10% har daraja',
    maxLevel: 3, costs: [150, 320, 700],
    apply: (st, lvl) => { st.weaponCoolMult = Math.max(0.5, 1 - lvl * 0.10); } },
  { id: 'ammo',       name: 'AMMO CACHE',       icon: '⊞',
    desc: 'Boshlang\'ich o\'qlar +25% har daraja',
    maxLevel: 3, costs: [90, 200, 400],
    apply: (st, lvl) => { st.ammoMult = 1 + lvl * 0.25; } },
];

let profile = defaultProfile();
function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      profile = {
        ...defaultProfile(), ...p,
        achievements: { ...(p.achievements || {}) },
        upgrades: { ...defaultProfile().upgrades, ...(p.upgrades || {}) },
        settings: { ...defaultProfile().settings, ...(p.settings || {}) },
        ownedShips: Array.isArray(p.ownedShips) && p.ownedShips.length > 0
          ? Array.from(new Set(['vanguard', ...p.ownedShips]))
          : ['vanguard'],
        equippedShip: p.equippedShip || 'vanguard',
      };
      // Auto-skip tutorial for veteran users who installed before this update
      if (p.tutorialDone === undefined &&
          ((p.totalKills || 0) > 0 || (p.totalDeaths || 0) > 0 || (p.totalModulesFound || 0) > 0)) {
        profile.tutorialDone = true;
      }
    }
  } catch (e) { profile = defaultProfile(); }
  // Pre-fill name input if available
  if (profile.name && nameInput && !nameInput.value) nameInput.value = profile.name;
}
function saveProfile() {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {}
  scheduleCloudSync();
}
loadProfile();

// ---------- CLOUD PROFILE SYNC ----------
const CLOUD_UID_KEY = 'odyssey.cloudUid';
const CLOUD_TOKEN_KEY = 'odyssey.cloudToken';
const CLOUD_LAST_SYNC_KEY = 'odyssey.cloudLastSync';

function randomHex(len) {
  const bytes = new Uint8Array(len / 2);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}
function ensureCloudIdentity() {
  let uid = localStorage.getItem(CLOUD_UID_KEY);
  let token = localStorage.getItem(CLOUD_TOKEN_KEY);
  if (!uid || !/^[a-f0-9]{16,64}$/i.test(uid)) {
    uid = randomHex(32);
    localStorage.setItem(CLOUD_UID_KEY, uid);
  }
  if (!token || !/^[a-f0-9]{16,64}$/i.test(token)) {
    token = randomHex(32);
    localStorage.setItem(CLOUD_TOKEN_KEY, token);
  }
  return { uid, token };
}

let cloudSyncStatus = 'idle'; // 'idle' | 'syncing' | 'synced' | 'error' | 'offline'
let cloudIndicator = null;
function setCloudStatus(s, msg) {
  cloudSyncStatus = s;
  if (!cloudIndicator) {
    cloudIndicator = document.createElement('div');
    cloudIndicator.id = 'cloud-status';
    document.body.appendChild(cloudIndicator);
  }
  const colors = {
    idle:    { dot: '#7cd4ff', text: '☁ Cloud' },
    syncing: { dot: '#ffd060', text: '☁ Syncing...' },
    synced:  { dot: '#7cffb1', text: '☁ Synced' },
    error:   { dot: '#ff7766', text: '☁ Sync error' },
    offline: { dot: '#888',    text: '☁ Offline' },
  };
  const c = colors[s] || colors.idle;
  cloudIndicator.innerHTML = `<span class="cs-dot" style="background:${c.dot};box-shadow:0 0 6px ${c.dot}"></span><span class="cs-txt">${c.text}${msg ? ' · '+msg : ''}</span>`;
  if (s === 'synced') {
    setTimeout(() => { if (cloudSyncStatus === 'synced') setCloudStatus('idle'); }, 2500);
  }
}

let cloudSyncTimer = null;
let lastCloudPutT = 0;
function scheduleCloudSync() {
  if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(() => doCloudSync().catch(()=>{}), 3000);
}
async function doCloudSync() {
  const { uid, token } = ensureCloudIdentity();
  // Min 5s between PUTs (server cooldown is 4s, give buffer)
  if (Date.now() - lastCloudPutT < 5000) {
    cloudSyncTimer = setTimeout(() => doCloudSync().catch(()=>{}), 5000 - (Date.now() - lastCloudPutT));
    return;
  }
  setCloudStatus('syncing');
  try {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, token, profile }),
    });
    if (res.ok) {
      const data = await res.json();
      lastCloudPutT = Date.now();
      localStorage.setItem(CLOUD_LAST_SYNC_KEY, String(data.updatedAt || Date.now()));
      setCloudStatus('synced');
    } else if (res.status === 429) {
      // retry later
      cloudSyncTimer = setTimeout(() => doCloudSync().catch(()=>{}), 5000);
      setCloudStatus('idle');
    } else {
      setCloudStatus('error');
    }
  } catch (e) {
    setCloudStatus('offline');
  }
}

function isFreshProfile(p) {
  // Detect "no real progress" — heuristic
  if (!p) return true;
  const totalActivity = (p.totalModulesFound || 0) + (p.kills || 0)
    + (p.totalDeaths || 0) + (p.credits || 0)
    + (p.bestTimeSec ? 1 : 0)
    + (p.ownedShips ? p.ownedShips.length - 1 : 0);
  return totalActivity === 0;
}

async function tryRestoreFromCloud() {
  const { uid, token } = ensureCloudIdentity();
  try {
    const res = await fetch(`/api/profile?uid=${uid}&token=${token}`);
    if (!res.ok) { setCloudStatus('idle'); return; }
    const data = await res.json();
    if (!data || !data.exists || !data.profile) {
      setCloudStatus('idle');
      return;
    }
    const cloudProfile = data.profile;
    const localFresh = isFreshProfile(profile);
    const cloudFresh = isFreshProfile(cloudProfile);
    if (cloudFresh) { setCloudStatus('idle'); return; }
    // Auto-restore if local is empty
    if (localFresh) {
      profile = { ...profile, ...cloudProfile };
      saveProfile();
      setCloudStatus('synced', 'restored from cloud');
      if (typeof reEquipShip === 'function') reEquipShip();
      return;
    }
    // Conflict: both have progress → show choice modal
    showCloudConflictModal(cloudProfile, data.updatedAt);
  } catch (e) {
    setCloudStatus('offline');
  }
}

function showCloudConflictModal(cloudProfile, cloudUpdatedAt) {
  if (document.getElementById('cloud-conflict')) return;
  const overlay = document.createElement('div');
  overlay.id = 'cloud-conflict';
  const fmtDate = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleString();
  };
  const sumStat = (p) =>
    `${p.totalModulesFound || 0} mods · ${p.kills || 0} kills · ${p.credits || 0}⬢ · ${(p.ownedShips || ['vanguard']).length} ships`;

  overlay.innerHTML = `
    <div class="cc-inner">
      <div class="cc-title">☁ CLOUD SYNC CONFLICT</div>
      <div class="cc-sub">Bu qurilmada va bulutda har xil ma'lumot bor. Qaysi birini saqlash?</div>
      <div class="cc-grid">
        <div class="cc-card" data-choice="local">
          <div class="cc-h">⚐  LOCAL (bu qurilma)</div>
          <div class="cc-stat">${sumStat(profile)}</div>
          <button class="cc-btn">SAQLAB QOLISH</button>
        </div>
        <div class="cc-card" data-choice="cloud">
          <div class="cc-h">☁  CLOUD ${cloudUpdatedAt ? '<span style="opacity:0.6;font-size:9px;">· '+fmtDate(cloudUpdatedAt)+'</span>' : ''}</div>
          <div class="cc-stat">${sumStat(cloudProfile)}</div>
          <button class="cc-btn">QAYTA TIKLASH</button>
        </div>
      </div>
      <div class="cc-hint">Tanlangan ma'lumot ikkala joyda ham ishlatiladi</div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelectorAll('[data-choice]').forEach(card => {
    card.addEventListener('click', () => {
      const choice = card.dataset.choice;
      if (choice === 'cloud') {
        profile = { ...profile, ...cloudProfile };
        saveProfile(); // will trigger PUT but with cloud data → no-op effectively
        if (typeof reEquipShip === 'function') reEquipShip();
        if (typeof renderDailySplash === 'function') renderDailySplash();
        if (typeof renderFactionSplash === 'function') renderFactionSplash();
        setCloudStatus('synced', 'restored from cloud');
      } else {
        // Keep local — just push to cloud
        scheduleCloudSync();
        setCloudStatus('synced', 'kept local');
      }
      overlay.remove();
    });
  });
}

// On startup: identify + try restore
ensureCloudIdentity();
// Defer restore attempt slightly so login bonus and other UI render first
setTimeout(() => tryRestoreFromCloud().catch(()=>{}), 1200);

// ---------- TRANSFER CODE UI (cross-device profile transfer) ----------
function fmtTransferCode(code) {
  // 8 chars → "XXXX-XXXX"
  return code ? code.slice(0, 4) + '-' + code.slice(4, 8) : '';
}
async function generateTransferCode() {
  const { uid, token } = ensureCloudIdentity();
  const res = await fetch('/api/profile/transfer-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, token }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}
async function redeemTransferCode(rawCode) {
  const code = (rawCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 8) throw new Error('bad_code');
  const res = await fetch('/api/profile/redeem-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function openTransferModal() {
  if (document.getElementById('transfer-modal')) return;
  const overlay = document.createElement('div');
  overlay.id = 'transfer-modal';
  overlay.innerHTML = `
    <div class="tm-inner">
      <button class="tm-close" type="button">✕</button>
      <div class="tm-title">☁ TRANSFER PROFILE</div>
      <div class="tm-sub">Bu o'yinni boshqa qurilmaga ko'chirish uchun</div>

      <div class="tm-grid">
        <div class="tm-card">
          <div class="tm-h">⇧  KOD OLISH</div>
          <div class="tm-desc">Bu qurilmadan profilni boshqa qurilmaga olib o'tish uchun kod yarating</div>
          <div class="tm-code-display" id="tm-code-display">—————————</div>
          <div class="tm-code-meta" id="tm-code-meta"></div>
          <button class="tm-btn tm-btn-primary" id="tm-gen-btn">★  KOD YARATISH</button>
          <button class="tm-btn tm-btn-secondary" id="tm-copy-btn" style="display:none;">⎘  NUSXA OLISH</button>
        </div>
        <div class="tm-card">
          <div class="tm-h">⇩  KODNI KIRITISH</div>
          <div class="tm-desc">Boshqa qurilmadan olingan kod bilan profilni qayta tiklash</div>
          <input type="text" class="tm-input" id="tm-code-input" placeholder="XXXX-XXXX" maxlength="9" autocomplete="off" />
          <button class="tm-btn tm-btn-primary" id="tm-redeem-btn">▶  TIKLASH</button>
          <div class="tm-result" id="tm-redeem-result"></div>
        </div>
      </div>
      <div class="tm-warn">⚠  Kod 10 daqiqa amal qiladi · Faqat bir marta ishlatiladi · Joriy ma'lumotlaringiz qayta tiklash bilan almashtiriladi</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('.tm-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  const codeDisplay = overlay.querySelector('#tm-code-display');
  const codeMeta = overlay.querySelector('#tm-code-meta');
  const genBtn = overlay.querySelector('#tm-gen-btn');
  const copyBtn = overlay.querySelector('#tm-copy-btn');
  const input = overlay.querySelector('#tm-code-input');
  const redeemBtn = overlay.querySelector('#tm-redeem-btn');
  const redeemResult = overlay.querySelector('#tm-redeem-result');

  let currentCode = null;
  let countdownTimer = null;

  // Auto-format input as user types: XXXX-XXXX
  input.addEventListener('input', () => {
    let v = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (v.length > 4) v = v.slice(0, 4) + '-' + v.slice(4, 8);
    input.value = v;
  });

  genBtn.addEventListener('click', async () => {
    genBtn.disabled = true;
    genBtn.textContent = '⏳ Yaratilmoqda...';
    try {
      const data = await generateTransferCode();
      currentCode = data.code;
      codeDisplay.textContent = fmtTransferCode(data.code);
      codeDisplay.classList.add('active');
      copyBtn.style.display = '';
      genBtn.textContent = '⟲  YANGI KOD';
      genBtn.disabled = false;
      // Countdown
      if (countdownTimer) clearInterval(countdownTimer);
      const tick = () => {
        const left = Math.max(0, Math.floor((data.expiresAt - Date.now()) / 1000));
        const m = Math.floor(left / 60), s = left % 60;
        codeMeta.textContent = left > 0
          ? `Amal qilish muddati: ${m}:${String(s).padStart(2,'0')}`
          : 'Muddati tugadi';
        if (left <= 0) {
          clearInterval(countdownTimer);
          codeDisplay.classList.remove('active');
          codeDisplay.classList.add('expired');
          copyBtn.style.display = 'none';
        }
      };
      tick();
      countdownTimer = setInterval(tick, 1000);
    } catch (e) {
      genBtn.disabled = false;
      genBtn.textContent = '✗  ' + (e.message === 'cooldown' ? '30s kuting' : 'Xatolik');
      setTimeout(() => { genBtn.textContent = '★  KOD YARATISH'; }, 3000);
    }
  });

  copyBtn.addEventListener('click', async () => {
    if (!currentCode) return;
    const text = fmtTransferCode(currentCode);
    const ok = await copyToClipboardSafe(text);
    copyBtn.textContent = ok ? '✓  KO\'CHIRILDI' : '✗  XATOLIK';
    setTimeout(() => { copyBtn.textContent = '⎘  NUSXA OLISH'; }, 2000);
  });

  redeemBtn.addEventListener('click', async () => {
    redeemResult.textContent = '';
    redeemResult.className = 'tm-result';
    redeemBtn.disabled = true;
    redeemBtn.textContent = '⏳ Tekshirilmoqda...';
    try {
      const data = await redeemTransferCode(input.value);
      // Save new identity
      localStorage.setItem(CLOUD_UID_KEY, data.uid);
      localStorage.setItem(CLOUD_TOKEN_KEY, data.token);
      // Fetch full profile from cloud
      const res = await fetch(`/api/profile?uid=${data.uid}&token=${data.token}`);
      if (!res.ok) throw new Error('fetch_failed');
      const pr = await res.json();
      if (!pr.exists) throw new Error('no_profile');
      profile = { ...defaultProfile(), ...pr.profile };
      saveProfile();
      if (typeof reEquipShip === 'function') reEquipShip();
      if (typeof renderDailySplash === 'function') renderDailySplash();
      if (typeof renderFactionSplash === 'function') renderFactionSplash();
      if (typeof renderLeaderboardSplash === 'function') renderLeaderboardSplash();
      if (nameInput && profile.name) nameInput.value = profile.name;
      redeemResult.textContent = '✓  Profil muvaffaqiyatli tiklandi!';
      redeemResult.classList.add('ok');
      setTimeout(close, 2200);
    } catch (e) {
      redeemBtn.disabled = false;
      redeemBtn.textContent = '▶  TIKLASH';
      const msg = {
        'bad_code':   'Kod noto\'g\'ri (8 belgi kerak)',
        'not_found':  'Kod topilmadi yoki muddati tugagan',
        'cooldown':   '5s kuting va qayta urinib ko\'ring',
        'fetch_failed': 'Profilni yuklashda xato',
        'no_profile': 'Profile topilmadi',
      }[e.message] || `Xatolik: ${e.message}`;
      redeemResult.textContent = '✗  ' + msg;
      redeemResult.classList.add('err');
    }
  });
}

// Periodic background sync (every 60s if dirty)
let lastProfileHash = '';
setInterval(() => {
  try {
    const h = JSON.stringify(profile);
    if (h !== lastProfileHash) {
      lastProfileHash = h;
      scheduleCloudSync();
    }
  } catch {}
}, 60_000);

// Sync ship variant with loaded profile (was built with default before profile loaded)
if (typeof reEquipShip === 'function' && profile.equippedShip !== 'vanguard') {
  reEquipShip();
}

// ---- Ship variant buy/equip ----
function buyShip(id) {
  if (profile.ownedShips.includes(id)) return false;
  const variant = getShipVariant(id);
  if (!variant || variant.cost <= 0) return false;
  if ((profile.credits || 0) < variant.cost) return false;
  profile.credits -= variant.cost;
  profile.ownedShips.push(id);
  saveProfile();
  if (typeof SFX !== 'undefined' && SFX.pickup) SFX.pickup();
  return true;
}
function equipShip(id) {
  if (!profile.ownedShips.includes(id)) return false;
  if (profile.equippedShip === id) return true;
  profile.equippedShip = id;
  saveProfile();
  reEquipShip();
  return true;
}

function unlockAchievement(id) {
  if (profile.achievements[id]) return false;
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return false;
  profile.achievements[id] = new Date().toISOString();
  saveProfile();
  showAchievementToast(ach);
  return true;
}

function showAchievementToast(ach) {
  const t = document.createElement('div');
  t.className = 'ach-toast';
  t.innerHTML = `
    <div class="icon">${ach.icon}</div>
    <div>
      <div class="label">YUTUQ OCHILDI</div>
      <div class="name">${ach.name}</div>
      <div class="desc">${ach.desc}</div>
    </div>
  `;
  document.body.appendChild(t);
  // Animate in
  requestAnimationFrame(() => t.classList.add('show'));
  // Remove after 4.5s
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 600);
  }, 4500);
  if (typeof SFX !== 'undefined') SFX.pickup();
}

// ---- Stat tracking hooks ----
let runStartTime = 0;
let dzInsideTime = 0;       // accumulated seconds inside Dark Zone in current run
let runModulesFound = 0;    // modules collected in current run

function startRunTracking() {
  runStartTime = performance.now();
  dzInsideTime = 0;
  runModulesFound = 0;
  unlockAchievement('first_flight');
  if (typeof dailyOnRunStart === 'function') dailyOnRunStart();
}

// Called every frame to track DZ time + check progressive achievements
function tickProfile(dt) {
  if (!state.alive) return;
  if (DARK_ZONE && DARK_ZONE.inside) {
    dzInsideTime += dt;
    if (dzInsideTime >= 20) unlockAchievement('dark_zone');
    if (typeof bumpDaily === 'function') bumpDaily('dz_time', dt);
  }
}

// Apply purchased upgrades to current ship state
function applyUpgrades() {
  // Reset to defaults first (in case re-applying)
  state.maxHull = 100; state.maxFuel = 100; state.maxBatt = 100; state.maxO2 = 100;
  state.solarMult = 1.0; state.weaponCoolMult = 1.0; state.ammoMult = 1.0;
  for (const u of UPGRADES) {
    const lvl = profile.upgrades[u.id] || 0;
    if (lvl > 0) u.apply(state, lvl);
  }
  // Apply ammo multiplier to base counts
  if (state.ammo) {
    state.ammo[1] = Math.floor(12 * state.ammoMult);
    state.ammo[2] = Math.floor(8 * state.ammoMult);
  }
  // Top up to new max
  state.hull = state.maxHull; state.fuel = state.maxFuel;
  state.batt = state.maxBatt; state.o2 = state.maxO2;
}

// ---------- BATTLE PASS — SEASON ----------
// Season cadence: monthly (YYYY-MM). Earn ships/badges persist via ownedShips/achievements.
function getCurrentBpSeason() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function getDaysLeftInSeason() {
  const d = new Date();
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return Math.max(0, lastDay - d.getDate());
}
function checkBpSeasonReset() {
  const current = getCurrentBpSeason();
  const stored = profile.bpSeasonId || '';
  if (stored === current) return false;
  // First time setting season ID — no notification, no reset
  if (!stored) {
    profile.bpSeasonId = current;
    saveProfile();
    return false;
  }
  // Season has changed — reset progression (keep ownedShips, achievements, credits)
  profile.bpXp = 0;
  profile.bpClaimed = [];
  profile.bpPremium = false;
  profile.bpPremiumClaimed = [];
  profile.bpSeasonId = current;
  saveProfile();
  return true; // Caller should show notification
}

function showSeasonResetModal() {
  if (document.getElementById('bp-season-reset')) return;
  const ov = document.createElement('div');
  ov.id = 'bp-season-reset';
  ov.innerHTML = `
    <div class="bsr-inner">
      <div class="bsr-icon">★</div>
      <div class="bsr-title">${t('bp.seasonResetTitle')}</div>
      <div class="bsr-season">${t('bp.season', { id: profile.bpSeasonId })}</div>
      <div class="bsr-desc">${t('bp.seasonResetDesc')}</div>
      <button class="bsr-btn">${t('bp.seasonResetCta')}</button>
    </div>
  `;
  document.body.appendChild(ov);
  ov.querySelector('.bsr-btn').addEventListener('click', () => ov.remove());
  ov.addEventListener('click', (e) => { if (e.target === ov) ov.remove(); });
}

// ---------- BATTLE PASS (XP + tier rewards) ----------
const BP_TIER_COUNT = 20;
const BP_TIERS = (() => {
  const arr = [];
  for (let i = 1; i <= BP_TIER_COUNT; i++) {
    // Cumulative XP requirement: T1=125, T5=1125, T10=3500, T20=12000
    const xpReq = 100 * i + 25 * i * i;
    let credits = 100 + i * 30;
    let unlock = null;
    let label = `${credits}⬢`;
    if (i === 5)  { unlock = { type: 'badge', id: 'bronze_wings', name: 'BRONZE WINGS', icon: '🥉' }; }
    if (i === 10) { unlock = { type: 'badge', id: 'silver_wings', name: 'SILVER WINGS', icon: '🥈' }; credits = 1500; label = '1500⬢'; }
    if (i === 15) { unlock = { type: 'badge', id: 'gold_wings', name: 'GOLD WINGS', icon: '🥇' }; credits = 2000; label = '2000⬢'; }
    if (i === 20) { unlock = { type: 'ship', id: 'phoenix', name: 'PHOENIX SHIP', icon: '★' }; credits = 0; label = 'PHOENIX'; }
    arr.push({ tier: i, xpReq, credits, unlock, label });
  }
  return arr;
})();

const BP_PREMIUM_COST = 5000;
// Premium track: each tier has an additional bonus reward
const BP_PREMIUM_TIERS = (() => {
  const arr = [];
  for (let i = 1; i <= BP_TIER_COUNT; i++) {
    let credits = 200 + i * 50; // bigger than free
    let unlock = null;
    let label = `${credits}⬢`;
    if (i === 3)  { unlock = { type: 'badge', id: 'premium_initiate', name: 'INITIATE', icon: '✦' }; }
    if (i === 7)  { unlock = { type: 'badge', id: 'premium_voyager',  name: 'VOYAGER',  icon: '⚡' }; }
    if (i === 12) { unlock = { type: 'badge', id: 'premium_corsair',  name: 'CORSAIR',  icon: '⚔' }; }
    if (i === 17) { unlock = { type: 'badge', id: 'premium_legend',   name: 'LEGEND',   icon: '☄' }; }
    if (i === 20) { unlock = { type: 'badge', id: 'premium_master', name: 'STAR MASTER', icon: '👑' }; credits = 5000; label = '5000⬢ + MASTER'; }
    arr.push({ tier: i, credits, unlock, label });
  }
  return arr;
})();

function unlockBpPremium() {
  if (profile.bpPremium) return false;
  if ((profile.credits || 0) < BP_PREMIUM_COST) return false;
  profile.credits -= BP_PREMIUM_COST;
  profile.bpPremium = true;
  saveProfile();
  if (typeof aidaSay === 'function') aidaSay(`★ PREMIUM BATTLE PASS faollashtirildi! Barcha tier'lardan qo'shimcha mukofotlar.`, 6000);
  if (typeof SFX !== 'undefined' && SFX.pickup) SFX.pickup();
  return true;
}

function isBpPremiumClaimable(tierIdx) {
  if (!profile.bpPremium) return false;
  if (tierIdx < 0 || tierIdx >= BP_TIER_COUNT) return false;
  if ((profile.bpPremiumClaimed || []).includes(tierIdx)) return false;
  return (profile.bpXp || 0) >= BP_TIERS[tierIdx].xpReq;
}
function claimBpPremiumTier(tierIdx) {
  if (!isBpPremiumClaimable(tierIdx)) return false;
  const tier = BP_PREMIUM_TIERS[tierIdx];
  if (!profile.bpPremiumClaimed) profile.bpPremiumClaimed = [];
  profile.bpPremiumClaimed.push(tierIdx);
  if (tier.credits > 0) addCredits(tier.credits, `BP PREMIUM T${tier.tier}`);
  if (tier.unlock && tier.unlock.type === 'ship') {
    if (!profile.ownedShips.includes(tier.unlock.id)) profile.ownedShips.push(tier.unlock.id);
  }
  saveProfile();
  return true;
}
function hasUnclaimedBpPremiumTier() {
  if (!profile.bpPremium) return false;
  for (let i = 0; i < BP_TIER_COUNT; i++) if (isBpPremiumClaimable(i)) return true;
  return false;
}

function getBpLevel() {
  // Highest tier whose xpReq is met
  let lvl = 0;
  for (const t of BP_TIERS) {
    if ((profile.bpXp || 0) >= t.xpReq) lvl = t.tier;
    else break;
  }
  return lvl;
}
function getBpProgress() {
  const xp = profile.bpXp || 0;
  const lvl = getBpLevel();
  if (lvl >= BP_TIER_COUNT) return { lvl, xp, prevXp: BP_TIERS[BP_TIER_COUNT - 1].xpReq, nextXp: BP_TIERS[BP_TIER_COUNT - 1].xpReq, pct: 1 };
  const prevXp = lvl > 0 ? BP_TIERS[lvl - 1].xpReq : 0;
  const nextXp = BP_TIERS[lvl].xpReq;
  const pct = Math.max(0, Math.min(1, (xp - prevXp) / (nextXp - prevXp || 1)));
  return { lvl, xp, prevXp, nextXp, pct };
}
function isBpTierClaimable(tierIdx) {
  if (tierIdx < 0 || tierIdx >= BP_TIER_COUNT) return false;
  if ((profile.bpClaimed || []).includes(tierIdx)) return false;
  return (profile.bpXp || 0) >= BP_TIERS[tierIdx].xpReq;
}
function hasUnclaimedBpTier() {
  for (let i = 0; i < BP_TIER_COUNT; i++) {
    if (isBpTierClaimable(i)) return true;
  }
  return false;
}
function claimBpTier(tierIdx) {
  if (!isBpTierClaimable(tierIdx)) return false;
  const tier = BP_TIERS[tierIdx];
  if (!profile.bpClaimed) profile.bpClaimed = [];
  profile.bpClaimed.push(tierIdx);
  if (tier.credits > 0) {
    addCredits(tier.credits, `BP TIER ${tier.tier}`);
  }
  if (tier.unlock) {
    if (tier.unlock.type === 'ship') {
      if (!profile.ownedShips.includes(tier.unlock.id)) {
        profile.ownedShips.push(tier.unlock.id);
      }
    } else if (tier.unlock.type === 'badge') {
      // Badges are stored implicitly via claimed array (rendered in stats)
    }
  }
  saveProfile();
  return true;
}

let bpXpToastTimer = null;
let bpXpAccum = 0;
function showBpXpToast(amount) {
  bpXpAccum += amount;
  let toast = document.getElementById('bp-xp-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bp-xp-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = `+${bpXpAccum} XP`;
  toast.classList.remove('show');
  void toast.offsetWidth; // restart animation
  toast.classList.add('show');
  if (bpXpToastTimer) clearTimeout(bpXpToastTimer);
  bpXpToastTimer = setTimeout(() => {
    bpXpAccum = 0;
    toast.classList.remove('show');
  }, 1800);
}

// Buddy boost: +25% BP XP when at least 1 friend is nearby (within range)
const BUDDY_BOOST_RANGE = 600;          // world units (AoI ~ 1200, this is half)
const BUDDY_BOOST_RANGE_SQ = BUDDY_BOOST_RANGE * BUDDY_BOOST_RANGE;
const BUDDY_BOOST_MULT = 1.25;          // +25%
let buddyBoostActive = false;
let buddyBoostBuddyName = '';
function checkBuddyBoost() {
  if (!profile.friends || profile.friends.length === 0) {
    buddyBoostActive = false; buddyBoostBuddyName = '';
    return false;
  }
  let active = false;
  let name = '';
  for (const o of otherPlayers.values()) {
    if (!o.code || !isCodeMyFriend(o.code)) continue;
    const d2 = state.pos.distanceToSquared(o.mesh.position);
    if (d2 <= BUDDY_BOOST_RANGE_SQ) { active = true; name = o.name; break; }
  }
  if (active !== buddyBoostActive) {
    buddyBoostActive = active;
    buddyBoostBuddyName = name;
    renderBuddyBoostHud();
    if (active && typeof SFX !== 'undefined' && SFX.notify) SFX.notify();
  } else if (active && name !== buddyBoostBuddyName) {
    buddyBoostBuddyName = name;
    renderBuddyBoostHud();
  }
  return active;
}
function renderBuddyBoostHud() {
  let el = document.getElementById('buddy-boost-hud');
  if (!buddyBoostActive) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('div');
    el.id = 'buddy-boost-hud';
    document.body.appendChild(el);
  }
  el.innerHTML = `<span class="bb-icon">★</span><span class="bb-text">BUDDY BOOST</span><span class="bb-mult">+25% XP</span><span class="bb-name">${escapeHtml(buddyBoostBuddyName)}</span>`;
}

function addBattleXp(amount, reason) {
  if (!amount || amount < 1) return;
  // Apply buddy boost (check current proximity at award time)
  let boosted = false;
  if (checkBuddyBoost()) {
    amount = Math.round(amount * BUDDY_BOOST_MULT);
    boosted = true;
  }
  const before = getBpLevel();
  profile.bpXp = (profile.bpXp || 0) + amount;
  saveProfile();
  showBpXpToast(amount);
  // Send increment to server for anti-cheat validation
  if (ws && ws.readyState === 1) {
    try { ws.send(JSON.stringify({ type: 'bp-xp-add', delta: amount })); } catch {}
  }
  const after = getBpLevel();
  if (after > before) {
    // Tier up notification (uses AIDA if available)
    const tier = BP_TIERS[after - 1];
    if (typeof aidaSay === 'function') {
      aidaSay(t('bp.tierUp', { tier: after, label: tier.label }), 5000);
    }
    if (typeof SFX !== 'undefined' && SFX.pickup) SFX.pickup();
    if (typeof renderBattlePassSplash === 'function') renderBattlePassSplash();
  }
  return boosted;
}
// Fetch server-side BP XP on startup (anti-cheat sync)
async function syncServerBpXp() {
  const uid = localStorage.getItem('odyssey.cloudUid');
  const token = localStorage.getItem('odyssey.cloudToken');
  if (!uid || !token) return;
  try {
    const r = await fetch(`/api/bp-xp?uid=${uid}&token=${token}`, { cache: 'no-store' });
    if (r.ok) {
      const j = await r.json();
      if (j.ok && typeof j.bpXp === 'number' && j.bpXp > (profile.bpXp || 0)) {
        // Server has higher XP (legit from other sessions), adopt it
        profile.bpXp = j.bpXp;
        saveProfile();
        if (typeof renderBattlePassSplash === 'function') renderBattlePassSplash();
      }
    }
  } catch {}
}
// Sync shortly after boot
setTimeout(syncServerBpXp, 2000);
// Periodic buddy boost check (every 2s) for HUD freshness
setInterval(() => {
  if (splash && splash.style.display !== 'none') return;
  if (!state.alive) return;
  checkBuddyBoost();
}, 2000);

// ---------- FRIEND PING SYSTEM ----------
const PING_DURATION_MS = 8000;
const PING_COOLDOWN_MS = 5000;
let lastPingSentT = 0;
const friendPings = []; // {x,y,z, name, code, t0, el, pos: THREE.Vector3}
function sendFriendPing() {
  if (!ws || ws.readyState !== 1) return;
  const now = performance.now();
  if (now - lastPingSentT < PING_COOLDOWN_MS) {
    aidaSay('⏱ Ping cooldown...', 1500);
    return;
  }
  if (!profile.friends || profile.friends.length === 0) {
    aidaSay("Sizda do'st yo'q. Ping yuborib bo'lmaydi.", 2500);
    return;
  }
  lastPingSentT = now;
  ws.send(JSON.stringify({ type: 'friend-ping' }));
  if (typeof SFX !== 'undefined' && SFX.notify) SFX.notify();
  pushChat('SYSTEM', '📡 Ping do\'stlarga yuborildi', '#7cffb1');
}
function addFriendPing(m) {
  // Avoid duplicate pings from same source within 1s
  const now = performance.now();
  for (let i = friendPings.length - 1; i >= 0; i--) {
    if (friendPings[i].fromUid === m.fromUid && now - friendPings[i].t0 < 1000) return;
  }
  const el = document.createElement('div');
  el.className = 'friend-ping';
  el.innerHTML = `<div class="fp-arrow">▲</div><div class="fp-name">${escapeHtml(m.fromName || 'Friend')}</div><div class="fp-dist"></div>`;
  document.body.appendChild(el);
  friendPings.push({
    fromUid: m.fromUid,
    name: m.fromName || 'Friend',
    code: m.fromCode || '',
    pos: new THREE.Vector3(+m.x || 0, +m.y || 0, +m.z || 0),
    t0: now,
    el,
  });
  if (typeof SFX !== 'undefined' && SFX.notify) SFX.notify();
  aidaSay(`📡 ${m.fromName} sizni chaqirmoqda!`, 4000);
}
const _pingProjTmp = new THREE.Vector3();
function updateFriendPings() {
  if (!friendPings.length) return;
  const now = performance.now();
  for (let i = friendPings.length - 1; i >= 0; i--) {
    const p = friendPings[i];
    const age = now - p.t0;
    if (age >= PING_DURATION_MS) {
      p.el.remove();
      friendPings.splice(i, 1);
      continue;
    }
    // Fade
    const fade = age < 500 ? age / 500 : (age > PING_DURATION_MS - 1000 ? (PING_DURATION_MS - age) / 1000 : 1);
    p.el.style.opacity = fade.toFixed(2);
    // Project to screen
    _pingProjTmp.copy(p.pos);
    const onScreen = projectToScreen(_pingProjTmp, _pingProjTmp);
    placeMarker(p.el, _pingProjTmp, onScreen);
    // Compute distance from player
    const dist = state.pos.distanceTo(p.pos);
    const distEl = p.el.querySelector('.fp-dist');
    if (distEl) distEl.textContent = `${dist.toFixed(0)}u`;
    // Rotate arrow toward target if off-screen
    const arrow = p.el.querySelector('.fp-arrow');
    if (arrow) {
      if (!onScreen) {
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        const ang = Math.atan2(_pingProjTmp.y - cy, _pingProjTmp.x - cx) * 180 / Math.PI + 90;
        arrow.style.transform = `rotate(${ang}deg)`;
        arrow.style.opacity = '1';
      } else {
        arrow.style.transform = 'rotate(0deg)';
        arrow.style.opacity = '0.4';
      }
    }
  }
}

// Award credits and update HUD/stats
function addCredits(amount, reason) {
  if (!amount) return;
  profile.credits = (profile.credits || 0) + amount;
  saveProfile();
  showCreditPop(amount, reason);
}
function showCreditPop(amount, reason) {
  const el = document.createElement('div');
  el.className = 'credit-pop';
  el.textContent = `+${amount}⬢  ${reason || ''}`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 500); }, 1800);
}

// Try to buy upgrade
function buyUpgrade(id) {
  const up = UPGRADES.find(u => u.id === id);
  if (!up) return false;
  const lvl = profile.upgrades[id] || 0;
  if (lvl >= up.maxLevel) return false;
  const cost = up.costs[lvl];
  if ((profile.credits || 0) < cost) return false;
  profile.credits -= cost;
  profile.upgrades[id] = lvl + 1;
  saveProfile();
  if (typeof SFX !== 'undefined') SFX.pickup();
  return true;
}

// Hook from kill events
function profileOnKill(kindKey) {
  profile.totalKills += 1;
  const reward = kindKey === 'tank' ? 25 : kindKey === 'interceptor' ? 14 : 8;
  const label = kindKey === 'tank' ? 'Tank' : kindKey === 'interceptor' ? 'Interceptor' : 'Scout';
  addCredits(reward, label);
  const xp = kindKey === 'tank' ? 25 : kindKey === 'interceptor' ? 14 : 8;
  addBattleXp(xp, 'kill');
  saveProfile();
  if (typeof dailyOnKill === 'function') dailyOnKill(kindKey);
  if (profile.totalKills >= 5)  unlockAchievement('pirate_5');
  if (profile.totalKills >= 25) unlockAchievement('pirate_25');
  // Buddy boost killed achievement
  if (typeof buddyBoostActive !== 'undefined' && buddyBoostActive) {
    profile.buddyKills = (profile.buddyKills || 0) + 1;
    unlockAchievement('buddy_kill');
  }
}
function profileOnModule(isFinal) {
  profile.totalModulesFound += 1;
  runModulesFound += 1;
  addCredits(isFinal ? 80 : 35, 'modul');
  addBattleXp(isFinal ? 100 : 50, 'module');
  saveProfile();
  if (typeof dailyOnModule === 'function') dailyOnModule();
  unlockAchievement('first_module');
  if (runModulesFound >= 7) unlockAchievement('all_modules');
  // probes: check after — handled in profileOnProbe
}
function profileOnProbe() {
  addCredits(40, 'zond');
  addBattleXp(30, 'probe');
  if (typeof bumpDaily === 'function') bumpDaily('probe', 1);
  if (probeObjects.filter(o => o.visited).length >= probeObjects.length) {
    unlockAchievement('all_probes');
  }
}
function profileOnTradeAccepted() {
  addCredits(20, 'trade');
  addBattleXp(20, 'trade');
  unlockAchievement('trade');
}
function profileOnBossKilled() {
  addCredits(500, 'BOSS');
  addBattleXp(300, 'boss');
  if (typeof bumpDaily === 'function') bumpDaily('boss', 1);
  unlockAchievement('boss');
}
function profileOnSosRescued() {
  addCredits(75, 'qutqarish');
  addBattleXp(50, 'rescue');
  if (typeof bumpDaily === 'function') bumpDaily('rescue', 1);
}
function profileOnSalvage() {
  addCredits(10, 'salvage');
  addBattleXp(8, 'salvage');
  if (typeof bumpDaily === 'function') bumpDaily('salvage', 1);
}
function profileOnDeath() {
  profile.totalDeaths += 1;
  if (runStartTime > 0) {
    profile.totalPlaytimeSec += (performance.now() - runStartTime) / 1000;
    runStartTime = performance.now(); // reset for next attempt
  }
  saveProfile();
  if (typeof dailyOnDeath === 'function') dailyOnDeath();
}
function profileOnWin() {
  profile.totalWins += 1;
  addCredits(300, "G'ALABA");
  addBattleXp(1000, 'win');
  if (typeof bumpDaily === 'function') bumpDaily('win', 1);
  const elapsed = runStartTime > 0 ? (performance.now() - runStartTime) / 1000 : 0;
  profile.totalPlaytimeSec += elapsed;
  if (profile.bestTimeSec == null || elapsed < profile.bestTimeSec) {
    profile.bestTimeSec = elapsed;
  }
  saveProfile();
  unlockAchievement('win');
  // Submit to global leaderboard (best-effort, no UI blocking)
  submitLeaderboard({
    name: profile.name || 'Pilot',
    timeSec: Math.round(elapsed),
    modules: state.modules ? state.modules.size : 7,
    kills: profile.totalKills,
    credits: profile.credits,
  });
}

// ---- Global Leaderboard (server-backed) ----
let leaderboardCache = [];
let lastLbFetch = 0;
async function fetchLeaderboard(force = false) {
  const now = Date.now();
  if (!force && now - lastLbFetch < 30_000 && leaderboardCache.length) return leaderboardCache;
  try {
    const r = await fetch('/api/leaderboard', { cache: 'no-store' });
    if (!r.ok) return leaderboardCache;
    const j = await r.json();
    if (j && Array.isArray(j.entries)) {
      leaderboardCache = j.entries;
      lastLbFetch = now;
    }
  } catch {}
  return leaderboardCache;
}
async function submitLeaderboard(entry) {
  try {
    const r = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    const j = await r.json().catch(() => ({}));
    if (j && j.ok && j.rank) {
      pushChat('LEADERBOARD', `Reytingda #${j.rank}-o'rin!`, '#ffd060');
    }
    // Refresh cache for next splash open
    fetchLeaderboard(true);
  } catch {}
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

let lbCurrentTab = 'global'; // 'global' | 'friends'
async function renderLeaderboardSplash() {
  if (!splash) return;
  let panel = document.getElementById('lb-splash');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'lb-splash';
    splash.appendChild(panel);
  }
  panel.innerHTML = `<div class="lb-title">${t('splash.leaderboard')} <span class="lb-sub">(...)</span></div>`;
  const entries = await fetchLeaderboard();
  if (!entries.length) {
    panel.innerHTML = `
      <div class="lb-title">${t('splash.leaderboard')}</div>
      <div class="lb-empty">${t('splash.leaderboardEmpty')}</div>`;
    return;
  }
  const myName = (profile.name || '').toLowerCase();
  // Build friend-name set (lowercase) for filter
  const friendNames = new Set();
  if (Array.isArray(friendsCache)) for (const f of friendsCache) friendNames.add((f.name || '').toLowerCase());
  // Always include self in friends tab
  if (myName) friendNames.add(myName);
  const hasFriendsTab = friendsCache && friendsCache.length > 0;
  // Filter entries based on tab; if no friends, force global
  if (!hasFriendsTab) lbCurrentTab = 'global';
  const filtered = lbCurrentTab === 'friends'
    ? entries.filter(e => friendNames.has((e.name || '').toLowerCase()))
    : entries;
  const tabsHtml = hasFriendsTab ? `
    <div class="lb-tabs">
      <button class="lb-tab ${lbCurrentTab === 'global' ? 'active' : ''}" data-tab="global">${t('lb.tabGlobal')}</button>
      <button class="lb-tab ${lbCurrentTab === 'friends' ? 'active' : ''}" data-tab="friends">${t('lb.tabFriends')} (${friendsCache.length + 1})</button>
    </div>
  ` : '';
  const rowsHtml = filtered.length === 0
    ? `<div class="lb-empty" style="padding:14px;">${t('lb.noFriendScores')}</div>`
    : `<div class="lb-list">
        ${filtered.slice(0, 10).map((e, i) => `
          <div class="lb-row ${e.name.toLowerCase() === myName ? 'me' : ''} ${friendNames.has(e.name.toLowerCase()) && e.name.toLowerCase() !== myName ? 'friend' : ''}">
            <span class="lb-rank">#${i+1}</span>
            <span class="lb-name">${friendNames.has(e.name.toLowerCase()) && e.name.toLowerCase() !== myName ? '★ ' : ''}${escapeHtml(e.name)}</span>
            <span class="lb-time">${fmtTime(e.timeSec)}</span>
            <span class="lb-mods">${e.modules}✪</span>
            <span class="lb-date">${e.date}</span>
          </div>
        `).join('')}
      </div>`;
  panel.innerHTML = `
    <div class="lb-title">${t('splash.leaderboard')} <span class="lb-sub">${lbCurrentTab === 'friends' ? `friends · ${filtered.length}` : `top ${entries.length}`}</span></div>
    ${tabsHtml}
    ${rowsHtml}
  `;
  panel.querySelectorAll('.lb-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      lbCurrentTab = btn.dataset.tab;
      renderLeaderboardSplash();
    });
  });
}

// ---- Stats screen UI ----
function buildStatsScreen() {
  const overlay = document.createElement('div');
  overlay.id = 'stats-overlay';
  overlay.className = 'stats-overlay';
  overlay.innerHTML = `
    <div class="stats-modal">
      <button class="close-btn" data-close>×</button>
      <div class="title">⬢ PILOT FILE</div>
      <div class="pilot-name">${escapeHtml(profile.name || '— UNNAMED —')}</div>
      <div class="stat-grid">
        <div><span>YIG'ILGAN MODULLAR</span><b>${profile.totalModulesFound}</b></div>
        <div><span>YO'Q QILINGAN QAROQCHILAR</span><b>${profile.totalKills}</b></div>
        <div><span>O'LIMLAR</span><b>${profile.totalDeaths}</b></div>
        <div><span>G'ALABALAR</span><b>${profile.totalWins}</b></div>
        <div><span>ENG YAXSHI VAQT</span><b>${profile.bestTimeSec != null ? formatTime(profile.bestTimeSec) : '—'}</b></div>
        <div><span>UMUMIY VAQT</span><b>${formatTime(profile.totalPlaytimeSec)}</b></div>
        <div><span>CREDITS</span><b style="color:#ffd060;">${profile.credits || 0}⬢</b></div>
        <div><span>BATTLE PASS</span><b style="color:#d8a8ff;">TIER ${getBpLevel()} · ${profile.bpXp || 0} XP</b></div>
        <div><span>DO'STLAR</span><b style="color:#7cffb1;">${(profile.friends || []).length} 👥</b></div>
        <div><span>BUDDY KILLS</span><b style="color:#7cffb1;">${profile.buddyKills || 0} ⚡</b></div>
      </div>
      ${(() => {
        // Earned BP badges (claimed tiers with badge unlocks) — both tracks
        const fClaimed = profile.bpClaimed || [];
        const pClaimed = profile.bpPremiumClaimed || [];
        const freeBadges = BP_TIERS
          .map((tier, idx) => ({ tier, idx, track: 'free' }))
          .filter(({ tier, idx }) => fClaimed.includes(idx) && tier.unlock && tier.unlock.type === 'badge');
        const premBadges = BP_PREMIUM_TIERS
          .map((tier, idx) => ({ tier, idx, track: 'prem' }))
          .filter(({ tier, idx }) => pClaimed.includes(idx) && tier.unlock && tier.unlock.type === 'badge');
        const all = [...freeBadges, ...premBadges];
        if (all.length === 0) return '';
        return `
          <div class="ach-title">BATTLE PASS BADGES (${all.length})</div>
          <div class="bp-badge-row">
            ${all.map(({ tier, track }) => `
              <div class="bp-badge ${track === 'prem' ? 'is-prem' : ''}" title="Tier ${tier.tier} ${track === 'prem' ? 'PREMIUM' : 'free'} reward">
                <div class="bp-badge-icon">${tier.unlock.icon}</div>
                <div class="bp-badge-name">${tier.unlock.name}</div>
                <div class="bp-badge-tier">T${tier.tier}${track === 'prem' ? ' ⬡' : ''}</div>
              </div>
            `).join('')}
          </div>
        `;
      })()}
      <div class="ach-title">YUTUQLAR (${Object.keys(profile.achievements).length}/${ACHIEVEMENTS.length})</div>
      <div class="ach-grid">
        ${ACHIEVEMENTS.map(a => {
          const unlocked = !!profile.achievements[a.id];
          return `
            <div class="ach-card ${unlocked ? 'unlocked' : 'locked'}">
              <div class="icon">${unlocked ? a.icon : '?'}</div>
              <div class="info">
                <div class="name">${unlocked ? a.name : '???'}</div>
                <div class="desc">${unlocked ? a.desc : 'Yopiq'}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.dataset.close !== undefined) {
      overlay.remove();
    }
  });
}
function formatTime(sec) {
  if (!sec || sec < 1) return '—';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}m ${s}s`;
}

// ---- Shop screen UI ----
function buildShopScreen(initialTab = 'upgrades') {
  // Remove any existing
  const existing = document.getElementById('shop-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'shop-overlay';
  overlay.className = 'stats-overlay';
  let activeTab = initialTab;

  const renderUpgrades = () => `
    <div class="ach-grid">
      ${UPGRADES.map(u => {
        const lvl = profile.upgrades[u.id] || 0;
        const max = u.maxLevel;
        const next = lvl < max ? u.costs[lvl] : null;
        const canAfford = next != null && (profile.credits || 0) >= next;
        const dots = Array.from({length: max}, (_, i) =>
          `<span class="dot ${i < lvl ? 'on' : ''}"></span>`
        ).join('');
        return `
          <div class="ach-card ${lvl > 0 ? 'unlocked' : 'locked'}" style="grid-column: 1 / -1;">
            <div class="icon">${u.icon}</div>
            <div class="info" style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div class="name">${u.name}</div>
                <div class="level-dots">${dots}</div>
              </div>
              <div class="desc">${u.desc}</div>
              <div style="margin-top:6px;">
                ${next != null
                  ? `<button class="buy-btn ${canAfford ? '' : 'disabled'}" data-buy="${u.id}" ${canAfford ? '' : 'disabled'}>
                      BUY  •  ${next}⬢  →  Lvl ${lvl + 1}/${max}
                    </button>`
                  : `<span style="color:#7cffb1; font-size:11px; letter-spacing:2px;">★ MAX DARAJA</span>`}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="margin-top:14px; font-size:10px; opacity:0.55; text-align:center;">
      Yangilanishlar runs orasida saqlanadi · Credits qaroqchi/modul/zond/g'alaba uchun beriladi
    </div>
  `;

  const renderShips = () => `
    <div class="ship-grid">
      ${SHIP_VARIANTS.map(v => {
        const owned = profile.ownedShips.includes(v.id);
        const equipped = profile.equippedShip === v.id;
        const canAfford = !owned && (profile.credits || 0) >= v.cost;
        const accentHex = '#' + v.defaultColors[1].toString(16).padStart(6, '0');
        return `
          <div class="ship-card ${equipped ? 'equipped' : (owned ? 'owned' : 'locked')}" style="--accent:${accentHex};">
            <div class="ship-preview" data-ship-preview="${v.id}">
              <div class="ship-fallback" style="color:${accentHex};">◆ ${v.name}</div>
            </div>
            <div class="ship-info">
              <div class="ship-name" style="color:${accentHex};">${v.name}</div>
              <div class="ship-tag">${v.tag}</div>
              <div class="ship-desc">${v.desc}</div>
              <div class="ship-cta">
                ${equipped
                  ? `<span class="ship-status equipped">★ EQUIPPED</span>`
                  : owned
                    ? `<button class="buy-btn" data-equip="${v.id}">EQUIP</button>`
                    : `<button class="buy-btn ${canAfford ? '' : 'disabled'}" data-buy-ship="${v.id}" ${canAfford ? '' : 'disabled'}>
                        BUY • ${v.cost}⬢
                      </button>`}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="margin-top:14px; font-size:10px; opacity:0.55; text-align:center;">
      Kemalar — kosmetik. Statlarga ta'sir qilmaydi · Fraksiya rangi accent'ni o'zgartiradi
    </div>
  `;

  const renderShop = () => {
    overlay.innerHTML = `
      <div class="stats-modal">
        <button class="close-btn" data-close>×</button>
        <div class="title">⬢ SHIPYARD</div>
        <div class="pilot-name">CREDITS: <b style="color:#ffd060;">${profile.credits || 0}⬢</b></div>
        <div class="shop-tabs">
          <button class="shop-tab ${activeTab === 'upgrades' ? 'active' : ''}" data-tab="upgrades">⛨ UPGRADES</button>
          <button class="shop-tab ${activeTab === 'ships' ? 'active' : ''}" data-tab="ships">◆ SHIPS</button>
        </div>
        ${activeTab === 'upgrades' ? renderUpgrades() : renderShips()}
      </div>
    `;
    // Tab switch
    overlay.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        activeTab = btn.dataset.tab;
        renderShop();
      });
    });
    // Wire upgrade buttons
    overlay.querySelectorAll('[data-buy]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (buyUpgrade(btn.dataset.buy)) renderShop();
      });
    });
    // Wire ship buy
    overlay.querySelectorAll('[data-buy-ship]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (buyShip(btn.dataset.buyShip)) {
          equipShip(btn.dataset.buyShip);
          renderShop();
        }
      });
    });
    // Wire ship equip
    overlay.querySelectorAll('[data-equip]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (equipShip(btn.dataset.equip)) {
          if (typeof SFX !== 'undefined' && SFX.pickup) SFX.pickup();
          renderShop();
        }
      });
    });
    // Render 3D ship previews
    if (activeTab === 'ships') {
      overlay.querySelectorAll('[data-ship-preview]').forEach(slot => {
        renderShipPreview(slot, slot.dataset.shipPreview);
      });
    }
    overlay.querySelector('[data-close]').addEventListener('click', () => overlay.remove());
  };
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  renderShop();
  document.body.appendChild(overlay);
}

// Render a small spinning 3D preview of a ship variant inside a slot element
function renderShipPreview(slot, variantId) {
  const variant = getShipVariant(variantId);
  if (!variant) return;
  const w = 180, h = 110;
  const renderer2 = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer2.setSize(w, h);
  renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer2.setClearColor(0x000000, 0);
  const scene2 = new THREE.Scene();
  const cam2 = new THREE.PerspectiveCamera(40, w / h, 0.1, 200);
  cam2.position.set(0, 4, 18);
  cam2.lookAt(0, 0, 0);
  // Lights
  scene2.add(new THREE.AmbientLight(0xaabbcc, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 8, 6);
  scene2.add(dir);
  // Ship
  const ship = variant.builder(variant.defaultColors[0], variant.defaultColors[1]);
  ship.scale.set(0.85, 0.85, 0.85);
  scene2.add(ship);
  // Mount canvas
  slot.innerHTML = '';
  slot.appendChild(renderer2.domElement);
  // Spin animation
  let rafId;
  const spin = () => {
    ship.rotation.y += 0.012;
    ship.rotation.x = Math.sin(performance.now() * 0.0008) * 0.15;
    renderer2.render(scene2, cam2);
    rafId = requestAnimationFrame(spin);
  };
  spin();
  // Cleanup when slot removed from DOM
  const obs = new MutationObserver(() => {
    if (!document.body.contains(slot)) {
      cancelAnimationFrame(rafId);
      renderer2.dispose();
      obs.disconnect();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

// ---- SETTINGS APPLY + PAUSE MENU ----
function applySettings() {
  const s = profile.settings || defaultProfile().settings;
  // Apply audio volumes (master sub-channels)
  if (typeof masterGain !== 'undefined' && masterGain && audioCtx) {
    masterGain.gain.linearRampToValueAtTime(sfxMuted ? 0 : s.sfxVolume, audioCtx.currentTime + 0.05);
  }
  if (typeof musicNodes !== 'undefined' && musicNodes && musicNodes.musicGain && audioCtx) {
    musicNodes.musicGain.gain.linearRampToValueAtTime(musicMuted ? 0 : s.musicVolume, audioCtx.currentTime + 0.05);
  }
  // Apply bloom toggle
  if (typeof bloomPass !== 'undefined' && bloomPass) {
    bloomPass.enabled = !!s.bloomOn;
  }
  // FOV applied per-frame in updateCamera (reads profile.settings.fov)
  // Sensitivity applied per-frame in handleControls
}

state.paused = false;
function openPauseMenu() {
  if (!state.alive || state.launching || splash.style.display !== 'none') return;
  if (state.paused) return;
  state.paused = true;
  document.exitPointerLock?.();
  if (typeof setEngineLevel === 'function') setEngineLevel(false, false);
  buildPauseMenu();
}
function closePauseMenu() {
  state.paused = false;
  const o = document.getElementById('pause-overlay');
  if (o) o.remove();
}

function buildPauseMenu() {
  const existing = document.getElementById('pause-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'pause-overlay';
  overlay.className = 'stats-overlay';
  const s = profile.settings;
  overlay.innerHTML = `
    <div class="stats-modal" style="min-width: 480px;">
      <button class="close-btn" data-close>×</button>
      <div class="title">⏸ PAUSED</div>
      <div class="pilot-name">${escapeHtml(state.name || 'PILOT')}</div>
      <div class="stat-grid" style="grid-template-columns: 1fr;">
        <label class="setting-row">
          <span>FIELD OF VIEW: <b id="fovVal">${s.fov}°</b></span>
          <input type="range" min="50" max="90" step="1" id="fovSlider" value="${s.fov}">
        </label>
        <label class="setting-row">
          <span>MOUSE SENSITIVITY: <b id="sensVal">${s.sensitivity.toFixed(2)}x</b></span>
          <input type="range" min="0.3" max="2.5" step="0.05" id="sensSlider" value="${s.sensitivity}">
        </label>
        <label class="setting-row">
          <span>SFX VOLUME: <b id="sfxVal">${Math.round(s.sfxVolume * 100)}%</b></span>
          <input type="range" min="0" max="1" step="0.05" id="sfxSlider" value="${s.sfxVolume}">
        </label>
        <label class="setting-row">
          <span>MUSIC VOLUME: <b id="musicVal">${Math.round(s.musicVolume * 100)}%</b></span>
          <input type="range" min="0" max="1" step="0.05" id="musicSlider" value="${s.musicVolume}">
        </label>
        <label class="setting-row">
          <span>BLOOM POSTPROCESS</span>
          <input type="checkbox" id="bloomToggle" ${s.bloomOn ? 'checked' : ''}>
        </label>
      </div>
      <div style="display:flex; gap:8px; margin-top:14px; justify-content:center; flex-wrap:wrap;">
        <button class="buy-btn" data-resume>▶ RESUME</button>
        <button class="buy-btn" data-shop>⛨ SHIPYARD</button>
        <button class="buy-btn" data-stats>⬢ PILOT FILE</button>
        <button class="buy-btn" data-tutorial>? TUTORIAL</button>
      </div>
      <div style="margin-top:10px; font-size:10px; opacity:0.55; text-align:center;">
        Press [P] yoki [Esc] yopish · sozlamalar avtomatik saqlanadi
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const slider = (id, valId, key, fmt, applyExtra) => {
    const el = overlay.querySelector('#' + id);
    el.addEventListener('input', () => {
      const v = parseFloat(el.value);
      profile.settings[key] = v;
      const valEl = overlay.querySelector('#' + valId);
      if (valEl) valEl.textContent = fmt(v);
      saveProfile();
      applySettings();
      if (applyExtra) applyExtra(v);
    });
  };
  slider('fovSlider', 'fovVal', 'fov', v => `${v|0}°`);
  slider('sensSlider', 'sensVal', 'sensitivity', v => `${v.toFixed(2)}x`);
  slider('sfxSlider', 'sfxVal', 'sfxVolume', v => `${Math.round(v*100)}%`);
  slider('musicSlider', 'musicVal', 'musicVolume', v => `${Math.round(v*100)}%`);
  const bloomChk = overlay.querySelector('#bloomToggle');
  bloomChk.addEventListener('change', () => {
    profile.settings.bloomOn = bloomChk.checked;
    saveProfile();
    applySettings();
  });

  overlay.querySelector('[data-close]').addEventListener('click', closePauseMenu);
  overlay.querySelector('[data-resume]').addEventListener('click', closePauseMenu);
  overlay.querySelector('[data-shop]').addEventListener('click', () => {
    closePauseMenu();
    buildShopScreen();
  });
  overlay.querySelector('[data-stats]').addEventListener('click', () => {
    closePauseMenu();
    buildStatsScreen();
  });
  overlay.querySelector('[data-tutorial]').addEventListener('click', () => {
    closePauseMenu();
    // Clear any active tutorial UI without setting tutorialDone
    if (tutorialEl) { tutorialEl.remove(); tutorialEl = null; }
    tutorialIdx = -1;
    profile.tutorialDone = false;
    saveProfile();
    setTimeout(() => startTutorial(), 200);
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePauseMenu();
  });
}

// ---- DAILY CHALLENGES ----
const DAILY_TEMPLATES = [
  { id: 'kills_10',         name: "10 qaroqchini yo'q qiling",      target: 10, reward: 75,  hook: 'kill', icon: '☠' },
  { id: 'modules_3_run',    name: "Bir runda 3 modul yig'ing",      target: 3,  reward: 80,  hook: 'module_run', icon: '✪' },
  { id: 'salvage_5',        name: "5 ta salvage toping",            target: 5,  reward: 60,  hook: 'salvage', icon: '◫' },
  { id: 'rescue_sos',       name: "Distress signalga javob bering", target: 1,  reward: 100, hook: 'rescue', icon: '✚' },
  { id: 'survive_dz_30',    name: "Dark Zone'da 30s tirik qoling",  target: 30, reward: 90,  hook: 'dz_time', icon: '☼' },
  { id: 'kill_tank_2',      name: "2 ta Tank yo'q qiling",          target: 2,  reward: 120, hook: 'kill_tank', icon: '⛟' },
  { id: 'kill_intercept_5', name: "5 ta Interceptor yo'q qiling",   target: 5,  reward: 90,  hook: 'kill_interceptor', icon: '➹' },
  { id: 'probes_2',         name: "2 zond toping",                  target: 2,  reward: 70,  hook: 'probe', icon: '◎' },
  { id: 'boss_1',           name: "Bossni yo'q qiling",             target: 1,  reward: 200, hook: 'boss', icon: '⬢' },
  { id: 'win_1',            name: "Genesis bilan g'alaba",          target: 1,  reward: 250, hook: 'win', icon: '★' },
  { id: 'no_death_3',       name: "3 modul, halok bo'lmasdan",      target: 3,  reward: 130, hook: 'module_run_no_death', icon: '◆' },
  { id: 'kills_burst',      name: "Bir runda 8 qaroqchi",           target: 8,  reward: 100, hook: 'kill_run', icon: '☣' },
];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ---------- DAILY LOGIN BONUS (7-day streak cycle) ----------
const LOGIN_REWARDS = [
  { day: 1, credits: 50,   icon: '◆', label: '50⬢' },
  { day: 2, credits: 100,  icon: '◆', label: '100⬢' },
  { day: 3, credits: 150,  icon: '◆', label: '150⬢' },
  { day: 4, credits: 200,  icon: '◆', label: '200⬢' },
  { day: 5, credits: 300,  icon: '✦', label: '300⬢' },
  { day: 6, credits: 400,  icon: '✦', label: '400⬢' },
  { day: 7, credits: 750,  icon: '★', label: '750⬢ JACKPOT' },
];

function checkDailyLoginBonus() {
  const today = todayStr();
  if (profile.lastLoginDate === today) return null; // already claimed
  const yest = yesterdayStr();
  if (profile.lastLoginDate === yest && profile.loginStreak >= 1 && profile.loginStreak < 7) {
    // Continue streak
    profile.loginStreak += 1;
  } else {
    // First-ever, gap, or completed cycle → restart at day 1
    profile.loginStreak = 1;
  }
  profile.lastLoginDate = today;
  const reward = LOGIN_REWARDS[profile.loginStreak - 1];
  // Grant credits
  if (typeof addCredits === 'function') {
    addCredits(reward.credits, `DAILY LOGIN — DAY ${reward.day}`);
  } else {
    profile.credits = (profile.credits || 0) + reward.credits;
  }
  saveProfile();
  return reward;
}

function showLoginBonusModal(reward) {
  if (!reward) return;
  const existing = document.getElementById('login-bonus-modal');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'login-bonus-modal';
  // 7-day calendar visual
  let calHtml = '<div class="lb-cal">';
  for (let i = 0; i < 7; i++) {
    const r = LOGIN_REWARDS[i];
    const claimed = i + 1 < profile.loginStreak;
    const today = i + 1 === profile.loginStreak;
    const upcoming = i + 1 > profile.loginStreak;
    const cls = claimed ? 'claimed' : (today ? 'today' : 'upcoming');
    calHtml += `
      <div class="lb-day ${cls}">
        <div class="lb-day-num">DAY ${r.day}</div>
        <div class="lb-day-icon">${r.icon}</div>
        <div class="lb-day-reward">${r.label}</div>
        ${today ? '<div class="lb-day-badge">TODAY</div>' : ''}
        ${claimed ? '<div class="lb-day-check">✓</div>' : ''}
      </div>
    `;
  }
  calHtml += '</div>';

  overlay.innerHTML = `
    <div class="lb-inner">
      <button class="lb-close" type="button">✕</button>
      <div class="lb-title">${t('login.title')}</div>
      <div class="lb-streak">${t('login.streak', { day: reward.day, streak: profile.loginStreak })}</div>
      ${calHtml}
      <div class="lb-prize">
        <div class="lb-prize-icon">${reward.icon}</div>
        <div class="lb-prize-text">${t('login.received', { n: reward.credits })}</div>
      </div>
      <div class="lb-hint">${t('login.hint')}</div>
      <button class="lb-claim" type="button">${t('login.continue')}</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.querySelector('.lb-close').addEventListener('click', close);
  overlay.querySelector('.lb-claim').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  if (typeof SFX !== 'undefined' && SFX.pickup) SFX.pickup();
}

function ensureDailyChallenges() {
  const today = todayStr();
  if (profile.dailyDate === today && profile.dailyChallenges && profile.dailyChallenges.length === 3) return;
  // Generate 3 random unique challenges
  const pool = DAILY_TEMPLATES.slice();
  const picks = [];
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picks.push(pool.splice(idx, 1)[0]);
  }
  profile.dailyDate = today;
  profile.dailyChallenges = picks.map(t => ({
    id: t.id, name: t.name, target: t.target, reward: t.reward,
    hook: t.hook, icon: t.icon, progress: 0, claimed: false,
  }));
  // Run-scoped trackers reset
  dailyRunKills = 0;
  dailyRunModules = 0;
  dailyRunDeathFlag = false;
  saveProfile();
}

let dailyRunKills = 0;
let dailyRunModules = 0;
let dailyRunDeathFlag = false; // true if died this run (invalidates no-death challenges)

function bumpDaily(hookKey, n = 1, opts = {}) {
  ensureDailyChallenges();
  let changed = false;
  for (const c of profile.dailyChallenges) {
    if (c.claimed) continue;
    let inc = 0;
    if (c.hook === hookKey) inc = n;
    // Composite hooks: kill also bumps kill_run; module also bumps module_run/module_run_no_death
    if (hookKey === 'kill' && c.hook === 'kill_run') inc = n;
    if (hookKey === 'kill_tank' && c.hook === 'kill') inc = n; // tank kill is also a kill
    if (hookKey === 'kill_interceptor' && c.hook === 'kill') inc = n;
    if (hookKey === 'kill_scout' && c.hook === 'kill') inc = n;
    if (hookKey === 'module_run_no_death' && c.hook === 'module_run') inc = n;
    if (inc > 0) {
      c.progress = Math.min(c.target, c.progress + inc);
      changed = true;
      if (c.progress >= c.target && !c.claimed) {
        c.claimed = true;
        addCredits(c.reward, `DAILY: ${c.name}`);
      }
    }
  }
  if (changed) saveProfile();
}

// Wire run-scoped daily progress
function dailyOnKill(kindKey) {
  dailyRunKills += 1;
  bumpDaily('kill_run', 1);
  bumpDaily('kill', 1);
  if (kindKey === 'tank') bumpDaily('kill_tank', 1);
  else if (kindKey === 'interceptor') bumpDaily('kill_interceptor', 1);
  else bumpDaily('kill_scout', 1);
}
function dailyOnModule() {
  dailyRunModules += 1;
  bumpDaily('module_run', 1);
  if (!dailyRunDeathFlag) bumpDaily('module_run_no_death', 1);
}
function dailyOnDeath() {
  dailyRunDeathFlag = true;
  // Invalidate no-death challenge: reset progress
  for (const c of profile.dailyChallenges || []) {
    if (c.hook === 'module_run_no_death' && !c.claimed) c.progress = 0;
  }
  saveProfile();
}
function dailyOnRunStart() {
  dailyRunKills = 0;
  dailyRunModules = 0;
  dailyRunDeathFlag = false;
  // Reset run-scoped progress (kill_run, module_run, module_run_no_death)
  for (const c of profile.dailyChallenges || []) {
    if ((c.hook === 'kill_run' || c.hook === 'module_run' || c.hook === 'module_run_no_death') && !c.claimed) {
      c.progress = 0;
    }
  }
  saveProfile();
}

// Splash UI: render daily challenges card
function renderDailySplash() {
  ensureDailyChallenges();
  if (!splash) return;
  let panel = document.getElementById('daily-splash');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'daily-splash';
    splash.appendChild(panel);
  }
  panel.innerHTML = `
    <div class="dh-title">${t('splash.daily')} <span class="dh-date">${profile.dailyDate}</span></div>
    <div class="dh-list">
      ${profile.dailyChallenges.map(c => {
        const pct = Math.round((c.progress / c.target) * 100);
        const done = c.claimed;
        return `
          <div class="dh-card ${done ? 'done' : ''}">
            <div class="dh-icon">${done ? '✓' : c.icon}</div>
            <div class="dh-body">
              <div class="dh-name">${c.name}</div>
              <div class="dh-bar"><div class="dh-fill" style="width:${pct}%"></div></div>
              <div class="dh-meta">${c.progress}/${c.target} · <span class="dh-reward">${c.reward}⬢</span></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ---- TUTORIAL (first-time onboarding) ----
const TUTORIAL_STEPS = [
  { key: 'tutorial.s1', dur: 8 },
  { key: 'tutorial.s2', dur: 8 },
  { key: 'tutorial.s3', dur: 7 },
  { key: 'tutorial.s4', dur: 8 },
  { key: 'tutorial.s5', dur: 7 },
  { key: 'tutorial.s6', dur: 7 },
  { key: 'tutorial.s7', dur: 9 },
];

let tutorialIdx = -1;
let tutorialT = 0;
let tutorialEl = null;

function tutorialActive() { return tutorialIdx >= 0 && tutorialIdx < TUTORIAL_STEPS.length; }

function startTutorial() {
  if (profile.tutorialDone) return;
  tutorialIdx = 0;
  tutorialT = 0;
  buildTutorialEl();
  showTutorialStep();
}

function buildTutorialEl() {
  if (tutorialEl) return;
  tutorialEl = document.createElement('div');
  tutorialEl.id = 'tutorial-toast';
  tutorialEl.innerHTML = `
    <div class="tip"></div>
    <div class="actions">
      <button data-skip>SKIP TUTORIAL</button>
      <button data-next>KEYINGI ▸</button>
    </div>
    <div class="progress"><div class="bar"></div></div>
  `;
  document.body.appendChild(tutorialEl);
  tutorialEl.querySelector('[data-skip]').addEventListener('click', (e) => {
    e.stopPropagation();
    finishTutorial();
  });
  tutorialEl.querySelector('[data-next]').addEventListener('click', (e) => {
    e.stopPropagation();
    advanceTutorial();
  });
}

function showTutorialStep() {
  if (!tutorialEl || !tutorialActive()) return;
  const step = TUTORIAL_STEPS[tutorialIdx];
  tutorialEl.querySelector('.tip').innerHTML = t(step.key);
  tutorialEl.querySelector('.bar').style.width = '0%';
  tutorialT = step.dur;
  tutorialEl.style.display = 'block';
}

function advanceTutorial() {
  tutorialIdx += 1;
  if (tutorialIdx >= TUTORIAL_STEPS.length) finishTutorial();
  else showTutorialStep();
}

function finishTutorial() {
  tutorialIdx = -1;
  if (tutorialEl) tutorialEl.remove();
  tutorialEl = null;
  profile.tutorialDone = true;
  saveProfile();
}

function tickTutorial(dt) {
  if (!tutorialActive() || !tutorialEl) return;
  if (state.paused || splash.style.display !== 'none') return;
  const step = TUTORIAL_STEPS[tutorialIdx];
  tutorialT -= dt;
  const elapsed = step.dur - tutorialT;
  const pct = Math.min(100, Math.max(0, (elapsed / step.dur) * 100));
  const bar = tutorialEl.querySelector('.bar');
  if (bar) bar.style.width = pct + '%';
  if (tutorialT <= 0) advanceTutorial();
}

// P key toggles pause (in-game)
window.addEventListener('keydown', (e) => {
  if (chatInput.style.display === 'block') return;
  if (e.code === 'KeyP') {
    e.preventDefault();
    if (state.paused) closePauseMenu();
    else openPauseMenu();
  }
});

// ---------- BATTLE PASS UI ----------
function renderBattlePassSplash() {
  if (!splash) return;
  let panel = document.getElementById('bp-splash');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'bp-splash';
    splash.appendChild(panel);
  }
  const p = getBpProgress();
  const pct = Math.round(p.pct * 100);
  const claimable = hasUnclaimedBpTier() || hasUnclaimedBpPremiumTier();
  const nextTier = p.lvl < BP_TIER_COUNT ? BP_TIERS[p.lvl] : null;
  const daysLeft = getDaysLeftInSeason();
  panel.innerHTML = `
    <div class="bp-title">${t('bp.title')} <span class="bp-tier">${t('bp.tier', { n: p.lvl, max: BP_TIER_COUNT })}</span></div>
    <div class="bp-season-row">
      <span class="bp-season-tag">${t('bp.season', { id: profile.bpSeasonId || getCurrentBpSeason() })}</span>
      <span class="bp-season-end">${t('bp.seasonEnds', { days: daysLeft })}</span>
    </div>
    <div class="bp-bar"><div class="bp-fill" style="width:${pct}%"></div></div>
    <div class="bp-meta">
      <span>${p.xp} XP</span>
      ${nextTier
        ? `<span class="bp-next">${t('bp.next', { label: nextTier.label, xp: nextTier.xpReq })}</span>`
        : `<span class="bp-max">${t('bp.maxTier')}</span>`}
    </div>
    <button class="bp-open-btn ${claimable ? 'has-claim' : ''}">
      ${claimable ? t('bp.rewardsReady') : t('bp.rewards')}
    </button>
  `;
  panel.querySelector('.bp-open-btn').addEventListener('click', openBattlePassModal);
}

function openBattlePassModal() {
  if (document.getElementById('bp-modal')) return;
  const overlay = document.createElement('div');
  overlay.id = 'bp-modal';
  const renderBody = () => {
    const p = getBpProgress();
    const isPrem = !!profile.bpPremium;
    const canAfford = (profile.credits || 0) >= BP_PREMIUM_COST;
    const premBanner = isPrem
      ? `<div class="bpm-prem-active">${t('bp.premiumActive')}</div>`
      : `<div class="bpm-prem-cta">
           <div class="bpm-prem-cta-text">
             <div class="bpm-prem-cta-title">${t('bp.premiumTitle')}</div>
             <div class="bpm-prem-cta-desc">${t('bp.premiumDesc')}</div>
           </div>
           <button class="bpm-prem-btn" ${canAfford ? '' : 'disabled'}>
             ${canAfford ? t('bp.premiumUnlock', { cost: BP_PREMIUM_COST }) : t('bp.premiumNotEnough', { cost: BP_PREMIUM_COST })}
           </button>
         </div>`;
    overlay.innerHTML = `
      <div class="bpm-inner">
        <button class="bpm-close" type="button">✕</button>
        <div class="bpm-title">${t('bp.title')}</div>
        <div class="bpm-summary">
          <div class="bpm-tier-big">${t('bp.tier', { n: p.lvl, max: BP_TIER_COUNT })}</div>
          <div class="bpm-bar"><div class="bpm-fill" style="width:${(p.pct*100).toFixed(0)}%"></div></div>
          <div class="bpm-xp">${p.xp} XP${p.lvl < BP_TIER_COUNT ? ` / ${p.nextXp}` : ' · MAX'}</div>
        </div>
        ${premBanner}
        <div class="bpm-track-headers ${isPrem ? 'has-prem' : ''}">
          <div></div>
          <div></div>
          <div class="bpm-track-h free">${t('bp.trackFree')}</div>
          ${isPrem ? `<div class="bpm-track-h prem">${t('bp.trackPrem')}</div>` : ''}
        </div>
        <div class="bpm-tier-list ${isPrem ? 'has-prem' : ''}">
          ${BP_TIERS.map((tier, idx) => {
            const f_claimed = (profile.bpClaimed || []).includes(idx);
            const f_claimable = isBpTierClaimable(idx);
            const reached = (profile.bpXp || 0) >= tier.xpReq;
            const f_cls = f_claimed ? 'claimed' : (f_claimable ? 'claimable' : (reached ? 'reached' : 'locked'));
            const f_icon = tier.unlock
              ? (tier.unlock.type === 'ship' ? '★' : (tier.unlock.icon || '◆'))
              : '⬢';
            // Premium cell
            const ptier = BP_PREMIUM_TIERS[idx];
            const p_claimed = (profile.bpPremiumClaimed || []).includes(idx);
            const p_claimable = isBpPremiumClaimable(idx);
            const p_cls = !isPrem ? 'locked-prem' : (p_claimed ? 'claimed' : (p_claimable ? 'claimable' : (reached ? 'reached' : 'locked')));
            const p_icon = ptier.unlock ? (ptier.unlock.icon || '◆') : '⬢';
            return `
              <div class="bpm-tier-row ${reached ? 'tier-reached' : ''}">
                <div class="bpm-t-num">T${tier.tier}</div>
                <div class="bpm-t-xp">${tier.xpReq} XP</div>
                <div class="bpm-cell free ${f_cls}" data-track="free" data-idx="${idx}">
                  <div class="bpm-t-icon">${f_icon}</div>
                  <div class="bpm-t-label">${tier.label}</div>
                  <button class="bpm-t-btn" ${f_claimable ? '' : 'disabled'}>
                    ${f_claimed ? '✓' : (f_claimable ? t('bp.claim') : (reached ? '◆' : '🔒'))}
                  </button>
                </div>
                ${isPrem ? `
                  <div class="bpm-cell prem ${p_cls}" data-track="prem" data-idx="${idx}">
                    <div class="bpm-t-icon">${p_icon}</div>
                    <div class="bpm-t-label">${ptier.label}</div>
                    <button class="bpm-t-btn" ${p_claimable ? '' : 'disabled'}>
                      ${p_claimed ? '✓' : (p_claimable ? t('bp.claim') : (reached ? '◆' : '🔒'))}
                    </button>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    overlay.querySelector('.bpm-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    // Premium unlock button
    const premBtn = overlay.querySelector('.bpm-prem-btn');
    if (premBtn) {
      premBtn.addEventListener('click', () => {
        if (premBtn.disabled) return;
        if (unlockBpPremium()) {
          renderBody();
          renderBattlePassSplash();
        }
      });
    }

    // Free + Premium claim buttons (delegated)
    overlay.querySelectorAll('.bpm-cell').forEach(cell => {
      const btn = cell.querySelector('.bpm-t-btn');
      if (!btn || btn.disabled) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(cell.dataset.idx, 10);
        const track = cell.dataset.track;
        const ok = track === 'prem' ? claimBpPremiumTier(idx) : claimBpTier(idx);
        if (ok) {
          if (typeof SFX !== 'undefined' && SFX.pickup) SFX.pickup();
          renderBody();
          renderBattlePassSplash();
        }
      });
    });
  };
  document.body.appendChild(overlay);
  renderBody();
}

// ---------- FRIENDS UI ----------
let friendsCache = []; // last fetched list
let friendsLoading = false;
const FRIENDS_REFRESH_MS = 60_000;
let friendsLastFetch = 0;

function getMyFriendCode() {
  const uid = localStorage.getItem('odyssey.cloudUid') || '';
  return uid.slice(0, 8).toUpperCase();
}

async function fetchFriends() {
  const uid = localStorage.getItem('odyssey.cloudUid');
  const token = localStorage.getItem('odyssey.cloudToken');
  if (!uid || !token) return [];
  try {
    const r = await fetch(`/api/friends?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`);
    const data = await r.json();
    if (data.ok && Array.isArray(data.friends)) {
      friendsCache = data.friends;
      friendsLastFetch = Date.now();
      // Sync local profile.friends list with server (in case server is source of truth)
      profile.friends = data.friends.map(f => ({ uid: f.uid, name: f.name, addedAt: f.addedAt }));
      saveProfile();
      return data.friends;
    }
  } catch (err) {
    console.warn('[friends] fetch failed', err);
  }
  return friendsCache;
}

async function addFriendByCode(code) {
  const uid = localStorage.getItem('odyssey.cloudUid');
  const token = localStorage.getItem('odyssey.cloudToken');
  if (!uid || !token) return { ok: false, error: 'no_auth' };
  if (!/^[a-f0-9]{8}$/i.test(code)) return { ok: false, error: 'bad_code' };
  try {
    const r = await fetch('/api/friends/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, token, code: code.toLowerCase() }),
    });
    const data = await r.json();
    if (data.ok && data.friend) {
      friendsCache.unshift(data.friend);
      profile.friends = friendsCache.map(f => ({ uid: f.uid, name: f.name, addedAt: f.addedAt }));
      saveProfile();
      // Achievements
      if (typeof unlockAchievement === 'function') {
        unlockAchievement('first_friend');
        if (profile.friends.length >= 5) unlockAchievement('social_5');
      }
      // Refresh nearby player labels (newly-added might be in AoI)
      for (const o of otherPlayers.values()) refreshOtherPlayerLabel(o);
    }
    return data;
  } catch (err) {
    return { ok: false, error: 'network' };
  }
}

async function removeFriend(friendUid) {
  const uid = localStorage.getItem('odyssey.cloudUid');
  const token = localStorage.getItem('odyssey.cloudToken');
  if (!uid || !token) return false;
  try {
    const r = await fetch('/api/friends/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, token, friendUid }),
    });
    const data = await r.json();
    if (data.ok) {
      friendsCache = friendsCache.filter(f => f.uid !== friendUid);
      profile.friends = (profile.friends || []).filter(f => f.uid !== friendUid);
      saveProfile();
      return true;
    }
  } catch {}
  return false;
}

function renderFriendsSplash() {
  if (!splash) return;
  let panel = document.getElementById('friends-splash');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'friends-splash';
    splash.appendChild(panel);
  }
  const onlineCount = friendsCache.filter(f => f.online).length;
  const total = friendsCache.length;
  panel.innerHTML = `
    <div class="fr-title">
      <span>${t('friends.title')}</span>
      <span class="fr-count">${total > 0 ? t('friends.online', { n: onlineCount }) + ` · ${total}` : ''}</span>
    </div>
    <div class="fr-mycode">
      <span class="fr-code-label">${t('friends.code')}:</span>
      <code class="fr-code-val" title="${t('friends.codeHint')}">${getMyFriendCode() || '—'}</code>
      <button class="fr-copy-btn" type="button" title="${t('friends.codeHint')}">⧉</button>
    </div>
    <button class="fr-open-btn" type="button">${t('friends.addBtn').replace('+ ', '')} / ${total}</button>
  `;
  panel.querySelector('.fr-copy-btn').addEventListener('click', async (e) => {
    e.stopPropagation();
    const code = getMyFriendCode();
    if (!code) return;
    try { await navigator.clipboard.writeText(code); } catch {}
    const btn = e.currentTarget;
    const orig = btn.textContent;
    btn.textContent = '✓';
    setTimeout(() => { btn.textContent = orig; }, 1500);
  });
  panel.querySelector('.fr-open-btn').addEventListener('click', openFriendsModal);
}

function openFriendsModal() {
  if (document.getElementById('friends-modal')) return;
  const ov = document.createElement('div');
  ov.id = 'friends-modal';
  const renderBody = () => {
    const list = friendsCache;
    const onlineCount = list.filter(f => f.online).length;
    ov.innerHTML = `
      <div class="frm-inner">
        <button class="frm-close" type="button">✕</button>
        <div class="frm-title">${t('friends.title')}</div>
        <div class="frm-mycode-row">
          <span>${t('friends.yourCode', { code: getMyFriendCode() || '—' })}</span>
          <button class="frm-copy" type="button">⧉</button>
        </div>
        <div class="frm-hint">${t('friends.codeHint')}</div>
        <div class="frm-add-row">
          <input type="text" class="frm-add-input" maxlength="8" placeholder="${t('friends.addPlaceholder')}" />
          <button class="frm-add-btn" type="button">${t('friends.addBtn')}</button>
        </div>
        <div class="frm-add-msg"></div>
        <div class="frm-online-tag">${onlineCount > 0 ? t('friends.online', { n: onlineCount }) : ''}</div>
        <div class="frm-list">
          ${list.length === 0
            ? `<div class="frm-empty">${t('friends.empty')}</div>`
            : list.map(f => `
                <div class="frm-row ${f.online ? 'online' : ''}" data-uid="${f.uid}">
                  <div class="frm-status"></div>
                  <div class="frm-info">
                    <div class="frm-name">${escapeHtml(f.name || 'Pilot')}</div>
                    <div class="frm-sub">
                      ${f.faction ? `<span class="frm-fac fac-${f.faction.toLowerCase()}">${f.faction}</span>` : ''}
                      <code class="frm-fcode">${f.code}</code>
                    </div>
                  </div>
                  <button class="frm-rm" data-uid="${f.uid}" title="${t('friends.remove')}">✕</button>
                </div>
              `).join('')
          }
        </div>
      </div>
    `;
    ov.querySelector('.frm-close').addEventListener('click', () => ov.remove());
    ov.addEventListener('click', (e) => { if (e.target === ov) ov.remove(); });
    ov.querySelector('.frm-copy').addEventListener('click', async (e) => {
      const code = getMyFriendCode();
      if (!code) return;
      try { await navigator.clipboard.writeText(code); } catch {}
      const btn = e.currentTarget;
      const orig = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    });
    const input = ov.querySelector('.frm-add-input');
    const msg = ov.querySelector('.frm-add-msg');
    const addBtn = ov.querySelector('.frm-add-btn');
    const submitAdd = async () => {
      const code = (input.value || '').trim();
      if (!/^[a-f0-9]{8}$/i.test(code)) {
        msg.textContent = t('friends.errBadCode');
        msg.className = 'frm-add-msg err';
        return;
      }
      addBtn.disabled = true;
      msg.textContent = '...';
      msg.className = 'frm-add-msg';
      const result = await addFriendByCode(code);
      addBtn.disabled = false;
      if (result.ok) {
        msg.textContent = t('friends.added', { name: result.friend.name });
        msg.className = 'frm-add-msg ok';
        input.value = '';
        renderBody();
        renderFriendsSplash();
      } else {
        const err = result.error;
        let errText;
        if (err === 'self')                errText = t('friends.errSelf');
        else if (err === 'already_friend') errText = t('friends.errExists');
        else if (err === 'not_found')      errText = t('friends.errNotFound');
        else if (err === 'bad_code')       errText = t('friends.errBadCode');
        else if (err === 'rate_limit')     errText = t('friends.errRateLimit');
        else if (err === 'limit_reached')  errText = t('friends.errLimitMax', { n: 200 });
        else                               errText = t('friends.errGeneric');
        msg.textContent = errText;
        msg.className = 'frm-add-msg err';
      }
    };
    addBtn.addEventListener('click', submitAdd);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitAdd();
    });
    ov.querySelectorAll('.frm-rm').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const friendUid = btn.dataset.uid;
        const friend = friendsCache.find(f => f.uid === friendUid);
        if (!friend) return;
        if (!confirm(t('friends.confirmRemove', { name: friend.name }))) return;
        const ok = await removeFriend(friendUid);
        if (ok) {
          renderBody();
          renderFriendsSplash();
        }
      });
    });
  };
  document.body.appendChild(ov);
  renderBody();
  // Refresh from server for fresh online status
  fetchFriends().then(() => renderBody());
}

// Render daily challenges + global leaderboard on splash at startup
renderDailySplash();
renderLeaderboardSplash();
const _bpSeasonReset = checkBpSeasonReset();
renderBattlePassSplash();
renderFriendsSplash();
// Refresh friends list shortly after boot (for online statuses)
setTimeout(() => {
  fetchFriends().then(() => {
    renderFriendsSplash();
    // Re-render leaderboard so friends tab can populate
    if (typeof renderLeaderboardSplash === 'function') renderLeaderboardSplash();
  }).catch(() => {});
}, 1500);
// Periodic refresh while on splash
setInterval(() => {
  if (splash && splash.style.display !== 'none' && Date.now() - friendsLastFetch > FRIENDS_REFRESH_MS) {
    fetchFriends().then(() => renderFriendsSplash()).catch(() => {});
  }
}, FRIENDS_REFRESH_MS);
// Daily login bonus + season reset notice (delayed slightly so splash renders first)
setTimeout(() => {
  if (_bpSeasonReset) {
    showSeasonResetModal();
  } else {
    const reward = checkDailyLoginBonus();
    if (reward) showLoginBonusModal(reward);
  }
}, 600);

// Stats + Shop buttons on splash
(function injectSplashButtons() {
  if (!splash) return;
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex; gap:8px; justify-content:center; margin-top:12px; flex-wrap:wrap;';
  const mkBtn = (i18nKey, fn) => {
    const b = document.createElement('button');
    b.dataset.i18n = i18nKey;
    b.textContent = t(i18nKey);
    b.style.cssText = 'background:transparent; border:1px solid rgba(120,220,255,0.4); color:#aef0ff; padding:8px 16px; cursor:pointer; font-family:inherit; font-size:11px; letter-spacing:3px;';
    b.addEventListener('click', (e) => { e.preventDefault(); fn(); });
    return b;
  };
  wrap.appendChild(mkBtn('splash.pilot', buildStatsScreen));
  wrap.appendChild(mkBtn('splash.shipyard', buildShopScreen));
  // Transfer button (manual text — not yet i18n'd)
  const transferBtn = document.createElement('button');
  transferBtn.textContent = '☁ TRANSFER';
  transferBtn.style.cssText = 'background:transparent; border:1px solid rgba(120,220,255,0.4); color:#aef0ff; padding:8px 16px; cursor:pointer; font-family:inherit; font-size:11px; letter-spacing:3px;';
  transferBtn.addEventListener('click', (e) => { e.preventDefault(); openTransferModal(); });
  wrap.appendChild(transferBtn);
  if (launchBtn && launchBtn.parentNode) {
    launchBtn.parentNode.insertBefore(wrap, launchBtn.nextSibling);
  } else {
    splash.appendChild(wrap);
  }
})();

// ---------- FACTION UI (selector modal + splash badge) ----------
function openFactionModal() {
  if (document.getElementById('faction-modal')) return;
  const overlay = document.createElement('div');
  overlay.id = 'faction-modal';
  overlay.innerHTML = `
    <div class="fm-inner">
      <div class="fm-title">FRAKSIYA TANLANG</div>
      <div class="fm-sub">Bu tanlov sizning Yer'dagi pozitsiyangizni belgilaydi.<br/>Boshqa fraksiyalar dushman, o'z fraksiyangiz ittifoqdosh.</div>
      <div class="fm-cards">
        ${Object.values(FACTIONS).map(f => `
          <button class="fm-card ${profile.faction === f.id ? 'current' : ''}" data-id="${f.id}"
                  style="--fc:${f.cssColor}; --fa:${f.cssAccent};">
            <div class="fm-icon">${f.icon}</div>
            <div class="fm-name">${f.name}</div>
            <div class="fm-creed">"${f.creed}"</div>
            <div class="fm-cta">${profile.faction === f.id ? 'JORIY ✓' : 'TANLASH'}</div>
          </button>
        `).join('')}
      </div>
      ${profile.faction ? '<button class="fm-close" type="button">YOPISH ✕</button>' : '<div class="fm-warn">Davom etish uchun fraksiya tanlang</div>'}
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelectorAll('.fm-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const isFirstChoice = !profile.faction;
      profile.faction = id;
      saveProfile();
      sendFaction(id);
      window.dispatchEvent(new Event('faction-changed'));
      overlay.remove();
      const f = getFaction(id);
      const msg = isFirstChoice
        ? `${f.icon} ${f.name} a'zosi sifatida ro'yxatdan o'tdingiz!`
        : `Fraksiya o'zgartirildi: ${f.icon} ${f.name}`;
      pushChat('FRAKSIYA', msg, f.cssColor);
      // Refresh existing other-player labels (enemy state may change)
      for (const o of otherPlayers.values()) refreshOtherPlayerLabel(o);
    });
  });

  const closeBtn = overlay.querySelector('.fm-close');
  if (closeBtn) closeBtn.addEventListener('click', () => overlay.remove());
}

function renderFactionSplash() {
  if (!splash) return;
  let panel = document.getElementById('faction-splash');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'faction-splash';
    splash.appendChild(panel);
  }
  const f = getFaction(profile.faction);
  if (!f) {
    panel.innerHTML = `
      <button class="fs-btn fs-choose" type="button">⚠ FRAKSIYA TANLASH SHART</button>
    `;
  } else {
    panel.innerHTML = `
      <button class="fs-btn fs-mine" type="button"
              style="color:${f.cssColor}; border-color:${f.cssColor}; box-shadow:0 0 12px ${f.cssColor}33;">
        <span class="fs-icon">${f.icon}</span>
        <span class="fs-name">${f.name}</span>
        <span class="fs-pvp">PvP: ${profile.factionKills || 0}K / ${profile.factionDeaths || 0}D</span>
      </button>
    `;
  }
  panel.querySelector('button').addEventListener('click', openFactionModal);
}
window.addEventListener('faction-changed', renderFactionSplash);
renderFactionSplash();

// Force selection on first run
if (!profile.faction) {
  // Defer slightly so splash UI is visible behind the modal
  setTimeout(() => { if (!profile.faction) openFactionModal(); }, 400);
}

// Block launch if no faction
const _origLaunchBtn = launchBtn;
if (_origLaunchBtn) {
  _origLaunchBtn.addEventListener('click', (e) => {
    if (!profile.faction) {
      e.preventDefault();
      e.stopImmediatePropagation();
      openFactionModal();
    }
  }, true);
}

// ---------- EMOTE WHEEL (B hold → radial select → release) ----------
const _emoteVecTmp = new THREE.Vector3();
const _emoteProjTmp = new THREE.Vector3();
const EMOTES = [
  { id: 0, icon: '⚠',  text: 'YORDAM!',     color: '#ff5544' },
  { id: 1, icon: '⇄',  text: 'SAVDO?',      color: '#ffd060' },
  { id: 2, icon: '→',  text: 'KETMOQDAMAN', color: '#7cd4ff' },
  { id: 3, icon: '★',  text: 'GG',          color: '#ffd060' },
  { id: 4, icon: '←',  text: 'ORQAMDA!',    color: '#ff7733' },
  { id: 5, icon: '✗',  text: 'DISTRESS',    color: '#ff3344' },
  { id: 6, icon: '✓',  text: 'ROGER',       color: '#7cffb1' },
  { id: 7, icon: '✦',  text: 'GENESIS!',    color: '#ffe14f' },
];

let emoteWheelEl = null;
let emoteWheelOpen = false;
let emoteHoverIdx = -1;
let emoteCenterX = 0, emoteCenterY = 0;
const EMOTE_COOLDOWN_MS = 1500;
let lastEmoteSentT = 0;

function openEmoteWheel() {
  if (emoteWheelOpen) return;
  if (!state.alive) return;
  if (splash && splash.style.display !== 'none') return;
  // Ignore if chat or pause active
  if (chatInput && chatInput.style.display === 'block') return;
  if (state.paused) return;
  emoteWheelOpen = true;
  emoteHoverIdx = -1;

  emoteCenterX = window.innerWidth / 2;
  emoteCenterY = window.innerHeight / 2;

  const wheel = document.createElement('div');
  wheel.id = 'emote-wheel';
  const R = 130, ir = 50;       // outer/inner radius
  const segs = EMOTES.length;
  const segAngle = (Math.PI * 2) / segs;
  let html = `<svg width="320" height="320" viewBox="-160 -160 320 320">`;
  // Center label
  html += `<circle cx="0" cy="0" r="${ir - 4}" fill="rgba(8,18,32,0.85)" stroke="rgba(120,220,255,0.4)" stroke-width="1"/>`;
  html += `<text x="0" y="-2" text-anchor="middle" dominant-baseline="middle" fill="#aef0ff" font-size="9" letter-spacing="2" font-family="Consolas,monospace">EMOTE</text>`;
  html += `<text x="0" y="12" text-anchor="middle" dominant-baseline="middle" fill="#7cd4ff" font-size="8" opacity="0.6" font-family="Consolas,monospace" id="emote-label">— hold B —</text>`;
  for (let i = 0; i < segs; i++) {
    // Each segment is a path slice
    const a0 = -Math.PI / 2 + (i - 0.5) * segAngle;
    const a1 = -Math.PI / 2 + (i + 0.5) * segAngle;
    const x0 = Math.cos(a0) * ir,        y0 = Math.sin(a0) * ir;
    const x1 = Math.cos(a0) * R,         y1 = Math.sin(a0) * R;
    const x2 = Math.cos(a1) * R,         y2 = Math.sin(a1) * R;
    const x3 = Math.cos(a1) * ir,        y3 = Math.sin(a1) * ir;
    const largeArc = 0;
    const path = `M ${x0} ${y0} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${ir} ${ir} 0 ${largeArc} 0 ${x0} ${y0} Z`;
    const ax = -Math.PI / 2 + i * segAngle;
    const cx = Math.cos(ax) * (ir + R) / 2;
    const cy = Math.sin(ax) * (ir + R) / 2;
    const e = EMOTES[i];
    html += `<g class="emote-seg" data-idx="${i}">`;
    html += `<path d="${path}" fill="rgba(20,30,50,0.55)" stroke="rgba(120,220,255,0.25)" stroke-width="1" class="seg-bg"/>`;
    html += `<text x="${cx}" y="${cy - 5}" text-anchor="middle" dominant-baseline="middle" fill="${e.color}" font-size="22" font-family="Consolas,monospace">${e.icon}</text>`;
    html += `<text x="${cx}" y="${cy + 12}" text-anchor="middle" dominant-baseline="middle" fill="#cfeaff" font-size="8" letter-spacing="1" font-family="Consolas,monospace" opacity="0.85">${e.text}</text>`;
    html += `</g>`;
  }
  html += `</svg>`;
  wheel.innerHTML = html;
  document.body.appendChild(wheel);
  emoteWheelEl = wheel;
}

function updateEmoteHover(mx, my) {
  if (!emoteWheelOpen || !emoteWheelEl) return;
  const dx = mx - emoteCenterX;
  const dy = my - emoteCenterY;
  const dist = Math.hypot(dx, dy);
  if (dist < 50) {
    setEmoteHover(-1);
    return;
  }
  // Angle from up (-PI/2) clockwise
  let ang = Math.atan2(dy, dx) + Math.PI / 2;
  if (ang < 0) ang += Math.PI * 2;
  const segAngle = (Math.PI * 2) / EMOTES.length;
  const idx = Math.floor(ang / segAngle + 0.5) % EMOTES.length;
  setEmoteHover(idx);
}
function setEmoteHover(idx) {
  if (idx === emoteHoverIdx) return;
  emoteHoverIdx = idx;
  if (!emoteWheelEl) return;
  emoteWheelEl.querySelectorAll('.emote-seg').forEach((g, i) => {
    g.classList.toggle('active', i === idx);
  });
  const lbl = emoteWheelEl.querySelector('#emote-label');
  if (lbl) lbl.textContent = idx >= 0 ? EMOTES[idx].text : '— hold B —';
}

function closeEmoteWheel(send) {
  if (!emoteWheelOpen) return;
  const idx = emoteHoverIdx;
  emoteWheelOpen = false;
  if (emoteWheelEl) { emoteWheelEl.remove(); emoteWheelEl = null; }
  emoteHoverIdx = -1;
  if (send && idx >= 0) {
    sendEmote(idx);
  }
}

function sendEmote(idx) {
  const now = performance.now();
  if (now - lastEmoteSentT < EMOTE_COOLDOWN_MS) return;
  lastEmoteSentT = now;
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({ type: 'emote', emote: idx }));
  }
  // Show our own bubble locally above ship
  showEmoteBubble('me', idx);
}

// Bubble overlay that follows a ship in screen-space
const emoteBubbles = new Map(); // key -> { el, idx, startT, ttl }
const EMOTE_TTL = 3000;

function showEmoteBubble(key, idx) {
  // Remove previous bubble for this key
  const old = emoteBubbles.get(key);
  if (old && old.el && old.el.parentNode) old.el.remove();
  const e = EMOTES[idx];
  if (!e) return;
  const el = document.createElement('div');
  el.className = 'emote-bubble';
  el.innerHTML = `<span class="eb-icon" style="color:${e.color}">${e.icon}</span><span class="eb-text">${e.text}</span>`;
  document.body.appendChild(el);
  emoteBubbles.set(key, { el, idx, startT: performance.now(), ttl: EMOTE_TTL });
}

function showEmoteFromOther(id, idx) {
  // Find the other player to anchor bubble
  if (!otherPlayers.has(id)) return;
  showEmoteBubble('p_' + id, idx);
}

function updateEmoteBubbles() {
  const now = performance.now();
  for (const [key, b] of emoteBubbles) {
    const t = (now - b.startT) / b.ttl;
    if (t >= 1) {
      if (b.el.parentNode) b.el.remove();
      emoteBubbles.delete(key);
      continue;
    }
    // Anchor position
    let pos;
    if (key === 'me') {
      pos = state.pos;
    } else {
      const id = parseInt(key.slice(2), 10);
      const o = otherPlayers.get(id);
      if (!o) {
        if (b.el.parentNode) b.el.remove();
        emoteBubbles.delete(key);
        continue;
      }
      pos = o.mesh.position;
    }
    // Offset upward a bit
    const out = _emoteProjTmp;
    const onScreen = projectToScreen(_emoteVecTmp.set(pos.x, pos.y + 10, pos.z), out);
    if (!onScreen) {
      b.el.style.display = 'none';
      continue;
    }
    b.el.style.display = '';
    b.el.style.left = out.x + 'px';
    b.el.style.top = (out.y - 24) + 'px';
    // Fade out near end
    const fade = t < 0.85 ? 1 : (1 - (t - 0.85) / 0.15);
    b.el.style.opacity = fade.toFixed(2);
  }
}

// Wire keyboard B hold/release + mouse track
window.addEventListener('keydown', (e) => {
  if (e.code !== 'KeyB') return;
  if (chatInput && chatInput.style.display === 'block') return;
  if (state.paused) return;
  if (!state.alive) return;
  if (splash.style.display !== 'none') return;
  if (e.repeat) return;
  e.preventDefault();
  openEmoteWheel();
});
window.addEventListener('keyup', (e) => {
  if (e.code !== 'KeyB') return;
  if (!emoteWheelOpen) return;
  e.preventDefault();
  closeEmoteWheel(true);
});
window.addEventListener('mousemove', (e) => {
  if (!emoteWheelOpen) return;
  updateEmoteHover(e.clientX, e.clientY);
});
// Cancel wheel on pause/death
window.addEventListener('blur', () => closeEmoteWheel(false));

// ---------- TOUCH CONTROLS (mobile / tablet) ----------
// Detect primary-input touch device (excludes hybrid laptops with mouse)
const isTouchDevice = window.matchMedia
  ? window.matchMedia('(pointer: coarse)').matches
  : (('ontouchstart' in window) || navigator.maxTouchPoints > 0);
const touchLook = { x: 0, y: 0 }; // continuous look-stick value (-1..1)

(function initTouchControls() {
  if (!isTouchDevice) return;
  document.body.classList.add('touch');

  const overlay = document.createElement('div');
  overlay.id = 'touch-controls';
  overlay.innerHTML = `
    <div class="tc-stick" id="tc-left"><div class="tc-knob"></div></div>
    <div class="tc-stick" id="tc-right"><div class="tc-knob"></div></div>
    <div class="tc-buttons">
      <button class="tc-btn fire"   id="tc-fire">FIRE</button>
      <button class="tc-btn boost"  id="tc-boost">BOOST</button>
      <button class="tc-btn brake"  id="tc-brake">BRAKE</button>
      <button class="tc-btn weapon" id="tc-weapon">1</button>
    </div>`;
  document.body.appendChild(overlay);

  // Left stick → keyboard simulation (W/S forward+back, A/D yaw)
  setupStick('tc-left', (nx, ny) => {
    if (ny < -0.25) keys.add('KeyW'); else keys.delete('KeyW');
    if (ny >  0.25) keys.add('KeyS'); else keys.delete('KeyS');
    if (nx < -0.25) keys.add('KeyA'); else keys.delete('KeyA');
    if (nx >  0.25) keys.add('KeyD'); else keys.delete('KeyD');
  }, () => {
    keys.delete('KeyW'); keys.delete('KeyS');
    keys.delete('KeyA'); keys.delete('KeyD');
  });

  // Right stick → camera look (continuous, integrated per frame)
  setupStick('tc-right', (nx, ny) => {
    touchLook.x = nx;
    touchLook.y = ny;
  }, () => {
    touchLook.x = 0; touchLook.y = 0;
  });

  // FIRE — held to auto-fire (cooldown via existing logic)
  const fireBtn = document.getElementById('tc-fire');
  let fireHeld = false;
  fireBtn.addEventListener('touchstart', (e) => { e.preventDefault(); fireHeld = true; if (typeof fire === 'function') fire(); });
  fireBtn.addEventListener('touchend',   (e) => { e.preventDefault(); fireHeld = false; });
  fireBtn.addEventListener('touchcancel',(e) => { e.preventDefault(); fireHeld = false; });
  setInterval(() => { if (fireHeld && typeof fire === 'function') fire(); }, 80);

  // BOOST → ShiftLeft hold
  bindHoldKey('tc-boost', 'ShiftLeft');
  // BRAKE → Space hold
  bindHoldKey('tc-brake', 'Space');

  // WEAPON cycle
  const wpnBtn = document.getElementById('tc-weapon');
  wpnBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const next = ((state.weapon || 0) + 1) % 3;
    if (typeof selectWeapon === 'function') selectWeapon(next);
    wpnBtn.textContent = String(next + 1);
  });

  function bindHoldKey(btnId, code) {
    const b = document.getElementById(btnId);
    b.addEventListener('touchstart', (e) => { e.preventDefault(); keys.add(code); });
    b.addEventListener('touchend',   (e) => { e.preventDefault(); keys.delete(code); });
    b.addEventListener('touchcancel',(e) => { e.preventDefault(); keys.delete(code); });
  }

  function setupStick(elId, onMove, onEnd) {
    const el = document.getElementById(elId);
    const knob = el.querySelector('.tc-knob');
    let activeId = null, cx = 0, cy = 0, radius = 0;

    const begin = (e) => {
      const t = e.changedTouches[0];
      activeId = t.identifier;
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top  + r.height / 2;
      radius = r.width / 2;
      apply(t.clientX, t.clientY);
      e.preventDefault();
    };
    const move = (e) => {
      if (activeId === null) return;
      const t = Array.from(e.changedTouches).find(c => c.identifier === activeId);
      if (!t) return;
      apply(t.clientX, t.clientY);
      e.preventDefault();
    };
    const end = (e) => {
      if (activeId === null) return;
      const t = Array.from(e.changedTouches).find(c => c.identifier === activeId);
      if (!t) return;
      activeId = null;
      knob.style.transform = 'translate(0, 0)';
      if (onEnd) onEnd();
      e.preventDefault();
    };
    function apply(px, py) {
      let dx = px - cx, dy = py - cy;
      const d = Math.hypot(dx, dy);
      if (d > radius) { dx = dx * radius / d; dy = dy * radius / d; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      onMove(dx / radius, dy / radius);
    }

    el.addEventListener('touchstart',  begin, { passive: false });
    el.addEventListener('touchmove',   move,  { passive: false });
    el.addEventListener('touchend',    end,   { passive: false });
    el.addEventListener('touchcancel', end,   { passive: false });
  }

  // Disable pointer-lock prompt on touch (it's keyboard/mouse specific)
  // and prevent pinch zoom on the canvas
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('#touch-controls')) e.preventDefault();
  });
})();

tick();
