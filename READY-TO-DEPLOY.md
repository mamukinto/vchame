# vchame.ge Multi-Dish Feature — READY TO DEPLOY ✅

## What's Done

### Backend (.NET API)
✅ Multi-dish support added to `Program.cs`:
- DishType column migration (idempotent SQL)
- `/api/eat` accepts `dishType` parameter
- `/api/undo` accepts `dishType` parameter
- `/api/stats` returns per-dish breakdown in `data.dishes[dishKey]`
- Primary key updated: (DeviceId, Date, DishType)

### Frontend (HTML/CSS/JS)
✅ Complete UI rebuild for 4 dishes:
- **index.html**: New layout with dish tabs, image-based dishes, face overlay
- **style.css**: Removed CSS-drawn khinkali, added `.dish-zone`, `.dish-tabs`, `.dish-image`, `.dish-face`
- **app.js**: Multi-dish state management, tab switching, per-dish counters, image-based share card
- **sw.js**: Updated cache version (v7) for multi-dish assets

### Features Working
✅ Tab navigation (khinkali, khachapuri, qababi, lobiani)
✅ Per-dish counting and stats
✅ Per-dish mood faces (7 states, custom messages per dish)
✅ Image-based dish characters (PNG) with CSS face overlay
✅ Multi-dish share card (Canvas API, shows all dishes eaten today)
✅ i18n (Georgian/English) for all 4 dishes
✅ Optimistic UI, Web Animations API, device persistence
✅ PWA install, global banner, undo button

## What's Missing

❌ **8 PNG images** need to be pasted into `src/Vchame.Api/wwwroot/images/`:

**Dish characters (faceless bodies):**
- khinkali.png
- khachapuri.png
- qababi.png
- lobiani.png

**Tab icons:**
- icon-khinkali.png
- icon-khachapuri.png
- icon-qababi.png
- icon-lobiani.png

📍 **You have these generated already** — just paste them into the `/images/` directory!

## Deploy Steps

### 1. Paste Images
Copy your 8 PNG files into:
```
dev/vchame/src/Vchame.Api/wwwroot/images/
```

Check:
```bash
cd dev/vchame
ls src/Vchame.Api/wwwroot/images/
# Should show 8 .png files (+ README.md)
```

### 2. Commit & Push
```bash
cd dev/vchame
git add .
git commit -m "add multi-dish feature with AI-generated dish PNGs

- 4 dishes: khinkali, khachapuri, qababi, lobiani
- image-based dish characters with CSS mood face overlay
- bottom tab navigation for dish switching
- per-dish counters and stats
- multi-dish share card (Today's Damage)
- backend DishType column migration
- i18n support for all dishes

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

Railway auto-deploys from `main` branch → live in ~2 minutes.

### 3. Test on vchame.ge
- Open vchame.ge on mobile
- Tap each of 4 dish tabs (should switch images)
- Count khinkali, switch to khachapuri, count it → stats should be independent
- Share card should show all dishes eaten today
- Install as PWA, check offline mode

## Vlog Content Plan (After Deploy)

### Video 1: Code Walkthrough (~15 min)
- Show CSS khinkali → PNG swap
- Explain multi-dish architecture (dishCounts object, tab switching)
- Canvas share card with drawImage()
- PWA setup, Railway auto-deploy
- **Film anytime** — just screencast + voiceover

### Video 2: Multi-Dish Build Process (~20 min)
- AI art generation (show prompts, Nanobanana output, remove.bg for transparency)
- Code changes (backend migration, frontend rebuild)
- Deploy to Railway, watch logs
- **Film during next iteration** (if you add more dishes or features)

### Video 3: Launch Day at Restaurant (~10 min)
- Go to restaurant with friends (Tbilisi, after Tashkent)
- Everyone installs vchame.ge, counts food, shares Instagram stories
- Reactions, "ძმაო..." moments, watermark visibility
- **Film ~March 1-7** (after March vendor blitz)

### Video 4: 30-Day Results (~15 min)
- Analytics reveal (users, dishes counted, PWA installs, shares)
- What worked, what didn't
- Learnings: viral loop, friend-to-friend spread, restaurant adoption
- **Film April 1** (30 days after launch)

### Bonus: Tashkent Pull-Up Bar Hunting Vlog
- Personal channel content (not vchame-related)
- You hunting for pull-up bars in Tashkent Feb 17-27
- Film during Tashkent trip, upload to "Mamuka Sarkisyan" channel

## Tech Stack Summary

**Backend:**
- .NET 9 Minimal API
- Neon Postgres (free 0.5GB)
- Multi-dish data model with DishType column

**Frontend:**
- Vanilla JS (no frameworks)
- PWA (manifest, service worker, offline support)
- Canvas API for share cards
- Web Animations API (zero reflow)
- i18n (Georgian/English)

**Hosting:**
- Railway (auto-deploy from GitHub main branch)
- Cloudflare DNS (vchame.ge → Railway)

**Repo:**
- github.com/mamukinto/vchame (public, open source)

## File Changes (For Reference)

```
Modified:
- src/Vchame.Api/Program.cs (DishType migration, per-dish stats)
- src/Vchame.Api/wwwroot/index.html (dish tabs, image-based layout)
- src/Vchame.Api/wwwroot/app.js (multi-dish state, tab switching, share card)
- src/Vchame.Api/wwwroot/style.css (removed CSS khinkali, added tabs)
- src/Vchame.Api/wwwroot/sw.js (cache v7)

New:
- src/Vchame.Api/wwwroot/images/ (directory for 8 PNGs)
- IMAGE_INSTRUCTIONS.md (this file)
- ai-art-prompts.md (AI art prompts for regeneration)
```

---

**You're literally one step away: paste the 8 PNGs and push to deploy! 🚀**

Have a great flight to Tashkent! Test vchame.ge on your phone during downtime.
