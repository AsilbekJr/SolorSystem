# 🚀 Technical Specification: Project "Odyssey: Sol's Last Breath"

## 1. Project Overview
**Concept:** A massive multiplayer online (MMO) browser-based space exploration and survival game.

**Objective:** The Earth's core is dying. The player must travel from Earth to the edge of the Solar System (Neptune/Oort Cloud) to retrieve the **Genesis Particle**, visiting each planet to collect vital components, and return to Earth to save humanity.

**Inspiration:** `fly.pieter.com`, but with deep lore, RPG elements, and high-stakes PvPvE.

## 2. Core Gameplay Mechanics

### A. The Journey (Progressive Mission)
- **Linear Progression** — sektorlar (sayyoralar). Keyingi sayyoraga o'tish uchun Jump Gate kerak.
- **Mandatory Collection** — har sayyorada noyob Core Module (Mars: Oxidizer, Jupiter: Gravity Compressor, ...).
- **The Return Phase** — Neptunda Genesis olingach, pilot HVT bo'ladi, joylashuvi serverga uzatiladi.

### B. Navigation & Physics
- Newton inertsiyasi.
- Gravity slingshot.
- Resurs: O₂, Yoqilg'i, Batareya. Quyoshdan uzoqlashganda solar panellar zaiflashadi.

## 3. Multiplayer & Social
- Persistent world, real-time visibility.
- Docking hub: trade, squad form.
- AIDA-Link quick chat + proximity voice/text.

## 4. AIDA AI Companion
- UI/UX yo'l-yo'riq.
- Tactical warning: "Solar flare detected in 10 seconds".
- Lore facts: Voyager 1, Mars Rovers.
- Autopilot + economy.

## 5. Entities & Environment
- Real-world probes (Voyager, New Horizons, Starlink) — easter eggs, buff.
- Factions: AI Aliens (Genesis qo'riqchilari), Space Pirates.
- Hazards: Solar flare, asteroid shower, Dark Zone (nebula).

## 6. Stack
- **Frontend:** Three.js / Babylon.js
- **Backend:** Node.js + Socket.io / ws
- **DB:** MongoDB / PostgreSQL
- Procedural generation, instanced rendering.

## 7. Progression & Monetization
- Modular ship building (engine/hull/weapon swap).
- Karma: Blue (Saviors) / Red (Raiders).
- Hall of Fame: birinchi pilot/squad — oltin yodgorlik.

## 8. Aesthetic
- Realistic sci-fi + retro-futurism.
- Ambient synth, Quyoshdan uzoqlashganda eerie.
- HUD-based UI (cockpit shisha orqali).

## 9. Endgame
- AIDA classified ma'lumotlarni ochadi: Genesis sentient bo'lishi mumkin.
- Tanlov: Hukumatga / Black Market Rebels'ga / yangi koloniya.

## Execution Priority
1. **MVP** — flight + Earth→Mars + socket. ✅ (joriy holat)
2. **Phase 2** — Stations, Trading UI, AIDA integration.
3. **Phase 3** — Jupiter→Neptune, Boss AI.
4. **Final** — Return Trip, Global Leaderboards.
