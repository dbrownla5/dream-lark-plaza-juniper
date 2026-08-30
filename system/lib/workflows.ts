/** Packet TAB 05 — required occupational chains. Roles are occupations, not project bots. */

export type WorkflowStep = {
  roleId: number;
  name: string;
  optional?: boolean;
};

export type WorkflowChain = {
  id: string;
  title: string;
  requirementId: string;
  steps: WorkflowStep[];
  notes: string;
};

export const WORKFLOW_CHAINS: WorkflowChain[] = [
  {
    id: "career",
    title: "Career / job search",
    requirementId: "R-WF-CAREER",
    steps: [
      { roleId: 7, name: "Job Discovery Researcher" },
      { roleId: 8, name: "Role Fit and Opportunity Analyst" },
      { roleId: 9, name: "Resume Specialist", optional: true },
      { roleId: 10, name: "Application Materials Specialist", optional: true },
      { roleId: 11, name: "Interview Preparation Specialist", optional: true },
      { roleId: 12, name: "Application Pipeline Coordinator" },
      { roleId: 13, name: "Professional Correspondence Specialist", optional: true },
    ],
    notes: "Discovery, fit, resume, application materials, interview, and pipeline remain separate.",
  },
  {
    id: "writing",
    title: "Correspondence and writing",
    requirementId: "R-WF-WRITE",
    steps: [
      { roleId: 1, name: "Natural-Language Intake Coordinator" },
      { roleId: 5, name: "Thinking and Decision Partner", optional: true },
      { roleId: 13, name: "Professional Correspondence Specialist", optional: true },
      { roleId: 14, name: "Personal and Difficult-Conversation Specialist", optional: true },
      { roleId: 15, name: "Long-Form Writing and Voice Editor", optional: true },
      { roleId: 16, name: "Brand and Web Copywriter", optional: true },
      { roleId: 3, name: "Continuity and Correction Steward" },
    ],
    notes: "The correct writing specialist works the same artifact lineage. New lineage only on explicit reset.",
  },
  {
    id: "business",
    title: "Business opportunity through campaign",
    requirementId: "R-WF-BIZ",
    steps: [
      { roleId: 17, name: "Business Opportunity Analyst" },
      { roleId: 18, name: "Service and Offer Designer" },
      { roleId: 19, name: "Revenue and Commercial Pricing Analyst" },
      { roleId: 20, name: "Market Positioning Strategist" },
      { roleId: 21, name: "Campaign and Outreach Planner" },
      { roleId: 16, name: "Brand and Web Copywriter", optional: true },
      { roleId: 22, name: "Social Content Producer and Publisher", optional: true },
    ],
    notes: "Opportunity, offer, commercial pricing, positioning, campaign, and content remain separate.",
  },
  {
    id: "financial",
    title: "Financial records (separated)",
    requirementId: "R-WF-FIN",
    steps: [
      { roleId: 23, name: "Personal Cash-Flow and Bills Analyst", optional: true },
      { roleId: 24, name: "Business Bookkeeping and Financial Records Specialist", optional: true },
      { roleId: 25, name: "Consignment Settlement Specialist", optional: true },
    ],
    notes: "Personal cash flow, business bookkeeping, and consignment settlement never collapse.",
  },
  {
    id: "resale",
    title: "Resale item lifecycle",
    requirementId: "R-WF-RESALE",
    steps: [
      { roleId: 34, name: "Original Media and Photo Custodian" },
      { roleId: 27, name: "Resale Intake and Item Record Specialist" },
      { roleId: 28, name: "Product Identification and Attribution Researcher" },
      { roleId: 29, name: "Condition and Measurements Specialist" },
      { roleId: 35, name: "Image Selection and Resale Preparation Specialist", optional: true },
      { roleId: 30, name: "Comparable-Sales Researcher" },
      { roleId: 31, name: "Resale Pricing Analyst" },
      { roleId: 32, name: "Marketplace Listing Specialist" },
      { roleId: 33, name: "Inventory, Order, and Fulfillment Coordinator" },
      { roleId: 25, name: "Consignment Settlement Specialist", optional: true },
      { roleId: 24, name: "Business Bookkeeping and Financial Records Specialist", optional: true },
    ],
    notes: "Identification, condition, comps, pricing, listing, and fulfillment remain separate occupations.",
  },
  {
    id: "media",
    title: "Media custody then derivatives",
    requirementId: "R-WF-MEDIA",
    steps: [
      { roleId: 34, name: "Original Media and Photo Custodian" },
      { roleId: 35, name: "Image Selection and Resale Preparation Specialist" },
    ],
    notes: "Originals are never altered. Derivatives always link to an original.",
  },
  {
    id: "technical",
    title: "Technical diagnosis then implementation",
    requirementId: "R-WF-TECH",
    steps: [
      { roleId: 37, name: "Software and Repository Diagnostician" },
      { roleId: 38, name: "Software Implementation and Release Specialist" },
      { roleId: 26, name: "Ecosystem Reliability and Integration Maintainer" },
    ],
    notes: "Desktop Support (39) remains separate for the user's PC.",
  },
  {
    id: "forensic",
    title: "Forensic timeline",
    requirementId: "R-WF-FOR",
    steps: [
      { roleId: 36, name: "File Discovery, Provenance, and Organization Specialist", optional: true },
      { roleId: 40, name: "Forensic Timeline and Evidence Package Specialist" },
      { roleId: 6, name: "Research and Evidence Analyst", optional: true },
    ],
    notes: "Allegations and inference are never recorded as facts.",
  },
];

export function getChain(id: string): WorkflowChain {
  const c = WORKFLOW_CHAINS.find((w) => w.id === id);
  if (!c) throw new Error(`UNKNOWN_CHAIN:${id}`);
  return c;
}

export function nextRequiredStep(chain: WorkflowChain, currentIndex: number): WorkflowStep | null {
  for (let i = currentIndex + 1; i < chain.steps.length; i++) {
    if (!chain.steps[i].optional) return chain.steps[i];
  }
  return null;
}

export function classifyIntakeDomain(text: string): {
  chainId: string;
  roleId: number;
  confidence: number;
  uncertain: boolean;
} {
  const t = text.toLowerCase();
  const hits: { chainId: string; roleId: number; score: number }[] = [];
  const add = (chainId: string, roleId: number, words: string[]) => {
    const score = words.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
    if (score) hits.push({ chainId, roleId, score });
  };
  add("career", 7, ["job", "resume", "interview", "application", "hiring", "role fit"]);
  add("writing", 15, ["essay", "voice", "letter", "draft", "rewrite", "edit this"]);
  add("writing", 13, ["email", "follow-up", "correspondence"]);
  add("writing", 14, ["difficult conversation", "apology", "boundary", "personal message"]);
  add("business", 17, ["offer", "pricing", "campaign", "positioning", "business idea"]);
  add("financial", 23, ["bill", "cash flow", "invoice", "receipt", "consignment"]);
  add("resale", 27, ["resale", "listing", "consign", "ebay", "poshmark", "sold comp"]);
  add("media", 34, ["photo", "photos", "image", "batch", "jpeg", "png"]);
  add("technical", 37, ["bug", "repository", "deploy", "typeerror", "build failed"]);
  add("forensic", 40, ["timeline", "chronology", "evidence package", "forensic"]);
  hits.sort((a, b) => b.score - a.score);
  if (!hits.length) {
    return { chainId: "writing", roleId: 1, confidence: 0.2, uncertain: true };
  }
  const top = hits[0];
  const second = hits[1]?.score ?? 0;
  const uncertain = top.score < 2 || top.score === second;
  return {
    chainId: top.chainId,
    roleId: top.roleId,
    confidence: Math.min(0.95, 0.35 + top.score * 0.15),
    uncertain,
  };
}
