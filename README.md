# Starantor — Website

Statische Website (React 18 UMD + Babel Standalone, kein Build-Schritt). Deploy via Vercel.

## Struktur

```
/
├── index.html      Entry, Design-Tokens (CSS), Fonts, CDN-Scripts (SRI-gepinnt)
├── app.jsx         Alle React-Komponenten
├── i18n.js         Texte DE/EN
├── vercel.json     Security Headers (CSP, HSTS, XFO, ...) + Caching
└── assets/
    ├── logo-web.png
    └── clients/    Kundenlogos
```

## Platzhalter ersetzen

- `HERO_VIDEO` in `app.jsx` — eigener Showreel-Loop (.mp4)
- `WORK_MEDIA` in `app.jsx` — Projektvideos (z.B. `assets/work/*.mp4`)
- Gründerportraits in `AboutUs` (`assets/team/*.jpg`)
- Case-Texte (Aufgabe/Umsetzung/Ergebnis) in `i18n.js` → `work.items`

Eigene Videos unter `assets/` ablegen und in `vercel.json` ist `media-src 'self'` bereits erlaubt; die externe Placeholder-Domain (`commondatastorage.googleapis.com`) kann danach aus der CSP entfernt werden.

## Lokal testen

```
npx serve .
```
