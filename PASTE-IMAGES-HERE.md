# Paste Your AI-Generated Images Here

## Main Dish Characters (4 PNGs)
Faceless food bodies - the CSS mood faces will overlay on top.

1. **Khinkali** → `src/Vchame.Api/wwwroot/images/khinkali.png`
2. **Khachapuri** → `src/Vchame.Api/wwwroot/images/khachapuri.png`
3. **Qababi** → `src/Vchame.Api/wwwroot/images/qababi.png`
4. **Lobiani** → `src/Vchame.Api/wwwroot/images/lobiani.png`

## Tab Icons (4 PNGs)
Small icons for the bottom navigation tabs.

1. **Khinkali icon** → `src/Vchame.Api/wwwroot/images/icon-khinkali.png`
2. **Khachapuri icon** → `src/Vchame.Api/wwwroot/images/icon-khachapuri.png`
3. **Qababi icon** → `src/Vchame.Api/wwwroot/images/icon-qababi.png`
4. **Lobiani icon** → `src/Vchame.Api/wwwroot/images/icon-lobiani.png`

---

## After pasting images:
1. Test locally: `dotnet run` (or just push to Railway - auto-deploys)
2. DB migration runs automatically on deploy (adds DishType column safely)
3. Cache version already bumped to v7
4. Share card uses `drawImage()` with your PNGs

## What's working:
- ✅ Backend multi-dish API (DishType param)
- ✅ Frontend tab switching
- ✅ Per-dish counts + moods
- ✅ Multi-dish share card ("Today's Damage")
- ✅ Service worker caches all 8 images
- ✅ DB migration (idempotent - safe to redeploy)

## What you need to do:
- 📋 Paste 8 PNGs into the paths above
- 🚀 Commit & push → Railway auto-deploys
- 🧪 Test at vchame.ge

Done!
