import "server-only";
import { google } from "googleapis";
import type { ApplicationPayload } from "@/lib/applications/validation";
import type { ApplicationType } from "@/types/conference";

const envNames: Record<ApplicationType, string> = { delegate: "GOOGLE_SHEET_DELEGATE_ID", chair: "GOOGLE_SHEET_CHAIR_ID", delegation: "GOOGLE_SHEET_DELEGATION_ID", press: "GOOGLE_SHEET_PRESS_ID", admin: "GOOGLE_SHEET_ADMIN_ID" };

export async function appendApplication(type: ApplicationType, payload: ApplicationPayload, submissionId: string) {
  const spreadsheetId = process.env[envNames[type]];
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!spreadsheetId || !clientEmail || !privateKey) throw new Error("SHEETS_NOT_CONFIGURED");
  const auth = new google.auth.GoogleAuth({ credentials: { client_email: clientEmail, private_key: privateKey }, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const sheets = google.sheets({ version: "v4", auth });
  const existing = await sheets.spreadsheets.values.get({ spreadsheetId, range: "Applications!A:A" });
  if ((existing.data.values || []).some((row) => row[0] === submissionId)) return;
  const submittedAt = new Date().toISOString();
  const rows = type === "delegation"
    ? (payload.delegates || []).map((delegate, index) => [submissionId, submittedAt, index + 1, ...Object.values(payload.summary || {}), ...Object.values(delegate)])
    : [[submissionId, submittedAt, ...Object.values(payload.answers || {})]];
  await sheets.spreadsheets.values.append({ spreadsheetId, range: "Applications!A:ZZ", valueInputOption: "RAW", insertDataOption: "INSERT_ROWS", requestBody: { values: rows } });
}
