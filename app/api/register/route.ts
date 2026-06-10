import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!SCRIPT_URL) {
      return NextResponse.json({
        success: false,
        message: "Apps Script URL not configured",
      });
    }

    // 👉 SEND TO GOOGLE APPS SCRIPT
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "attendee",
        ...body,
      }),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}