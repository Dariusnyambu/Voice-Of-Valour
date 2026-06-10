import { NextRequest, NextResponse } from "next/server";

// Use server-side env var (no NEXT_PUBLIC_ prefix)
const SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ||
  "";

function normalizePhone(p: string): string {
  return String(p || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/^0/, "+254")
    .replace(/^\+2540/, "+254");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, email } = body;

    // ── No API configured — demo mode ──────────────────
    if (!SCRIPT_URL) {
      console.warn("APPS_SCRIPT_URL not set — running in demo mode");
      return NextResponse.json({
        success: true,
        message: "Registration submitted successfully! (demo mode)",
      });
    }

    // ── Step 1: Fetch existing attendees & check duplicate ──
    try {
      const listRes = await fetch(`${SCRIPT_URL}?action=attendees`, {
        cache: "no-store",
        headers: { "Accept": "application/json" },
      });

      if (listRes.ok) {
        const listData = await listRes.json();

        if (listData?.data && Array.isArray(listData.data)) {
          const checkPhone = normalizePhone(phone);
          const checkEmail = String(email || "").trim().toLowerCase();

          const duplicate = listData.data.find((row: Record<string, string>) => {
            const rowPhone = normalizePhone(row["Phone"] || row["phone"] || "");
            const rowEmail = String(row["Email"] || row["email"] || "").trim().toLowerCase();

            const phoneMatch =
              checkPhone.length > 7 &&
              rowPhone.length > 7 &&
              rowPhone === checkPhone;

            const emailMatch =
              checkEmail.length > 5 &&
              rowEmail.length > 5 &&
              rowEmail === checkEmail;

            return phoneMatch || emailMatch;
          });

          if (duplicate) {
            return NextResponse.json({
              success: false,
              isDuplicate: true,
              message:
                "This phone number or email is already registered! Each person only needs to register once.",
            });
          }
        }
      }
    } catch (dupErr) {
      // Log but don't block — better to allow a duplicate than to block a real registration
      console.error("Duplicate check failed:", dupErr);
    }

    // ── Step 2: Submit to Google Sheets ─────────────────
    const submitRes = await fetch(`${SCRIPT_URL}?action=attendee`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
    });

    if (!submitRes.ok) {
      console.error("Apps Script returned:", submitRes.status, submitRes.statusText);
      return NextResponse.json({
        success: false,
        message: "Failed to save registration. Please try again.",
      });
    }

    const result = await submitRes.json();
    return NextResponse.json(result);

  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json({
      success: false,
      message: "Server error. Please try again in a moment.",
    });
  }
}

