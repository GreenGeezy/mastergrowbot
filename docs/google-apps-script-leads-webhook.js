const SPREADSHEET_ID = "1qtLlr8sgDVP6fRydOQrkSRxoOCC4ZZllzmEvzMHZC5M";
const SHEET_NAME = "Sheet1";
const WEBHOOK_SECRET = "REPLACE_WITH_THE_SAME_VALUE_AS_GOOGLE_LEADS_WEBHOOK_SECRET";
const OWNER_EMAILS = ["Agcomsol@gmail.com", "mastergrowbotai@gmail.com"];

const HEADERS = [
  "Created At",
  "Email",
  "Name",
  "Source Page",
  "Source Form",
  "Interest Product",
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
  "UTM Content",
  "User Agent",
  "Raw Payload",
];

function doPost(event) {
  try {
    const payload = JSON.parse((event && event.postData && event.postData.contents) || "{}");

    if (WEBHOOK_SECRET && payload.secret !== WEBHOOK_SECRET) {
      return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
    }

    const email = String(payload.email || "").trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, error: "Invalid email" }, 400);
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    ensureHeaders(sheet);

    const row = [
      payload.createdAt || new Date().toISOString(),
      email,
      payload.name || "",
      payload.sourcePage || "",
      payload.sourceForm || "",
      payload.interestProduct || payload.productName || "",
      (payload.utm && payload.utm.utm_source) || payload.utm_source || "",
      (payload.utm && payload.utm.utm_medium) || payload.utm_medium || "",
      (payload.utm && payload.utm.utm_campaign) || payload.utm_campaign || "",
      (payload.utm && payload.utm.utm_content) || payload.utm_content || "",
      payload.userAgent || "",
      JSON.stringify(stripSecret(payload)),
    ];

    sheet.appendRow(row);
    sendOwnerEmail(row);

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: error.message || "Unknown error" }, 500);
  }
}

function ensureHeaders(sheet) {
  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = existing.some(function (value) {
    return String(value || "").trim() !== "";
  });

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.autoResizeColumns(1, HEADERS.length);
  }
}

function sendOwnerEmail(row) {
  const subject = "New MasterGrowbot AI website email signup";
  const body = [
    "A new email was submitted on mastergrowbot.com.",
    "",
    "Email: " + row[1],
    "Name: " + row[2],
    "Source page: " + row[3],
    "Source form: " + row[4],
    "Interest: " + row[5],
    "Created at: " + row[0],
    "",
    "Google Sheet:",
    "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/edit",
  ].join("\n");

  MailApp.sendEmail({
    to: OWNER_EMAILS.join(","),
    subject: subject,
    body: body,
  });
}

function stripSecret(payload) {
  const clone = Object.assign({}, payload);
  delete clone.secret;
  return clone;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
