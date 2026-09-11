import { isInternalQuestionKey, type QuestionDefinition, type QuestionGroups } from "@/lib/questions";

export type FormRules = {
  minimumDelegates: number;
  committeePreferenceCount: number;
};

export type SheetHeaderRow = {
  applicationType: string;
  text: string;
};

export const DELEGATION_SHARED_FIELDS = [
  { summaryId: "schoolName", delegateId: "delegateFullName" },
  { summaryId: "numberOfDelegates", delegateId: "delegateBirthDate" },
  { summaryId: "contactEmail", delegateId: "delegateNationalId" },
] as const;

function questionMap(questions: QuestionGroups, type: string) {
  return new Map((questions[type] ?? []).map((question) => [question.id, question]));
}

function labelsForQuestions(questions: QuestionDefinition[], _rules: FormRules) {
  const labels: string[] = ["Submitted At"];
  for (const question of questions) {
    if (!question.label || isInternalQuestionKey(question.id)) continue;
    labels.push(question.label);
  }
  return labels;
}

export function getApplicationSheetHeaders(questions: QuestionGroups, rules: FormRules): SheetHeaderRow[] {
  const rows: SheetHeaderRow[] = [];
  
  for (const type of ["delegate", "chair", "delegation", "press", "admin"]) {
    const list = questions[type] ?? [];
    if (type === "delegation") {
      const summaryQuestions = list.slice(0, 3);
      const memberQuestions = list.slice(3);
      const headers = [
        "Submitted At",
        "Delegate #",
        ...summaryQuestions.map((q) => q.label),
        ...memberQuestions.map((q) => q.label),
      ];
      rows.push({
        applicationType: "Delegation",
        text: headers.filter(Boolean).join("\t"),
      });
    } else {
      rows.push({
        applicationType: type[0].toUpperCase() + type.slice(1),
        text: labelsForQuestions(list, rules).join("\t"),
      });
    }
  }

  return rows;
}
