# 🚀 Odyssey: Sol's Last Breath — MVP

`fly.pieter.com` uslubidagi brauzer-uchun MMO kosmik o'yini. Bitta `index.html` + `game.js` mijoz, Node.js + WebSocket server.

## TZ asoslari (qisqacha)

Yer yadrosi o'lmoqda. Pilot Quyosh tizimi chetidagi **Genesis Particle**ni topib qaytishi kerak. Har bir sayyorada **Core Module** yig'iladi. Genesis qo'lga olingach, pilot **HVT** (High Value Target) bo'ladi va boshqa o'yinchilarga ko'rinadi.

To'liq spetsifikatsiya `docs/TZ.md` faylida.

## Ishga tushirish

```powershell
npm install
npm start
```

So'ng brauzerda oching: <http://localhost:3000>

Bir nechta brauzer oynasini oching — multiplayerni sinash uchun.

## Boshqaruv

| Tugma | Vazifa |
|---|---|
| W / S | Oldinga / orqaga gaz |
| A / D | Yaw (chap/o'ng burilish) |
| Q / E | Roll (aylanish) |
| Sichqoncha | Pitch / Yaw (ko'rish) |
| Shift | Boost (yoqilg'i tez tugaydi) |
| Space | Tormoz (batareyani sarflaydi) |
| F | Jump Gate yonida — keyingi sektorga sakrash |
| T | Chat |

## MVP + Faza 2 da bor narsalar

**Asosiy:**
- ☀ Quyosh + 6 sayyora (Yer, Mars, Yupiter, Saturn, Uran, Neptun)
- 🛸 Newton inertsiyali uchish, gravitatsiya, to'qnashuv
- 🌀 Jump Gate'lar (har bir sayyora yonida aylanib turadi) — `F` bilan keyingi sektorga sakrash
- 💎 Core Module pickup (oxirgisi — Genesis Particle)
- 🫁 O₂ / Yoqilg'i / Batareya / Korpus resurslari
- 🌐 Real-time multiplayer (WebSocket, ~12 Hz sinxron)
- 💬 Chat (T)
- 🎯 Off-screen markerlar
- 🤖 AIDA AI xabarlari, lore, ogohlantirish

**Faza 2 yangiliklari:**
- 🪨 **Asteroid belt** — Mars↔Yupiter orasida 220 ta asteroid, to'qnashuvli
- 🔫 **Lazer qurol** — LMB bosing, batareya sarflaydi, qaroqchini va asteroidni uradi
- 👾 **Pirate AI** — sizni quvib yuradi, o'q otadi. HVT bo'lganingizda 3x ko'p paydo bo'ladi
- 📡 **Voyager 1 easter egg** — Neptun ortida, yaqinlashsangiz lore + resurs buff
- ☄ **Solar flare** — har 90-180 soniyada portlash. Sayyora ortiga yashiring!
- 🛰 **Docking** — sayyora yaqinida sekin uchsangiz O₂/Yoqilg'i/Korpus avto-tiklanadi
- ⚖ **Karma tizimi** — Saviors (+) / Raiders (−)
- 🏆 **G'alaba** — Genesis bilan Yerga qaytsangiz Mission Complete + statistika

## Keyingi bosqichlar

1. **Faza 3** — Trading UI (boshqa pilotlar bilan), Dark Zone nebula, Boss AI Aliens, ko'p qurol turi
2. **Final** — Server-side karma sync, Hall of Fame leaderboard, endgame tanlov (Government / Black Market / New Colony)

## Stack

- **Frontend:** Three.js (CDN, ESM)
- **Backend:** Node.js + `ws`
- **Hech qanday build step yo'q** — toza ESM, brauzer to'g'ridan-to'g'ri yuklaydi

## Litsenziya

MIT (xohlagancha o'zgartiring).
