import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_SETTINGS } from "../config/conference.ts";
import { buildApplicationRows, getApplicationSheetHeaders } from "../lib/applications/sheetRows.ts";

test("keeps missing optional press answers in their own columns", () => {
  const headers = getApplicationSheetHeaders("press", DEFAULT_SETTINGS);
  const answers = {
    additionalInfo: "Last answer",
    dietaryPreferences: "Vegetarian",
    references: "References",
    motivationLetter: "Motivation",
    experience: "Experience",
    grade: "11th Grade",
    school: "School",
    gender: "Other",
    birthDate: "2008-01-01",
    nationalId: "00000000000",
    phoneNumber: "+90 555 000 00 00",
    email: "press@example.com",
    fullName: "Ada",
  };

  const [row] = buildApplicationRows("press", { answers }, DEFAULT_SETTINGS, "2026-01-01T00:00:00.000Z");

  assert.equal(row[headers.indexOf("Camera Model")], "");
  assert.equal(row[headers.indexOf("Dietary Preferences")], "Vegetarian");
  assert.equal(row[headers.indexOf("Anything you would like to add?")], "Last answer");
});

test("keeps delegation summary and delegate answers in question order", () => {
  const headers = getApplicationSheetHeaders("delegation", DEFAULT_SETTINGS);
  const summary = {
    contactEmail: "advisor@example.com",
    numberOfDelegates: "1",
    schoolName: "Buca Science High School",
  };
  const delegate = {
    delegateAdditionalInfo: "Last answer",
    delegateEmail: "delegate@example.com",
    delegateFullName: "Ada",
  };

  const [row] = buildApplicationRows("delegation", { summary, delegates: [delegate] }, DEFAULT_SETTINGS, "2026-01-01T00:00:00.000Z");

  assert.equal(row[headers.indexOf("School or Organization")], "Buca Science High School");
  assert.equal(row[headers.indexOf("Number of Delegates")], "1");
  assert.equal(row[headers.indexOf("Advisor/Delegation Email")], "advisor@example.com");
  assert.equal(row[headers.indexOf("Delegate Full Name")], "Ada");
  assert.equal(row[headers.indexOf("Delegate Email")], "delegate@example.com");
  assert.equal(row[headers.indexOf("Anything you would like to add?")], "Last answer");
});
