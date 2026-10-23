import type { SiteSettings } from "@/types/conference";

type VerificationEmailInput = {
  code: string;
  name: string;
  applicationTitle: string;
  settings: SiteSettings;
  siteUrl: string;
};

const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => htmlEntities[character] ?? character);
}

export function buildVerificationEmail({ code, name, applicationTitle, settings, siteUrl }: VerificationEmailInput) {
  const conference = settings.conference;
  const brandName = conference.brandName.replace(/\s+/g, " ").trim() || "BUFALOMUN";
  const displayName = conference.displayName.trim() || brandName;
  const dates = conference.dates.trim();
  const location = [conference.location.city, conference.location.country].filter(Boolean).join(", ");
  const safeName = escapeHtml(name.trim() || "there");
  const safeTitle = escapeHtml(applicationTitle.trim() || "application");
  const safeCode = escapeHtml(code);
  const safeBrand = escapeHtml(brandName);
  const safeDisplayName = escapeHtml(displayName);
  const safeSiteUrl = escapeHtml(siteUrl);
  const footerMeta = [displayName, dates, location].filter(Boolean).join(" · ");
  const safeFooterMeta = escapeHtml(footerMeta);
  const subject = `${code} is your ${brandName} verification code`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f1ed;color:#272422;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your ${safeBrand} verification code is ${safeCode}. It expires in 10 minutes.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f1ed">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#fffdfb;border:1px solid #cfc4bc;border-radius:16px;overflow:hidden;">
        <tr>
          <td bgcolor="#2e2e2e" style="padding:22px 30px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="44" style="padding-right:12px;">
                  <img src="${safeSiteUrl}/icon.png" width="44" height="44" alt="${safeBrand}" style="display:block;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.18);">
                </td>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:2px;color:#ddd0c8;">${safeDisplayName}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:38px 30px 30px;">
            <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase;color:#e90238;">Email verification</p>
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:40px;line-height:1.05;font-weight:400;color:#272422;">Verify your email.</h1>
            <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:#3c3733;">Hi ${safeName},</p>
            <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.7;color:#3c3733;">Use the six-digit code below to finish your <strong style="color:#272422;">${safeTitle}</strong> application. It expires in 10 minutes.</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;">
              <tr>
                <td align="center" bgcolor="#f6f1ed" style="padding:24px 16px;border:1px solid #cfc4bc;border-radius:12px;font-family:Arial,Helvetica,sans-serif;font-size:34px;line-height:1;font-weight:700;letter-spacing:10px;color:#272422;">${safeCode}</td>
              </tr>
            </table>
            <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:#6d625c;">If you did not request this code, you can safely ignore this email. Your application is only delivered after verification.</p>
          </td>
        </tr>
        <tr>
          <td bgcolor="#faf7f4" style="padding:18px 30px;border-top:1px solid #e5ddd7;">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#6d625c;">${safeFooterMeta}</p>
            <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#6d625c;"><a href="${safeSiteUrl}" style="color:#e90238;text-decoration:none;">${safeSiteUrl.replace(/^https?:\/\//, "")}</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    displayName,
    "",
    "Verify your email",
    "",
    `Hi ${name.trim() || "there"},`,
    "",
    `Use this six-digit code to finish your ${applicationTitle.trim() || "application"} application:`,
    "",
    code,
    "",
    "This code expires in 10 minutes. If you did not request it, you can ignore this email.",
    "",
    footerMeta,
    siteUrl,
  ].join("\n");

  return { subject, html, text };
}
