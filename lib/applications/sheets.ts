import "server-only";
import { google } from "googleapis";
import type { ApplicationPayload } from "@/lib/applications/validation";
import type { ApplicationType, QuestionDefinition, SiteSettings } from "@/types/conference";
import { DEFAULT_SETTINGS } from "@/config/conference";

const envNames: Record<ApplicationType, string> = { delegate: "GOOGLE_SHEET_DELEGATE_ID", chair: "GOOGLE_SHEET_CHAIR_ID", delegation: "GOOGLE_SHEET_DELEGATION_ID", press: "GOOGLE_SHEET_PRESS_ID", admin: "GOOGLE_SHEET_ADMIN_ID" };

function getHeaders(type: ApplicationType, settings: SiteSettings): string[] {
  const questions: QuestionDefinition[] = settings.form.questions[type];
  if (type === "delegation") {
    const summaryQuestions = questions.slice(0, 3);
    const memberQuestions = questions.slice(3);
    return ["Submitted At", "Delegate #", ...summaryQuestions.map((q) => q.label), ...memberQuestions.map((q) => q.label)];
  }
  return ["Submitted At", ...questions.map((q) => q.label)];
}

async function ensureHeaderRow(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string, type: ApplicationType, settings: SiteSettings) {
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: "Applications!1:1" });
  const firstRow = res.data.values?.[0];
  if (!firstRow || firstRow[0] !== "Submitted At") {
    await sheets.spreadsheets.values.update({ spreadsheetId, range: "Applications!A1", valueInputOption: "RAW", requestBody: { values: [getHeaders(type, settings)] } });
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
  const submittedAt = new Date().toISOString();
  const rows = type === "delegation"
    ? (payload.delegates || []).map((delegate, index) => [submittedAt, index + 1, ...Object.values(payload.summary || {}), ...Object.values(delegate)])
    : [[submittedAt, ...Object.values(payload.answers || {})]];
  await sheets.spreadsheets.values.append({ spreadsheetId, range: "Applications!A:ZZ", valueInputOption: "RAW", insertDataOption: "INSERT_ROWS", requestBody: { values: rows } });
}

