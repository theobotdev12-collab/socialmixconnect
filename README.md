# SocialMix Connect (socialmixconnect.com)

Official deep-link routing and social preview service for **SocialMix** — the social messaging app that keeps you connected online and even when there is no internet with survival mode features.

🌐 **Production Domain:** [https://socialmixconnect.com](https://socialmixconnect.com)  
📱 **Android App:** [Download on Google Play](https://play.google.com/store/apps/details?id=com.socialmix.app)

---

## Overview

`socialmixconnect` is a high-performance edge service deployed on **Vercel** designed to:

1. **Generate Rich Open Graph & WhatsApp Link Previews**:
   - High-resolution, WhatsApp-standard cards (1200×630, <300KB) with custom titles, descriptions, and media.
   - Dynamic fetching of entity metadata from Supabase:
     - 👥 **Groups** (`/group/:id`): Community names, descriptions, and avatars.
     - 🍽️ **Food Businesses** (`/food/:id`): Menus, operating hours, features, and photos.
     - 🏠 **Properties** (`/property/:id`): Property listings, descriptions, and image galleries.
     - 🛍️ **Products** (`/product/:id`): Marketplace item titles and photos.
     - 🎥 **Virtual Tours** (`/tour/:id`): Immersive tour thumbnails and details.
     - 🔔 **Doorbell Dreams / Reels** (`/reel/:id`): Short-form video previews.

2. **WhatsApp-Style Interactive Landing Page**:
   - WhatsApp-faithful chat interface rendered in SocialMix's purple brand palette (`#4C1D95`, `#7C3AED`, `#EDE4FF`).
   - Context-aware action buttons (*"Join Group on SocialMix"*, *"View Restaurant on SocialMix"*, etc.).
   - Automatic deferred deep linking via Android `intent://` scheme with Play Store fallback.

3. **Android App Links & Asset Links**:
   - Serves `/.well-known/assetlinks.json` for verified Android App Links.

---

## Tech Stack

- **Runtime:** Node.js (ES Modules) Serverless Functions
- **Hosting / CDN:** Vercel Edge Network
- **Database / Storage:** Supabase (`@supabase/supabase-js`)
- **DNS Registrar:** Spaceship (`socialmixconnect.com`)

---

## File Structure

```text
├── api/
│   └── index.js              # Catch-all serverless function (OG tags, Supabase metadata, landing page)
├── public/
│   └── og-image.png          # High-resolution (1200x630) default SocialMix WhatsApp preview card
├── scripts/
│   └── generate-og-image.ps1 # Generator script for the branded OG image
├── .well-known/
│   └── assetlinks.json       # Android App Links verification
├── vercel.json               # Route rewrites, static caching headers, clean URLs
└── package.json              # Dependencies and ESM configuration
```

---

## Deployment

Pushes to the `main` branch automatically deploy to production via Vercel:

```bash
git add .
git commit -m "feat: description of change"
git push origin main
```
