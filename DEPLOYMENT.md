# Deployment Guide — Odyssey: Sol's Last Breath

## Architecture

This project uses a split deployment strategy:

- **Vercel** — Static files (HTML, JS, CSS, Service Worker, PWA manifest)
- **Railway/Render** — WebSocket server (Node.js with ws)

Vercel does not support long-running WebSocket servers, so we use a separate platform for the backend.

---

## Step 1: Deploy Static Files to Vercel

### Prerequisites
- Vercel account (free)
- Git repository (GitHub, GitLab, or Bitbucket)

### Instructions

1. Push your code to a Git repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect the `vercel.json` configuration
6. Click "Deploy"

After deployment, you'll get a URL like `https://your-project.vercel.app`

---

## Step 2: Deploy WebSocket Server to Railway

### Why Railway?
- Free tier available ($5/month free credit)
- Supports Node.js WebSocket servers
- Easy deployment from Git
- Automatic HTTPS

### Prerequisites
- Railway account (free)
- Git repository (same as Vercel)

### Instructions

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will detect `package.json` and use `node server.js` as start command
6. Click "Deploy"

After deployment, you'll get a WebSocket URL like `wss://your-app.railway.app`

---

## Step 3: Configure Client WebSocket URL

### Option A: Environment Variable (Recommended)

Add a `WS_URL` environment variable to your Vercel project:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - Name: `WS_URL`
   - Value: `wss://your-app.railway.app`
4. Redeploy

Then update `game.js` to use this variable (see below).

### Option B: Hardcoded in game.js

Edit `game.js` and change the WebSocket URL:

```javascript
// Find the WebSocket connection code
const ws = new WebSocket('wss://your-app.railway.app');
```

---

## Step 4: Update game.js for Dynamic WebSocket URL

Replace the WebSocket connection code in `game.js`:

```javascript
// Dynamic WebSocket URL (supports Vercel env var)
const WS_URL = window.WS_URL || 
               (location.protocol === 'https:' ? 'wss://localhost:3000' : 'ws://localhost:3000');
const ws = new WebSocket(WS_URL);
```

Add this to your `index.html` in the `<head>` section:

```html
<script>
  // Vercel environment variable for WebSocket URL
  window.WS_URL = '{{WS_URL}}';
</script>
```

---

## Alternative: Render (Free Option)

If you prefer Render instead of Railway:

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - Name: `odyssey-ws-server`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Click "Create Web Service"

Render provides free web services with automatic HTTPS.

---

## Alternative: Fly.io

For production-grade deployment:

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Initialize: `fly launch`
4. Deploy: `fly deploy`

Fly.io provides global edge deployment.

---

## Data Persistence

The server uses local JSON files:
- `profiles.json` — Player profiles and BP XP
- `leaderboard.json` — Global leaderboard

For Railway/Render, you need to use a persistent disk:

### Railway
1. Go to your project
2. Click "Storage"
3. Add a volume (e.g., `data`)
4. Mount to `/app/data`
5. Update `server.js` to use `/app/data/profiles.json`

### Render
Render doesn't support persistent disks on free tier. Use a database (PostgreSQL, Redis) for production.

---

## Testing Deployment

1. Visit your Vercel URL
2. Open browser console
3. Check WebSocket connection status
4. Test multiplayer features

---

## Cost Summary

| Platform | Tier | Cost |
|----------|------|------|
| Vercel | Static | Free |
| Railway | Web Service | $5/mo credit (free) |
| Render | Web Service | Free |
| Fly.io | App | ~$5/mo |

Total: **$0-5/month** (depending on platform choice)

---

## Troubleshooting

### WebSocket Connection Failed
- Check WebSocket URL is correct
- Verify Railway/Render service is running
- Check browser console for errors
- Ensure HTTPS is used for WSS connections

### CORS Errors
- Verify server.js has proper CORS headers
- Check Vercel domain is allowed in CORS

### Data Not Persisting
- Ensure persistent disk is configured
- Check file paths in server.js
- Verify permissions on data directory
