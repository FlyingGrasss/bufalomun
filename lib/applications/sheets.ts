import "server-only";
import { google } from "googleapis";
import type { ApplicationPayload } from "@/lib/applications/validation";
import type { ApplicationType, SiteSettings } from "@/types/conference";
import { DEFAULT_SETTINGS } from "@/config/conference";
import { buildApplicationRows, getApplicationSheetHeaders } from "@/lib/applications/sheetRows";

const envNames: Record<ApplicationType, string> = { delegate: "GOOGLE_SHEET_DELEGATE_ID", chair: "GOOGLE_SHEET_CHAIR_ID", delegation: "GOOGLE_SHEET_DELEGATION_ID", press: "GOOGLE_SHEET_PRESS_ID", admin: "GOOGLE_SHEET_ADMIN_ID" };

async function ensureHeaderRow(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string, type: ApplicationType, settings: SiteSettings) {
  const expected = getApplicationSheetHeaders(type, settings);
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: "Applications!1:1" });
  const firstRow = res.data.values?.[0] ?? [];
  const matches = expected.length === firstRow.length && expected.every((label, index) => firstRow[index] === label);
  if (!matches) {
    await sheets.spreadsheets.values.update({ spreadsheetId, range: "Applications!A1", valueInputOption: "RAW", requestBody: { values: [expected] } });
  }
}

export async function appendApplication(type: ApplicationType, payload: ApplicationPayload, _submissionId: string, settings: SiteSettings = DEFAULT_SETTINGS) {
  const spreadsheetId = process.env[envNames[type]];
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!spreadsheetId || !clientEmail || !privateKey) throw new Error("SHEETS_NOT_CONFIGURED");
  const auth = new google.auth.GoogleAuth({ credentials: { client_email: clientEmail, private_key: privateKey }, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const sheets = google.sheets({ version: "v4", auth });
  await ensureHeaderRow(sheets, spreadsheetId, type, settings);
  const rows = buildApplicationRows(type, payload, settings);
  await sheets.spreadsheets.values.append({ spreadsheetId, range: "Applications!A:ZZ", valueInputOption: "RAW", insertDataOption: "INSERT_ROWS", requestBody: { values: rows } });
}

