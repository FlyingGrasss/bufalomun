import type { ApplicationType, QuestionDefinition, SiteSettings } from "@/types/conference";

const gender = ["Male", "Female", "Other"];
const grades = ["Preparation Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "Graduate"];
const englishLevels = ["Beginner", "Intermediate", "Advanced", "Native"];
const dietary = ["Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-free", "Dairy-free"];
const committees = [
  "H-MIA",
  "DISEC",
  "UNWOMEN",
  "UNOCEAN",
  "CC: Age of Discovery",
  "NACA",
  "The San Remo Conference",
  "FKK: Muhteşem Yüzyıl",
];

const q = (
  id: string,
  label: string,
  type: QuestionDefinition["type"] = "shortText",
  required = false,
  extra: Partial<QuestionDefinition> = {},
): QuestionDefinition => ({ id, label, type, required, ...extra });

const personal = (): QuestionDefinition[] => [
  q("fullName", "Full Name", "shortText", true, { placeholder: "Your full name" }),
  q("email", "Email Address", "email", true, { placeholder: "you@example.com" }),
  q("phoneNumber", "Phone Number", "phone", true, { placeholder: "+90 5xx xxx xx xx" }),
  q("nationalId", "National ID", "shortText", true),
  q("birthDate", "Birth Date", "date", true),
  q("gender", "Gender", "dropdown", true, { options: gender }),
  q("school", "School Name", "shortText", true),
  q("grade", "Grade/Level", "dropdown", true, { options: grades }),
];

const preferences = (): QuestionDefinition[] => [
  q("choice1", "1. Committee Choice", "dropdown", true, { options: committees }),
  q("choice2", "2. Committee Choice", "dropdown", false, { options: committees }),
  q("choice3", "3. Committee Choice", "dropdown", false, { options: committees }),
];

const commonEnd = (): QuestionDefinition[] => [
  q("experience", "Previous Experiences", "longText"),
  q("motivationLetter", "Motivation Letter", "longText", true, { minWords: 150 }),
  q("references", "References", "longText"),
  q("dietaryPreferences", "Dietary Preferences", "dropdown", false, { options: dietary }),
  q("additionalInfo", "Anything you would like to add?", "longText"),
];

const questions: Record<ApplicationType, QuestionDefinition[]> = {
  delegate: [
    ...personal(),
    q("englishLevel", "English Level", "dropdown", true, { options: englishLevels }),
    ...preferences(),
    ...commonEnd(),
  ],
  chair: [
    ...personal(),
    ...preferences(),
    ...commonEnd().slice(0, 3),
    q("chairDelegateOption", "If your application for the chairboard is not approved, would you like to participate as a delegate?", "dropdown", false, { options: ["Yes", "No"] }),
    q("chairAiConcern", "Some delegates say that another delegate is using AI. What would you do?", "longText"),
    q("chairAuthority", "Delegates begin to disregard your authority and overstep the boundaries of respect. What would you do?", "longText"),
    q("chairGaResolution", "The second day ends without enough progress for a resolution paper. What would you do?", "longText"),
    q("chairGaPersonalMatters", "Two delegates bring personal matters into debate. What would you do?", "longText"),
    q("chairSpecialCabinetSwitch", "A delegate wants to switch to a rival cabinet through a top-secret directive. What action would you take?", "longText"),
    q("chairSpecialInfoSharing", "You overhear delegates from rival cabinets sharing confidential plans. What would you do?", "longText"),
    q("chairCrisisProcedure", "Explain crisis procedure step by step for a first-time delegate.", "longText"),
    ...commonEnd().slice(3),
  ],
  delegation: [
    q("schoolName", "School or Organization", "shortText", true),
    q("numberOfDelegates", "Number of Delegates", "number", true),
    q("contactEmail", "Advisor/Delegation Email", "email", true),
    q("delegateFullName", "Delegate Full Name", "shortText", true),
    q("delegateBirthDate", "Birth Date", "date", true),
    q("delegateNationalId", "National ID", "shortText", true),
    q("delegateGender", "Gender", "dropdown", true, { options: gender }),
    ...preferences(),
    q("delegateEnglishLevel", "English Level", "dropdown", true, { options: englishLevels }),
    q("delegateDietaryPreferences", "Dietary Preferences", "dropdown", false, { options: dietary }),
    q("delegateEmail", "Delegate Email", "email", true),
    q("delegatePhoneNumber", "Delegate Phone", "phone", true),
    q("delegateGrade", "Grade/Level", "dropdown", true, { options: grades }),
    q("delegateExperience", "Previous Experiences", "longText"),
    q("delegateMotivationLetter", "Motivation Letter", "longText", true, { minWords: 150 }),
    q("delegateReferences", "References", "longText"),
    q("delegateAdditionalInfo", "Anything you would like to add?", "longText"),
  ],
  press: [
    ...personal(),
    ...commonEnd().slice(0, 3),
    q("camera", "Camera Model", "shortText"),
    ...commonEnd().slice(3),
  ],
  admin: [
    ...personal(),
    q("experience", "Previous Experiences", "longText"),
    q("adminCrowdingStrategy", "How would you prevent crowding when committees leave at the same time?", "longText"),
    q("adminNoteDuringProcedure", "A delegate asks you to pass a note during a motion or voting procedure. What would you do?", "longText"),
    q("adminExpectations", "What should committee admins expect from floor/running admins?", "longText"),
    ...commonEnd().slice(1),
  ],
};

export const DEFAULT_SETTINGS: SiteSettings = {
  conference: {
    id: "bufalomun26",
    brandName: "BUFALOMUN",
    shortName: "BUFALOMUN'26",
    displayName: "BUFALOMUN'26",
    fullName: "Second Official Session of Buca Science High School Model United Nations",
    sessionName: "Second Official Session of Buca Science High School Model United Nations",
    dates: "9-10-11 October 2026",
    startDateIso: "2026-10-09T09:00:00+03:00",
    endDateIso: "2026-10-11T18:00:00+03:00",
    year: 2026,
    hashtag: "#Bestinthewest",
    siteUrl: "https://bufalomun.vercel.app",
    contactEmail: "contact@bufalomun.org",
    senderEmail: "onboarding@resend.dev",
    instagramUrl: "https://www.instagram.com/bufalo.mun/",
    instagramHandle: "@bufalo.mun",
    location: { venue: "Buca Science High School", city: "İzmir", country: "Türkiye" },
    organizer: {
      name: "BUFALOMUN Organization Team",
      creditName: "Emre Bozkurt",
      creditUrl: "https://www.instagram.com/emre.bozqurt/",
    },
  },
  sections: { about: true, letters: true, committees: true, team: true, applications: true, contact: true },
  applications: [
    { id: "delegate", enabled: true, title: "Delegate", formTitle: "Delegate Application", description: "Represent a nation, research global issues, and negotiate thoughtful solutions in committee." },
    { id: "chair", enabled: true, title: "Chairboard", formTitle: "Chairboard Application", description: "Lead a committee, guide procedure, and turn debate into a productive session." },
    { id: "delegation", enabled: true, title: "Delegation", formTitle: "Delegation Application", description: "Bring your school or organization to BUFALOMUN and build a delegation ready for three days of debate." },
    { id: "press", enabled: true, title: "Press", formTitle: "Press Application", description: "Report on the conference and preserve its most important moments through journalism and photography." },
    { id: "admin", enabled: true, title: "Admin", formTitle: "Admin Application", description: "Support the people and processes behind the conference through communication, coordination, and participant care." },
  ],
  form: { minimumDelegates: 8, committeePreferenceCount: 3, questions },
  letters: [
    {
      id: "secretary-general",
      titlePrefix: "Letter From The",
      titleHighlight: "Secretary-General",
      opening: "Dear Participants",
      paragraphs: [
        "It is a great pleasure to invite you to {sessionName}. On {dates}, delegates will come together to debate global issues, negotiate solutions, and practice diplomacy through an engaging Model United Nations experience.",
        "Our team is preparing {shortName} as a welcoming, thoughtful, and memorable conference. We look forward to meeting participants who value research, respectful debate, and cooperation in every committee.",
      ],
      author: "Secretary-General",
    },
  ],
};

export const APPLICATION_TYPES = DEFAULT_SETTINGS.applications.map((item) => item.id);

export function formatConferenceText(text: string, settings: SiteSettings = DEFAULT_SETTINGS) {
  return text
    .replaceAll("{sessionName}", settings.conference.sessionName)
    .replaceAll("{dates}", settings.conference.dates)
    .replaceAll("{shortName}", settings.conference.shortName);
}
