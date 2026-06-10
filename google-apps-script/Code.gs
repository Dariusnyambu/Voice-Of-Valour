// ============================================================
// VOICE OF VALOUR SEASON 4 — Google Apps Script Backend
// ============================================================
// HOW TO DEPLOY:
// 1. Open your Google Sheet
// 2. Extensions → Apps Script
// 3. Paste this entire file, replacing any existing code
// 4. Click Save (Ctrl+S)
// 5. Deploy → New Deployment
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Copy the Web App URL
// ============================================================

const SPREADSHEET_ID = "1xUy_9RuWPQPfxX93LKYEvqZtL6UEQ8djgOEtt36wJHA";

// ── CORS headers helper ─────────────────────────────────────
function setCORSHeaders(output) {
  return output;
}

// ── Main GET handler ────────────────────────────────────────
function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    if (action === "attendees")  result = getAttendees();
    else if (action === "partners")   result = getPartners();
    else if (action === "analytics")  result = getAnalytics();
    else result = { success: false, message: "Unknown action: " + action };
  } catch (err) {
    result = { success: false, message: err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Main POST handler ───────────────────────────────────────
function doPost(e) {
  let data = {};
  let action = "";

  try {
    // Parse body — sent as plain text JSON
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    // action comes from URL query param
    action = e.parameter.action || data.action || "";
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: "Parse error: " + err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  let result;
  try {
    if (action === "attendee")  result = addAttendee(data);
    else if (action === "partner")   result = addPartner(data);
    else result = { success: false, message: "Unknown action: " + action };
  } catch (err) {
    result = { success: false, message: "Error: " + err.toString() };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── GET Attendees ───────────────────────────────────────────
function getAttendees() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName("Attendees");
  if (!sheet || sheet.getLastRow() < 2) return { success: true, data: [] };

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const data = rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i] || ""; });
    return obj;
  });
  return { success: true, data: data };
}

// ── ADD Attendee ────────────────────────────────────────────
function addAttendee(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName("Attendees");

  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet("Attendees");
    sheet.appendRow([
      "ID", "Timestamp", "Full Name", "Phone", "Email",
      "Gender", "County", "Town", "Church Name",
      "Church Location", "Position", "Attendance Type", "Notes"
    ]);
    // Style header row
    sheet.getRange(1, 1, 1, 13).setBackground("#F5B301").setFontWeight("bold");
  }

  const id = "VOV-" + new Date().getTime();
  const timestamp = new Date().toISOString();

  sheet.appendRow([
    id,
    timestamp,
    data.fullName   || "",
    data.phone      || "",
    data.email      || "",
    data.gender     || "",
    data.county     || "",
    data.town       || "",
    data.churchName || "",
    data.churchLocation || "",
    data.position   || "",
    data.attendanceType || "",
    data.notes      || ""
  ]);

  return { success: true, message: "Registration submitted successfully!", id: id };
}

// ── GET Partners ────────────────────────────────────────────
function getPartners() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName("Partners");
  if (!sheet || sheet.getLastRow() < 2) return { success: true, data: [] };

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const data = rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i] || ""; });
    return obj;
  });
  return { success: true, data: data };
}

// ── ADD Partner ─────────────────────────────────────────────
function addPartner(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName("Partners");

  if (!sheet) {
    sheet = ss.insertSheet("Partners");
    sheet.appendRow([
      "ID", "Timestamp", "Full Name", "Organization",
      "Phone", "Email", "Category", "Description", "Amount", "Message"
    ]);
    sheet.getRange(1, 1, 1, 10).setBackground("#F5B301").setFontWeight("bold");
  }

  const id = "VOV-P-" + new Date().getTime();
  const timestamp = new Date().toISOString();

  sheet.appendRow([
    id,
    timestamp,
    data.fullName     || "",
    data.organization || "",
    data.phone        || "",
    data.email        || "",
    data.category     || "",
    data.description  || "",
    data.amount       || "",
    data.message      || ""
  ]);

  return { success: true, message: "Partnership request submitted successfully!", id: id };
}

// ── Analytics ───────────────────────────────────────────────
function getAnalytics() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const attendeesSheet = ss.getSheetByName("Attendees");
  const partnersSheet  = ss.getSheetByName("Partners");

  const attendees = (attendeesSheet && attendeesSheet.getLastRow() > 1)
    ? attendeesSheet.getDataRange().getValues().slice(1)
    : [];
  const partners = (partnersSheet && partnersSheet.getLastRow() > 1)
    ? partnersSheet.getDataRange().getValues().slice(1)
    : [];

  // Today's registrations
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var todayCount = attendees.filter(function(r) {
    var d = new Date(r[1]);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }).length;

  // Unique churches
  var churches = {};
  attendees.forEach(function(r) { if (r[8]) churches[r[8]] = true; });

  // Registrations per day (last 8 days)
  var regDays = [];
  for (var i = 7; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    var label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    var count = attendees.filter(function(r) {
      var rd = new Date(r[1]);
      rd.setHours(0, 0, 0, 0);
      return rd.getTime() === d.getTime();
    }).length;
    regDays.push({ date: label, count: count });
  }

  // Partners per day (last 8 days)
  var partDays = [];
  for (var j = 7; j >= 0; j--) {
    var pd = new Date();
    pd.setDate(pd.getDate() - j);
    pd.setHours(0, 0, 0, 0);
    var plabel = pd.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    var pcount = partners.filter(function(r) {
      var rd = new Date(r[1]);
      rd.setHours(0, 0, 0, 0);
      return rd.getTime() === pd.getTime();
    }).length;
    partDays.push({ date: plabel, count: pcount });
  }

  // Position distribution (col index 10)
  var posMap = {};
  attendees.forEach(function(r) {
    var pos = r[10] || "Other";
    posMap[pos] = (posMap[pos] || 0) + 1;
  });
  var positionDistribution = Object.keys(posMap).map(function(k) {
    return { name: k, value: posMap[k] };
  }).sort(function(a, b) { return b.value - a.value; });

  // Church representation (col index 8)
  var churchMap = {};
  attendees.forEach(function(r) {
    var c = r[8] || "Other";
    churchMap[c] = (churchMap[c] || 0) + 1;
  });
  var churchRep = Object.keys(churchMap)
    .map(function(k) { return { name: k, value: churchMap[k] }; })
    .sort(function(a, b) { return b.value - a.value; })
    .slice(0, 6);

  return {
    success: true,
    data: {
      totalAttendees:       attendees.length,
      totalPartners:        partners.length,
      churchesRepresented:  Object.keys(churches).length,
      todayRegistrations:   todayCount,
      registrationsPerDay:  regDays,
      partnersPerDay:       partDays,
      positionDistribution: positionDistribution,
      churchRepresentation: churchRep,
    }
  };
}

// ── Test function — run manually in Apps Script editor ──────
function testScript() {
  Logger.log("=== Testing addAttendee ===");
  var result = addAttendee({
    fullName: "Test User",
    phone: "+254700000000",
    email: "test@test.com",
    gender: "Male",
    county: "Nairobi",
    town: "Nairobi",
    churchName: "Test Church",
    churchLocation: "Nairobi",
    position: "Church Member",
    attendanceType: "Individual",
    notes: "Test submission"
  });
  Logger.log(JSON.stringify(result));

  Logger.log("=== Testing getAnalytics ===");
  var analytics = getAnalytics();
  Logger.log(JSON.stringify(analytics.data));
}
