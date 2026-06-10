import { Attendee, Partner, Analytics } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

async function callScript(params: Record<string, string>, body?: Record<string, unknown>) {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  try {
    const res = await fetch(url.toString(), {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "text/plain" }, // Apps Script requires text/plain for POST
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const text = await res.text();
    return JSON.parse(text);
  } catch (err) {
    console.error("Apps Script error:", err);
    return { success: false, message: "Connection failed" };
  }
}

// ── These two functions go through Next.js API routes ────────
// This avoids CORS issues when calling Apps Script from the browser

export async function checkDuplicate(
  phone: string,
  email: string
): Promise<{ isDuplicate: boolean; message?: string }> {
  try {
    const res = await fetch("/api/check-duplicate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, email }),
    });
    if (!res.ok) return { isDuplicate: false };
    return await res.json();
  } catch {
    return { isDuplicate: false };
  }
}

export async function submitAttendee(
  data: Omit<Attendee, "id" | "timestamp">
): Promise<{ success: boolean; message: string; isDuplicate?: boolean }> {
  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      return { success: false, message: "Server error. Please try again." };
    }
    return await res.json();
  } catch {
    return { success: false, message: "Connection failed. Please try again." };
  }
}

export async function submitPartner(
  data: Omit<Partner, "id" | "timestamp">
): Promise<{ success: boolean; message: string }> {
  if (!BASE_URL) return { success: true, message: "Partnership submitted! (demo mode)" };
  const result = await callScript({ action: "partner" }, data);
  return result;
}

export async function getAttendees(): Promise<Attendee[]> {
  if (!BASE_URL) return getMockAttendees();
  const result = await callScript({ action: "attendees" });
  if (!result?.data) return getMockAttendees();
  // Map Google Sheets column headers to our Attendee type
  // Handles both exact matches and common variations
  return result.data.map((row: Record<string, string>, i: number) => ({
    id: row["ID"] || row["id"] || `VOV-${i}`,
    timestamp: row["Timestamp"] || row["timestamp"] || "",
    fullName: row["Full Name"] || row["fullName"] || row["Name"] || "",
    phone: row["Phone"] || row["phone"] || "",
    email: row["Email"] || row["email"] || "",
    gender: row["Gender"] || row["gender"] || "",
    county: row["County"] || row["county"] || "",
    town: row["Town"] || row["town"] || row["Town/City"] || "",
    churchName: row["Church Name"] || row["churchName"] || row["Church"] || "",
    churchLocation: row["Church Location"] || row["churchLocation"] || "",
    position: row["Position"] || row["position"] || "",
    attendanceType: row["Attendance Type"] || row["attendanceType"] || row["Type"] || "",
    notes: row["Notes"] || row["notes"] || "",
  }));
}

export async function getPartners(): Promise<Partner[]> {
  if (!BASE_URL) return getMockPartners();
  const result = await callScript({ action: "partners" });
  if (!result?.data) return getMockPartners();
  return result.data.map((row: Record<string, string>, i: number) => ({
    id: row["ID"] || row["id"] || `VOV-P-${i}`,
    timestamp: row["Timestamp"] || row["timestamp"] || "",
    fullName: row["Full Name"] || row["fullName"] || row["Name"] || "",
    organization: row["Organization"] || row["organization"] || "",
    phone: row["Phone"] || row["phone"] || "",
    email: row["Email"] || row["email"] || "",
    category: row["Category"] || row["category"] || "",
    description: row["Description"] || row["description"] || "",
    amount: row["Amount"] || row["amount"] || "",
    message: row["Message"] || row["message"] || "",
  }));
}

export async function getAnalytics(): Promise<Analytics> {
  if (!BASE_URL) return getMockAnalytics();
  const result = await callScript({ action: "analytics" });
  return result?.data || getMockAnalytics();
}

// ── Mock fallbacks ──────────────────────────────────────────
function getMockAttendees(): Attendee[] {
  return [
    { id: "VOV-001", timestamp: "2026-06-01T08:30:00Z", fullName: "John Kamau", phone: "+254712345678", email: "john@example.com", gender: "Male", county: "Nairobi", town: "Nairobi", churchName: "FGCK Christ Centre", churchLocation: "Kasarani", position: "Church Member", attendanceType: "Individual" },
    { id: "VOV-002", timestamp: "2026-06-01T09:15:00Z", fullName: "Mary Wanjiku", phone: "+254723456789", email: "mary@example.com", gender: "Female", county: "Kiambu", town: "Thika", churchName: "CITAM", churchLocation: "Thika Road", position: "Worship Leader", attendanceType: "Individual" },
    { id: "VOV-003", timestamp: "2026-06-02T08:00:00Z", fullName: "Grace Njeri", phone: "+254745678901", email: "grace@example.com", gender: "Female", county: "Nairobi", town: "Westlands", churchName: "Mavuno Church", churchLocation: "Westlands", position: "Youth Leader", attendanceType: "Individual" },
    { id: "VOV-004", timestamp: "2026-06-02T09:30:00Z", fullName: "David Mutua", phone: "+254756789012", email: "david@example.com", gender: "Male", county: "Machakos", town: "Machakos", churchName: "AIC Machakos", churchLocation: "Machakos", position: "Pastor", attendanceType: "Group" },
    { id: "VOV-005", timestamp: "2026-06-03T07:45:00Z", fullName: "Faith Akinyi", phone: "+254767890123", email: "faith@example.com", gender: "Female", county: "Nairobi", town: "Eastlands", churchName: "Jesus Winner Ministry", churchLocation: "Umoja", position: "Choir Member", attendanceType: "Individual" },
  ];
}

function getMockPartners(): Partner[] {
  return [
    { id: "VOV-P001", timestamp: "2026-06-01T10:00:00Z", fullName: "James Waweru", organization: "Waweru Enterprises", phone: "+254700123456", email: "james@waweru.co.ke", category: "Financial Support", description: "Financial support for event", amount: "50000" },
    { id: "VOV-P002", timestamp: "2026-06-02T11:00:00Z", fullName: "Sarah Muthoni", organization: "Sound Solutions Ltd", phone: "+254700234567", email: "sarah@soundsolutions.co.ke", category: "Music Equipment", description: "PA System and sound equipment" },
  ];
}

function getMockAnalytics(): Analytics {
  return {
    totalAttendees: 248,
    totalPartners: 12,
    churchesRepresented: 45,
    todayRegistrations: 18,
    registrationsPerDay: [
      { date: "May 28", count: 12 }, { date: "May 29", count: 19 },
      { date: "May 30", count: 28 }, { date: "May 31", count: 35 },
      { date: "Jun 1", count: 42 },  { date: "Jun 2", count: 56 },
      { date: "Jun 3", count: 38 },  { date: "Jun 4", count: 18 },
    ],
    partnersPerDay: [
      { date: "May 28", count: 1 }, { date: "May 29", count: 2 },
      { date: "May 30", count: 1 }, { date: "May 31", count: 2 },
      { date: "Jun 1", count: 3 },  { date: "Jun 2", count: 2 },
      { date: "Jun 3", count: 1 },  { date: "Jun 4", count: 0 },
    ],
    positionDistribution: [
      { name: "Church Member", value: 95 }, { name: "Worship Leader", value: 32 },
      { name: "Youth Leader", value: 28 },  { name: "Choir Member", value: 24 },
      { name: "Praise Team", value: 22 },   { name: "Deacon", value: 18 },
      { name: "Elder", value: 15 },         { name: "Pastor", value: 10 },
      { name: "Other", value: 4 },
    ],
    churchRepresentation: [
      { name: "FGCK", value: 45 },   { name: "CITAM", value: 38 },
      { name: "Mavuno", value: 32 }, { name: "Deliverance", value: 28 },
      { name: "AIC", value: 25 },    { name: "Others", value: 80 },
    ],
  };
}
