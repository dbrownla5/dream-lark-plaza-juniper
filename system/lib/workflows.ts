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

// No hypothetical workflows live here.
//
// This file used to hold eight sketched chains transcribed from a packet tab —
// "career", "writing", "business", and so on — each one a list of role names in
// an order, with no actual work defined at any step. They were never jobs. They
// were placeholders, and running them (or offering them as a menu) produced
// work that looked real and was not.
//
// A workflow gets added here only when its job has been built out completely
// and concretely: what each step actually does, on what input, producing what,
// and what happens when it can't. Until a job is built that way, it does not
// appear on this list and nothing in the product offers it.
export const WORKFLOW_CHAINS: WorkflowChain[] = [];

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

// There is deliberately no keyword classifier here. Picking Dayna's workflow
// from words in a sentence produced confident wrong answers (an estate cleanout
// routed to the writing chain). When the domain is not stated, the system asks
// her once and shows the list — it does not infer.
