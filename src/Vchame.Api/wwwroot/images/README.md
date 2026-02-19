# vchame.ge Images

This directory should contain 8 PNG files for the multi-dish feature.

## Required Files

### Dish Character Bodies (faceless food PNGs, ~200x200px recommended)
- `khinkali.png` - Khinkali character without face
- `khachapuri.png` - Khachapuri character without face
- `qababi.png` - Qababi character without face
- `lobiani.png` - Lobiani character without face

### Tab Bar Icons (~32x32px recommended)
- `icon-khinkali.png` - Small khinkali icon for bottom tab
- `icon-khachapuri.png` - Small khachapuri icon for bottom tab
- `icon-qababi.png` - Small qababi icon for bottom tab
- `icon-lobiani.png` - Small lobiani icon for bottom tab

## Notes
- Character bodies should be **faceless** — mood faces are drawn with CSS overlays (7 moods, no need for 28 images)
- AI art prompts are saved in `/c/Users/lenovo/dev/vchame/ai-art-prompts.md`
- After adding images, just drop the 8 PNG files here and the app will work
- Images are cached in service worker (see `/sw.js`)
