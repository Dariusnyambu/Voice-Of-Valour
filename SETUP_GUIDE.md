# Voice Of Valour Season 4 — Complete Setup Guide

## 🚀 Quick Start

```bash
cd voice-of-valour
npm install
npm run dev
```

Visit: http://localhost:3000
Admin: http://localhost:3000/admin (use credentials from .env.local)

---

## 📁 Project Structure

```
voice-of-valour/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── login/page.tsx              # Admin login
│   ├── admin/
│   │   ├── layout.tsx              # Admin sidebar layout
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── attendees/page.tsx      # Attendees table
│   │   ├── partners/page.tsx       # Partners table
│   │   └── analytics/page.tsx      # Charts & analytics
│   └── api/auth/[...nextauth]/     # NextAuth handler
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── CountdownSection.tsx
│       ├── AboutSection.tsx
│       ├── MinistersSection.tsx
│       ├── RegistrationSection.tsx
│       ├── PartnershipSection.tsx
│       ├── StatisticsSection.tsx
│       ├── DirectionsSection.tsx
│       └── FAQSection.tsx
├── data/ministers.ts
├── lib/
│   ├── auth.ts                     # NextAuth config
│   ├── sheets.ts                   # Google Sheets API
│   └── utils.ts
├── types/index.ts
├── middleware.ts                   # Admin route protection
├── google-apps-script/Code.gs      # Backend script
└── .env.local                      # Environment variables
```

---

## 🔑 Environment Variables

Create `.env.local` in the project root:

```env
# Admin Authentication
ADMIN_EMAIL=admin@voiceofvalour.co.ke
ADMIN_PASSWORD=YourSecurePassword2026!
NEXTAUTH_SECRET=generate-a-random-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Google Apps Script API URLs (fill after Step 2)
NEXT_PUBLIC_ATTENDEE_API_URL=https://script.google.com/macros/s/YOUR_ID/exec?action=attendee
NEXT_PUBLIC_PARTNER_API_URL=https://script.google.com/macros/s/YOUR_ID/exec?action=partner
NEXT_PUBLIC_ANALYTICS_API_URL=https://script.google.com/macros/s/YOUR_ID/exec?action=analytics

# Google Maps (optional — map embed works without key)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

---

## 📊 Step 1 — Google Sheets Setup

1. Go to https://sheets.google.com
2. Create a new spreadsheet named: **Voice Of Valour Season 4**
3. Create two sheets (tabs):
   - **Attendees** — with headers:
     `ID | Timestamp | Full Name | Phone | Email | Gender | County | Town | Church Name | Church Location | Position | Attendance Type | Notes`
   - **Partners** — with headers:
     `ID | Timestamp | Full Name | Organization | Phone | Email | Category | Description | Amount | Message`
4. Copy the Spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`

---

## ⚙️ Step 2 — Google Apps Script Setup

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete the default `myFunction()` code
3. Paste the entire contents of `google-apps-script/Code.gs`
4. Click **Save** (floppy disk icon)
5. Click **Deploy → New deployment**
6. Configure:
   - Type: **Web app**
   - Description: `Voice Of Valour API v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**
8. **Copy the Web App URL** — it looks like:
   `https://script.google.com/macros/s/AKfyc.../exec`
9. Update your `.env.local`:
   ```
   NEXT_PUBLIC_ATTENDEE_API_URL=https://script.google.com/macros/s/YOUR_ID/exec?action=attendee
   NEXT_PUBLIC_PARTNER_API_URL=https://script.google.com/macros/s/YOUR_ID/exec?action=partner
   NEXT_PUBLIC_ANALYTICS_API_URL=https://script.google.com/macros/s/YOUR_ID/exec?action=analytics
   ```

> **Note:** The same script URL handles all actions via the `?action=` query parameter.

---

## ▲ Step 3 — Vercel Deployment

### Option A: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B: Via GitHub

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Voice Of Valour Season 4"
   git remote add origin https://github.com/YOUR_USERNAME/voice-of-valour.git
   git push -u origin main
   ```
2. Go to https://vercel.com → **Add New Project**
3. Import your GitHub repository
4. Framework: **Next.js** (auto-detected)
5. Add all environment variables from `.env.local`
6. Click **Deploy**

### Environment Variables on Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Key | Value |
|-----|-------|
| `ADMIN_EMAIL` | your admin email |
| `ADMIN_PASSWORD` | your admin password |
| `NEXTAUTH_SECRET` | your generated secret |
| `NEXTAUTH_URL` | https://your-app.vercel.app |
| `NEXT_PUBLIC_ATTENDEE_API_URL` | your apps script URL + ?action=attendee |
| `NEXT_PUBLIC_PARTNER_API_URL` | your apps script URL + ?action=partner |
| `NEXT_PUBLIC_ANALYTICS_API_URL` | your apps script URL + ?action=analytics |

---

## 🔐 Step 4 — Admin Account Setup

Default credentials (set in `.env.local`):
- **Email:** admin@voiceofvalour.co.ke
- **Password:** VoiceOfValour2026!

**To change credentials:**
1. Update `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your environment variables
2. Redeploy or restart the dev server

Admin dashboard is at: `/admin`
Login page is at: `/login`

---

## 📥 Export Functionality

The admin dashboard includes export buttons:

| Export | Format | Library |
|--------|--------|---------|
| Excel | `.xlsx` | SheetJS (xlsx) |
| CSV | `.csv` | Built-in |
| Print | Browser print | Built-in |

No additional setup required — these work out of the box.

---

## 🗺️ Google Maps

The venue map currently uses a standard iframe embed which works without an API key.

To upgrade to the full React Google Maps integration:
1. Get a Google Maps API key from https://console.cloud.google.com
2. Enable the **Maps JavaScript API** and **Maps Embed API**
3. Add to Vercel env vars: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key`

---

## 🎨 Customization

### Minister Photos
Minister photos are stored in `/public/`:
- `/public/minister-denis.jpg`
- `/public/minister-mercy.jpg`
- `/public/minister-jane.jpg`
- `/public/minister-zenith.jpg`
- `/public/minister-joseph.jpg`

Replace these files with higher-resolution versions as needed.

### Minister Data
Edit `/data/ministers.ts` to update names, titles, bios, and social links.

### Colors
All brand colors are defined as CSS variables in `app/globals.css`:
```css
--gold: #F5B301;
--gold-dark: #D89A00;
--gold-light: #FFE7A0;
--bg-dark: #111827;
```

### Event Info
Update event details in:
- `components/sections/HeroSection.tsx` — date, time, venue
- `components/sections/CountdownSection.tsx` — TARGET_DATE
- `components/sections/DirectionsSection.tsx` — maps link, venue details

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI primitives |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Authentication | NextAuth v5 (Credentials) |
| Database | Google Sheets via Apps Script |
| Export | SheetJS (xlsx) |
| Notifications | Sonner |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 🐛 Troubleshooting

**Admin login not working:**
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in env vars
- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your actual domain

**Google Sheets not saving:**
- Confirm Apps Script is deployed as Web App with access: **Anyone**
- Check the API URL includes the correct `?action=` parameter
- Test the URL directly in browser: `YOUR_URL?action=analytics`

**Build errors:**
```bash
npm run build 2>&1 | head -50
```

**Framer Motion SSR errors:**
- All animated components must have `"use client"` at the top — already done.

---

## 📞 Support

Built by **Royal Graphix** for Voice Of Valour Season 4.

For technical support, contact the development team.

> *"The Spirit of the Lord is upon me..." — Luke 4:18*
