import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_SETTINGS } from "../config/conference.ts";
import { buildVerificationEmail } from "../lib/applications/email.ts";

const settings = {
  ...DEFAULT_SETTINGS,
  conference: {
    ...DEFAULT_SETTINGS.conference,
    dates: "14-15-16 November 2026",
  },
};

test("builds a branded, escaped verification email", () => {
  const email = buildVerificationEmail({
    code: "123456",
    name: "Ada <script>",
    applicationTitle: "Delegate",
    settings,
    siteUrl: "https://bufalomun.org",
  });

  assert.match(email.subject, /123456/);
  assert.match(email.html, /123456/);
  assert.match(email.html, /Ada &lt;script&gt;/);
  assert.doesNotMatch(email.html, /<script>/);
  assert.match(email.html, /https:\/\/bufalomun\.org\/icon\.png/);
  assert.match(email.text, /Delegate application/);
});
