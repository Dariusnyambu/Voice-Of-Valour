import { NextRequest, NextResponse } from "next/server";

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
    const { phone, email } = await req.json();

    if (!phone && !email) {
      return NextResponse.json({ isDuplicate: false });
    }

    if (!SCRIPT_URL) {
      return NextResponse.json({ isDuplicate: false });
    }

    const listRes = await fetch(`${SCRIPT_URL}?action=attendees`, {
      cache: "no-store",
    });

    if (!listRes.ok) {
      return NextResponse.json({ isDuplicate: false });
    }

    const data = await listRes.json();

    if (!data?.data || !Array.isArray(data.data)) {
      return NextResponse.json({ isDuplicate: false });
    }

    const checkPhone = normalizePhone(phone);
    const checkEmail = String(email || "").trim().toLowerCase();

    const duplicate = data.data.find((row: Record<string, string>) => {
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
        isDuplicate: true,
        message:
          "This phone number or email is already registered. Each person only needs to register once!",
      });
    }

    return NextResponse.json({ isDuplicate: false });

  } catch (err) {
    console.error("Check duplicate error:", err);
    // On error allow through — don't block registrations
    return NextResponse.json({ isDuplicate: false });
  }
}
