# Vercel Environment Variables
# Add these in: Vercel Project → Settings → Environment Variables

ADMIN_EMAIL=admin@voiceofvalour.co.ke
ADMIN_PASSWORD=VoiceOfValour2026!
NEXTAUTH_SECRET=voice-of-valour-secret-2026
NEXTAUTH_URL=https://YOUR-VERCEL-DOMAIN.vercel.app

NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbys6yoqhcjy-REL8v1_UQIaIHPxb__FZiHu9dBQaEMpBFCZb8jIf5BGthW58BgEcxHb/exec

NEXT_PUBLIC_SHEET_ID=1xUy_9RuWPQPfxX93LKYEvqZtL6UEQ8djgOEtt36wJHA

# ── Google Apps Script Instructions ──────────────────────────
# 1. Open your Google Sheet (ID above)
# 2. Extensions → Apps Script
# 3. Paste the full contents of google-apps-script/Code.gs
# 4. Save (Ctrl+S)
# 5. Click "Run" → select "testScript" to verify it works
# 6. Deploy → New Deployment
#    Type: Web app | Execute as: Me | Access: Anyone
# 7. The Web App URL is already configured above ✓

# ── Testing the API ──────────────────────────────────────────
# Open these URLs in your browser to test:
# GET attendees:
#   https://script.google.com/macros/s/AKfycbys6yoqhcjy-REL8v1_UQIaIHPxb__FZiHu9dBQaEMpBFCZb8jIf5BGthW58BgEcxHb/exec?action=attendees
# GET partners:
#   https://script.google.com/macros/s/AKfycbys6yoqhcjy-REL8v1_UQIaIHPxb__FZiHu9dBQaEMpBFCZb8jIf5BGthW58BgEcxHb/exec?action=partners
# GET analytics:
#   https://script.google.com/macros/s/AKfycbys6yoqhcjy-REL8v1_UQIaIHPxb__FZiHu9dBQaEMpBFCZb8jIf5BGthW58BgEcxHb/exec?action=analytics
