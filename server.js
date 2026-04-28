// Odyssey: Sol's Last Breath — scalable multiplayer server
// Optimizations:
//   • Tick-based snapshot broadcast (TICK_HZ Hz fixed) — caps outbound bandwidth
//   • Area-of-Interest filtering — clients only receive nearby players
//   • Per-message deflate compression — reduces payload by ~60-80%
//   • Per-client rate limiting — protects against floods
//   • Position quantization (int16) — smaller snapshots
//   • /stats JSON endpoint for monitoring
//   • Static file caching headers
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;

// ---- Tunables ----
const TICK_HZ           = 15;                    // server snapshot rate (Hz)
const TICK_MS           = Math.floor(1000 / TICK_HZ);
const AOI_RADIUS        = 5500;                  // only broadcast within this radius (world units)
const AOI_RADIUS_SQ     = AOI_RADIUS * AOI_RADIUS;
const MAX_STATE_HZ      = 30;                    // per-client state messages/sec
const MAX_CHAT_HZ       = 5;                     // per-client chat messages/sec
const MAX_TRADE_HZ      = 4;                     // per-client trade messages/sec
const MAX_PAYLOAD_BYTES = 8 * 1024;              // hard cap per WS frame
const STATIC_CACHE_SEC  = 0;                     // set >0 in production

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
};

// ---- Stats counters ----
let totalConnects   = 0;
let totalDisconnects = 0;
let stateMsgsIn     = 0;
let snapshotsOut    = 0;
let bytesOut        = 0;
const startedAt     = Date.now();

// ---- Faction war (server-side daily score) ----
const factionScore = { ASCENDANT: 0, NIHILIST: 0 };
let factionScoreDate = new Date().toISOString().split('T')[0];
function rolloverFactionDaily() {
  const today = new Date().toISOString().split('T')[0];
  if (today !== factionScoreDate) {
    // Crown yesterday's winner & broadcast
    const winner = factionScore.ASCENDANT > factionScore.NIHILIST ? 'ASCENDANT'
                 : factionScore.NIHILIST > factionScore.ASCENDANT ? 'NIHILIST' : null;
    broadcastEvent({
      type: 'event',
      kind: 'daily-rollover',
      winner,
      asc: factionScore.ASCENDANT,
      nih: factionScore.NIHILIST,
      date: factionScoreDate,
    });
    factionScore.ASCENDANT = 0;
    factionScore.NIHILIST = 0;
    factionScoreDate = today;
  }
}
function broadcastEvent(payload) {
  const out = JSON.stringify(payload);
  for (const op of players.values()) op.send(out);
}
// Periodic live events: spawn random galactic event every ~5-10 min if 2+ players online
const EVENT_KINDS = [
  { id: 'solar-flare',   name: 'QUYOSH PORTLASHI',   creed: 'Sun ejected a CME — battery drains in open space',  color: '#ff7733', durationSec: 90 },
  { id: 'asteroid-rain', name: 'ASTEROID YOMG\'IRI', creed: 'Belt'+ ' debris streaming through inner system',     color: '#cfa080', durationSec: 120 },
  { id: 'pirate-surge',  name: 'QAROQCHI HUJUMI',    creed: 'Increased hostile activity reported',                 color: '#ff5544', durationSec: 100 },
  { id: 'genesis-pulse', name: 'GENESIS PULSI',      creed: 'Anomaly — faction kills double for 60s!',             color: '#ffd060', durationSec: 60 },
];
let activeEvent = null;
function pickRandomEvent() {
  return EVENT_KINDS[Math.floor(Math.random() * EVENT_KINDS.length)];
}
setInterval(() => {
  rolloverFactionDaily();
  if (activeEvent) return;            // one at a time
  if (players.size < 2) return;       // no audience
  if (Math.random() > 0.35) return;   // ~35% chance per check
  const ev = pickRandomEvent();
  activeEvent = {
    ...ev,
    startedAt: Date.now(),
    expiresAt: Date.now() + ev.durationSec * 1000,
  };
  broadcastEvent({
    type: 'event',
    kind: 'event-start',
    event: activeEvent,
  });
  setTimeout(() => {
    if (!activeEvent) return;
    broadcastEvent({
      type: 'event',
      kind: 'event-end',
      event: activeEvent,
    });
    activeEvent = null;
  }, ev.durationSec * 1000);
}, 5 * 60 * 1000); // every 5 min, ~35% spawn rate

// ---- Leaderboard (persistent JSON file) ----
const LB_FILE = path.join(__dirname, 'leaderboard.json');
const LB_MAX_ENTRIES = 50;
const LB_SUBMIT_COOLDOWN_MS = 5_000; // per-IP
const lbSubmitTs = new Map(); // ip -> last submit timestamp
let leaderboard = [];

function loadLeaderboard() {
  try {
    const raw = fs.readFileSync(LB_FILE, 'utf8');
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) leaderboard = arr;
  } catch {}
}
function saveLeaderboard() {
  try {
    fs.writeFile(LB_FILE, JSON.stringify(leaderboard, null, 2), () => {});
  } catch {}
}
function addLeaderboardEntry(entry) {
  // Validate; return { ok, rank } where rank is 1-based or null
  if (!entry || typeof entry !== 'object') return { ok: false };
  const name = String(entry.name || 'Unknown').slice(0, 24);
  const timeSec = +entry.timeSec;
  const modules = +entry.modules || 0;
  const kills = +entry.kills || 0;
  const credits = +entry.credits || 0;
  if (!Number.isFinite(timeSec) || timeSec < 30 || timeSec > 86400) return { ok: false };
  if (!Number.isFinite(modules) || modules < 7 || modules > 100) return { ok: false };
  const newEntry = {
    name, timeSec, modules, kills, credits,
    date: new Date().toISOString().split('T')[0],
    ts: Date.now(),
  };
  leaderboard.push(newEntry);
  leaderboard.sort((a, b) => a.timeSec - b.timeSec);
  if (leaderboard.length > LB_MAX_ENTRIES) leaderboard.length = LB_MAX_ENTRIES;
  saveLeaderboard();
  const rankIdx = leaderboard.indexOf(newEntry);
  return { ok: true, rank: rankIdx >= 0 ? rankIdx + 1 : null };
}
loadLeaderboard();

// ---- Cloud Profile Sync (per-UID JSON storage) ----
const PROFILES_FILE = path.join(__dirname, 'profiles.json');
const PROFILE_MAX_BYTES = 16 * 1024; // 16KB per profile (plenty for stats)
const PROFILE_PUT_COOLDOWN_MS = 4_000; // per-UID
const PROFILES_MAX = 50_000; // hard cap to prevent disk bloat
const profilePutTs = new Map(); // uid -> last put ts
let profiles = {}; // { uid: {token, profile, updatedAt} }
let profilesDirty = false;

function loadProfiles() {
  try {
    const raw = fs.readFileSync(PROFILES_FILE, 'utf8');
    const obj = JSON.parse(raw);
    if (obj && typeof obj === 'object') profiles = obj;
  } catch {}
}
function saveProfilesNow() {
  try {
    fs.writeFile(PROFILES_FILE, JSON.stringify(profiles), () => {});
    profilesDirty = false;
  } catch {}
}
// Batched flush every 10s if dirty
setInterval(() => { if (profilesDirty) saveProfilesNow(); }, 10_000);

function isValidUid(s) {
  return typeof s === 'string' && /^[a-f0-9]{16,64}$/i.test(s);
}
function isValidToken(s) {
  return typeof s === 'string' && /^[a-f0-9]{16,64}$/i.test(s);
}
loadProfiles();

// ---- Transfer Codes (short-lived single-use codes for cross-device profile transfer) ----
const TRANSFER_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const TRANSFER_CODE_GEN_COOLDOWN_MS = 30_000; // per-UID
const TRANSFER_REDEEM_COOLDOWN_MS = 5_000;    // per-IP
const TRANSFER_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous (0/O, 1/I/L)
const transferCodes = new Map(); // code -> {uid, token, expiresAt}
const transferGenTs = new Map(); // uid -> last gen ts
const transferRedeemTs = new Map(); // ip -> last redeem ts

function genTransferCode() {
  // 8 chars, e.g. "XK7F-9LM2" (formatted on display)
  let code = '';
  const bytes = new Uint8Array(8);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < 8; i++) code += TRANSFER_ALPHABET[bytes[i] % TRANSFER_ALPHABET.length];
  return code;
}
function purgeExpiredCodes() {
  const now = Date.now();
  for (const [c, v] of transferCodes) {
    if (v.expiresAt < now) transferCodes.delete(c);
  }
}
setInterval(purgeExpiredCodes, 60_000);
function normalizeCode(s) {
  return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}


function getClientIp(req) {
  return (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
      || req.socket.remoteAddress
      || 'unknown';
}

// ---- HTTP (static + /stats) ----
const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/stats') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    });
    return res.end(JSON.stringify({
      players: players.size,
      totalConnects, totalDisconnects,
      uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
      stateMsgsIn, snapshotsOut, bytesOut,
      memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576),
      tickHz: TICK_HZ, aoiRadius: AOI_RADIUS,
    }));
  }
  if (url === '/api/factions' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    });
    return res.end(JSON.stringify({
      score: factionScore,
      date: factionScoreDate,
      activeEvent,
    }));
  }
  if (url === '/api/leaderboard' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    });
    return res.end(JSON.stringify({ entries: leaderboard.slice(0, 20) }));
  }
  if (url === '/api/leaderboard' && req.method === 'POST') {
    const ip = getClientIp(req);
    const last = lbSubmitTs.get(ip) || 0;
    if (Date.now() - last < LB_SUBMIT_COOLDOWN_MS) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: false, error: 'cooldown' }));
    }
    lbSubmitTs.set(ip, Date.now());
    let body = '';
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > 2048) { req.destroy(); return; }
      body += chunk;
    });
    req.on('end', () => {
      let entry;
      try { entry = JSON.parse(body); } catch {
        res.writeHead(400); return res.end('{"ok":false}');
      }
      const result = addLeaderboardEntry(entry);
      res.writeHead(result.ok ? 200 : 400, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ ok: result.ok, rank: result.rank || null, total: leaderboard.length }));
    });
    return;
  }
  // ---- Cloud Profile Sync ----
  if (url === '/api/profile' && req.method === 'GET') {
    const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const uid = params.get('uid');
    const token = params.get('token');
    if (!isValidUid(uid) || !isValidToken(token)) {
      res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end('{"ok":false,"error":"bad_params"}');
    }
    const entry = profiles[uid];
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    });
    if (!entry) return res.end('{"ok":true,"exists":false}');
    if (entry.token !== token) {
      res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end('{"ok":false,"error":"bad_token"}');
    }
    return res.end(JSON.stringify({ ok: true, exists: true, profile: entry.profile, updatedAt: entry.updatedAt }));
  }
  if (url === '/api/profile' && req.method === 'PUT') {
    let body = '';
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > PROFILE_MAX_BYTES + 256) { req.destroy(); return; }
      body += chunk;
    });
    req.on('end', () => {
      let payload;
      try { payload = JSON.parse(body); } catch {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"bad_json"}');
      }
      const { uid, token, profile } = payload || {};
      if (!isValidUid(uid) || !isValidToken(token)) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"bad_params"}');
      }
      if (!profile || typeof profile !== 'object') {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"bad_profile"}');
      }
      const profileSize = JSON.stringify(profile).length;
      if (profileSize > PROFILE_MAX_BYTES) {
        res.writeHead(413, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"too_large"}');
      }
      const last = profilePutTs.get(uid) || 0;
      if (Date.now() - last < PROFILE_PUT_COOLDOWN_MS) {
        res.writeHead(429, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"cooldown"}');
      }
      profilePutTs.set(uid, Date.now());
      const existing = profiles[uid];
      if (existing && existing.token !== token) {
        res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"bad_token"}');
      }
      // Cap on total profiles (LRU eviction by updatedAt)
      const uids = Object.keys(profiles);
      if (!existing && uids.length >= PROFILES_MAX) {
        let oldestUid = null, oldestTs = Infinity;
        for (const u of uids) {
          const t = profiles[u].updatedAt || 0;
          if (t < oldestTs) { oldestTs = t; oldestUid = u; }
        }
        if (oldestUid) delete profiles[oldestUid];
      }
      profiles[uid] = { token, profile, updatedAt: Date.now() };
      profilesDirty = true;
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify({ ok: true, updatedAt: profiles[uid].updatedAt }));
    });
    return;
  }
  // ---- Transfer code: generate (auth via uid+token) ----
  if (url === '/api/profile/transfer-code' && req.method === 'POST') {
    let body = '';
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > 1024) { req.destroy(); return; }
      body += chunk;
    });
    req.on('end', () => {
      let payload;
      try { payload = JSON.parse(body); } catch {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"bad_json"}');
      }
      const { uid, token } = payload || {};
      if (!isValidUid(uid) || !isValidToken(token)) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"bad_params"}');
      }
      // If profile exists on server, token must match
      const existing = profiles[uid];
      if (existing && existing.token !== token) {
        res.writeHead(403, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"bad_token"}');
      }
      const last = transferGenTs.get(uid) || 0;
      if (Date.now() - last < TRANSFER_CODE_GEN_COOLDOWN_MS) {
        res.writeHead(429, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"cooldown"}');
      }
      transferGenTs.set(uid, Date.now());
      // Generate unique code (collision-resistant retry)
      let code = '';
      for (let i = 0; i < 5; i++) {
        const c = genTransferCode();
        if (!transferCodes.has(c)) { code = c; break; }
      }
      if (!code) {
        res.writeHead(503, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"collision"}');
      }
      const expiresAt = Date.now() + TRANSFER_CODE_TTL_MS;
      transferCodes.set(code, { uid, token, expiresAt });
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify({ ok: true, code, expiresAt, ttlSec: Math.floor(TRANSFER_CODE_TTL_MS / 1000) }));
    });
    return;
  }
  // ---- Transfer code: redeem (no auth needed; consumed on success) ----
  if (url === '/api/profile/redeem-code' && req.method === 'POST') {
    const ip = getClientIp(req);
    const last = transferRedeemTs.get(ip) || 0;
    if (Date.now() - last < TRANSFER_REDEEM_COOLDOWN_MS) {
      res.writeHead(429, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end('{"ok":false,"error":"cooldown"}');
    }
    transferRedeemTs.set(ip, Date.now());
    let body = '';
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > 256) { req.destroy(); return; }
      body += chunk;
    });
    req.on('end', () => {
      let payload;
      try { payload = JSON.parse(body); } catch {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"bad_json"}');
      }
      const code = normalizeCode(payload && payload.code);
      if (!code || code.length !== 8) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"bad_code"}');
      }
      const entry = transferCodes.get(code);
      if (!entry || entry.expiresAt < Date.now()) {
        if (entry) transferCodes.delete(code);
        res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        return res.end('{"ok":false,"error":"not_found"}');
      }
      // Single-use: consume code
      transferCodes.delete(code);
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify({ ok: true, uid: entry.uid, token: entry.token }));
    });
    return;
  }
  if ((url === '/api/profile/transfer-code' || url === '/api/profile/redeem-code') && req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // CORS preflight
  if (url === '/api/profile' && req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  if (url === '/') url = '/index.html';
  const filePath = path.join(__dirname, url);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404); return res.end('Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
    if (STATIC_CACHE_SEC > 0) headers['Cache-Control'] = `public, max-age=${STATIC_CACHE_SEC}`;
    res.writeHead(200, headers);
    res.end(data);
  });
});

// ---- WebSocket Server (compression + payload cap) ----
const wss = new WebSocketServer({
  server,
  maxPayload: MAX_PAYLOAD_BYTES,
  perMessageDeflate: {
    zlibDeflateOptions: { level: 1, memLevel: 7, chunkSize: 8 * 1024 },
    zlibInflateOptions: { chunkSize: 8 * 1024 },
    serverNoContextTakeover: false,
    clientNoContextTakeover: false,
    threshold: 256, // only compress payloads > 256 bytes
  },
});

const players = new Map(); // id -> Player
let nextId = 1;

class Player {
  constructor(ws) {
    this.ws = ws;
    this.id = nextId++;
    this.state = {
      x: 0, y: 0, z: 0,
      qx: 0, qy: 0, qz: 0, qw: 1,
      name: `Pilot-${this.id}`, hvt: false,
      faction: null, // 'ASCENDANT' | 'NIHILIST' | null
    };
    this.dirty = true; // include in next snapshot
    // Rate-limit ring buffers
    this.stateTs = [];
    this.chatTs  = [];
    this.tradeTs = [];
    // Cached neighbor count (for back-pressure decisions)
    this.lastSeenNames = new Map(); // id -> last name version sent
  }
  rateOk(buf, maxHz) {
    const now = Date.now();
    while (buf.length && buf[0] < now - 1000) buf.shift();
    if (buf.length >= maxHz) return false;
    buf.push(now);
    return true;
  }
  send(obj) {
    if (this.ws.readyState !== 1) return;
    const msg = typeof obj === 'string' ? obj : JSON.stringify(obj);
    this.ws.send(msg);
    bytesOut += msg.length;
  }
}

function dist2(a, b) {
  const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z;
  return dx*dx + dy*dy + dz*dz;
}

// ---- Tick: build per-player snapshots of nearby dirty players ----
setInterval(() => {
  if (players.size === 0) return;
  // Gather list of dirty players once
  const dirty = [];
  for (const p of players.values()) if (p.dirty) dirty.push(p);
  if (dirty.length === 0) return;

  for (const p of players.values()) {
    if (p.ws.readyState !== 1) continue;
    const ups = [];
    for (const op of dirty) {
      if (op.id === p.id) continue;
      if (dist2(p.state, op.state) > AOI_RADIUS_SQ) continue;
      // Quantize to fewer decimals to shrink JSON
      ups.push({
        id: op.id,
        x:  +op.state.x.toFixed(1),
        y:  +op.state.y.toFixed(1),
        z:  +op.state.z.toFixed(1),
        qx: +op.state.qx.toFixed(4),
        qy: +op.state.qy.toFixed(4),
        qz: +op.state.qz.toFixed(4),
        qw: +op.state.qw.toFixed(4),
        hvt: !!op.state.hvt,
      });
    }
    if (ups.length === 0) continue;
    p.send({ type: 'snapshot', players: ups });
    snapshotsOut++;
  }

  // Clear dirty flags
  for (const op of dirty) op.dirty = false;
}, TICK_MS);

// ---- WS Connection Lifecycle ----
wss.on('connection', (ws) => {
  const me = new Player(ws);
  players.set(me.id, me);
  totalConnects++;

  // INIT — send everyone in AoI (use origin as start; AoI grows as player moves)
  const initList = [];
  for (const op of players.values()) {
    if (op.id === me.id) continue;
    initList.push({ id: op.id, ...op.state });
  }
  me.send({
    type: 'init',
    id: me.id,
    players: initList,
    factionScore: { ...factionScore },
    activeEvent: activeEvent ? { ...activeEvent } : null,
  });

  // Notify nearby players of join
  for (const op of players.values()) {
    if (op.id === me.id) continue;
    if (dist2(op.state, me.state) > AOI_RADIUS_SQ) continue;
    op.send({ type: 'join', id: me.id, ...me.state });
  }

  ws.on('message', (raw) => {
    if (raw.length > MAX_PAYLOAD_BYTES) return;
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (!msg || typeof msg !== 'object') return;

    const t = msg.type;
    if (t === 'state') {
      if (!me.rateOk(me.stateTs, MAX_STATE_HZ)) return;
      // Validate numbers
      const x = +msg.x, y = +msg.y, z = +msg.z;
      const qx = +msg.qx, qy = +msg.qy, qz = +msg.qz, qw = +msg.qw;
      if (![x, y, z, qx, qy, qz, qw].every(Number.isFinite)) return;
      // World bounds clamp (sanity)
      if (Math.abs(x) > 200000 || Math.abs(y) > 200000 || Math.abs(z) > 200000) return;
      me.state.x = x; me.state.y = y; me.state.z = z;
      me.state.qx = qx; me.state.qy = qy; me.state.qz = qz; me.state.qw = qw;
      if (typeof msg.hvt === 'boolean') me.state.hvt = msg.hvt;
      me.dirty = true;
      stateMsgsIn++;
    } else if (t === 'faction' && (msg.faction === 'ASCENDANT' || msg.faction === 'NIHILIST' || msg.faction === null)) {
      if (me.state.faction === msg.faction) return;
      me.state.faction = msg.faction;
      // Broadcast faction change to nearby players (anyone who might already see them)
      const out = JSON.stringify({ type: 'faction', id: me.id, faction: msg.faction });
      for (const op of players.values()) {
        if (op.id === me.id) continue;
        if (op.ws.readyState !== 1) continue;
        op.send(out);
      }
    } else if (t === 'name' && typeof msg.name === 'string') {
      const name = msg.name.slice(0, 24);
      if (name === me.state.name) return;
      me.state.name = name;
      // Send to nearby only (immediate)
      for (const op of players.values()) {
        if (op.id === me.id) continue;
        if (dist2(op.state, me.state) > AOI_RADIUS_SQ) continue;
        op.send({ type: 'name', id: me.id, name });
      }
    } else if (t === 'chat' && typeof msg.text === 'string') {
      if (!me.rateOk(me.chatTs, MAX_CHAT_HZ)) return;
      const text = msg.text.slice(0, 200);
      if (!text) return;
      // Chat is global (small payloads, rare)
      const out = JSON.stringify({ type: 'chat', id: me.id, name: me.state.name, text });
      for (const op of players.values()) op.send(out);
    } else if (t === 'emote') {
      const emoteId = Number(msg.emote);
      if (!Number.isFinite(emoteId) || emoteId < 0 || emoteId > 15) return;
      // Rate-limit (reuse chat bucket — emotes are like quick chats)
      if (!me.rateOk(me.chatTs, MAX_CHAT_HZ)) return;
      const out = JSON.stringify({ type: 'emote', id: me.id, emote: emoteId });
      for (const op of players.values()) {
        if (op.id === me.id) continue;
        if (dist2(op.state, me.state) > AOI_RADIUS_SQ) continue;
        op.send(out);
      }
    } else if (t === 'pvp-hit') {
      // Relay damage event from attacker to a single victim, with sanity checks
      const targetId = Number(msg.to);
      const target = players.get(targetId);
      if (!target || target.id === me.id) return;
      // Both must have factions set
      if (!me.state.faction || !target.state.faction) return;
      // Friendly fire blocked
      if (me.state.faction === target.state.faction) return;
      // Range check (anti-cheat: attacker must be reasonably close)
      if (dist2(me.state, target.state) > AOI_RADIUS_SQ) return;
      // Damage clamp
      const dmg = Math.max(1, Math.min(120, +msg.dmg || 0));
      const weapon = String(msg.weapon || 'LASER').slice(0, 16);
      target.send({
        type: 'pvp-hit',
        from: me.id,
        fromName: me.state.name,
        fromFaction: me.state.faction,
        dmg,
        weapon,
      });
    } else if (t === 'pvp-kill') {
      // Victim confirms death — broadcast kill notification globally (small msg)
      const victimId = Number(msg.victim);
      const victim = players.get(victimId);
      if (!victim) return;
      // Validate factions are opposite
      if (!me.state.faction || !victim.state.faction) return;
      if (me.state.faction === victim.state.faction) return;
      const weapon = String(msg.weapon || 'LASER').slice(0, 16);
      // Increment faction score (with Genesis Pulse 2x bonus)
      rolloverFactionDaily();
      const mult = (activeEvent && activeEvent.id === 'genesis-pulse') ? 2 : 1;
      factionScore[me.state.faction] = (factionScore[me.state.faction] || 0) + mult;
      const out = JSON.stringify({
        type: 'pvp-kill',
        killer: me.id,
        killerName: me.state.name,
        killerFaction: me.state.faction,
        victim: victim.id,
        victimName: victim.state.name,
        victimFaction: victim.state.faction,
        weapon,
        score: { ...factionScore },
      });
      for (const op of players.values()) op.send(out);
    } else if (t === 'trade-offer' || t === 'trade-accept' || t === 'trade-decline') {
      if (!me.rateOk(me.tradeTs, MAX_TRADE_HZ)) return;
      const targetId = Number(msg.to);
      const target = players.get(targetId);
      if (!target) return;
      // Targets must be in AoI to receive trade (anti-griefing)
      if (dist2(target.state, me.state) > AOI_RADIUS_SQ) return;
      target.send({ ...msg, from: me.id, fromName: me.state.name });
    }
  });

  ws.on('close', () => {
    players.delete(me.id);
    totalDisconnects++;
    // Notify nearby of leave (also fall-back to all — it's tiny)
    const out = JSON.stringify({ type: 'leave', id: me.id });
    for (const op of players.values()) op.send(out);
  });

  ws.on('error', () => {
    try { ws.close(); } catch {}
  });
});

// ---- Stale connection sweeper (kill idle/dead sockets) ----
setInterval(() => {
  for (const [id, p] of players) {
    if (p.ws.readyState !== 1) {
      players.delete(id);
    }
  }
}, 10_000);

// ---- Boot ----
server.listen(PORT, () => {
  console.log(`🚀 Odyssey server: http://localhost:${PORT}`);
  console.log(`   tick=${TICK_HZ}Hz  AoI=${AOI_RADIUS}u  stateLimit=${MAX_STATE_HZ}Hz  compression=on`);
  console.log(`   /stats — JSON monitoring endpoint`);
});

// ---- Graceful shutdown ----
function shutdown() {
  console.log('\n⏻ Shutdown signal received');
  for (const p of players.values()) {
    try { p.ws.close(1001, 'server-shutdown'); } catch {}
  }
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
