# Image Placement Instructions

You have **8 PNG images** to paste into: `src/Vchame.Api/wwwroot/images/`

## Required Files (all in same flat directory)

### Dish Character Images (4 files)
**Large tappable dish bodies (faceless - CSS overlays the mood face)**

1. `khinkali.png`
2. `khachapuri.png`
3. `qababi.png`
4. `lobiani.png`

### Tab Icon Images (4 files)
**Small icons for bottom navigation tabs (prefix with icon-)**

1. `icon-khinkali.png`
2. `icon-khachapuri.png`
3. `icon-qababi.png`
4. `icon-lobiani.png`

## Quick Paste Commands

From your download folder (adjust path):

```bash
cd /path/to/your/downloads

# Copy dish characters
cp khinkali.png C:\Users\lenovo\dev\vchame\src\Vchame.Api\wwwroot\images\
cp khachapuri.png C:\Users\lenovo\dev\vchame\src\Vchame.Api\wwwroot\images\
cp qababi.png C:\Users\lenovo\dev\vchame\src\Vchame.Api\wwwroot\images\
cp lobiani.png C:\Users\lenovo\dev\vchame\src\Vchame.Api\wwwroot\images\

# Copy tab icons (rename them to icon-*.png format)
cp khinkali-icon.png C:\Users\lenovo\dev\vchame\src\Vchame.Api\wwwroot\images\icon-khinkali.png
cp khachapuri-icon.png C:\Users\lenovo\dev\vchame\src\Vchame.Api\wwwroot\images\icon-khachapuri.png
cp qababi-icon.png C:\Users\lenovo\dev\vchame\src\Vchame.Api\wwwroot\images\icon-qababi.png
cp lobiani-icon.png C:\Users\lenovo\dev\vchame\src\Vchame.Api\wwwroot\images\icon-lobiani.png
```

## Verify

After pasting, check:
```bash
ls C:\Users\lenovo\dev\vchame\src\Vchame.Api\wwwroot\images\
```

You should see 8 files total.

## Then Deploy

Once images are in place:
```bash
cd C:\Users\lenovo\dev\vchame
git add .
git commit -m "multi-dish feature with AI-generated PNGs"
git push
```

Railway will auto-deploy from the `main` branch.
