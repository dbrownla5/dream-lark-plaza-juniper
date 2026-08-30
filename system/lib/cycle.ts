/** Packet TAB 03 §3.10 operating cycle, expanded to 20 durable steps. */

export const CYCLE_STEPS = [
  "load_role_contract",
  "load_task_authority",
  "retrieve_living_context",
  "separate_user_words",
  "activate_qualified_skills",
  "check_spend_ceiling",
  "invoke_llm",
  "gather_evidence",
  "perform_bounded_task",
  "validate_structured_output",
  "evaluate_rubric",
  "write_task_state",
  "write_context_changes",
  "record_audit",
  "snapshot_recovery",
  "handoff_if_required",
  "stop_for_approval",
  "fail_visibly_if_blocked",
  "trigger_next_workflow",
  "resume_from_durable_state",
] as const;

export type CycleStep = (typeof CYCLE_STEPS)[number];

/** Permanent 14-point operating rubric (directive §8 + packet). */
export const RUBRIC_POINTS = [
  "evidence_quality",
  "occupational_scope",
  "required_handoffs",
  "authority_to_act",
  "corrections_treatment",
  "user_words_vs_inference",
  "uncertainty_handling",
  "original_provenance",
  "qualified_skills_tools",
  "completion_criteria",
  "review_failure_behavior",
  "recovery",
  "spend_cost_control",
  "no_fabricated_success",
] as const;

export type RubricPoint = (typeof RUBRIC_POINTS)[number];

export type RubricResult = {
  point: RubricPoint;
  pass: boolean;
  note: string;
};

export function emptyRubric(notes?: Partial<Record<RubricPoint, string>>): RubricResult[] {
  return RUBRIC_POINTS.map((point) => ({
    point,
    pass: false,
    note: notes?.[point] ?? "not evaluated",
  }));
}
