# 🎮 Weekend Millionaire — Dynarisk Training Edition
Multiplayer real-time quiz game for UFT fraud awareness training.

## How it works
- **GM opens** `/gm` on their laptop (projector optional)
- **Players open** the root URL `/` on their phone or laptop
- Players enter their name — no passwords, no login
- **GM controls all pacing**: starts the game, shows questions, reveals answers
- Players who answer wrong are **marked as eliminated** but stay in the game
- GM can see every player's status in real time

---

## 🚀 Deployment Options

### Option A — Railway (Recommended, free tier available)
1. Create a free account at **railway.app**
2. Click "New Project" → "Deploy from GitHub repo"
3. Push this folder to a GitHub repo, or use Railway's drag-and-drop deploy
4. Railway auto-detects Node.js, runs `npm start`, assigns a public URL
5. Share `https://your-app.railway.app` with players
6. GM opens `https://your-app.railway.app/gm`

### Option B — Render (Free tier)
1. Create account at **render.com**
2. New → Web Service → connect your GitHub repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Free tier may sleep after 15min inactivity — wake it before the session

### Option C — fly.io (Generous free tier)
```bash
npm install -g flyctl
fly auth signup
fly launch        # follow prompts
fly deploy
```

### Option D — Any VPS (DigitalOcean, Hetzner, Linode etc.)
```bash
# On your VPS:
git clone <your-repo> && cd weekend-millionaire
npm install
npm install -g pm2
pm2 start server.js --name millionaire
pm2 save

# Optional: nginx reverse proxy on port 80/443
```

---

## 🎮 Running a Session

### Before the session
1. Deploy and verify the URL works
2. Open `/gm` on your laptop (bookmark it)
3. Test with one device as a player first
4. Share the player URL with your team (QR code recommended)

### During the session
| GM Action | What happens |
|-----------|-------------|
| **Start Game** | Players leave lobby, see "Training in progress..." |
| **Show Question** | All players see the question simultaneously |
| **50/50** | Removes 2 wrong answers on everyone's screen |
| **Ask Team** | Shows live vote distribution on GM screen + player screens |
| **Call the Expert** | Shows hint ONLY on GM screen (read it aloud) |
| **Reveal Answer** | All players see correct answer + explanation |
| **Presentation Mode** | Players go back to waiting screen (for your slides) |
| **Reset** | Wipes everything, back to lobby |

### Flow per question
1. Do your presentation segment
2. Click **Presentation Mode** (if not already)
3. When ready: click **Show Question** — everyone sees it at once
4. Wait for players to answer (watch the "X/10 answered" counter)
5. Optionally use lifelines
6. Click **Reveal Answer** — explanations shown to all
7. Discuss the answer with the team
8. Click **Presentation Mode** to continue training

---

## 🏆 Scoring
- Answer all 10 correctly → **£1,000,000 winner**
- Wrong answer → **eliminated** (marked on GM dashboard, but keep playing)
- Still in running at game end → show winner(s)

---

## 📁 Project Structure
```
millionaire/
├── server.js         # Express + Socket.io backend
├── package.json
└── public/
    ├── index.html    # Player view (mobile-friendly)
    └── gm.html       # Game Master dashboard
```

## Local Development
```bash
npm install
npm start
# Open http://localhost:3000/gm in one tab (GM)
# Open http://localhost:3000 in another tab (player)
```

---

*Dynarisk Support Team Training | Version 1.0*
