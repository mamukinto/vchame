# vchame.ge

Georgian food counter PWA. Tap to count, share your shame on Instagram stories.

## What it does

Track how much you eat (khinkali, khachapuri, qababi, lobiani) with:
- Per-dish counters with mood faces (happy → dead)
- Roast toasts at milestones (5, 10, 15, 20, 30)
- Food personality badges (Khinkali Lord, Cheese Brain, etc.)
- Streak tracking (consecutive days)
- Global leaderboard (top 100)
- Instagram story share cards (with optional photo & location)
- Works offline, installable as PWA

## Stack

- .NET 9 Minimal API
- Neon Postgres (free tier)
- Vanilla JS (zero dependencies)
- PWA (service worker, offline support)
- Georgian + English i18n

## Hosting

- Railway (auto-deploys from main branch)
- Cloudflare DNS (vchame.ge)

## Run locally

```bash
cd src/Vchame.Api
dotnet run
```

Open http://localhost:5000

## Live

**[vchame.ge](https://vchame.ge)**

## License

MIT — do whatever you want with it
