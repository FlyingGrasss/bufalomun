import type { ApplicationPayload } from "@/lib/applications/validation";
import type { ApplicationType, QuestionDefinition, SiteSettings } from "@/types/conference";

function questionsFor(type: ApplicationType, settings: SiteSettings) {
  return settings.form.questions[type];
}

function valuesFor(questions: QuestionDefinition[], source: Record<string, string> | undefined) {
  return questions.map((question) => source?.[question.id] ?? "");
}

export function getApplicationSheetHeaders(type: ApplicationType, settings: SiteSettings): string[] {
  const questions = questionsFor(type, settings);
  if (type === "delegation") {
    const summaryQuestions = questions.slice(0, 3);
    const memberQuestions = questions.slice(3);
    return ["Submitted At", "Delegate #", ...summaryQuestions.map((question) => question.label), ...memberQuestions.map((question) => question.label)];
  }
  return ["Submitted At", ...questions.map((question) => question.label)];
}

export function buildApplicationRows(
  type: ApplicationType,
  payload: ApplicationPayload,
  settings: SiteSettings,
  submittedAt = new Date().toISOString(),
): string[][] {
  const questions = questionsFor(type, settings);
  if (type === "delegation") {
    const summaryQuestions = questions.slice(0, 3);
    const memberQuestions = questions.slice(3);
    return (payload.delegates ?? []).map((delegate, index) => [
      submittedAt,
      String(index + 1),
      ...valuesFor(summaryQuestions, payload.summary),
      ...valuesFor(memberQuestions, delegate),
    ]);
  }
  return [[submittedAt, ...valuesFor(questions, payload.answers)]];
}
