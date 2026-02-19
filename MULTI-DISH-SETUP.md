# vchame.ge Multi-Dish PNG Setup

## Status: READY FOR PNG IMAGES

The multi-dish code is complete and configured to use PNG images instead of CSS shapes.

## What Changed

### 1. HTML (`src/Vchame.Api/wwwroot/index.html`)
- Dish character body uses `<img id="dishImage" class="dish-image" src="/images/khinkali.png">`
- Tab icons use `<img src="/images/icon-khinkali.png" class="dish-tab-icon">`
- CSS mood face overlay remains (7 moods, no images needed)

### 2. JavaScript (`src/Vchame.Api/wwwroot/app.js`)
- `switchDish()` updates `dom.dishImage.src` when changing tabs
- `drawDishWithMood()` uses `ctx.drawImage()` for share card canvas
- Preloads all dish images on page load for smooth tab switching
- Fixed image path to `/images/${dishKey}.png` (removed `/dishes/` subdirectory)

### 3. CSS (`src/Vchame.Api/wwwroot/style.css`)
- `.dish-image` styles for PNG display (100% width/height, object-fit: contain)
- `.dish-face` absolute positioning for mood overlay
- `.dish-tab img` styling for tab icons (32x32px, opacity transitions)

### 4. Service Worker (`src/Vchame.Api/wwwroot/sw.js`)
- Cache version bumped to v7
- All 8 PNG paths added to cache manifest

## Required PNG Files (8 total)

Place in: `/c/Users/lenovo/dev/vchame/src/Vchame.Api/wwwroot/images/`

### Dish Characters (faceless bodies, ~200x200px)
- `khinkali.png`
- `khachapuri.png`
- `qababi.png`
- `lobiani.png`

### Tab Icons (~32x32px)
- `icon-khinkali.png`
- `icon-khachapuri.png`
- `icon-qababi.png`
- `icon-lobiani.png`

**IMPORTANT:**
- Character PNGs should be **faceless** — mood faces are CSS overlays
- No need for 28 images (4 dishes × 7 moods) — just 4 faceless characters + 4 tab icons
- Transparent background recommended
- AI art prompts saved in `ai-art-prompts.md`

## Current Placeholders

Transparent 1x1 PNG placeholders exist for all 8 files. App will not break when loaded, but will show tiny placeholders until you replace them with real art.

## Next Steps

1. Generate 8 PNG files using AI (DALL-E/Midjourney/etc) based on prompts in `ai-art-prompts.md`
2. Drop the 8 PNG files into `src/Vchame.Api/wwwroot/images/`
3. Deploy — done!

## Testing

1. Run app locally: `dotnet run` from `src/Vchame.Api/`
2. Check all 4 tabs switch correctly
3. Tap to increment count, check mood face overlays
4. Test share card canvas (should show dish PNG + mood face)
5. Test on mobile (tap icons, PWA install, share to stories)
