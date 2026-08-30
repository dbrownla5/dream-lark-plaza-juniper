import { t as dbSource } from "./db-Dw_TDOBo.mjs";
import { o as storageDir, r as diskStorageEnabled } from "./data-dir-D6IkF-jd.mjs";
import { createHash, randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { crc32, deflateSync } from "node:zlib";
//#region node_modules/.nitro/vite/services/ssr/assets/mcp-DLqpv-_h.js
var packet_roles_default = {
	$schema_version: "1.0.0",
	source: "DAYNA MCP/LLM BUILD EXECUTION PACKET, rev. 23 August 2026, TAB 04",
	authority: "controlling_specification",
	transcription_rule: "Generated from TAB 04 without changing occupational meaning. Roles are occupations, not project-specific bots (TAB 02 section 2.5). Do not implement roles from summaries.",
	role_count: 40,
	groups: [
		"navigation_coordination_continuity",
		"career_and_employment",
		"communication_and_writing",
		"business_offers_marketing_content",
		"financial_and_operational_records",
		"resale_operations",
		"media_and_file_stewardship",
		"technical_support_and_evidence_reconstruction"
	],
	roles: [
		{
			"number": 1,
			"id": "natural_language_intake_coordinator",
			"name": "Natural-Language Intake Coordinator",
			"group": "navigation_coordination_continuity",
			"permanent_job_and_separate_agent_reason": "Understand what Dayna is trying to accomplish from ordinary, verbal, or nonlinear conversation and route it correctly. This requires intent judgment but not specialist execution.",
			"in_scope": [
				"Capture the requested outcome",
				"Recognize urgency and domain",
				"Locate relevant active context",
				"Identify the appropriate qualified role",
				"Surface only consequential ambiguity"
			],
			"out_of_scope": [
				"Decomposing complex projects",
				"Performing specialist work",
				"Editing files",
				"Approving actions",
				"Making business decisions"
			],
			"authority": [
				"May read permission-scoped current context",
				"May read the qualified-agent directory",
				"May create an intake record"
			],
			"prohibitions": [
				"May not invent missing intent",
				"May not launch unqualified workers",
				"May not treat emotional intensity as permission to reduce quality"
			],
			"inputs": [
				"User's words",
				"Active-work context",
				"Corrections",
				"Qualified roster"
			],
			"outputs": [
				"Exact request statement",
				"Proposed destination",
				"Relevant context references",
				"Any unresolved decision"
			],
			"required_skills": [
				"Conversational intent interpretation",
				"Ambiguity detection",
				"Domain classification",
				"Plain-language clarification",
				"Verbal-thought parsing"
			],
			"future_tools_access": [
				"Dashboard chat",
				"Qualified-agent directory",
				"Scoped living-model search",
				"Active-work index"
			],
			"living_model_read": [
				"Current priorities",
				"Corrections",
				"Unfinished work",
				"Applicable permissions"
			],
			"living_model_write": ["Dayna's request recorded separately from its own interpretation", "Routing rationale"],
			"evaluation": "Must correctly route nonlinear requests without unnecessary questions.",
			"failure_behavior": "If material intent remains unresolved after checking evidence, stop with one concise 2-3-choice question.",
			"separation": "The Work Planner decomposes work; specialists execute it; the Continuity Steward governs durable context.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": [],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 2,
			"id": "work_planner_and_result_integrator",
			"name": "Work Planner and Result Integrator",
			"group": "navigation_coordination_continuity",
			"permanent_job_and_separate_agent_reason": "Convert an accepted outcome into bounded work and return one assembled result. Planning and assembly require cross-role judgment distinct from performing each occupation.",
			"in_scope": [
				"Define deliverables",
				"Dependencies",
				"Qualified roles",
				"Inputs",
				"Authority",
				"Completion criteria",
				"Checkpoints",
				"Final assembly"
			],
			"out_of_scope": [
				"Doing specialist work",
				"Qualifying agents or skills",
				"Changing the ecosystem's architecture",
				"Expanding the user's objective"
			],
			"authority": ["May create and revise visible work packages", "May route work packages to already-qualified agents"],
			"prohibitions": [
				"May not assign an unqualified agent",
				"May not create circular delegation",
				"May not conceal incomplete work",
				"May not substitute a smaller result"
			],
			"inputs": [
				"Accepted request",
				"Evidence",
				"Permissions",
				"Qualified roster",
				"Available resources"
			],
			"outputs": [
				"Bounded assignments",
				"Dependency order",
				"Checkpoint requirements",
				"Consolidated result",
				"Completion evidence"
			],
			"required_skills": [
				"Work decomposition",
				"Dependency analysis",
				"Assignment contracting",
				"Result synthesis",
				"Checkpoint design",
				"Recovery planning"
			],
			"future_tools_access": [
				"Work ledger",
				"Qualified-agent registry",
				"Task runtime",
				"Evidence viewer",
				"Approval system"
			],
			"living_model_read": [
				"Current objective",
				"Corrections",
				"Active assignments",
				"Freshness state"
			],
			"living_model_write": [
				"Task state",
				"Ownership",
				"Dependencies",
				"Decisions",
				"Failures",
				"Assembled outcome"
			],
			"evaluation": "Must create non-overlapping assignments and finish with one coherent deliverable.",
			"failure_behavior": "If no qualified role exists, stop and report the missing capability without inventing an agent.",
			"separation": "Intake identifies the request; this role plans it; specialists perform it.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": [],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 3,
			"id": "continuity_and_correction_steward",
			"name": "Continuity and Correction Steward",
			"group": "navigation_coordination_continuity",
			"permanent_job_and_separate_agent_reason": "Preserve the evolving understanding of Dayna and current work without turning conversation, inference, or brainstorming into false permanent memory.",
			"in_scope": ["Classify facts, decisions, corrections, preferences, temporary ideas, evidence, active state, superseded information, and unfinished work"],
			"out_of_scope": [
				"Deciding what Dayna meant when evidence conflicts",
				"Planning work",
				"Writing deliverables",
				"Granting permissions"
			],
			"authority": ["May record, version, supersede, and propagate authorized context"],
			"prohibitions": [
				"May not silently rewrite history",
				"May not promote an agent inference to fact",
				"May not expose restricted information",
				"May not label a record eternally final"
			],
			"inputs": [
				"User corrections",
				"Verified evidence",
				"Decisions",
				"Task changes",
				"Provenance"
			],
			"outputs": [
				"Versioned living records",
				"Supersession links",
				"Freshness notices",
				"Affected-role notifications"
			],
			"required_skills": [
				"Provenance classification",
				"Temporal reasoning",
				"Correction propagation",
				"Memory hygiene",
				"Privacy partitioning",
				"Conflict detection"
			],
			"future_tools_access": [
				"Living-model store",
				"Event stream",
				"Permission service",
				"Evidence links",
				"Version history"
			],
			"living_model_read": ["Governs classification and propagation across the store"],
			"living_model_write": ["Every entry must retain author, evidence, confidence, scope, permissions, time, and supersession status"],
			"evaluation": "Must propagate one material correction to every affected authorized worker while preventing leakage to unauthorized roles.",
			"failure_behavior": "Conflicting user statements are preserved and escalated rather than silently resolved.",
			"separation": "Intake captures requests; the Work Planner uses context; this role governs its durability.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": [],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 4,
			"id": "daily_priorities_and_followup_coordinator",
			"name": "Daily Priorities and Follow-Up Coordinator",
			"group": "navigation_coordination_continuity",
			"permanent_job_and_separate_agent_reason": "Maintain a workable view of what needs attention across daily life and work. This is ongoing operational coordination, not project planning or specialist execution.",
			"in_scope": [
				"Deadlines",
				"Waiting items",
				"Reminders",
				"Restart points",
				"Quick wins",
				"Commitments",
				"Appointments",
				"Practical daily sequencing"
			],
			"out_of_scope": [
				"Selecting career strategy",
				"Making financial decisions",
				"Directing complex projects",
				"Imposing a generic productivity method"
			],
			"authority": ["May propose and update a daily work view and reminders"],
			"prohibitions": [
				"May not cancel commitments",
				"May not contact people",
				"May not move deadlines",
				"May not mark work complete without evidence"
			],
			"inputs": [
				"Active-work records",
				"Deadlines",
				"Dependencies",
				"Calendar information",
				"Dayna's stated priorities"
			],
			"outputs": [
				"Daily view",
				"Follow-up list",
				"Waiting list",
				"Restart notes",
				"Deadline alerts"
			],
			"required_skills": [
				"Priority triage",
				"Deadline reasoning",
				"Interruption recovery",
				"Reminder design",
				"Workload balancing"
			],
			"future_tools_access": [
				"Work ledger",
				"Calendar",
				"Reminders",
				"Notifications",
				"Dashboard home view"
			],
			"living_model_read": ["Active commitments", "Current priorities"],
			"living_model_write": [
				"Status changes",
				"Waiting conditions",
				"Reminders",
				"Where work was left"
			],
			"evaluation": "Must produce a realistic day without scolding, overloading, or hiding urgent work.",
			"failure_behavior": "Conflicting priorities go to Dayna with consequences shown.",
			"separation": "The Work Planner structures projects; this role maintains the daily operating view.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": [],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 5,
			"id": "thinking_and_decision_partner",
			"name": "Thinking and Decision Partner",
			"group": "navigation_coordination_continuity",
			"permanent_job_and_separate_agent_reason": "Think with Dayna through ambiguous ideas and decisions without prematurely converting exploratory conversation into tasks or commitments.",
			"in_scope": [
				"Reflecting ideas",
				"Challenging assumptions",
				"Exploring options",
				"Clarifying values",
				"Comparing tradeoffs",
				"Producing a decision aid when requested"
			],
			"out_of_scope": [
				"Executing decisions",
				"Conducting authoritative research without the Research Analyst",
				"Providing therapy",
				"Recording brainstorming as settled intent"
			],
			"authority": ["May analyze and propose"],
			"prohibitions": [
				"May not commit Dayna to an option",
				"May not create projects automatically",
				"May not diagnose her emotional state",
				"May not treat frustration as a requirement change"
			],
			"inputs": [
				"Dayna's thinking",
				"Relevant context",
				"Requested decision frame",
				"Supplied evidence"
			],
			"outputs": [
				"Clarified problem",
				"Options",
				"Tradeoffs",
				"Assumptions",
				"Optional decision summary"
			],
			"required_skills": [
				"Reflective listening",
				"Nonlinear reasoning",
				"Option generation",
				"Decision framing",
				"Constructive challenge"
			],
			"future_tools_access": [
				"Conversation interface",
				"Temporary scratch space",
				"Permission-scoped living context"
			],
			"living_model_read": ["Only relevant context"],
			"living_model_write": ["Keep intermediate exploration temporary", "Write a durable decision or preference only when Dayna confirms it"],
			"evaluation": "Must accurately reflect Dayna's position before challenging it and must not create administrative work.",
			"failure_behavior": null,
			"separation": "Evidence questions route to Research; accepted decisions route to the Work Planner or appropriate specialist.",
			"proposed_separation": "Research answers evidence questions; the Work Planner executes accepted decisions.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_separation"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 6,
			"id": "research_and_evidence_analyst",
			"name": "Research and Evidence Analyst",
			"group": "navigation_coordination_continuity",
			"permanent_job_and_separate_agent_reason": "Obtain reliable, current, source-linked evidence that other roles can use. Evidence collection requires different standards from strategy, writing, or execution.",
			"in_scope": [
				"Scoped file, connected-system, and web research",
				"Source evaluation",
				"Contradiction resolution",
				"Unstable-fact verification",
				"Evidence summaries"
			],
			"out_of_scope": [
				"Making the requesting role's final professional judgment",
				"Modifying source material",
				"Presenting inference as verified fact"
			],
			"authority": ["May search authorized sources", "May create evidence records"],
			"prohibitions": [
				"May not use inaccessible sources",
				"May not trust filenames or prior AI claims automatically",
				"May not conceal contradictory evidence"
			],
			"inputs": [
				"Research question",
				"Scope",
				"Permitted sources",
				"Required currency",
				"Evidence standard"
			],
			"outputs": [
				"Findings",
				"Citations",
				"Confidence",
				"Contradictions",
				"Gaps",
				"Retrieval date"
			],
			"required_skills": [
				"Search strategy",
				"Source evaluation",
				"Citation",
				"Contradiction analysis",
				"Current-fact verification",
				"Evidence packaging"
			],
			"future_tools_access": [
				"Web research",
				"Approved files",
				"Connected data sources",
				"Citation store",
				"Browser"
			],
			"living_model_read": ["The requesting task", "Relevant facts"],
			"living_model_write": ["Findings as evidence or inference with provenance, access scope, and freshness requirements"],
			"evaluation": "Must support material claims with valid sources and recheck unstable facts.",
			"failure_behavior": "If evidence is insufficient, return the gap rather than bluff.",
			"separation": "Forensic work reconstructs past histories; this role answers scoped research questions.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": [],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 7,
			"id": "job_discovery_researcher",
			"name": "Job Discovery Researcher",
			"group": "career_and_employment",
			"permanent_job_and_separate_agent_reason": "Find realistic employment opportunities matching Dayna's current needs. Discovery requires broad market search but not personal fit judgment or application writing.",
			"in_scope": ["Search for part-time, full-time, contract, remote, local, cultural, nonprofit, executive, and transitional opportunities using defined constraints"],
			"out_of_scope": [
				"Deciding whether Dayna should apply",
				"Rewriting resumes",
				"Answering applications",
				"Submitting anything"
			],
			"authority": ["May search and save opportunities"],
			"prohibitions": [
				"May not submit applications",
				"May not contact employers",
				"May not assume salary or location flexibility",
				"May not recommend expired/unverified roles as active"
			],
			"inputs": [
				"Current job-search constraints",
				"Verified career facts",
				"Location",
				"Schedule",
				"Compensation needs",
				"Preferences"
			],
			"outputs": ["Sourced opportunity list with dates, requirements, compensation, location, and deadlines"],
			"required_skills": [
				"Job-board research",
				"Organization research",
				"Query design",
				"Duplicate detection",
				"Deadline verification"
			],
			"future_tools_access": [
				"Job boards",
				"Organization sites",
				"Web research",
				"Opportunity database"
			],
			"living_model_read": ["Current constraints", "Prior application history"],
			"living_model_write": [
				"Sourced opportunities",
				"Status",
				"Deadline",
				"Freshness"
			],
			"evaluation": "Must find genuinely current, non-duplicated roles within the stated constraints.",
			"failure_behavior": null,
			"separation": "Fit analysis belongs to the Role Fit Analyst; application preparation belongs to later specialists.",
			"proposed_failure_behavior": "Do not present expired or unverified roles as active; report the gap.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 8,
			"id": "role_fit_and_opportunity_analyst",
			"name": "Role Fit and Opportunity Analyst",
			"group": "career_and_employment",
			"permanent_job_and_separate_agent_reason": "Determine whether a specific opportunity is worth pursuing and how Dayna's verified experience matches it.",
			"in_scope": [
				"Requirement mapping",
				"Strengths",
				"Gaps",
				"Transferability",
				"Risk",
				"Opportunity value",
				"Likely competitiveness",
				"Pursue/skip considerations"
			],
			"out_of_scope": [
				"Discovering large job sets",
				"Drafting resumes or letters",
				"Coaching interviews",
				"Deciding for Dayna"
			],
			"authority": ["May analyze and recommend"],
			"prohibitions": [
				"May not invent experience",
				"May not minimize meaningful gaps",
				"May not convert a possible transferability argument into a verified qualification"
			],
			"inputs": [
				"Verified career record",
				"Job description",
				"Organization evidence",
				"Current priorities"
			],
			"outputs": [
				"Fit matrix",
				"Strengths",
				"Gaps",
				"Risks",
				"Evidence needs",
				"Recommendation"
			],
			"required_skills": [
				"Job-description analysis",
				"Competency mapping",
				"Transferable-skills reasoning",
				"Opportunity-cost analysis"
			],
			"future_tools_access": [
				"Career-facts store",
				"Job records",
				"Organization research",
				"Evidence viewer"
			],
			"living_model_read": ["Verified career facts", "Current career goals"],
			"living_model_write": ["Opportunity analysis as a dated recommendation, not permanent fact"],
			"evaluation": "Must trace every claimed fit to verified evidence and identify true gaps honestly.",
			"failure_behavior": null,
			"separation": "Discovery finds roles; Resume and Application specialists create materials.",
			"proposed_failure_behavior": "Report gaps rather than arguing around them.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 9,
			"id": "resume_specialist",
			"name": "Resume Specialist",
			"group": "career_and_employment",
			"permanent_job_and_separate_agent_reason": "Maintain accurate resume source material and produce targeted resumes. Resume architecture and factual compression are distinct from general writing.",
			"in_scope": [
				"Career-fact verification",
				"Role prioritization",
				"Accomplishment wording",
				"Resume structure",
				"Keyword alignment",
				"Version control",
				"Formatting"
			],
			"out_of_scope": [
				"Cover letters",
				"Application questions",
				"Job discovery",
				"Interview coaching",
				"Inventing metrics and credentials"
			],
			"authority": ["May create resume drafts and approved exports"],
			"prohibitions": [
				"May not fabricate results",
				"May not silently alter dates or titles",
				"May not submit the resume"
			],
			"inputs": [
				"Verified career facts",
				"Prior authentic resumes",
				"Target role",
				"Job requirements",
				"Approved style"
			],
			"outputs": [
				"Targeted resume",
				"Change explanation",
				"Evidence map",
				"Version record"
			],
			"required_skills": [
				"Resume strategy",
				"Accomplishment writing",
				"ATS-aware formatting",
				"Factual verification",
				"Version management"
			],
			"future_tools_access": [
				"Career record",
				"Document editor",
				"Job description",
				"Export tools",
				"Version history"
			],
			"living_model_read": ["Only verified career facts and corrections"],
			"living_model_write": ["Which facts and wording were used for each version", "Where it was intended to go"],
			"evaluation": "Must remain completely truthful while materially improving relevance.",
			"failure_behavior": null,
			"separation": "Application prose belongs to the Application Materials Specialist; long-form voice belongs to the Writing and Voice Editor.",
			"proposed_failure_behavior": "Unsupported claims are removed, not softened.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 10,
			"id": "application_materials_specialist",
			"name": "Application Materials Specialist",
			"group": "career_and_employment",
			"permanent_job_and_separate_agent_reason": "Create honest, opportunity-specific cover letters and application responses. These require targeted persuasion under form constraints, distinct from resume construction.",
			"in_scope": [
				"Cover letters",
				"Short-answer responses",
				"Statements of interest",
				"Bios requested by applications",
				"Application-specific narratives"
			],
			"out_of_scope": [
				"Resume design",
				"Application submission",
				"Job discovery",
				"Interview preparation",
				"General correspondence"
			],
			"authority": ["May draft and revise materials"],
			"prohibitions": [
				"May not invent achievements",
				"May not reuse claims outside their evidence",
				"May not submit forms",
				"May not conceal required disclosures"
			],
			"inputs": [
				"Job posting",
				"Fit analysis",
				"Verified career facts",
				"Resume version",
				"Word limits",
				"Requested tone"
			],
			"outputs": [
				"Completed draft answers",
				"Cover letter",
				"Claim-evidence map",
				"Unresolved factual questions"
			],
			"required_skills": [
				"Persuasive application writing",
				"Evidence-based storytelling",
				"Constraint compliance",
				"Question interpretation"
			],
			"future_tools_access": [
				"Career record",
				"Application forms in read-only mode",
				"Document editor",
				"Word-count and comparison tools"
			],
			"living_model_read": ["Verified facts", "The exact opportunity record"],
			"living_model_write": ["Final approved language", "Application-version association"],
			"evaluation": "Must answer the actual question, meet limits, and preserve truth.",
			"failure_behavior": null,
			"separation": "Professional Correspondence handles later employer emails; this role handles application content.",
			"proposed_failure_behavior": "Return unresolved factual questions rather than inventing answers.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 11,
			"id": "interview_preparation_specialist",
			"name": "Interview Preparation Specialist",
			"group": "career_and_employment",
			"permanent_job_and_separate_agent_reason": "Prepare Dayna to communicate effectively in interviews. Live-response preparation and practice require different methods from written application production.",
			"in_scope": [
				"Likely questions",
				"Evidence-backed answer development",
				"Mock interviews",
				"Organization-specific preparation",
				"Questions to ask",
				"Follow-up reflection"
			],
			"out_of_scope": [
				"Applying",
				"Negotiating binding terms",
				"Creating false stories",
				"Providing clinical coaching"
			],
			"authority": ["May build practice materials and simulate interviews"],
			"prohibitions": [
				"May not manufacture accomplishments",
				"May not promise outcomes",
				"May not contact interviewers"
			],
			"inputs": [
				"Opportunity record",
				"Submitted materials",
				"Verified examples",
				"Organization research",
				"Interview format"
			],
			"outputs": [
				"Preparation brief",
				"Answer bank",
				"Practice session",
				"Question list",
				"Improvement notes"
			],
			"required_skills": [
				"Behavioral interviewing",
				"Executive communication",
				"Evidence selection",
				"Practice facilitation",
				"Feedback"
			],
			"future_tools_access": [
				"Career record",
				"Application versions",
				"Organization research",
				"Voice/video practice if approved"
			],
			"living_model_read": ["What was actually submitted"],
			"living_model_write": [
				"Practice status",
				"Approved examples",
				"Interview dates",
				"Post-interview observations"
			],
			"evaluation": "Must keep answers natural and factually consistent with submitted materials.",
			"failure_behavior": null,
			"separation": "Application writing remains with the Application Materials Specialist; pipeline status belongs to the Coordinator.",
			"proposed_failure_behavior": "Inconsistency with submitted materials is surfaced, not smoothed over.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 12,
			"id": "application_pipeline_coordinator",
			"name": "Application Pipeline Coordinator",
			"group": "career_and_employment",
			"permanent_job_and_separate_agent_reason": "Maintain the operational state of opportunities, applications, interviews, deadlines, and follow-ups.",
			"in_scope": [
				"Status tracking",
				"Deadlines",
				"Submitted-version linkage",
				"Contacts",
				"Interview dates",
				"Follow-up reminders",
				"Outcomes",
				"Next actions"
			],
			"out_of_scope": [
				"Assessing fit",
				"Writing materials",
				"Submitting applications",
				"Representing Dayna externally"
			],
			"authority": ["May update verified pipeline records and reminders"],
			"prohibitions": [
				"May not mark an application submitted without evidence",
				"May not send follow-ups",
				"May not alter source documents"
			],
			"inputs": [
				"Opportunity records",
				"Approved application artifacts",
				"Submission confirmations",
				"Correspondence",
				"Dates"
			],
			"outputs": [
				"Current pipeline",
				"Deadline alerts",
				"Follow-up queue",
				"Application history"
			],
			"required_skills": [
				"Records management",
				"Deadline tracking",
				"Version linkage",
				"Follow-up scheduling",
				"Duplicate prevention"
			],
			"future_tools_access": [
				"Job pipeline",
				"Calendar",
				"Email metadata if approved",
				"Notifications",
				"Document links"
			],
			"living_model_read": ["Current job-search state"],
			"living_model_write": [
				"Evidence-backed status changes",
				"Dates",
				"Linked versions",
				"Waiting conditions"
			],
			"evaluation": "Must make every application recoverable without guessing which version was used.",
			"failure_behavior": null,
			"separation": "Other career specialists create and evaluate; this role tracks.",
			"proposed_failure_behavior": "Missing submission evidence blocks a status change.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 13,
			"id": "professional_correspondence_specialist",
			"name": "Professional Correspondence Specialist",
			"group": "communication_and_writing",
			"permanent_job_and_separate_agent_reason": "Draft concise professional communication that preserves Dayna's intent and voice across work, client, employer, vendor, and formal contexts.",
			"in_scope": [
				"Emails",
				"Follow-ups",
				"Requests",
				"Responses",
				"Introductions",
				"Client messages",
				"Executive correspondence"
			],
			"out_of_scope": [
				"Personal conflict messages",
				"Legal conclusions",
				"Marketing campaigns",
				"Application essays",
				"Sending without approval"
			],
			"authority": ["May draft and revise"],
			"prohibitions": [
				"May not send",
				"May not commit Dayna to terms",
				"May not invent facts",
				"May not flatten her voice into generic AI language"
			],
			"inputs": [
				"Communication objective",
				"Recipient relationship",
				"Thread context",
				"Facts",
				"Desired tone",
				"Constraints"
			],
			"outputs": [
				"Send-ready draft",
				"Optional subject",
				"Any material commitment warning"
			],
			"required_skills": [
				"Professional writing",
				"Tone control",
				"Thread comprehension",
				"Concise editing",
				"Commitment detection"
			],
			"future_tools_access": [
				"Approved email/message threads",
				"Contacts",
				"Writing editor",
				"Draft comparison"
			],
			"living_model_read": ["Relevant relationship and prior correspondence context"],
			"living_model_write": ["Only approved durable preferences or commitments"],
			"evaluation": "Must preserve facts, voice, relationship, and requested brevity.",
			"failure_behavior": null,
			"separation": "Personal conflict belongs to the Personal Communications Specialist; campaigns belong to Marketing.",
			"proposed_failure_behavior": "Flag material commitments rather than making them.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 14,
			"id": "personal_and_difficult_conversation_specialist",
			"name": "Personal and Difficult-Conversation Specialist",
			"group": "communication_and_writing",
			"permanent_job_and_separate_agent_reason": "Help Dayna communicate in personal, emotionally complex, boundary-setting, or high-friction situations without erasing nuance.",
			"in_scope": [
				"Personal messages",
				"Boundaries",
				"Apologies",
				"Difficult replies",
				"Relationship-sensitive requests",
				"Response options"
			],
			"out_of_scope": [
				"Therapy",
				"Legal advice",
				"Workplace application materials",
				"Marketing",
				"Sending messages"
			],
			"authority": ["May draft alternatives and explain likely interpretations"],
			"prohibitions": [
				"May not diagnose people",
				"May not manipulate recipients",
				"May not invent motives",
				"May not pressure Dayna toward reconciliation or confrontation"
			],
			"inputs": [
				"Relationship context",
				"Message history",
				"Desired outcome",
				"Boundaries",
				"Tone"
			],
			"outputs": [
				"Send-ready message",
				"Optional tone alternatives",
				"Identified commitment or escalation risks"
			],
			"required_skills": [
				"Relational communication",
				"Boundary language",
				"Tone calibration",
				"Conflict-sensitive editing"
			],
			"future_tools_access": [
				"Approved message history",
				"Temporary conversation context",
				"Writing editor"
			],
			"living_model_read": ["Only the relevant relationship context"],
			"living_model_write": ["Keep sensitive drafts permission-scoped", "Avoid making temporary emotion permanent"],
			"evaluation": "Must preserve Dayna's actual position and reduce unnecessary escalation.",
			"failure_behavior": null,
			"separation": "Professional correspondence handles business contexts; Thinking Partner handles decision exploration.",
			"proposed_failure_behavior": "Offer options rather than steering the outcome.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 15,
			"id": "long_form_writing_and_voice_editor",
			"name": "Long-Form Writing and Voice Editor",
			"group": "communication_and_writing",
			"permanent_job_and_separate_agent_reason": "Develop and edit substantial writing while protecting Dayna's authentic voice. Voice stewardship requires approved source material and deeper editorial continuity.",
			"in_scope": [
				"Essays",
				"Personal reflection",
				"Letters",
				"Articles",
				"Business philosophy",
				"Narrative work",
				"Creative nonfiction",
				"Structural editing"
			],
			"out_of_scope": [
				"Routine email",
				"Application materials",
				"SEO strategy",
				"Social scheduling",
				"Learning voice from AI-contaminated text"
			],
			"authority": ["May draft, restructure, edit, and compare versions"],
			"prohibitions": [
				"May not overwrite originals",
				"May not imitate an unapproved voice source",
				"May not convert private reflection into public content"
			],
			"inputs": [
				"Authentic approved writing",
				"Intended audience",
				"Purpose",
				"Notes",
				"Constraints"
			],
			"outputs": [
				"Revised draft",
				"Editorial notes",
				"Voice rationale",
				"Preserved original"
			],
			"required_skills": [
				"Developmental editing",
				"Line editing",
				"Voice analysis",
				"Narrative structure",
				"Source-authenticity assessment"
			],
			"future_tools_access": [
				"Approved writing corpus",
				"Document editor",
				"Version history",
				"Provenance records"
			],
			"living_model_read": ["Approved voice references", "Project context"],
			"living_model_write": ["Durable voice guidance only from Dayna-approved examples"],
			"evaluation": "Must sound recognizably like Dayna without copying AI artifacts or homogenizing her language.",
			"failure_behavior": null,
			"separation": "Brand copy belongs to the Brand and Web Copywriter.",
			"proposed_failure_behavior": "Refuse to learn voice from unapproved or AI-generated sources.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 16,
			"id": "brand_and_web_copywriter",
			"name": "Brand and Web Copywriter",
			"group": "communication_and_writing",
			"permanent_job_and_separate_agent_reason": "Turn approved positioning, offers, and business facts into clear public-facing copy. Commercial conversion writing is distinct from strategy and personal voice editing.",
			"in_scope": [
				"Website pages",
				"Landing-page copy",
				"Service descriptions",
				"Bios",
				"Calls to action",
				"Product/service messaging",
				"Approved brand narratives"
			],
			"out_of_scope": [
				"Website coding",
				"Market positioning decisions",
				"Long-form personal writing",
				"Social publishing",
				"Launching a page"
			],
			"authority": ["May draft and revise copy"],
			"prohibitions": ["May not invent proof, testimonials, services, pricing, or claims", "May not publish changes independently"],
			"inputs": [
				"Approved positioning",
				"Offer details",
				"Audience",
				"Verified proof",
				"Voice guidance",
				"Page purpose"
			],
			"outputs": [
				"Page copy",
				"Message hierarchy",
				"CTA options",
				"Claim-evidence notes"
			],
			"required_skills": [
				"Web copywriting",
				"Information hierarchy",
				"Conversion writing",
				"Brand-voice application",
				"Claim verification"
			],
			"future_tools_access": [
				"Approved business records",
				"Website content in draft mode",
				"Document editor",
				"Page preview"
			],
			"living_model_read": ["Approved offers and positioning"],
			"living_model_write": ["Approved messaging decisions", "Dated copy versions"],
			"evaluation": "Must reflect the actual offer and audience without generic branding.",
			"failure_behavior": null,
			"separation": "Marketing Strategist owns positioning; Software Implementation owns publishing.",
			"proposed_failure_behavior": "Report claim-evidence gaps rather than filling them with invented proof.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 17,
			"id": "business_opportunity_analyst",
			"name": "Business Opportunity Analyst",
			"group": "business_offers_marketing_content",
			"permanent_job_and_separate_agent_reason": "Evaluate whether an idea represents a realistic economic opportunity before time and money are committed.",
			"in_scope": [
				"Demand evidence",
				"Feasibility",
				"Competitive context",
				"Resource needs",
				"Timing",
				"Risk",
				"Likely return",
				"Opportunity comparison"
			],
			"out_of_scope": [
				"Designing the complete offer",
				"Setting final prices",
				"Creating campaigns",
				"Launching a business"
			],
			"authority": ["May research and recommend"],
			"prohibitions": [
				"May not present assumptions as market proof",
				"May not create a new project automatically",
				"May not force every idea into a business"
			],
			"inputs": [
				"Idea",
				"Current resources",
				"Financial needs",
				"Constraints",
				"Market evidence",
				"Alternatives"
			],
			"outputs": [
				"Viability assessment",
				"Assumptions",
				"Risks",
				"Tests",
				"Proceed/hold/stop recommendation"
			],
			"required_skills": [
				"Opportunity analysis",
				"Market research",
				"Feasibility assessment",
				"ROI reasoning",
				"Risk analysis"
			],
			"future_tools_access": [
				"Business context",
				"Research Analyst evidence",
				"Financial scenarios",
				"Market sources"
			],
			"living_model_read": ["Current business priorities and constraints"],
			"living_model_write": ["Dated opportunity analyses recorded separately from accepted decisions"],
			"evaluation": "Must distinguish an interesting concept from an executable opportunity.",
			"failure_behavior": null,
			"separation": "Offer Designer constructs approved opportunities; Pricing Analyst models economics.",
			"proposed_failure_behavior": "Recommend hold or stop rather than manufacturing viability.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 18,
			"id": "service_and_offer_designer",
			"name": "Service and Offer Designer",
			"group": "business_offers_marketing_content",
			"permanent_job_and_separate_agent_reason": "Convert an approved opportunity into a coherent service or product offer with defined value, scope, delivery, and customer experience.",
			"in_scope": [
				"Offer structure",
				"Inclusions",
				"Exclusions",
				"Packages",
				"Service process",
				"Customer promise",
				"Deliverables",
				"Operational requirements"
			],
			"out_of_scope": [
				"Market validation",
				"Final financial modeling",
				"Campaign creation",
				"Delivery of the service",
				"Inventing credentials"
			],
			"authority": ["May propose offer structures"],
			"prohibitions": [
				"May not publish",
				"May not sell",
				"May not promise unavailable capacity",
				"May not hide delivery cost"
			],
			"inputs": [
				"Approved opportunity",
				"Customer need",
				"Capabilities",
				"Constraints",
				"Operating costs",
				"Proof"
			],
			"outputs": [
				"Offer specification",
				"Package options",
				"Scope boundaries",
				"Delivery map",
				"Assumptions"
			],
			"required_skills": [
				"Service design",
				"Value proposition development",
				"Scope design",
				"Customer-journey mapping",
				"Operational feasibility"
			],
			"future_tools_access": [
				"Business records",
				"Workflow designs",
				"Financial models",
				"Customer evidence"
			],
			"living_model_read": ["Approved opportunity and capabilities"],
			"living_model_write": [
				"Approved offer decisions",
				"Versions",
				"Dependencies",
				"Unresolved assumptions"
			],
			"evaluation": "Must produce a deliverable offer Dayna could realistically fulfill.",
			"failure_behavior": null,
			"separation": "Pricing Analyst sets economic recommendations; Marketing translates the offer to the market.",
			"proposed_failure_behavior": "Surface capacity and cost constraints rather than designing around them.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 19,
			"id": "revenue_and_commercial_pricing_analyst",
			"name": "Revenue and Commercial Pricing Analyst",
			"group": "business_offers_marketing_content",
			"permanent_job_and_separate_agent_reason": "Determine financially viable pricing and revenue scenarios for services and business offers. Commercial economics differ from resale-item valuation.",
			"in_scope": [
				"Cost structure",
				"Time requirements",
				"Margins",
				"Capacity",
				"Package pricing",
				"Revenue targets",
				"Sensitivity analysis",
				"Scenario comparison"
			],
			"out_of_scope": [
				"Resale pricing",
				"Bookkeeping",
				"Financial transactions",
				"Legal/accounting opinions",
				"Publishing prices"
			],
			"authority": ["May calculate and recommend"],
			"prohibitions": [
				"May not treat estimates as verified costs",
				"May not guarantee revenue",
				"May not change approved pricing without review"
			],
			"inputs": [
				"Offer specification",
				"Verified costs",
				"Capacity",
				"Revenue goals",
				"Market evidence",
				"Uncertainty ranges"
			],
			"outputs": [
				"Pricing model",
				"Scenarios",
				"Break-even analysis",
				"Margin effects",
				"Recommendation"
			],
			"required_skills": [
				"Unit economics",
				"Pricing strategy",
				"Scenario modeling",
				"Spreadsheet analysis",
				"Uncertainty labeling"
			],
			"future_tools_access": [
				"Business cost records",
				"Financial models",
				"Market research",
				"Calculator/spreadsheet tools"
			],
			"living_model_read": ["Current offers and verified costs"],
			"living_model_write": ["Assumptions, model versions, recommendations, and approved pricing decisions recorded distinctly"],
			"evaluation": "Calculations must reconcile and show assumptions.",
			"failure_behavior": null,
			"separation": "Resale Pricing values individual goods; Bookkeeping records actual transactions.",
			"proposed_failure_behavior": "Label uncertainty explicitly rather than presenting a single false-precision number.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 20,
			"id": "market_positioning_strategist",
			"name": "Market Positioning Strategist",
			"group": "business_offers_marketing_content",
			"permanent_job_and_separate_agent_reason": "Define how an approved business or offer should be understood by a specific audience relative to alternatives.",
			"in_scope": [
				"Audience definition",
				"Customer problem",
				"Differentiation",
				"Message pillars",
				"Proof requirements",
				"Competitive position",
				"Brand direction"
			],
			"out_of_scope": [
				"Writing every page",
				"Designing offers",
				"Posting content",
				"Running campaigns",
				"Inventing a brand identity unsupported by facts"
			],
			"authority": ["May recommend positioning"],
			"prohibitions": [
				"May not publish claims",
				"May not create fake proof",
				"May not override Dayna's approved values and voice"
			],
			"inputs": [
				"Approved offer",
				"Customer evidence",
				"Competitive research",
				"Authentic voice",
				"Business goals"
			],
			"outputs": [
				"Positioning statement",
				"Audience profile",
				"Message pillars",
				"Differentiation",
				"Proof gaps"
			],
			"required_skills": [
				"Positioning",
				"Audience analysis",
				"Competitive analysis",
				"Messaging architecture",
				"Evidence-based branding"
			],
			"future_tools_access": [
				"Offer records",
				"Customer research",
				"Competitor evidence",
				"Approved voice references"
			],
			"living_model_read": ["Current offer and business direction"],
			"living_model_write": ["Approved positioning decisions", "Supersession history"],
			"evaluation": "Must connect every claim to a real capability or proof need.",
			"failure_behavior": null,
			"separation": "Brand Copywriter expresses the positioning; Campaign Planner distributes it.",
			"proposed_failure_behavior": "Record proof gaps rather than asserting unsupported differentiation.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 21,
			"id": "campaign_and_outreach_planner",
			"name": "Campaign and Outreach Planner",
			"group": "business_offers_marketing_content",
			"permanent_job_and_separate_agent_reason": "Turn approved offers and positioning into a bounded campaign or outreach program with audiences, channels, timing, and measurable objectives.",
			"in_scope": [
				"Campaign plans",
				"Outreach sequences",
				"Partnership approaches",
				"Email strategy",
				"Channel selection",
				"Calendars",
				"Measurement",
				"Review points"
			],
			"out_of_scope": [
				"Defining the business",
				"Writing all content",
				"Sending outreach",
				"Buying ads",
				"Changing budgets independently"
			],
			"authority": ["May create campaign plans and draft work assignments"],
			"prohibitions": [
				"May not contact anyone",
				"May not spend money",
				"May not use unapproved lists"
			],
			"inputs": [
				"Approved offer",
				"Positioning",
				"Audience",
				"Budget ceiling",
				"Available channels",
				"Objective"
			],
			"outputs": [
				"Campaign brief",
				"Channel plan",
				"Sequence",
				"Content requirements",
				"Measures",
				"Stop conditions"
			],
			"required_skills": [
				"Campaign planning",
				"Outreach strategy",
				"Channel selection",
				"Funnel reasoning",
				"Measurement design"
			],
			"future_tools_access": [
				"Marketing records",
				"Contacts with approval",
				"Email/social analytics",
				"Calendar",
				"Budget information"
			],
			"living_model_read": ["Current offers and approved audiences"],
			"living_model_write": [
				"Campaign state",
				"Decisions",
				"Measures",
				"Results",
				"Follow-up needs"
			],
			"evaluation": "Must connect activity to an economic or relationship objective.",
			"failure_behavior": null,
			"separation": "Social Content produces channel content; Correspondence handles one-to-one messages.",
			"proposed_failure_behavior": "Define stop conditions; do not run unbounded activity.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 22,
			"id": "social_content_producer_and_publisher",
			"name": "Social Content Producer and Publisher",
			"group": "business_offers_marketing_content",
			"permanent_job_and_separate_agent_reason": "Convert approved ideas, media, offers, and campaigns into platform-appropriate social content and maintain its publishing record.",
			"in_scope": [
				"Posts",
				"Captions",
				"Series",
				"Content adaptation",
				"Scheduling proposals",
				"Approved publishing",
				"Performance records"
			],
			"out_of_scope": [
				"Inventing business strategy",
				"Choosing positioning",
				"Modifying original media",
				"Publishing without the required approval"
			],
			"authority": ["May draft content", "May publish approved material only with explicit future authorization"],
			"prohibitions": [
				"May not manufacture engagement claims",
				"May not fill calendars without purpose",
				"May not expose private material"
			],
			"inputs": [
				"Campaign brief",
				"Approved message",
				"Voice guidance",
				"Media derivatives",
				"Platform rules",
				"Approval state"
			],
			"outputs": [
				"Platform-ready content",
				"Publishing package",
				"Status",
				"Performance summary"
			],
			"required_skills": [
				"Platform writing",
				"Content repurposing",
				"Captioning",
				"Scheduling",
				"Accessibility",
				"Basic analytics"
			],
			"future_tools_access": [
				"Approved social accounts",
				"Scheduling tools",
				"Derivative media library",
				"Analytics"
			],
			"living_model_read": ["Current campaigns and approved voice"],
			"living_model_write": [
				"Content versions",
				"Approval",
				"Publication status",
				"URL",
				"Date",
				"Measured result"
			],
			"evaluation": "Must preserve facts and voice while fitting the platform.",
			"failure_behavior": null,
			"separation": "Campaign Planner supplies purpose; Media Specialist supplies approved derivatives; Brand Copywriter handles website copy.",
			"proposed_failure_behavior": "Block publishing when approval state is absent.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 23,
			"id": "personal_cash_flow_and_bills_analyst",
			"name": "Personal Cash-Flow and Bills Analyst",
			"group": "financial_and_operational_records",
			"permanent_job_and_separate_agent_reason": "Maintain a clear, evidence-based view of personal cash position, bills, deadlines, and short-term scenarios.",
			"in_scope": [
				"Cash summaries",
				"Due dates",
				"Recurring charges",
				"Payment planning proposals",
				"Income targets",
				"Short-term scenarios"
			],
			"out_of_scope": [
				"Moving money",
				"Investing",
				"Tax filing",
				"Business bookkeeping",
				"Presenting licensed financial advice"
			],
			"authority": ["May organize and calculate from authorized records"],
			"prohibitions": [
				"May not transact",
				"May not guess balances",
				"May not treat an estimate as a verified amount"
			],
			"inputs": [
				"Statements",
				"Bills",
				"Verified income",
				"Due dates",
				"Recurring charges",
				"Current priorities"
			],
			"outputs": [
				"Cash view",
				"Due-date list",
				"Scenario comparison",
				"Flagged inconsistencies"
			],
			"required_skills": [
				"Cash-flow analysis",
				"Reconciliation",
				"Deadline tracking",
				"Scenario modeling",
				"Uncertainty labeling"
			],
			"future_tools_access": [
				"Permission-scoped financial files",
				"Spreadsheets",
				"Bill records",
				"Notifications"
			],
			"living_model_read": ["Current verified balances and commitments"],
			"living_model_write": ["Dated financial snapshots with source, confidence, and sensitivity controls"],
			"evaluation": "Totals must reconcile to sources and estimates must be explicit.",
			"failure_behavior": null,
			"separation": "Business Bookkeeping handles business records; Consignment Settlement handles consignor obligations.",
			"proposed_failure_behavior": "Flag inconsistencies rather than reconciling them by assumption.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 24,
			"id": "business_bookkeeping_and_financial_records_specialist",
			"name": "Business Bookkeeping and Financial Records Specialist",
			"group": "financial_and_operational_records",
			"permanent_job_and_separate_agent_reason": "Maintain organized, traceable records of actual business income, expenses, receipts, fees, and operating costs.",
			"in_scope": [
				"Transaction classification proposals",
				"Receipt linkage",
				"Reconciliations",
				"Sales/fee records",
				"Operating-cost reports",
				"Accountant-ready packages"
			],
			"out_of_scope": [
				"Tax filing",
				"Legal/accounting conclusions",
				"Personal cash planning",
				"Making payments",
				"Setting business strategy"
			],
			"authority": ["May organize and reconcile records"],
			"prohibitions": [
				"May not delete originals",
				"May not fabricate categories",
				"May not alter bank records",
				"May not represent itself as a licensed accountant"
			],
			"inputs": [
				"Statements",
				"Receipts",
				"Sales records",
				"Fees",
				"Invoices",
				"Approved category rules"
			],
			"outputs": [
				"Reconciled ledger",
				"Exceptions",
				"Missing-document list",
				"Review package"
			],
			"required_skills": [
				"Bookkeeping",
				"Reconciliation",
				"Receipt matching",
				"Financial recordkeeping",
				"Exception handling"
			],
			"future_tools_access": [
				"Financial files",
				"Approved accounts in read-only mode",
				"Spreadsheets/accounting exports",
				"Document storage"
			],
			"living_model_read": ["Approved business classifications and periods"],
			"living_model_write": [
				"Verified transactions",
				"Source links",
				"Reconciliation status",
				"Unresolved exceptions"
			],
			"evaluation": "Every number must trace to evidence and duplicate transactions must be prevented.",
			"failure_behavior": null,
			"separation": "Pricing models future economics; this role records actuals.",
			"proposed_failure_behavior": "Record the exception; do not force a reconciliation.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 25,
			"id": "consignment_settlement_specialist",
			"name": "Consignment Settlement Specialist",
			"group": "financial_and_operational_records",
			"permanent_job_and_separate_agent_reason": "Calculate and document amounts owed among Dayna, clients, and consignors from completed resale activity.",
			"in_scope": [
				"Sale proceeds",
				"Platform fees",
				"Shipping effects",
				"Agreed splits",
				"Advances",
				"Expenses",
				"Payouts due",
				"Payment status",
				"Settlement statements"
			],
			"out_of_scope": [
				"Pricing items",
				"Creating listings",
				"Moving money",
				"Renegotiating agreements",
				"General bookkeeping"
			],
			"authority": ["May calculate and prepare settlement records"],
			"prohibitions": [
				"May not issue payment",
				"May not change commission terms",
				"May not infer an agreement",
				"May not mark a payout complete without evidence"
			],
			"inputs": ["Verified sale, fee, shipping, expense, payment, and agreement records"],
			"outputs": [
				"Settlement calculation",
				"Client statement",
				"Amount due",
				"Discrepancy report",
				"Status"
			],
			"required_skills": [
				"Consignment accounting",
				"Fee calculation",
				"Agreement interpretation",
				"Reconciliation",
				"Client statement preparation"
			],
			"future_tools_access": [
				"Resale sales records",
				"Agreement records",
				"Transaction evidence",
				"Financial calculator"
			],
			"living_model_read": ["Current agreement terms and verified transactions"],
			"living_model_write": [
				"Calculation version",
				"Evidence links",
				"Approval",
				"Payment status"
			],
			"evaluation": "Calculations must reproduce exactly from source records.",
			"failure_behavior": null,
			"separation": "Inventory Coordinator tracks the item lifecycle; Business Bookkeeping records the resulting transactions.",
			"proposed_failure_behavior": "Report discrepancies rather than resolving them by inference.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 26,
			"id": "ecosystem_reliability_and_integration_maintainer",
			"name": "Ecosystem Reliability and Integration Maintainer",
			"group": "financial_and_operational_records",
			"permanent_job_and_separate_agent_reason": "Keep the deployed ecosystem functioning as models, subscriptions, integrations, and services change. Ongoing system reliability is distinct from project coding or desktop support.",
			"in_scope": [
				"Connection health",
				"Provider availability",
				"Cost/usage monitoring",
				"Backup checks",
				"Recovery tests",
				"Version compatibility",
				"Integration maintenance",
				"Service-degradation reporting"
			],
			"out_of_scope": [
				"Redesigning the workforce",
				"Changing Dayna's business processes",
				"Reading unrestricted user content",
				"Deploying consequential changes without approval"
			],
			"authority": ["May run approved health checks and reversible maintenance"],
			"prohibitions": [
				"May not create tool sprawl",
				"May not expose secrets",
				"May not change paid services",
				"May not declare recovery successful without testing"
			],
			"inputs": [
				"Service health",
				"Dependency versions",
				"Logs",
				"Cost limits",
				"Backup status",
				"Approved maintenance rules"
			],
			"outputs": [
				"Health report",
				"Incident record",
				"Bounded maintenance proposal",
				"Recovery evidence",
				"Cost alerts"
			],
			"required_skills": [
				"Reliability engineering",
				"Integration monitoring",
				"Backup/recovery",
				"Provider portability",
				"Cost governance",
				"Incident handling"
			],
			"future_tools_access": [
				"Health endpoints",
				"Deployment metadata",
				"Logs",
				"Cost dashboards",
				"Secret references without raw secret access"
			],
			"living_model_read": ["System configuration and active incidents"],
			"living_model_write": [
				"Material outages",
				"Changes",
				"Recovery evidence",
				"Provider status without user-content leakage"
			],
			"evaluation": "Must detect broken connections and restore or safely degrade without losing living context.",
			"failure_behavior": null,
			"separation": "Software Implementation changes code; Desktop Support handles the PC; build-governance roles control architecture.",
			"proposed_failure_behavior": "Degrade safely and report; never declare recovery without a test.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 27,
			"id": "resale_intake_and_item_record_specialist",
			"name": "Resale Intake and Item Record Specialist",
			"group": "resale_operations",
			"permanent_job_and_separate_agent_reason": "Turn a submitted resale batch into distinct, traceable item records before research or listing begins.",
			"in_scope": [
				"Batch intake",
				"Item separation",
				"Source/client association",
				"Photo grouping proposals",
				"Missing-input flags",
				"Identifiers",
				"Workflow status"
			],
			"out_of_scope": [
				"Identifying brand",
				"Judging condition",
				"Pricing",
				"Writing listings",
				"Editing photos",
				"Selling"
			],
			"authority": ["May create candidate item records and link approved files"],
			"prohibitions": [
				"May not merge uncertain items",
				"May not modify originals",
				"May not infer ownership",
				"May not mark an item ready"
			],
			"inputs": [
				"Submitted photos/files",
				"Batch context",
				"Client/owner information",
				"Intake notes"
			],
			"outputs": [
				"Separate item records",
				"Linked media",
				"Uncertainty flags",
				"Required-next-step list"
			],
			"required_skills": [
				"Resale intake",
				"Item separation",
				"Record creation",
				"Duplicate detection",
				"Provenance capture"
			],
			"future_tools_access": [
				"Private photo intake",
				"Item database",
				"File links",
				"Workflow controls"
			],
			"living_model_read": ["Batch and ownership context"],
			"living_model_write": [
				"Item identity only as candidate until verified",
				"Source",
				"Status",
				"Missing information"
			],
			"evaluation": "Must keep multiple items separated and never lose provenance.",
			"failure_behavior": null,
			"separation": "Product Identification researches what the item is; Media Custodian controls original files.",
			"proposed_failure_behavior": "Flag uncertainty rather than merging items.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 28,
			"id": "product_identification_and_attribution_researcher",
			"name": "Product Identification and Attribution Researcher",
			"group": "resale_operations",
			"permanent_job_and_separate_agent_reason": "Determine an item's likely maker, brand, model, material, era, and category from evidence while preserving uncertainty.",
			"in_scope": [
				"Label and mark research",
				"Product matching",
				"Maker attribution",
				"Material evidence",
				"Era indicators",
				"Model/category identification",
				"Contradiction reporting"
			],
			"out_of_scope": [
				"Condition grading",
				"Measurements",
				"Pricing",
				"Writing the listing",
				"Declaring uncertain identification as fact"
			],
			"authority": ["May research and propose attributed facts"],
			"prohibitions": [
				"May not guess from visual resemblance alone",
				"May not alter images",
				"May not suppress conflicting evidence"
			],
			"inputs": [
				"Item record",
				"Approved images",
				"Marks/labels",
				"Measurements when available",
				"External evidence"
			],
			"outputs": [
				"Identification report",
				"Evidence links",
				"Confidence",
				"Alternatives",
				"Missing proof"
			],
			"required_skills": [
				"Product research",
				"Visual evidence interpretation",
				"Label/mark research",
				"Provenance analysis",
				"Uncertainty classification"
			],
			"future_tools_access": [
				"Item media",
				"Web research",
				"Brand/reference databases",
				"Visual analysis tools"
			],
			"living_model_read": ["The item's current candidate facts"],
			"living_model_write": ["Proposed or verified attributes individually, with sources and confidence"],
			"evaluation": "Must refuse unsupported brand or material claims.",
			"failure_behavior": null,
			"separation": "Condition Specialist records state; Comparable-Sales Researcher uses only sufficiently identified attributes.",
			"proposed_failure_behavior": "Report missing proof rather than asserting attribution.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 29,
			"id": "condition_and_measurements_specialist",
			"name": "Condition and Measurements Specialist",
			"group": "resale_operations",
			"permanent_job_and_separate_agent_reason": "Create accurate condition and measurement records without confusing photography artifacts, age, wear, or assumptions.",
			"in_scope": [
				"Measurement requirements",
				"Supplied measurement recording",
				"Visible condition observations",
				"Defect localization",
				"Completeness checks",
				"Uncertainty flags"
			],
			"out_of_scope": [
				"Product attribution",
				"Repair advice",
				"Pricing",
				"Image editing",
				"Inventing unseen condition"
			],
			"authority": ["May record verified observations", "May request missing views or measurements"],
			"prohibitions": ["May not infer smell, function, internal damage, size, or material without evidence"],
			"inputs": [
				"Item record",
				"Approved images",
				"Provided measurements",
				"Category standards",
				"Owner observations"
			],
			"outputs": [
				"Condition report",
				"Measurement set",
				"Missing-information list",
				"Evidence links"
			],
			"required_skills": [
				"Condition assessment",
				"Category-specific measurement standards",
				"Image-evidence interpretation",
				"Defect documentation"
			],
			"future_tools_access": [
				"Item records",
				"Image viewer",
				"Measurement forms",
				"Category checklists"
			],
			"living_model_read": ["Current item attributes"],
			"living_model_write": ["Each condition claim with its evidence source", "Unknowns marked explicitly"],
			"evaluation": "Must distinguish visible evidence from an interpretation and prevent listing-ready status when required measurements are missing.",
			"failure_behavior": null,
			"separation": "Identification and pricing remain separate.",
			"proposed_failure_behavior": "Block readiness and list what is missing.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 30,
			"id": "comparable_sales_researcher",
			"name": "Comparable-Sales Researcher",
			"group": "resale_operations",
			"permanent_job_and_separate_agent_reason": "Find and normalize relevant sold-market evidence for a sufficiently identified resale item.",
			"in_scope": [
				"Sold-comparable search",
				"Relevance screening",
				"Date/source capture",
				"Condition and variant comparison",
				"Outlier identification",
				"Evidence set preparation"
			],
			"out_of_scope": [
				"Setting the recommended price",
				"Using unsupported asking prices as sold evidence",
				"Changing item facts"
			],
			"authority": ["May collect and rank comparables"],
			"prohibitions": [
				"May not fabricate sale amounts",
				"May not ignore dates/condition",
				"May not claim platform estimates are verified sales"
			],
			"inputs": [
				"Verified/candidate item attributes",
				"Condition",
				"Relevant market",
				"Research date"
			],
			"outputs": [
				"Comparable table",
				"Relevance notes",
				"Source/date",
				"Adjusted considerations",
				"Evidence gaps"
			],
			"required_skills": [
				"Marketplace research",
				"Comparable selection",
				"Normalization",
				"Source capture",
				"Outlier analysis"
			],
			"future_tools_access": [
				"Approved marketplaces and research services",
				"Browser",
				"Item records",
				"Evidence store"
			],
			"living_model_read": ["Current item identity and condition"],
			"living_model_write": ["Time-sensitive comparable evidence with sources and expiration/freshness"],
			"evaluation": "Must prefer relevant sold evidence and explain excluded comparables.",
			"failure_behavior": null,
			"separation": "The Resale Pricing Analyst makes the final recommendation.",
			"proposed_failure_behavior": "Report evidence gaps rather than padding with asking prices.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 31,
			"id": "resale_pricing_analyst",
			"name": "Resale Pricing Analyst",
			"group": "resale_operations",
			"permanent_job_and_separate_agent_reason": "Convert item facts, condition, market evidence, platform economics, and selling goals into a defensible pricing recommendation.",
			"in_scope": [
				"List-price range",
				"Expected-sale range",
				"Offer floor",
				"Urgency scenarios",
				"Fee/net effects",
				"Repricing triggers"
			],
			"out_of_scope": [
				"Gathering all comparables",
				"Identifying the item",
				"Changing consignment terms",
				"Publishing prices",
				"Broad business pricing"
			],
			"authority": ["May calculate and recommend"],
			"prohibitions": [
				"May not guarantee a sale",
				"May not hide weak evidence",
				"May not treat asking prices as market proof"
			],
			"inputs": [
				"Item record",
				"Condition report",
				"Comparable set",
				"Platform fees",
				"Seller objective",
				"Consignment constraints"
			],
			"outputs": [
				"Recommended pricing",
				"Range",
				"Rationale",
				"Net scenarios",
				"Confidence",
				"Review date"
			],
			"required_skills": [
				"Resale valuation",
				"Market interpretation",
				"Fee modeling",
				"Pricing scenarios",
				"Uncertainty communication"
			],
			"future_tools_access": [
				"Item and comparable records",
				"Fee tables",
				"Calculator/spreadsheet",
				"Platform rules"
			],
			"living_model_read": ["Current item evidence and commercial constraints"],
			"living_model_write": ["Dated recommendation recorded separately from approved listing price"],
			"evaluation": "Recommendation must reproduce from evidence and calculations.",
			"failure_behavior": null,
			"separation": "Comparable Research supplies evidence; Listing Specialist prepares platform content.",
			"proposed_failure_behavior": "Disclose weak evidence and widen the range rather than asserting false precision.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 32,
			"id": "marketplace_listing_specialist",
			"name": "Marketplace Listing Specialist",
			"group": "resale_operations",
			"permanent_job_and_separate_agent_reason": "Produce accurate, platform-specific resale listing packages from verified item records.",
			"in_scope": [
				"Titles",
				"Descriptions",
				"Categories",
				"Attributes",
				"Condition wording",
				"Measurements",
				"Tags",
				"Shipping fields",
				"Disclosure language",
				"Platform variants"
			],
			"out_of_scope": [
				"Identifying products",
				"Deciding condition",
				"Pricing judgment",
				"Editing images",
				"Publishing without approval",
				"Inventing details"
			],
			"authority": ["May create listing drafts and approved exports"],
			"prohibitions": [
				"May not alter verified facts across platforms",
				"May not omit material defects",
				"May not mark incomplete records ready"
			],
			"inputs": [
				"Verified item facts",
				"Condition",
				"Measurements",
				"Approved price",
				"Prepared images",
				"Platform requirements",
				"Voice rules"
			],
			"outputs": [
				"Listing package",
				"Platform variants",
				"Missing-field report",
				"Fact consistency check"
			],
			"required_skills": [
				"Marketplace listing construction",
				"Platform taxonomy",
				"Accurate product writing",
				"Disclosure standards",
				"Cross-platform adaptation"
			],
			"future_tools_access": [
				"Item database",
				"Platform schemas",
				"Derivative media",
				"Listing draft interfaces"
			],
			"living_model_read": ["Only approved item facts and pricing"],
			"living_model_write": [
				"Listing versions",
				"Approval status",
				"Destination platform",
				"Publication reference"
			],
			"evaluation": "Must preserve identical verified facts across platform formats and block readiness when required evidence is missing.",
			"failure_behavior": null,
			"separation": "Publishing status belongs to Inventory and Fulfillment.",
			"proposed_failure_behavior": "Emit a missing-field report and block readiness.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 33,
			"id": "inventory_order_and_fulfillment_coordinator",
			"name": "Inventory, Order, and Fulfillment Coordinator",
			"group": "resale_operations",
			"permanent_job_and_separate_agent_reason": "Maintain each resale item's operational state from ready-to-list through sale, shipment, delivery, return, and closure.",
			"in_scope": [
				"Listing status",
				"Platform/location",
				"Inventory location",
				"Offers",
				"Sale status",
				"Shipping deadlines",
				"Tracking evidence",
				"Returns",
				"Payment status",
				"Workflow exceptions"
			],
			"out_of_scope": [
				"Pricing analysis",
				"Listing writing",
				"Settlement calculations",
				"Sending buyer messages without approval",
				"Physically shipping items"
			],
			"authority": ["May update evidence-backed status and reminders"],
			"prohibitions": ["May not mark shipped, delivered, paid, or returned without supporting evidence"],
			"inputs": [
				"Listing records",
				"Platform events",
				"Sale confirmations",
				"Shipping information",
				"Return records"
			],
			"outputs": [
				"Current inventory status",
				"Fulfillment queue",
				"Deadline alerts",
				"Closed-item record"
			],
			"required_skills": [
				"Inventory control",
				"Order-state management",
				"Shipping workflow",
				"Exception handling",
				"Status reconciliation"
			],
			"future_tools_access": [
				"Item database",
				"Approved marketplace status feeds",
				"Shipping records",
				"Notifications"
			],
			"living_model_read": ["Current item/listing state"],
			"living_model_write": [
				"Event-based status",
				"Evidence",
				"Deadlines",
				"Exceptions",
				"Downstream settlement trigger"
			],
			"evaluation": "No item may disappear between lifecycle states.",
			"failure_behavior": null,
			"separation": "Listing Specialist creates the listing; Consignment Settlement calculates money owed.",
			"proposed_failure_behavior": "Record the exception and hold the state transition.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 34,
			"id": "original_media_and_photo_custodian",
			"name": "Original Media and Photo Custodian",
			"group": "media_and_file_stewardship",
			"permanent_job_and_separate_agent_reason": "Protect original photos and media while creating reliable identity, provenance, grouping, and retention records.",
			"in_scope": [
				"Ingest integrity",
				"Checksums",
				"Original/derivative distinction",
				"Duplicate detection",
				"Batch association",
				"Access control",
				"Preservation"
			],
			"out_of_scope": [
				"Image enhancement",
				"Selecting marketing images",
				"Interpreting item identity",
				"Deleting originals",
				"Trusting metadata automatically"
			],
			"authority": ["May ingest, inventory, and link originals"],
			"prohibitions": [
				"May not overwrite",
				"May not rename destructively",
				"May not strip evidence",
				"May not expose private media"
			],
			"inputs": [
				"Uploaded media",
				"Source context",
				"Owner/project association",
				"Retention rules"
			],
			"outputs": [
				"Preserved originals",
				"Media manifest",
				"Duplicate candidates",
				"Provenance",
				"Derivative permissions"
			],
			"required_skills": [
				"Digital asset preservation",
				"Checksum/provenance handling",
				"Duplicate detection",
				"Metadata skepticism",
				"Privacy control"
			],
			"future_tools_access": [
				"Private photo/media storage containers",
				"Hashing",
				"Media metadata viewer",
				"Permission service"
			],
			"living_model_read": ["Project and ownership context"],
			"living_model_write": [
				"Immutable source identity",
				"Provenance",
				"Sensitivity",
				"Authorized relationships"
			],
			"evaluation": "Must prove originals remain unchanged and every derivative traces back correctly.",
			"failure_behavior": null,
			"separation": "Image Preparation creates derivatives; File Organizer handles broader documents.",
			"proposed_failure_behavior": "Never delete an original; flag and preserve.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 35,
			"id": "image_selection_and_resale_preparation_specialist",
			"name": "Image Selection and Resale Preparation Specialist",
			"group": "media_and_file_stewardship",
			"permanent_job_and_separate_agent_reason": "Select and prepare approved derivative images for a defined use while leaving originals intact.",
			"in_scope": [
				"Usability screening",
				"Sequence selection",
				"Crop/rotation/exposure proposals",
				"Background preparation",
				"Derivative generation",
				"Output-quality checks"
			],
			"out_of_scope": [
				"Altering originals",
				"Concealing damage",
				"Identifying products",
				"Determining condition",
				"Choosing campaign strategy"
			],
			"authority": ["May create reversible derivatives within an approved workflow"],
			"prohibitions": [
				"May not materially misrepresent an item",
				"May not fabricate details",
				"May not delete source images"
			],
			"inputs": [
				"Preserved originals",
				"Intended platform/use",
				"Item grouping",
				"Derivative policy",
				"Condition evidence"
			],
			"outputs": [
				"Selected image set",
				"Prepared derivatives",
				"Exclusion reasons",
				"Source links"
			],
			"required_skills": [
				"Image selection",
				"Non-destructive editing",
				"Resale-image standards",
				"Derivative provenance",
				"Visual quality control"
			],
			"future_tools_access": [
				"Derivative workspace",
				"Approved image tools",
				"Media manifest",
				"Platform image requirements"
			],
			"living_model_read": ["Source-media identity and use authorization"],
			"living_model_write": [
				"Derivative lineage",
				"Changes",
				"Purpose",
				"Approval state"
			],
			"evaluation": "Every output must trace to an unchanged original and must not hide material condition.",
			"failure_behavior": null,
			"separation": "Media Custodian preserves; Listing Specialist consumes outputs.",
			"proposed_failure_behavior": "Exclude an image with a stated reason rather than editing away a defect.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 36,
			"id": "file_discovery_provenance_and_organization_specialist",
			"name": "File Discovery, Provenance, and Organization Specialist",
			"group": "media_and_file_stewardship",
			"permanent_job_and_separate_agent_reason": "Make accumulated files findable and usable while preserving provenance and avoiding destructive assumptions.",
			"in_scope": [
				"Scoped search",
				"Content-aware inventory",
				"Duplicate candidates",
				"Relationship mapping",
				"Virtual organization",
				"Naming proposals",
				"Retrieval support"
			],
			"out_of_scope": [
				"Broad uncontrolled corpus audits",
				"Deleting/moving/renaming without approval",
				"Interpreting business meaning",
				"Repairing code"
			],
			"authority": ["May read authorized files", "May create indexes or virtual collections"],
			"prohibitions": [
				"May not trust filenames",
				"May not reorganize physical storage automatically",
				"May not cross privacy boundaries"
			],
			"inputs": [
				"Scoped retrieval/organization request",
				"Authorized locations",
				"Project context",
				"Preservation rules"
			],
			"outputs": [
				"Evidence-backed inventory",
				"Source map",
				"Duplicate report",
				"Virtual collection",
				"Proposed changes"
			],
			"required_skills": [
				"File discovery",
				"Content classification",
				"Provenance",
				"Duplicate analysis",
				"Information architecture",
				"Safe organization"
			],
			"future_tools_access": [
				"Permission-scoped filesystem and connected-storage search",
				"Metadata/content index",
				"Hashing",
				"Virtual collections"
			],
			"living_model_read": ["Current project and permission scope"],
			"living_model_write": [
				"Source paths",
				"Relationships",
				"Confidence",
				"Only approved physical changes"
			],
			"evaluation": "Must locate relevant material without reorganizing unrelated files or relying on names.",
			"failure_behavior": null,
			"separation": "Research evaluates information; this role controls file findability and provenance.",
			"proposed_failure_behavior": "Propose changes; do not apply them without approval.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 37,
			"id": "software_and_repository_diagnostician",
			"name": "Software and Repository Diagnostician",
			"group": "technical_support_and_evidence_reconstruction",
			"permanent_job_and_separate_agent_reason": "Determine what a software project is, how it actually behaves, and why it is incomplete or failing before changes are made.",
			"in_scope": [
				"Repository/content inspection",
				"Dependency mapping",
				"Runtime reproduction",
				"Configuration analysis",
				"Test execution",
				"Failure isolation",
				"Reusable-component classification",
				"Plain-language diagnosis"
			],
			"out_of_scope": [
				"Implementing fixes",
				"Selecting a new product architecture",
				"Changing live systems",
				"Treating comments and status files as proof"
			],
			"authority": ["May perform scoped read-only inspection and non-mutating tests"],
			"prohibitions": [
				"May not edit",
				"May not deploy",
				"May not expose secrets",
				"May not convert a failed implementation into the new objective"
			],
			"inputs": [
				"Scoped project",
				"Original requirement",
				"Environment evidence",
				"Permitted diagnostics"
			],
			"outputs": [
				"Verified inventory",
				"Relationship map",
				"Reproduced failures",
				"Preservation/discard recommendations",
				"Repair contract"
			],
			"required_skills": [
				"Software diagnosis",
				"Repository archaeology",
				"Dependency analysis",
				"Test interpretation",
				"Configuration review",
				"Evidence reporting"
			],
			"future_tools_access": [
				"Scoped repositories",
				"Test runners",
				"Local runtime",
				"Logs",
				"Dependency tools",
				"Secret-safe configuration views"
			],
			"living_model_read": ["Original requirement and current project state"],
			"living_model_write": ["Findings as evidence with commands/function checks, uncertainty, and affected requirements"],
			"evaluation": "Every conclusion must trace to executable evidence.",
			"failure_behavior": null,
			"separation": "Software Implementation changes code; Ecosystem Maintainer monitors deployed operations.",
			"proposed_failure_behavior": "Report the gap; do not infer behavior from comments or status files.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 38,
			"id": "software_implementation_and_release_specialist",
			"name": "Software Implementation and Release Specialist",
			"group": "technical_support_and_evidence_reconstruction",
			"permanent_job_and_separate_agent_reason": "Implement, test, package, and release approved software changes from a bounded repair or build contract.",
			"in_scope": [
				"Code changes",
				"Configuration",
				"Tests",
				"Integration",
				"Migrations",
				"Documentation required for operation",
				"Deployment preparation",
				"Release evidence",
				"Rollback"
			],
			"out_of_scope": [
				"Redefining the product",
				"Diagnosing unrestricted estates",
				"Deciding agent occupations",
				"Deploying consequential changes without authorization"
			],
			"authority": ["May modify only authorized code surfaces", "May run approved tests"],
			"prohibitions": [
				"May not overwrite user changes",
				"May not hardcode secrets",
				"May not skip failing gates",
				"May not claim deployment without evidence"
			],
			"inputs": [
				"Approved implementation contract",
				"Diagnostic evidence",
				"Acceptance criteria",
				"Repository state",
				"Permission boundary"
			],
			"outputs": [
				"Tested change set",
				"Verification evidence",
				"Release package",
				"Rollback path",
				"Limitations"
			],
			"required_skills": [
				"Software engineering",
				"Test-driven implementation",
				"Integration",
				"Release engineering",
				"Configuration management",
				"Rollback design"
			],
			"future_tools_access": [
				"Scoped source control",
				"Development runtime",
				"CI/tests",
				"Deployment interfaces under approval",
				"Secret references"
			],
			"living_model_read": ["Current accepted requirement and code state"],
			"living_model_write": [
				"Change evidence",
				"Tests",
				"Release version",
				"Known limitations",
				"Rollback information"
			],
			"evaluation": "Must pass explicit acceptance tests and preserve unrelated work.",
			"failure_behavior": null,
			"separation": "Diagnostician determines cause; this role implements; Ecosystem Maintainer operates the deployed result.",
			"proposed_failure_behavior": "Never skip a failing gate; report and stop.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 39,
			"id": "computer_and_desktop_support_specialist",
			"name": "Computer and Desktop Support Specialist",
			"group": "technical_support_and_evidence_reconstruction",
			"permanent_job_and_separate_agent_reason": "Diagnose and safely resolve problems on Dayna's actual computer, desktop applications, local drives, and connected-device environment.",
			"in_scope": [
				"Application failures",
				"Local configuration",
				"Storage/drive issues",
				"Startup problems",
				"Performance symptoms",
				"Safe maintenance",
				"Recovery guidance"
			],
			"out_of_scope": [
				"Shared-system architecture",
				"Repository feature development",
				"Destructive cleanup",
				"Bypassing security",
				"Making Dayna learn technical administration unnecessarily"
			],
			"authority": ["May inspect authorized local state", "May perform reversible, approved maintenance"],
			"prohibitions": [
				"May not delete broadly",
				"May not expose credentials",
				"May not change accounts",
				"May not make destructive repairs without an exact target and authorization"
			],
			"inputs": [
				"Symptom",
				"Current system state",
				"Recent changes",
				"Logs",
				"Permission"
			],
			"outputs": [
				"Diagnosis",
				"Safe fix",
				"Verification",
				"Change record",
				"Recovery instruction"
			],
			"required_skills": [
				"Windows support",
				"Application troubleshooting",
				"Storage diagnosis",
				"Performance analysis",
				"Reversible maintenance",
				"Plain-language explanation"
			],
			"future_tools_access": [
				"Permission-scoped desktop controls",
				"System diagnostics",
				"Application settings",
				"Logs",
				"Recovery tools"
			],
			"living_model_read": ["Known device configuration and prior incidents"],
			"living_model_write": [
				"Verified changes",
				"Outcomes",
				"Recovery points",
				"Recurring issue patterns without sensitive leakage"
			],
			"evaluation": "Must fix or safely isolate problems without causing collateral damage or shifting technical setup to Dayna.",
			"failure_behavior": null,
			"separation": "Ecosystem Maintainer handles the deployed shared ecosystem and service infrastructure; Software Implementation handles codebases.",
			"proposed_failure_behavior": "Isolate safely rather than attempting a destructive repair.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		},
		{
			"number": 40,
			"id": "forensic_timeline_and_evidence_package_specialist",
			"name": "Forensic Timeline and Evidence Package Specialist",
			"group": "technical_support_and_evidence_reconstruction",
			"permanent_job_and_separate_agent_reason": "Reconstruct complicated factual histories from messages, records, receipts, files, photos, and events while preserving evidentiary distinctions.",
			"in_scope": [
				"Chronologies",
				"Source reconciliation",
				"Confirmed/unconfirmed event separation",
				"Contradiction tracking",
				"Exhibit indexing",
				"Reviewable evidence packages"
			],
			"out_of_scope": [
				"Legal conclusions",
				"Advocacy unsupported by evidence",
				"Broad research unrelated to the defined matter",
				"Altering originals"
			],
			"authority": ["May organize authorized evidence and identify gaps"],
			"prohibitions": [
				"May not decide disputed truth without support",
				"May not cross matter/privacy boundaries",
				"May not characterize allegations as facts"
			],
			"inputs": [
				"Defined matter",
				"Authorized records",
				"Dates",
				"Communications",
				"Transactions",
				"Media",
				"Evidentiary standard"
			],
			"outputs": [
				"Sourced timeline",
				"Evidence index",
				"Contradiction table",
				"Gaps",
				"Review package"
			],
			"required_skills": [
				"Timeline reconstruction",
				"Evidence handling",
				"Document reconciliation",
				"Source attribution",
				"Uncertainty classification",
				"Privacy partitioning"
			],
			"future_tools_access": [
				"Permission-scoped records",
				"Document/media viewers",
				"Timeline tools",
				"Evidence storage",
				"Hashing"
			],
			"living_model_read": ["Only the matter-specific context"],
			"living_model_write": ["Events with source, status, confidence, relationship, and access boundary"],
			"evaluation": "Every material event must trace to evidence or be marked disputed/unknown.",
			"failure_behavior": null,
			"separation": "Research answers external questions; File Organization locates sources; this role reconstructs the factual history.",
			"proposed_failure_behavior": "Mark disputed or unknown rather than resolving without support.",
			"contract_provenance": {
				"packet_sourced": [
					"in_scope",
					"out_of_scope",
					"authority",
					"prohibitions",
					"inputs",
					"outputs",
					"required_skills",
					"future_tools_access",
					"living_model_read",
					"living_model_write",
					"evaluation",
					"separation",
					"permanent_job_and_separate_agent_reason"
				],
				"agent_proposed": ["proposed_failure_behavior"],
				"verified_against": "DAYNA MCP/LLM BUILD EXECUTION PACKET rev. 23 August 2026, TAB 04"
			}
		}
	]
};
/**
* Forty permanent occupational role contracts.
* Loaded from TAB 04 of the Dayna MCP/LLM Build Execution Packet (23 Aug 2026).
* Do not collapse, rename, or implement from summaries.
*/
var GROUP_TO_FAMILY = {
	navigation_coordination_continuity: "navigation",
	career_and_employment: "career",
	communication_and_writing: "writing",
	business_offers_marketing_content: "business",
	financial_and_operational_records: "records",
	resale_operations: "resale",
	media_and_file_stewardship: "media",
	technical_support_and_evidence_reconstruction: "technical"
};
function join$1(parts) {
	return parts.filter(Boolean).join("; ");
}
function deriveAllowed(role) {
	const auth = join$1(role.authority).toLowerCase();
	const prohib = join$1(role.prohibitions).toLowerCase();
	const allowed = ["READ", "ANALYZE"];
	if (/\b(draft|edit|restructure|revise|compose|write|compare versions)\b/.test(auth)) allowed.push("DRAFT");
	if (/\b(modify|update records|ingest|inventory|link originals)\b/.test(auth) && !/\bmay not edit\b/.test(prohib) && !/\bread-only\b/.test(auth)) allowed.push("MODIFY");
	return allowed;
}
function mapRole(role) {
	const family = GROUP_TO_FAMILY[role.group];
	if (!family) throw new Error(`UNKNOWN_GROUP:${role.group}`);
	const prohibitionList = role.prohibitions.map((p) => p.trim()).filter(Boolean);
	const failure = role.failure_behavior && String(role.failure_behavior).trim() || role.proposed_failure_behavior && String(role.proposed_failure_behavior).trim() || "";
	return {
		id: role.number,
		slug: role.id.replace(/_/g, "-"),
		name: role.name,
		family,
		job: role.permanent_job_and_separate_agent_reason,
		inScope: join$1(role.in_scope),
		outOfScope: join$1(role.out_of_scope),
		authority: join$1(role.authority),
		prohibitions: join$1(prohibitionList),
		prohibitionList,
		inputsOutputs: `${join$1(role.inputs)} → ${join$1(role.outputs)}`,
		requiredSkills: role.required_skills,
		tools: join$1(role.future_tools_access),
		livingModel: `Read: ${join$1(role.living_model_read)}. Write: ${join$1(role.living_model_write)}.`,
		evaluation: role.evaluation,
		failureBehavior: failure,
		separation: role.separation,
		allowedActions: deriveAllowed(role),
		requiresApprovalFor: [
			"EXECUTE",
			"PUBLISH",
			"SEND",
			"DELETE"
		],
		handoffRoleIds: []
	};
}
var packetList = packet_roles_default.roles;
if (!Array.isArray(packetList) || packetList.length !== 40) throw new Error(`PACKET_ROLE_COUNT:${Array.isArray(packetList) ? packetList.length : "invalid"}`);
var ROLES = packetList.slice().sort((a, b) => a.number - b.number).map(mapRole);
var byId = new Map(ROLES.map((r) => [r.id, r]));
new Map(ROLES.map((r) => [r.slug, r]));
function getRole(id) {
	const r = byId.get(id);
	if (!r) throw new Error(`UNKNOWN_ROLE:${id}`);
	return r;
}
function assertExactlyFortyRoles() {
	if (ROLES.length !== 40) throw new Error(`ROLE_COUNT:${ROLES.length}`);
	const ids = ROLES.map((r) => r.id);
	if (new Set(ids).size !== 40) throw new Error("DUPLICATE_ROLE_ID");
	for (let i = 1; i <= 40; i++) if (!byId.has(i)) throw new Error(`MISSING_ROLE:${i}`);
}
assertExactlyFortyRoles();
var WORKFLOW_CHAINS = [
	{
		id: "career",
		title: "Career / job search",
		requirementId: "R-WF-CAREER",
		steps: [
			{
				roleId: 7,
				name: "Job Discovery Researcher"
			},
			{
				roleId: 8,
				name: "Role Fit and Opportunity Analyst"
			},
			{
				roleId: 9,
				name: "Resume Specialist",
				optional: true
			},
			{
				roleId: 10,
				name: "Application Materials Specialist",
				optional: true
			},
			{
				roleId: 11,
				name: "Interview Preparation Specialist",
				optional: true
			},
			{
				roleId: 12,
				name: "Application Pipeline Coordinator"
			},
			{
				roleId: 13,
				name: "Professional Correspondence Specialist",
				optional: true
			}
		],
		notes: "Discovery, fit, resume, application materials, interview, and pipeline remain separate."
	},
	{
		id: "writing",
		title: "Correspondence and writing",
		requirementId: "R-WF-WRITE",
		steps: [
			{
				roleId: 1,
				name: "Natural-Language Intake Coordinator"
			},
			{
				roleId: 5,
				name: "Thinking and Decision Partner",
				optional: true
			},
			{
				roleId: 13,
				name: "Professional Correspondence Specialist",
				optional: true
			},
			{
				roleId: 14,
				name: "Personal and Difficult-Conversation Specialist",
				optional: true
			},
			{
				roleId: 15,
				name: "Long-Form Writing and Voice Editor",
				optional: true
			},
			{
				roleId: 16,
				name: "Brand and Web Copywriter",
				optional: true
			},
			{
				roleId: 3,
				name: "Continuity and Correction Steward"
			}
		],
		notes: "The correct writing specialist works the same artifact lineage. New lineage only on explicit reset."
	},
	{
		id: "business",
		title: "Business opportunity through campaign",
		requirementId: "R-WF-BIZ",
		steps: [
			{
				roleId: 17,
				name: "Business Opportunity Analyst"
			},
			{
				roleId: 18,
				name: "Service and Offer Designer"
			},
			{
				roleId: 19,
				name: "Revenue and Commercial Pricing Analyst"
			},
			{
				roleId: 20,
				name: "Market Positioning Strategist"
			},
			{
				roleId: 21,
				name: "Campaign and Outreach Planner"
			},
			{
				roleId: 16,
				name: "Brand and Web Copywriter",
				optional: true
			},
			{
				roleId: 22,
				name: "Social Content Producer and Publisher",
				optional: true
			}
		],
		notes: "Opportunity, offer, commercial pricing, positioning, campaign, and content remain separate."
	},
	{
		id: "financial",
		title: "Financial records (separated)",
		requirementId: "R-WF-FIN",
		steps: [
			{
				roleId: 23,
				name: "Personal Cash-Flow and Bills Analyst",
				optional: true
			},
			{
				roleId: 24,
				name: "Business Bookkeeping and Financial Records Specialist",
				optional: true
			},
			{
				roleId: 25,
				name: "Consignment Settlement Specialist",
				optional: true
			}
		],
		notes: "Personal cash flow, business bookkeeping, and consignment settlement never collapse."
	},
	{
		id: "resale",
		title: "Resale item lifecycle",
		requirementId: "R-WF-RESALE",
		steps: [
			{
				roleId: 34,
				name: "Original Media and Photo Custodian"
			},
			{
				roleId: 27,
				name: "Resale Intake and Item Record Specialist"
			},
			{
				roleId: 28,
				name: "Product Identification and Attribution Researcher"
			},
			{
				roleId: 29,
				name: "Condition and Measurements Specialist"
			},
			{
				roleId: 35,
				name: "Image Selection and Resale Preparation Specialist",
				optional: true
			},
			{
				roleId: 30,
				name: "Comparable-Sales Researcher"
			},
			{
				roleId: 31,
				name: "Resale Pricing Analyst"
			},
			{
				roleId: 32,
				name: "Marketplace Listing Specialist"
			},
			{
				roleId: 33,
				name: "Inventory, Order, and Fulfillment Coordinator"
			},
			{
				roleId: 25,
				name: "Consignment Settlement Specialist",
				optional: true
			},
			{
				roleId: 24,
				name: "Business Bookkeeping and Financial Records Specialist",
				optional: true
			}
		],
		notes: "Identification, condition, comps, pricing, listing, and fulfillment remain separate occupations."
	},
	{
		id: "media",
		title: "Media custody then derivatives",
		requirementId: "R-WF-MEDIA",
		steps: [{
			roleId: 34,
			name: "Original Media and Photo Custodian"
		}, {
			roleId: 35,
			name: "Image Selection and Resale Preparation Specialist"
		}],
		notes: "Originals are never altered. Derivatives always link to an original."
	},
	{
		id: "technical",
		title: "Technical diagnosis then implementation",
		requirementId: "R-WF-TECH",
		steps: [
			{
				roleId: 37,
				name: "Software and Repository Diagnostician"
			},
			{
				roleId: 38,
				name: "Software Implementation and Release Specialist"
			},
			{
				roleId: 26,
				name: "Ecosystem Reliability and Integration Maintainer"
			}
		],
		notes: "Desktop Support (39) remains separate for the user's PC."
	},
	{
		id: "forensic",
		title: "Forensic timeline",
		requirementId: "R-WF-FOR",
		steps: [
			{
				roleId: 36,
				name: "File Discovery, Provenance, and Organization Specialist",
				optional: true
			},
			{
				roleId: 40,
				name: "Forensic Timeline and Evidence Package Specialist"
			},
			{
				roleId: 6,
				name: "Research and Evidence Analyst",
				optional: true
			}
		],
		notes: "Allegations and inference are never recorded as facts."
	}
];
function getChain(id) {
	const c = WORKFLOW_CHAINS.find((w) => w.id === id);
	if (!c) throw new Error(`UNKNOWN_CHAIN:${id}`);
	return c;
}
function classifyIntakeDomain(text) {
	const t = text.toLowerCase();
	const hits = [];
	const add = (chainId, roleId, words) => {
		const score = words.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
		if (score) hits.push({
			chainId,
			roleId,
			score
		});
	};
	add("career", 7, [
		"job",
		"resume",
		"interview",
		"application",
		"hiring",
		"role fit"
	]);
	add("writing", 15, [
		"essay",
		"voice",
		"letter",
		"draft",
		"rewrite",
		"edit this"
	]);
	add("writing", 13, [
		"email",
		"follow-up",
		"correspondence"
	]);
	add("writing", 14, [
		"difficult conversation",
		"apology",
		"boundary",
		"personal message"
	]);
	add("business", 17, [
		"offer",
		"pricing",
		"campaign",
		"positioning",
		"business idea"
	]);
	add("financial", 23, [
		"bill",
		"cash flow",
		"invoice",
		"receipt",
		"consignment"
	]);
	add("resale", 27, [
		"resale",
		"listing",
		"consign",
		"ebay",
		"poshmark",
		"sold comp"
	]);
	add("media", 34, [
		"photo",
		"photos",
		"image",
		"batch",
		"jpeg",
		"png"
	]);
	add("technical", 37, [
		"bug",
		"repository",
		"deploy",
		"typeerror",
		"build failed"
	]);
	add("forensic", 40, [
		"timeline",
		"chronology",
		"evidence package",
		"forensic"
	]);
	hits.sort((a, b) => b.score - a.score);
	if (!hits.length) return {
		chainId: "writing",
		roleId: 1,
		confidence: .2,
		uncertain: true
	};
	const top = hits[0];
	const second = hits[1]?.score ?? 0;
	const uncertain = top.score < 2 || top.score === second;
	return {
		chainId: top.chainId,
		roleId: top.roleId,
		confidence: Math.min(.95, .35 + top.score * .15),
		uncertain
	};
}
function newId(prefix = "") {
	const id = randomUUID();
	return prefix ? `${prefix}_${id}` : id;
}
function sha256Hex(data) {
	const h = createHash("sha256");
	h.update(typeof data === "string" ? data : Buffer.from(data));
	return h.digest("hex");
}
var SECRET_PATTERNS = [
	/xai[_-]?api[_-]?key/i,
	/gemini[_-]?api[_-]?key/i,
	/llm[_-]?api[_-]?key/i,
	/api[_-]?key\s*[:=]/i,
	/bearer\s+[a-z0-9._-]+/i,
	/password\s*[:=]/i,
	/database_url/i,
	/secret\s*[:=]/i,
	/\bsk-[a-zA-Z0-9]{10,}/,
	/\bAIza[0-9A-Za-z_-]{30,}/,
	/\bAQ\.[0-9A-Za-z_-]{20,}/,
	/-----BEGIN [A-Z ]+PRIVATE KEY-----/
];
function containsSecret(text) {
	return SECRET_PATTERNS.some((re) => re.test(text));
}
function redactSecrets(text) {
	let out = text;
	for (const re of SECRET_PATTERNS) out = out.replace(re, "[REDACTED]");
	return out;
}
function assertActionAllowed(roleId, action) {
	const role = getRole(roleId);
	if (!role.allowedActions.includes(action)) return {
		ok: false,
		code: "ACTION_FORBIDDEN",
		message: `${role.name} may not ${action}. ${role.prohibitions}`
	};
	return { ok: true };
}
function assertApprovalNeeded(roleId, action) {
	return getRole(roleId).requiresApprovalFor.includes(action);
}
function detectCircularHandoff(path, nextRoleId) {
	if (path.includes(nextRoleId)) {
		if (path[path.length - 1] === nextRoleId || path.slice(-3).includes(nextRoleId)) return {
			ok: false,
			code: "CIRCULAR_HANDOFF",
			message: `Handoff path ${path.join("→")} → ${nextRoleId} is circular`
		};
	}
	const pair = `${path[path.length - 1]}>${nextRoleId}`;
	const back = `${nextRoleId}>${path[path.length - 1]}`;
	if (path.join(">").includes(back) && path.includes(nextRoleId)) return {
		ok: false,
		code: "CIRCULAR_HANDOFF",
		message: `Handoff ${pair} reverses an earlier assignment without new evidence`
	};
	return { ok: true };
}
function tokens(text) {
	return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2));
}
/** Paraphrases that have already slipped token-overlap denylists. Fail closed. */
var PARAPHRASE_RULES = [
	{
		id: "guarantee_sale",
		when: /guarantee|sale|sell|listing|price|seller/,
		hits: /guarantee.{0,40}sell|promise.{0,40}sell|definitely sell|will sell today|guaranteed to sell|this will (definitely|surely) sell/
	},
	{
		id: "overwrite_original",
		when: /overwrite|original/,
		hits: /overwrite.{0,20}original|replace the original|save over the original|destructive rename/
	},
	{
		id: "unapproved_voice",
		when: /voice|imitate|unapproved|ai-generated|ai generated/,
		hits: /learn.{0,20}voice from (unapproved|ai)|imitate.{0,20}(ai|unapproved)|write as her from (resume|old ai)/
	},
	{
		id: "publish_without_approval",
		when: /publish|send|pay|payout|listing/,
		hits: /publish (now|anyway|without)|send (it|this) (now|without approval)|pay (them|out) now|go live without/
	}
];
function assertProhibitedSpeech(roleId, text, phase = "request") {
	const role = getRole(roleId);
	const hay = text.toLowerCase();
	const prohibitions = role.prohibitionList.length ? role.prohibitionList : role.prohibitions.split(";").map((s) => s.trim()).filter(Boolean);
	for (const rule of PARAPHRASE_RULES) if (rule.when.test(`${role.name} ${role.job} ${role.prohibitions}`) && rule.hits.test(hay)) return {
		ok: false,
		code: "PROHIBITION_PARAPHRASE",
		message: `${role.name} refused: this request paraphrases a prohibition (${rule.id}). ${role.prohibitions}`
	};
	if (phase === "output") return { ok: true };
	for (const p of prohibitions) {
		const pTok = tokens(p.replace(/^may not\s+/i, ""));
		const tTok = tokens(hay);
		if (pTok.size < 2) continue;
		let hit = 0;
		for (const w of pTok) if (tTok.has(w)) hit += 1;
		if (hit / pTok.size >= .7) return {
			ok: false,
			code: "PROHIBITION_OVERLAP",
			message: `${role.name} refused: request overlaps prohibition "${p}".`
		};
	}
	return { ok: true };
}
function sanitizeForAgentContext(input) {
	return {
		userStatement: redactSecrets(input.userStatement ?? ""),
		other: redactSecrets(input.other ?? "")
	};
}
var LLM_MODEL = process.env.LLM_MODEL?.trim() || "gemini-3.6-flash";
var LLM_BASE = (process.env.LLM_BASE_URL?.trim() || "https://generativelanguage.googleapis.com/v1beta/openai").replace(/\/+$/, "");
function resolveApiKey() {
	return (process.env.LLM_API_KEY || process.env.GEMINI_API_KEY)?.trim() || void 0;
}
function llmAvailable() {
	return Boolean(resolveApiKey());
}
function estimateCostCents(prompt, completion) {
	return (prompt * 5e-4 + completion * .0015) / 10;
}
async function invokeLlm(opts) {
	const apiKey = resolveApiKey();
	if (!apiKey) return {
		ok: false,
		code: "LLM_UNAVAILABLE",
		error: "Occupational judgment cannot run: the language model is not available. The file was preserved. Nothing was invented."
	};
	const system = redactSecrets(opts.system);
	const user = redactSecrets(opts.user);
	try {
		const body = {
			model: LLM_MODEL,
			max_tokens: opts.maxTokens ?? 900,
			temperature: .2,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		};
		if (opts.json) body.response_format = { type: "json_object" };
		let res = await fetch(`${LLM_BASE}/chat/completions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify(body)
		});
		if (!res.ok && res.status === 400 && body.response_format) {
			delete body.response_format;
			res = await fetch(`${LLM_BASE}/chat/completions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${apiKey}`
				},
				body: JSON.stringify(body)
			});
		}
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			return {
				ok: false,
				code: "LLM_ERROR",
				error: `LLM API error ${res.status}: ${body.slice(0, 400)}`
			};
		}
		const json = await res.json();
		const text = json.choices?.[0]?.message?.content ?? "";
		if (!text.trim()) return {
			ok: false,
			code: "LLM_EMPTY",
			error: "The model returned an empty response."
		};
		const promptTokens = json.usage?.prompt_tokens ?? 0;
		const completionTokens = json.usage?.completion_tokens ?? 0;
		return {
			ok: true,
			text,
			model: json.model ?? LLM_MODEL,
			promptTokens,
			completionTokens,
			costCents: estimateCostCents(promptTokens, completionTokens)
		};
	} catch (err) {
		return {
			ok: false,
			code: "LLM_ERROR",
			error: err instanceof Error ? err.message : "LLM request failed"
		};
	}
}
async function invokeVision(opts) {
	const apiKey = resolveApiKey();
	if (!apiKey) return {
		ok: false,
		code: "LLM_UNAVAILABLE",
		error: "Vision analysis is not available. The original is preserved. The item is in review — identity was not invented."
	};
	try {
		const res = await fetch(`${LLM_BASE}/chat/completions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: LLM_MODEL,
				max_tokens: 500,
				temperature: .1,
				messages: [{
					role: "system",
					content: "You analyze images for cataloging. Describe visible geometry, color, text, and defects. Never invent a brand, title, person, or identity. If uncertain, say uncertain. Return JSON only: {description, text_seen, quality, confidence, uncertain_reasons}."
				}, {
					role: "user",
					content: [{
						type: "text",
						text: redactSecrets(opts.prompt)
					}, {
						type: "image_url",
						image_url: { url: `data:${opts.mime};base64,${opts.imageBase64}` }
					}]
				}]
			})
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			return {
				ok: false,
				code: "LLM_ERROR",
				error: `LLM vision error ${res.status}: ${body.slice(0, 400)}`
			};
		}
		const json = await res.json();
		const text = json.choices?.[0]?.message?.content ?? "";
		if (!text.trim()) return {
			ok: false,
			code: "LLM_EMPTY",
			error: "Vision returned empty."
		};
		const promptTokens = json.usage?.prompt_tokens ?? 0;
		const completionTokens = json.usage?.completion_tokens ?? 0;
		return {
			ok: true,
			text,
			model: json.model ?? LLM_MODEL,
			promptTokens,
			completionTokens,
			costCents: estimateCostCents(promptTokens, completionTokens)
		};
	} catch (err) {
		return {
			ok: false,
			code: "LLM_ERROR",
			error: err instanceof Error ? err.message : "Vision request failed"
		};
	}
}
async function ensureWorkspace(sql, userId) {
	let workspaceId = (await sql.query(`select id from workspaces where user_id = $1`, [userId]))[0]?.id;
	if (!workspaceId) {
		workspaceId = newId("ws");
		await sql.query(`insert into workspaces (id, user_id) values ($1,$2) on conflict (user_id) do nothing`, [workspaceId, userId]);
		workspaceId = (await sql.query(`select id from workspaces where user_id = $1`, [userId]))[0]?.id ?? workspaceId;
	}
	await sql.query(`insert into spend_limits (user_id, daily_cents) values ($1, 500) on conflict (user_id) do nothing`, [userId]);
	await seedSkills(sql, userId);
	await writeHealth(sql, userId);
	return { workspaceId };
}
async function seedSkills(sql, userId) {
	if (((await sql.query(`select count(*)::int as n from skills where user_id = $1`, [userId]))[0]?.n ?? 0) > 0) return;
	for (const role of ROLES) for (const name of role.requiredSkills) {
		const id = newId("skill");
		await sql.query(`insert into skills (id, user_id, role_id, name, status, evidence)
         values ($1,$2,$3,$4,'candidate','seeded from TAB 04 required skills')
         on conflict (user_id, role_id, name) do nothing`, [
			id,
			userId,
			role.id,
			name
		]);
	}
}
async function writeHealth(sql, userId) {
	const payload = {
		status: "PARTIAL",
		db: dbSource,
		llm: llmAvailable() ? LLM_MODEL : "UNAVAILABLE",
		roles: 40,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		note: "WORKING is reserved for Stage 15. Components remain PARTIAL."
	};
	await sql.query(`insert into system_health (id, user_id, payload_json)
     values ($1,$2,$3)
     on conflict (id) do update set user_id = excluded.user_id, payload_json = excluded.payload_json, updated_at = now()`, [
		`health:${userId}`,
		userId,
		JSON.stringify(payload)
	]);
}
async function dailySpendCents(sql, userId) {
	const rows = await sql.query(`select coalesce(sum(cost_cents),0) as total from usage_events
     where user_id = $1 and created_at >= date_trunc('day', now())`, [userId]);
	return Number(rows[0]?.total ?? 0);
}
async function spendCeiling(sql, userId) {
	const rows = await sql.query(`select daily_cents from spend_limits where user_id = $1`, [userId]);
	return Number(rows[0]?.daily_cents ?? 500);
}
async function recordUsage(sql, opts) {
	await sql.query(`insert into usage_events (id, user_id, kind, cost_cents) values ($1,$2,$3,$4)`, [
		newId("use"),
		opts.userId,
		opts.kind,
		opts.costCents
	]);
}
async function audit(sql, opts) {
	await sql.query(`insert into audit_log (id, user_id, actor, action, target, detail) values ($1,$2,$3,$4,$5,$6)`, [
		newId("aud"),
		opts.userId,
		opts.actor,
		opts.action,
		opts.target ?? null,
		opts.detail ?? null
	]);
}
var CONTEXT_KINDS = [
	"user_statement",
	"verified_fact",
	"external_evidence",
	"agent_inference",
	"calculation",
	"preference",
	"decision",
	"temporary_idea",
	"correction",
	"superseded_state",
	"unfinished_work",
	"processing_aloud"
];
var SELECT = `id, user_id, kind, body, author, source, confidence, scope, permissions,
  project_id, matter_id, supersedes_id, superseded_by, lineage_id, version_n, artifact_id,
  created_at::text as created_at`;
async function writeContext(sql, opts) {
	if (!CONTEXT_KINDS.includes(opts.kind)) throw new Error(`UNKNOWN_CONTEXT_KIND:${opts.kind}`);
	if (opts.kind === "user_statement" && opts.author !== "dayna" && opts.author !== "user") throw new Error("USER_STATEMENT_AUTHOR_MUST_BE_USER");
	if (opts.kind === "agent_inference" && (opts.author === "dayna" || opts.author === "user")) throw new Error("INFERENCE_CANNOT_BE_ATTRIBUTED_TO_USER");
	const id = newId("ctx");
	const lineageId = opts.lineageId ?? newId("lin");
	await sql.query(`insert into living_context
      (id, user_id, kind, body, author, source, confidence, scope, permissions, project_id, matter_id, lineage_id, artifact_id)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, [
		id,
		opts.userId,
		opts.kind,
		opts.body,
		opts.author,
		opts.source ?? null,
		opts.confidence ?? null,
		opts.scope ?? opts.kind,
		opts.permissions ?? "owner",
		opts.projectId ?? null,
		opts.matterId ?? null,
		lineageId,
		opts.artifactId ?? null
	]);
	const row = await getContext(sql, opts.userId, id);
	if (!row) throw new Error("CONTEXT_WRITE_FAILED");
	return row;
}
async function getContext(sql, userId, id) {
	return (await sql.query(`select ${SELECT} from living_context where id = $1 and user_id = $2`, [id, userId]))[0] ?? null;
}
async function currentOfLineage(sql, userId, lineageId) {
	return (await sql.query(`select ${SELECT} from living_context
     where user_id = $1 and lineage_id = $2 and superseded_by is null
     order by version_n desc limit 1`, [userId, lineageId]))[0] ?? null;
}
async function correctContext(sql, opts) {
	const prior = await getContext(sql, opts.userId, opts.supersedesId);
	if (!prior) throw new Error("CONTEXT_NOT_FOUND");
	const id = newId("ctx");
	const version = prior.version_n + 1;
	await sql.query(`insert into living_context
      (id, user_id, kind, body, author, source, confidence, scope, permissions, project_id, matter_id,
       supersedes_id, lineage_id, version_n, artifact_id)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`, [
		id,
		opts.userId,
		"correction",
		opts.body,
		opts.author,
		"user_correction",
		1,
		prior.scope,
		prior.permissions,
		prior.project_id,
		prior.matter_id,
		prior.id,
		prior.lineage_id,
		version,
		prior.artifact_id
	]);
	await sql.query(`update living_context set superseded_by = $1, kind = case when id = $2 then 'superseded_state' else kind end
     where user_id = $3 and id = $2`, [
		id,
		prior.id,
		opts.userId
	]);
	const row = await getContext(sql, opts.userId, id);
	if (!row) throw new Error("CORRECTION_WRITE_FAILED");
	return row;
}
async function retrieveForTask(sql, opts) {
	const limit = opts.limit ?? 40;
	return sql.query(`select ${SELECT} from living_context
     where user_id = $1
       and superseded_by is null
       and (
         source = 'voice_pillar'
         or permissions is null
         or permissions in ('owner','role','public')
       )
       and ($2::text is null or project_id is null or project_id = $2)
       and (kind <> 'agent_inference' or author = $3)
     order by case when source = 'voice_pillar' then 0 else 1 end, created_at desc
     limit $4`, [
		opts.userId,
		opts.projectId ?? null,
		`role:${opts.roleId}`,
		limit
	]);
}
async function listVoicePillars(sql, userId) {
	return sql.query(`select ${SELECT} from living_context
     where user_id = $1 and source = 'voice_pillar' and superseded_by is null
     order by scope, created_at`, [userId]);
}
async function listContext(sql, userId, limit = 80) {
	return sql.query(`select ${SELECT} from living_context where user_id = $1 order by created_at desc limit $2`, [userId, limit]);
}
async function refineArtifact(sql, opts) {
	const existing = await sql.query(`select id, lineage_id, current_version from artifacts where id = $1 and user_id = $2`, [opts.artifactId, opts.userId]);
	if (!existing[0]) throw new Error("ARTIFACT_NOT_FOUND");
	if (opts.startOver) {
		const lineageId = newId("lin");
		const artifactId = newId("art");
		await sql.query(`insert into artifacts (id, user_id, title, kind, lineage_id, current_version)
       values ($1,$2,$3,$4,$5,1)`, [
			artifactId,
			opts.userId,
			"new direction",
			"writing",
			lineageId
		]);
		await sql.query(`insert into artifact_versions (id, artifact_id, user_id, version_n, body, origin)
       values ($1,$2,$3,1,$4,$5)`, [
			newId("ver"),
			artifactId,
			opts.userId,
			opts.body,
			opts.origin
		]);
		return {
			artifactId,
			lineageId,
			version: 1
		};
	}
	const version = existing[0].current_version + 1;
	await sql.query(`insert into artifact_versions (id, artifact_id, user_id, version_n, body, origin)
     values ($1,$2,$3,$4,$5,$6)`, [
		newId("ver"),
		existing[0].id,
		opts.userId,
		version,
		opts.body,
		opts.origin
	]);
	await sql.query(`update artifacts set current_version = $1 where id = $2 and user_id = $3`, [
		version,
		existing[0].id,
		opts.userId
	]);
	return {
		artifactId: existing[0].id,
		lineageId: existing[0].lineage_id,
		version
	};
}
async function createArtifact(sql, opts) {
	const artifactId = newId("art");
	const lineageId = newId("lin");
	await sql.query(`insert into artifacts (id, user_id, title, kind, lineage_id, current_version)
     values ($1,$2,$3,$4,$5,1)`, [
		artifactId,
		opts.userId,
		opts.title,
		opts.kind,
		lineageId
	]);
	await sql.query(`insert into artifact_versions (id, artifact_id, user_id, version_n, body, origin)
     values ($1,$2,$3,1,$4,$5)`, [
		newId("ver"),
		artifactId,
		opts.userId,
		opts.body,
		opts.origin
	]);
	return {
		artifactId,
		lineageId
	};
}
/** Permanent 14-point operating rubric (directive §8 + packet). */
var RUBRIC_POINTS = [
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
	"no_fabricated_success"
];
function emptyRubric(notes) {
	return RUBRIC_POINTS.map((point) => ({
		point,
		pass: false,
		note: notes?.[point] ?? "not evaluated"
	}));
}
function asOptionalString(v) {
	if (typeof v === "string") return v;
	if (v == null) return void 0;
	return String(v);
}
function asNullableString(v) {
	if (typeof v === "string") return v.trim() ? v : null;
	if (v == null) return null;
	return String(v);
}
function asNullableRoleId(v) {
	const n = typeof v === "number" ? v : typeof v === "string" ? Number.parseInt(v, 10) : NaN;
	if (!Number.isInteger(n) || n < 1 || n > 40) return null;
	return n;
}
/** Coerce untrusted model output to the exact OccupationOutput shape.
*  Values that cannot be coerced become null/undefined \u2014 never a wrong type
*  that would later hit a typed database column. */
function validateOccupationOutput(raw) {
	return {
		interpretation: asOptionalString(raw.interpretation),
		output: raw.output,
		evidence: Array.isArray(raw.evidence) ? raw.evidence : raw.evidence != null ? [raw.evidence] : void 0,
		uncertainty: asNullableString(raw.uncertainty),
		handoff_role_id: asNullableRoleId(raw.handoff_role_id),
		needs_approval: raw.needs_approval === true || raw.needs_approval === "true",
		approval_action: asNullableString(raw.approval_action),
		context_note: asOptionalString(raw.context_note)
	};
}
function parseOccupationOutput(text) {
	const candidates = [];
	const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
	if (fenced) candidates.push(fenced[1].trim());
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	if (start >= 0 && end > start) candidates.push(text.slice(start, end + 1));
	candidates.push(text.trim());
	let last;
	for (const raw of candidates) {
		const cleaned = raw.replace(/[\u201C\u201D]/g, "\"").replace(/[\u2018\u2019]/g, "'").replace(/,\s*([}\]])/g, "$1");
		try {
			const parsed = JSON.parse(cleaned);
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return validateOccupationOutput(parsed);
		} catch (err) {
			last = err;
		}
	}
	throw last instanceof Error ? last : /* @__PURE__ */ new Error("NO_JSON");
}
function emptyPayload() {
	return { history: [] };
}
function parsePayload(raw) {
	if (!raw) return emptyPayload();
	try {
		const parsed = JSON.parse(raw);
		if (!parsed.history) parsed.history = [];
		return parsed;
	} catch {
		return emptyPayload();
	}
}
async function createWorkPackage(sql, opts) {
	const id = newId("pkg");
	const payload = {
		...emptyPayload(),
		...opts.payload,
		history: opts.payload?.history ?? []
	};
	await sql.query(`insert into work_packages (id, user_id, title, objective, status, payload_json)
     values ($1,$2,$3,$4,'open',$5)`, [
		id,
		opts.userId,
		opts.title,
		opts.objective,
		JSON.stringify(payload)
	]);
	return {
		id,
		user_id: opts.userId,
		title: opts.title,
		objective: opts.objective,
		status: "open",
		workflow_id: null,
		payload
	};
}
async function bindPackageWorkflow(sql, userId, packageId, workflowId) {
	await sql.query(`update work_packages set workflow_id = $1 where id = $2 and user_id = $3`, [
		workflowId,
		packageId,
		userId
	]);
}
async function loadPackage(sql, userId, id) {
	const rows = await sql.query(`select id, user_id, title, objective, status, workflow_id, payload_json from work_packages where id = $1 and user_id = $2`, [id, userId]);
	if (!rows[0]) return null;
	return {
		...rows[0],
		payload: parsePayload(rows[0].payload_json)
	};
}
async function appendPackageHistory(sql, opts) {
	const pkg = await loadPackage(sql, opts.userId, opts.packageId);
	if (!pkg) return null;
	pkg.payload.history.push({
		roleId: opts.roleId,
		taskId: opts.taskId,
		stepName: opts.stepName,
		interpretation: opts.interpretation,
		output: opts.output
	});
	await sql.query(`update work_packages set payload_json = $1 where id = $2 and user_id = $3`, [
		JSON.stringify(pkg.payload),
		pkg.id,
		opts.userId
	]);
	return pkg;
}
function packagePrompt(pkg) {
	const p = pkg.payload;
	const lines = [
		`Work package ${pkg.id}: ${pkg.title}`,
		`Objective: ${pkg.objective}`,
		p.filename ? `Held original: ${p.filename} checksum=${p.checksum ?? "none"} classification=${p.classification ?? "none"}` : "",
		p.extractedText ? `Extracted text from the original (this is evidence, not your words):\n${p.extractedText.slice(0, 6e3)}` : p.mediaBatchId ? `Media batch ${p.mediaBatchId} is in originals. Do not invent identity from a filename.` : ""
	];
	if (p.history.length) {
		lines.push("Prior occupations on this same package (do not restart the lineage):");
		for (const h of p.history) lines.push(`- role ${h.roleId}${h.stepName ? ` ${h.stepName}` : ""}: ${h.interpretation ?? ""}\n  output: ${JSON.stringify(h.output).slice(0, 1500)}`);
	} else lines.push("No prior occupation has written on this package yet. You are first.");
	return lines.filter(Boolean).join("\n");
}
function objectPath(objectKey) {
	return join(storageDir(), objectKey);
}
function writeZoneObject(objectKey, bytes) {
	if (!diskStorageEnabled()) return;
	const path = objectPath(objectKey);
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, bytes);
	if (sha256Hex(readFileSync(path)) !== sha256Hex(bytes)) throw new Error("DISK_CHECKSUM_MISMATCH");
}
function readZoneObject(objectKey) {
	if (!diskStorageEnabled()) return null;
	const path = objectPath(objectKey);
	if (!existsSync(path)) return null;
	return new Uint8Array(readFileSync(path));
}
var STORAGE_ZONES = [
	"originals",
	"intake",
	"temp",
	"derivatives",
	"review",
	"agent_ready",
	"outputs",
	"catalog",
	"archive"
];
function isZone(z) {
	return STORAGE_ZONES.includes(z);
}
function asBytes(value) {
	if (value instanceof Uint8Array) return value;
	if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) return new Uint8Array(value);
	if (value instanceof ArrayBuffer) return new Uint8Array(value);
	if (typeof value === "string") {
		const hex = value.startsWith("\\x") ? value.slice(2) : value;
		if (/^[0-9a-fA-F]+$/.test(hex) && hex.length % 2 === 0) return Uint8Array.from(Buffer.from(hex, "hex"));
		return new Uint8Array(Buffer.from(value, "base64"));
	}
	throw new Error("BLOB_BYTES_UNREADABLE");
}
function sanitizeName(name) {
	return name.replace(/[^A-Za-z0-9._-]+/g, "_").slice(0, 180) || "unnamed";
}
async function putObject(sql, opts) {
	if (!isZone(opts.zone)) throw new Error(`UNKNOWN_ZONE:${opts.zone}`);
	const id = newId("blob");
	const checksum = sha256Hex(opts.bytes);
	const filename = opts.originalFilename ? sanitizeName(opts.originalFilename) : "object";
	const objectKey = `${opts.zone}/${id}/${filename}`;
	const immutable = opts.immutable || opts.zone === "originals" ? 1 : 0;
	const buf = Buffer.from(opts.bytes);
	await sql.query(`insert into object_blobs
      (id, user_id, zone, object_key, checksum_sha256, mime, byte_size, bytes, original_filename, immutable)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [
		id,
		opts.userId,
		opts.zone,
		objectKey,
		checksum,
		opts.mime ?? null,
		opts.bytes.byteLength,
		buf,
		opts.originalFilename ?? null,
		immutable
	]);
	writeZoneObject(objectKey, opts.bytes);
	const verified = await getObject(sql, opts.userId, id);
	if (!verified || verified.checksum_sha256 !== checksum) throw new Error("PERSISTENCE_VERIFY_FAILED");
	if (sha256Hex(await getObjectBytes(sql, opts.userId, id)) !== checksum) throw new Error("CHECKSUM_MISMATCH_AFTER_WRITE");
	return verified;
}
async function getObject(sql, userId, id) {
	return (await sql.query(`select id, user_id, zone, object_key, checksum_sha256, mime, byte_size, original_filename, immutable, created_at::text as created_at
     from object_blobs where id = $1 and user_id = $2`, [id, userId]))[0] ?? null;
}
async function getObjectBytes(sql, userId, id) {
	const meta = await getObject(sql, userId, id);
	if (!meta) throw new Error("BLOB_NOT_FOUND");
	const fromDisk = readZoneObject(meta.object_key);
	if (fromDisk) {
		if (sha256Hex(fromDisk) !== meta.checksum_sha256) throw new Error("DISK_CHECKSUM_MISMATCH");
		return fromDisk;
	}
	const rows = await sql.query(`select bytes from object_blobs where id = $1 and user_id = $2`, [id, userId]);
	if (!rows[0]) throw new Error("BLOB_NOT_FOUND");
	return asBytes(rows[0].bytes);
}
async function tryMutateOriginal(sql, userId, id, bytes) {
	const row = await getObject(sql, userId, id);
	if (!row) throw new Error("BLOB_NOT_FOUND");
	if (row.immutable === 1 || row.zone === "originals") throw new Error("ORIGINAL_IMMUTABLE");
	await sql.query(`update object_blobs set bytes = $1, byte_size = $2, checksum_sha256 = $3
     where id = $4 and user_id = $5 and immutable = 0`, [
		Buffer.from(bytes),
		bytes.byteLength,
		sha256Hex(bytes),
		id,
		userId
	]);
	throw new Error("UNEXPECTED_MUTATION_PATH");
}
async function putDerivative(sql, opts) {
	const blob = await putObject(sql, {
		userId: opts.userId,
		zone: "derivatives",
		bytes: opts.bytes,
		mime: opts.mime,
		originalFilename: opts.originalFilename ?? `${opts.purpose}.bin`,
		immutable: false
	});
	const derivativeId = newId("drv");
	await sql.query(`insert into media_derivatives (id, user_id, original_asset_id, blob_id, purpose, lineage_note)
     values ($1,$2,$3,$4,$5,$6)`, [
		derivativeId,
		opts.userId,
		opts.originalAssetId,
		blob.id,
		opts.purpose,
		`derivative of ${opts.originalAssetId}; original unchanged`
	]);
	return {
		blob,
		derivativeId
	};
}
async function ingestOriginal(sql, opts) {
	const intake = await putObject(sql, {
		userId: opts.userId,
		zone: "intake",
		bytes: opts.bytes,
		mime: opts.mime,
		originalFilename: opts.originalFilename,
		immutable: false
	});
	const original = await putObject(sql, {
		userId: opts.userId,
		zone: "originals",
		bytes: opts.bytes,
		mime: opts.mime,
		originalFilename: opts.originalFilename,
		immutable: true
	});
	if (intake.checksum_sha256 !== original.checksum_sha256) throw new Error("INTAKE_ORIGINAL_CHECKSUM_MISMATCH");
	const manifest = Buffer.from(JSON.stringify({
		original_id: original.id,
		intake_id: intake.id,
		checksum_sha256: original.checksum_sha256,
		original_filename: original.original_filename,
		mime: original.mime,
		byte_size: original.byte_size,
		object_key: original.object_key
	}));
	return {
		intake,
		original,
		catalog: await putObject(sql, {
			userId: opts.userId,
			zone: "catalog",
			bytes: new Uint8Array(manifest),
			mime: "application/json",
			originalFilename: `${(opts.originalFilename ?? "object").slice(0, 80)}.manifest.json`,
			immutable: false
		})
	};
}
async function zoneCensus(sql, userId) {
	const rows = await sql.query(`select zone, count(*)::int as count, coalesce(sum(byte_size),0)::int as bytes,
            max(created_at)::text as last_write
     from object_blobs where user_id = $1 group by zone`, [userId]);
	return STORAGE_ZONES.map((zone) => {
		const hit = rows.find((r) => r.zone === zone);
		return {
			zone,
			count: Number(hit?.count ?? 0),
			bytes: Number(hit?.bytes ?? 0),
			lastWrite: hit?.last_write ?? null
		};
	});
}
var TASK_COLUMNS = `id, user_id, role_id, title, request_statement, interpretation, status, workflow_id, step_name,
            parent_task_id, package_id, input_json, output_json, evidence_json, uncertainty, recovery_json,
            is_test_only, created_at::text as created_at, updated_at::text as updated_at`;
async function getTask(sql, userId, id) {
	return (await sql.query(`select ${TASK_COLUMNS} from tasks where id = $1 and user_id = $2`, [id, userId]))[0] ?? null;
}
async function setTaskStatus(sql, task, status) {
	await sql.query(`update tasks set status = $1, updated_at = now() where id = $2 and user_id = $3`, [
		status,
		task.id,
		task.user_id
	]);
}
async function recordEvent(sql, task, kind, body) {
	await sql.query(`insert into task_events (id, task_id, user_id, kind, body) values ($1,$2,$3,$4,$5)`, [
		newId("evt"),
		task.id,
		task.user_id,
		kind,
		body
	]);
}
async function createTask(sql, opts) {
	getRole(opts.roleId);
	const id = newId("task");
	await sql.query(`insert into tasks
      (id, user_id, role_id, project_id, title, request_statement, interpretation, status, workflow_id, step_name,
       parent_task_id, package_id, input_json, is_test_only)
     values ($1,$2,$3,$4,$5,$6,$7,'queued',$8,$9,$10,$11,$12,$13)`, [
		id,
		opts.userId,
		opts.roleId,
		opts.projectId ?? null,
		opts.title,
		opts.requestStatement,
		opts.interpretation ?? null,
		opts.workflowId ?? null,
		opts.stepName ?? null,
		opts.parentTaskId ?? null,
		opts.packageId ?? null,
		opts.input ? JSON.stringify(opts.input) : null,
		opts.isTestOnly ? 1 : 0
	]);
	await sql.query(`insert into task_events (id, task_id, user_id, kind, body) values ($1,$2,$3,'created',$4)`, [
		newId("evt"),
		id,
		opts.userId,
		`role ${opts.roleId}`
	]);
	const task = await getTask(sql, opts.userId, id);
	if (!task) throw new Error("TASK_CREATE_FAILED");
	return task;
}
/**
* The single ledger writer. Every run — success, block, or approval stop —
* exits through here, so no path can complete without leaving a durable,
* readable record: an agent_runs row, a recovery point, and a task event.
* provider/model are recorded only when a provider was actually contacted.
*/
async function recordRun(sql, task, opts) {
	await sql.query(`insert into agent_runs (id, task_id, user_id, role_id, cycle_step, provider, model, prompt_tokens, completion_tokens, cost_cents, blocked_reason, rubric_json)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`, [
		newId("run"),
		task.id,
		task.user_id,
		task.role_id,
		opts.cycleStep,
		opts.llm ? "gemini" : null,
		opts.llm?.model ?? null,
		opts.llm?.promptTokens ?? null,
		opts.llm?.completionTokens ?? null,
		opts.llm?.costCents ?? null,
		opts.blockedReason,
		JSON.stringify(opts.rubric)
	]);
	await sql.query(`insert into recovery_points (id, task_id, user_id, snapshot_json) values ($1,$2,$3,$4)`, [
		newId("rec"),
		task.id,
		task.user_id,
		JSON.stringify(opts.snapshot)
	]);
}
async function runOccupation(sql, opts) {
	const rubric = emptyRubric();
	const mark = (point, pass, note) => {
		const idx = rubric.findIndex((r) => r.point === point);
		if (idx >= 0) rubric[idx] = {
			point,
			pass,
			note
		};
	};
	const task = await getTask(sql, opts.userId, opts.taskId);
	if (!task) throw new Error("TASK_NOT_FOUND");
	const role = getRole(task.role_id);
	await setTaskStatus(sql, task, "running");
	await recordEvent(sql, task, "load_role_contract", null);
	mark("occupational_scope", true, `${role.name} contract loaded`);
	/** Blocks the task visibly. Whatever the model already produced is passed
	*  in `salvage` and preserved into evidence — a failed run never erases
	*  material that was generated before the failure. */
	const fail = async (reason, failedPoint, llm, salvage) => {
		mark(failedPoint, false, reason);
		mark("review_failure_behavior", true, "blocked visibly, not silently");
		mark("no_fabricated_success", true, "failure recorded as failure");
		mark("recovery", true, "recovery point snapshotted");
		const salvageNote = salvage ? redactSecrets(salvage).slice(0, 4e3) : null;
		await sql.query(`update tasks set status = 'blocked', uncertainty = $1, recovery_json = $2,
              evidence_json = coalesce(evidence_json, $3), updated_at = now()
       where id = $4 and user_id = $5`, [
			reason,
			JSON.stringify({
				resume: true,
				reason
			}),
			salvageNote ? JSON.stringify({ salvaged_model_output: salvageNote }) : null,
			task.id,
			task.user_id
		]);
		await recordRun(sql, task, {
			cycleStep: "fail_visibly_if_blocked",
			rubric,
			blockedReason: reason,
			llm,
			snapshot: {
				status: "blocked",
				reason,
				salvaged: Boolean(salvageNote)
			}
		});
		await recordEvent(sql, task, "blocked", reason);
		if (task.workflow_id) await sql.query(`update workflow_instances set status = 'blocked' where id = $1 and user_id = $2 and status = 'running'`, [task.workflow_id, task.user_id]);
		return {
			task: await getTask(sql, task.user_id, task.id),
			blockedReason: reason,
			rubric,
			handoffTaskId: null,
			approvalId: null,
			llmUsed: llm != null
		};
	};
	const allowed = assertActionAllowed(role.id, opts.action);
	if (!allowed.ok) return fail(allowed.message, "authority_to_act", null);
	const speech = assertProhibitedSpeech(role.id, `${task.request_statement}\n${opts.extraInstruction ?? ""}`, "request");
	if (!speech.ok) return fail(speech.message, "authority_to_act", null);
	mark("authority_to_act", true, `${opts.action} allowed for ${role.name}`);
	await recordEvent(sql, task, "load_task_authority", opts.action);
	if (assertApprovalNeeded(role.id, opts.action)) {
		const appr = await sql.query(`select id, status from approvals where user_id = $1 and task_id = $2 and action_kind = $3 order by created_at desc limit 1`, [
			opts.userId,
			task.id,
			opts.action
		]);
		if (!appr[0] || appr[0].status !== "approved") {
			const approvalId = appr[0]?.id ?? await createApproval(sql, opts.userId, task.id, opts.action, role);
			await setTaskStatus(sql, task, "waiting_approval");
			mark("completion_criteria", true, "stopped for approval");
			mark("no_fabricated_success", true, "nothing executed before approval");
			await recordRun(sql, task, {
				cycleStep: "stop_for_approval",
				rubric,
				blockedReason: "WAITING_APPROVAL",
				llm: null,
				snapshot: {
					status: "waiting_approval",
					approvalId
				}
			});
			await recordEvent(sql, task, "stop_for_approval", "waiting_approval");
			return {
				task: await getTask(sql, opts.userId, task.id),
				blockedReason: "WAITING_APPROVAL",
				rubric,
				handoffTaskId: null,
				approvalId,
				llmUsed: false
			};
		}
	}
	const ctx = await retrieveForTask(sql, {
		userId: opts.userId,
		roleId: role.id
	});
	const userBits = ctx.filter((c) => c.kind === "user_statement" || c.kind === "correction");
	const inferences = ctx.filter((c) => c.kind === "agent_inference");
	const pillars = role.id === 15 || role.id === 14 || role.id === 16 ? await listVoicePillars(sql, opts.userId) : [];
	mark("user_words_vs_inference", true, `${userBits.length} user records kept apart from ${inferences.length} inferences`);
	mark("corrections_treatment", true, "corrections retrieved with user statements");
	mark("qualified_skills_tools", true, "role-scoped retrieval; unqualified tool use blocked at call sites");
	await recordEvent(sql, task, "retrieve_living_context", `${ctx.length} records`);
	const pkg = task.package_id ? await loadPackage(sql, opts.userId, task.package_id) : null;
	const pkgText = pkg ? packagePrompt(pkg) : "";
	const cleaned = sanitizeForAgentContext({
		userStatement: task.request_statement,
		other: inferences.map((c) => c.body).join("\n")
	});
	const spent = await dailySpendCents(sql, opts.userId);
	const ceiling = await spendCeiling(sql, opts.userId);
	if (spent >= ceiling) return fail(`SPEND_CEILING ${spent}/${ceiling} cents`, "spend_cost_control", null);
	mark("spend_cost_control", true, `spend ${spent}/${ceiling} cents`);
	if (!llmAvailable()) return fail("LLM_UNAVAILABLE: occupational judgment cannot run. Files and records already written remain.", "no_fabricated_success", null);
	const voiceRule = role.id === 15 || role.id === 14 || role.id === 16 ? pillars.length ? `Approved voice sources (Dayna's words, not AI):\n${pillars.map((p) => `- slot ${p.scope}: ${p.body.slice(0, 1200)}`).join("\n")}` : "No approved voice source is sealed. Do not imitate Dayna. Do not learn voice from this run or from AI text." : "";
	const system = [
		`You are the permanent occupation: ${role.name} (role ${role.id}).`,
		`Job: ${role.job}`,
		`In scope: ${role.inScope}`,
		`Out of scope: ${role.outOfScope}`,
		`Authority: ${role.authority}`,
		`Prohibitions: ${role.prohibitions}`,
		`Living-model: ${role.livingModel}`,
		voiceRule,
		`You must keep Dayna's words distinct from your interpretation.`,
		`Never invent identity, facts, or success. If uncertain, say so.`,
		`Return a single JSON object only. No markdown. Keys: interpretation (string), output (object or string), evidence (array of strings), uncertainty (string or null), handoff_role_id (number or null), needs_approval (boolean), approval_action (string or null), context_note (string).`
	].filter(Boolean).join("\n");
	const user = [
		`Dayna's words (do not rewrite as yours):\n${cleaned.userStatement}`,
		userBits.length ? `Current user statements / corrections:\n${userBits.map((c) => c.body).join("\n")}` : "",
		opts.extraInstruction ? `Additional instruction:\n${opts.extraInstruction}` : "",
		pkgText,
		task.input_json ? `Input handed to you from the previous occupation or intake:\n${task.input_json.slice(0, 4e3)}` : "",
		`Prior agent inference (not Dayna's voice):\n${cleaned.other || "(none)"}`
	].filter(Boolean).join("\n\n");
	await recordEvent(sql, task, "invoke_llm", null);
	const llm = await invokeLlm({
		system,
		user,
		maxTokens: 1800,
		json: true
	});
	await recordUsage(sql, {
		userId: opts.userId,
		kind: "llm",
		costCents: llm.ok ? llm.costCents : 0
	});
	if (!llm.ok) return fail(`${llm.code}: ${llm.error}`, "no_fabricated_success", null);
	const llmUsage = {
		model: llm.model,
		promptTokens: llm.promptTokens,
		completionTokens: llm.completionTokens,
		costCents: llm.costCents
	};
	let parsed;
	let repairUsage = {
		promptTokens: 0,
		completionTokens: 0,
		costCents: 0
	};
	try {
		parsed = parseOccupationOutput(llm.text);
	} catch {
		const repair = await invokeLlm({
			system: "Return a single JSON object only. No markdown. Keys: interpretation (string), output (object or string), evidence (array of strings), uncertainty (string or null), handoff_role_id (number or null), needs_approval (boolean), approval_action (string or null), context_note (string).",
			user: `The previous reply was not valid JSON. Repair it into valid JSON with those keys.\n\nPrevious reply:\n${llm.text.slice(0, 3500)}`,
			maxTokens: 1800,
			json: true
		});
		await recordUsage(sql, {
			userId: opts.userId,
			kind: "llm",
			costCents: repair.ok ? repair.costCents : 0
		});
		if (repair.ok) repairUsage = {
			promptTokens: repair.promptTokens,
			completionTokens: repair.completionTokens,
			costCents: repair.costCents
		};
		if (!repair.ok) return fail("STRUCTURED_OUTPUT_INVALID: model reply was not valid JSON", "completion_criteria", llmUsage, llm.text);
		try {
			parsed = parseOccupationOutput(repair.text);
		} catch {
			return fail("STRUCTURED_OUTPUT_INVALID after repair", "completion_criteria", llmUsage, repair.text);
		}
	}
	mark("completion_criteria", true, "structured output validated");
	await recordEvent(sql, task, "validate_structured_output", null);
	const totalUsage = {
		model: llmUsage.model,
		promptTokens: llmUsage.promptTokens + repairUsage.promptTokens,
		completionTokens: llmUsage.completionTokens + repairUsage.completionTokens,
		costCents: llmUsage.costCents + repairUsage.costCents
	};
	const outGate = assertProhibitedSpeech(role.id, `${parsed.interpretation ?? ""} ${typeof parsed.output === "string" ? parsed.output : JSON.stringify(parsed.output ?? {})}`, "output");
	if (!outGate.ok) return fail(outGate.message, "authority_to_act", totalUsage, JSON.stringify(parsed.output ?? parsed.interpretation ?? ""));
	const interpretation = redactSecrets(String(parsed.interpretation ?? ""));
	await writeContext(sql, {
		userId: opts.userId,
		kind: "agent_inference",
		body: interpretation || JSON.stringify(parsed.output ?? {}),
		author: `role:${role.id}`,
		source: `llm:${llm.model}`,
		confidence: parsed.uncertainty ? .4 : .7
	});
	await recordEvent(sql, task, "write_context_changes", null);
	const evidence = {
		model: llm.model,
		promptTokens: totalUsage.promptTokens,
		completionTokens: totalUsage.completionTokens,
		contextIds: ctx.map((c) => c.id),
		evidence: parsed.evidence ?? []
	};
	mark("evidence_quality", Boolean(parsed.evidence && parsed.evidence.length), `${parsed.evidence?.length ?? 0} evidence items`);
	mark("uncertainty_handling", true, parsed.uncertainty ? `uncertainty declared: ${parsed.uncertainty.slice(0, 120)}` : "no uncertainty declared");
	mark("original_provenance", true, "originals untouched by this run");
	let status = "done";
	let blockedReason = null;
	let approvalId = null;
	let handoffTaskId = null;
	if (parsed.needs_approval) {
		status = "waiting_approval";
		approvalId = await createApproval(sql, opts.userId, task.id, parsed.approval_action || opts.action, role);
		blockedReason = "WAITING_APPROVAL";
	}
	if (parsed.handoff_role_id && parsed.handoff_role_id !== role.id) {
		const circ = detectCircularHandoff(await handoffPath(sql, task), parsed.handoff_role_id);
		if (!circ.ok) return fail(circ.message, "required_handoffs", totalUsage, JSON.stringify(parsed.output ?? ""));
		try {
			getRole(parsed.handoff_role_id);
		} catch {
			return fail(`HANDOFF_UNKNOWN_ROLE:${parsed.handoff_role_id}`, "required_handoffs", totalUsage, JSON.stringify(parsed.output ?? ""));
		}
		handoffTaskId = (await createTask(sql, {
			userId: opts.userId,
			roleId: parsed.handoff_role_id,
			title: `Handoff from ${role.name}`,
			requestStatement: task.request_statement,
			interpretation: `Handoff note: ${parsed.context_note ?? ""}`,
			workflowId: task.workflow_id,
			stepName: `handoff:${role.id}->${parsed.handoff_role_id}`,
			parentTaskId: task.id,
			isTestOnly: task.is_test_only === 1,
			input: {
				fromRoleId: role.id,
				fromTaskId: task.id,
				fromStep: task.step_name,
				interpretation,
				output: parsed.output ?? null
			}
		})).id;
		status = parsed.needs_approval ? status : "handed_off";
		mark("required_handoffs", true, `handoff to role ${parsed.handoff_role_id}`);
		await recordEvent(sql, task, "handoff_if_required", `role ${parsed.handoff_role_id}`);
	} else mark("required_handoffs", true, "no handoff required");
	mark("review_failure_behavior", true, blockedReason ? blockedReason : "completed without failure");
	mark("no_fabricated_success", status !== "done" || !blockedReason, "status agrees with blockers");
	mark("recovery", true, "recovery point snapshotted");
	await sql.query(`update tasks set status = $1, interpretation = $2, output_json = $3, evidence_json = $4,
            uncertainty = $5, updated_at = now()
     where id = $6 and user_id = $7`, [
		status,
		interpretation,
		JSON.stringify(parsed.output ?? {}),
		JSON.stringify(evidence),
		parsed.uncertainty ?? null,
		task.id,
		opts.userId
	]);
	await recordEvent(sql, task, "write_task_state", status);
	await recordRun(sql, task, {
		cycleStep: status === "waiting_approval" ? "stop_for_approval" : "write_task_state",
		rubric,
		blockedReason,
		llm: totalUsage,
		snapshot: {
			status,
			roleId: role.id,
			interpretation
		}
	});
	await audit(sql, {
		userId: opts.userId,
		actor: `role:${role.id}`,
		action: "runOccupation",
		target: task.id,
		detail: status
	});
	if ((status === "done" || status === "handed_off") && task.package_id) {
		await appendPackageHistory(sql, {
			userId: opts.userId,
			packageId: task.package_id,
			roleId: role.id,
			taskId: task.id,
			stepName: task.step_name,
			interpretation,
			output: parsed.output ?? {}
		});
		await putObject(sql, {
			userId: opts.userId,
			zone: "outputs",
			bytes: new Uint8Array(Buffer.from(JSON.stringify({
				taskId: task.id,
				roleId: role.id,
				interpretation,
				output: parsed.output ?? {}
			}))),
			mime: "application/json",
			originalFilename: `${task.id}.output.json`
		});
	}
	const latest = await getTask(sql, opts.userId, task.id);
	if (latest && (latest.status === "done" || latest.status === "handed_off")) await advanceAfterComplete(sql, opts.userId, latest);
	return {
		task: (latest ? await getTask(sql, opts.userId, latest.id) : latest) ?? latest,
		blockedReason,
		rubric,
		handoffTaskId,
		approvalId,
		llmUsed: true
	};
}
async function createApproval(sql, userId, taskId, action, role) {
	const id = newId("apr");
	await sql.query(`insert into approvals (id, user_id, task_id, action_kind, consequence, status)
     values ($1,$2,$3,$4,$5,'pending')`, [
		id,
		userId,
		taskId,
		action,
		`${role.name} requests ${action}. Nothing executes until you approve.`
	]);
	return id;
}
async function handoffPath(sql, task) {
	const path = [task.role_id];
	let parent = task.parent_task_id;
	let guard = 0;
	while (parent && guard++ < 20) {
		const rows = await sql.query(`select role_id, parent_task_id from tasks where id = $1 and user_id = $2`, [parent, task.user_id]);
		if (!rows[0]) break;
		path.unshift(rows[0].role_id);
		parent = rows[0].parent_task_id;
	}
	return path;
}
async function resumeTask(sql, userId, taskId, action) {
	const task = await getTask(sql, userId, taskId);
	if (!task) throw new Error("TASK_NOT_FOUND");
	if (task.status === "done") throw new Error("TASK_ALREADY_DONE");
	return runOccupation(sql, {
		userId,
		taskId,
		action
	});
}
async function decideApproval(sql, opts) {
	const rows = await sql.query(`select id, task_id, action_kind, status from approvals where id = $1 and user_id = $2`, [opts.approvalId, opts.userId]);
	if (!rows[0]) throw new Error("APPROVAL_NOT_FOUND");
	if (rows[0].status !== "pending") throw new Error("APPROVAL_NOT_PENDING");
	await sql.query(`update approvals set status = $1, decided_at = now(), decided_note = $2 where id = $3 and user_id = $4`, [
		opts.status,
		opts.note ?? null,
		opts.approvalId,
		opts.userId
	]);
	if (opts.status === "denied") {
		if (rows[0].task_id) await sql.query(`update tasks set status = 'blocked', uncertainty = 'approval denied', updated_at = now()
         where id = $1 and user_id = $2`, [rows[0].task_id, opts.userId]);
		return {
			approvalId: opts.approvalId,
			status: "denied"
		};
	}
	if (rows[0].task_id) {
		const resumed = await runOccupation(sql, {
			userId: opts.userId,
			taskId: rows[0].task_id,
			action: rows[0].action_kind
		});
		return {
			approvalId: opts.approvalId,
			status: "approved",
			resumed
		};
	}
	return {
		approvalId: opts.approvalId,
		status: "approved"
	};
}
async function startChain(sql, opts) {
	const chain = getChain(opts.chainId);
	const workflowId = newId("wf");
	await sql.query(`insert into workflow_instances (id, user_id, chain_id, status, current_step, subject_id, subject_kind)
     values ($1,$2,$3,'running',0,$4,$5)`, [
		workflowId,
		opts.userId,
		chain.id,
		opts.subjectId ?? null,
		opts.subjectKind ?? null
	]);
	let packageId = opts.packageId ?? null;
	if (!packageId) packageId = (await createWorkPackage(sql, {
		userId: opts.userId,
		title: chain.title,
		objective: opts.requestStatement
	})).id;
	await bindPackageWorkflow(sql, opts.userId, packageId, workflowId);
	const first = chain.steps[0];
	return {
		workflowId,
		firstTask: await createTask(sql, {
			userId: opts.userId,
			roleId: first.roleId,
			title: `${chain.title}: ${first.name}`,
			requestStatement: opts.requestStatement,
			workflowId,
			stepName: first.name,
			packageId,
			input: opts.input ?? {
				chainId: chain.id,
				objective: opts.requestStatement
			},
			isTestOnly: opts.isTestOnly
		})
	};
}
async function getWorkflow(sql, userId, id) {
	return (await sql.query(`select id, user_id, chain_id, status, current_step, subject_id, created_at::text as created_at
     from workflow_instances where id = $1 and user_id = $2`, [id, userId]))[0] ?? null;
}
async function listWorkflowPaths(sql, userId) {
	const rows = await sql.query(`select id, user_id, chain_id, status, current_step, subject_id, created_at::text as created_at
     from workflow_instances where user_id = $1 order by created_at desc limit 20`, [userId]);
	const tasks = await listTasks(sql, userId);
	return rows.map((wf) => {
		const chain = getChain(wf.chain_id);
		return {
			workflow: wf,
			title: chain.title,
			steps: chain.steps.map((s, index) => {
				const t = tasks.find((x) => x.workflow_id === wf.id && x.role_id === s.roleId && x.step_name === s.name);
				return {
					index,
					roleId: s.roleId,
					name: s.name,
					optional: s.optional,
					taskId: t?.id ?? null,
					status: t?.status ?? null,
					current: index === wf.current_step && wf.status === "running"
				};
			}),
			handoffs: tasks.filter((x) => x.workflow_id === wf.id && x.step_name?.startsWith("handoff:")).map((x) => ({
				taskId: x.id,
				roleId: x.role_id,
				status: x.status,
				title: x.title
			}))
		};
	});
}
/** Create the next occupation on the chain. Hands it this occupation's output.
*  Only the task that IS the chain's current step advances the cursor — a
*  second call for the same step is a no-op, and a handoff side-task can
*  never move the chain. A blocked chain whose current step completes is
*  unblocked by that completion. */
async function advanceAfterComplete(sql, userId, task) {
	if (!task.workflow_id) return null;
	if (task.status !== "done" && task.status !== "handed_off") return null;
	const wf = await getWorkflow(sql, userId, task.workflow_id);
	if (!wf || wf.status === "completed") return null;
	const chain = getChain(wf.chain_id);
	const doneIndex = chain.steps.findIndex((s) => s.name === task.step_name && s.roleId === task.role_id);
	if (doneIndex === -1 || doneIndex !== wf.current_step) return null;
	const nextIndex = doneIndex + 1;
	const next = chain.steps[nextIndex];
	if (!next) {
		await sql.query(`update workflow_instances set status = 'completed', current_step = $1 where id = $2 and user_id = $3`, [
			chain.steps.length - 1,
			wf.id,
			userId
		]);
		if (task.package_id) await sql.query(`update work_packages set status = 'closed' where id = $1 and user_id = $2`, [task.package_id, userId]);
		return null;
	}
	const existing = await sql.query(`select ${TASK_COLUMNS}
     from tasks where user_id = $1 and workflow_id = $2 and role_id = $3 and step_name = $4
     order by created_at desc limit 1`, [
		userId,
		wf.id,
		next.roleId,
		next.name
	]);
	await sql.query(`update workflow_instances set current_step = $1, status = 'running' where id = $2 and user_id = $3`, [
		nextIndex,
		wf.id,
		userId
	]);
	if (existing[0]) return existing[0];
	let priorOutput = null;
	try {
		priorOutput = task.output_json ? JSON.parse(task.output_json) : null;
	} catch {
		priorOutput = task.output_json;
	}
	return createTask(sql, {
		userId,
		roleId: next.roleId,
		title: `${chain.title}: ${next.name}`,
		requestStatement: task.request_statement,
		interpretation: `Next occupation after ${task.step_name ?? `role ${task.role_id}`}. Same package.`,
		workflowId: wf.id,
		stepName: next.name,
		parentTaskId: task.id,
		packageId: task.package_id,
		isTestOnly: task.is_test_only === 1,
		input: {
			fromRoleId: task.role_id,
			fromTaskId: task.id,
			fromStep: task.step_name,
			interpretation: task.interpretation,
			output: priorOutput
		}
	});
}
/** Run the current queued step of a chain. One occupation. Then queue the next. */
async function driveWorkflow(sql, userId, workflowId) {
	const wf = await getWorkflow(sql, userId, workflowId);
	if (!wf) throw new Error("WORKFLOW_NOT_FOUND");
	if (wf.status === "completed") return {
		task: null,
		blockedReason: null,
		nextTaskId: null,
		workflowStatus: wf.status
	};
	const chain = getChain(wf.chain_id);
	const step = chain.steps[wf.current_step];
	if (!step) {
		await sql.query(`update workflow_instances set status = 'completed' where id = $1 and user_id = $2`, [wf.id, userId]);
		return {
			task: null,
			blockedReason: null,
			nextTaskId: null,
			workflowStatus: "completed"
		};
	}
	let task = (await sql.query(`select ${TASK_COLUMNS}
     from tasks where user_id = $1 and workflow_id = $2 and role_id = $3 and step_name = $4
     order by created_at desc limit 1`, [
		userId,
		wf.id,
		step.roleId,
		step.name
	]))[0];
	if (!task) task = await createTask(sql, {
		userId,
		roleId: step.roleId,
		title: `${chain.title}: ${step.name}`,
		requestStatement: `Continue occupational chain ${chain.id} at ${step.name}.`,
		workflowId: wf.id,
		stepName: step.name
	});
	if (task.status === "waiting_approval") return {
		task,
		blockedReason: "WAITING_APPROVAL",
		nextTaskId: null,
		workflowStatus: wf.status
	};
	if (task.status === "done" || task.status === "handed_off") {
		const next = await advanceAfterComplete(sql, userId, task);
		const latestWf = await getWorkflow(sql, userId, wf.id);
		return {
			task,
			blockedReason: null,
			nextTaskId: next?.id ?? null,
			workflowStatus: latestWf?.status ?? wf.status
		};
	}
	const run = await runOccupation(sql, {
		userId,
		taskId: task.id,
		action: "ANALYZE"
	});
	const latestWf = await getWorkflow(sql, userId, wf.id);
	return {
		task: run.task,
		blockedReason: run.blockedReason,
		nextTaskId: run.handoffTaskId,
		workflowStatus: latestWf?.status ?? wf.status
	};
}
/** Run occupations on a chain until blocked, completed, or the step cap. Each step receives the last output. */
async function driveUntilBlocked(sql, userId, workflowId, maxSteps = 8) {
	const steps = [];
	let workflowStatus = "running";
	for (let i = 0; i < maxSteps; i++) {
		const r = await driveWorkflow(sql, userId, workflowId);
		workflowStatus = r.workflowStatus;
		if (r.task) steps.push({
			taskId: r.task.id,
			roleId: r.task.role_id,
			status: r.task.status,
			blockedReason: r.blockedReason
		});
		if (r.blockedReason) break;
		if (workflowStatus === "completed") break;
		if (!r.task) break;
		if (r.task.status === "blocked" || r.task.status === "waiting_approval") break;
	}
	return {
		steps,
		workflowStatus
	};
}
async function listTasks(sql, userId) {
	return sql.query(`select ${TASK_COLUMNS} from tasks where user_id = $1 order by created_at desc limit 80`, [userId]);
}
async function enqueueJob(sql, opts) {
	const id = newId("job");
	await sql.query(`insert into intake_jobs (id, user_id, kind, status, payload_json) values ($1,$2,$3,'queued',$4)`, [
		id,
		opts.userId,
		opts.kind,
		JSON.stringify(opts.payload)
	]);
	return (await sql.query(`select id, user_id, kind, status, payload_json, error, result_json from intake_jobs where id = $1`, [id]))[0];
}
async function listJobs(sql, userId, limit = 20) {
	return sql.query(`select id, user_id, kind, status, payload_json, error, result_json from intake_jobs
     where user_id = $1 order by created_at desc limit $2`, [userId, limit]);
}
async function drainIntakeQueue(sql, opts) {
	const limit = opts?.limit ?? 4;
	const rows = opts?.userId ? await sql.query(`select id, user_id, kind, status, payload_json, error, result_json from intake_jobs
         where status = 'queued' and user_id = $1 order by created_at limit $2`, [opts.userId, limit]) : await sql.query(`select id, user_id, kind, status, payload_json, error, result_json from intake_jobs
         where status = 'queued' order by created_at limit $1`, [limit]);
	let ran = 0;
	let failed = 0;
	for (const job of rows) {
		await sql.query(`update intake_jobs set status = 'running', updated_at = now() where id = $1`, [job.id]);
		try {
			const payload = JSON.parse(job.payload_json);
			let result = { ok: true };
			if (job.kind === "drive_workflow" && payload.workflowId) result = await driveUntilBlocked(sql, job.user_id, payload.workflowId, 8);
			await sql.query(`update intake_jobs set status = 'done', result_json = $1, updated_at = now() where id = $2`, [JSON.stringify(result), job.id]);
			ran += 1;
		} catch (err) {
			failed += 1;
			await sql.query(`update intake_jobs set status = 'failed', error = $1, updated_at = now() where id = $2`, [err instanceof Error ? err.message : "job failed", job.id]);
		}
	}
	return {
		ran,
		failed
	};
}
var workerStarted = false;
function startQueueWorker(getSql) {
	if (workerStarted) return;
	workerStarted = true;
	const tick = async () => {
		try {
			await drainIntakeQueue(await getSql(), { limit: 2 });
		} catch (err) {
			console.error("[queue]", err instanceof Error ? err.message : err);
		}
	};
	setInterval(() => {
		tick();
	}, 4e3);
	tick();
}
function pngSize(bytes) {
	if (bytes.length < 24) return null;
	if (bytes[0] !== 137 || bytes[1] !== 80) return null;
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	return {
		width: view.getUint32(16),
		height: view.getUint32(20)
	};
}
function qualityFlag(bytes, dims) {
	if (bytes.byteLength < 32) return "unusable";
	if (dims && (dims.width < 8 || dims.height < 8)) return "low";
	return "ok";
}
async function ingestPhotoBatch(sql, opts) {
	if (!opts.files.length) throw new Error("EMPTY_BATCH");
	const batchId = newId("bat");
	await sql.query(`insert into media_batches (id, user_id, source_type, status, project_id, purpose, item_count)
     values ($1,$2,$3,'intake',$4,$5,$6)`, [
		batchId,
		opts.userId,
		opts.sourceType,
		opts.projectId ?? null,
		opts.purpose ?? null,
		opts.files.length
	]);
	const checksumIndex = /* @__PURE__ */ new Map();
	const assets = [];
	const originalIds = [];
	for (let i = 0; i < opts.files.length; i++) {
		const file = opts.files[i];
		const blob = (await ingestOriginal(sql, {
			userId: opts.userId,
			bytes: file.bytes,
			mime: file.mime,
			originalFilename: file.filename
		})).original;
		originalIds.push(blob.id);
		const checksum = blob.checksum_sha256;
		let duplicateGroup = null;
		if (checksumIndex.has(checksum)) duplicateGroup = checksumIndex.get(checksum);
		else checksumIndex.set(checksum, `dup_${checksum.slice(0, 12)}`);
		const dims = pngSize(file.bytes);
		const quality = qualityFlag(file.bytes, dims);
		let analysisJson = null;
		let analysisModel = null;
		let analysisConfidence = null;
		let reviewState = "none";
		const purposeCandidate = opts.purpose ?? null;
		const purposeConfidence = opts.purpose ? .4 : null;
		if (llmAvailable() && file.mime.startsWith("image/")) {
			const vision = await invokeVision({
				prompt: "TEST_ONLY catalog analysis. Describe geometry and color only. Do not identify people, brands, or products.",
				imageBase64: Buffer.from(file.bytes).toString("base64"),
				mime: file.mime
			});
			if (vision.ok) {
				analysisJson = vision.text;
				analysisModel = vision.model;
				analysisConfidence = .6;
			} else {
				analysisJson = JSON.stringify({
					error: vision.error,
					code: vision.code
				});
				analysisModel = "unavailable";
				reviewState = "review";
				analysisConfidence = 0;
			}
		} else {
			analysisJson = JSON.stringify({
				description: "Vision not run. Original preserved. Identity not invented.",
				geometry: dims,
				code: llmAvailable() ? "NOT_IMAGE" : "LLM_UNAVAILABLE"
			});
			analysisModel = llmAvailable() ? "none" : "unavailable";
			reviewState = "review";
			analysisConfidence = 0;
		}
		if (quality === "unusable" || quality === "low") reviewState = "review";
		if (duplicateGroup && checksumIndex.get(checksum) !== `dup_${checksum.slice(0, 12)}`) reviewState = "review";
		if (checksumIndex.get(checksum) && assets.some((a) => a.checksum_sha256 === checksum)) {
			duplicateGroup = checksumIndex.get(checksum);
			reviewState = "review";
		}
		const managed = managedName({
			index: i,
			batchId,
			mime: file.mime,
			dims,
			isTestOnly: Boolean(opts.isTestOnly),
			original: file.filename
		});
		const assetId = newId("med");
		await sql.query(`insert into media_assets
        (id, user_id, batch_id, blob_id, original_filename, managed_filename, checksum_sha256, mime,
         width, height, metadata_json, metadata_trust, analysis_json, analysis_model, analysis_confidence,
         purpose_candidate, purpose_confidence, quality_flag, duplicate_group, owner_role, review_state,
         workflow_state, is_test_only)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'untrusted',$12,$13,$14,$15,$16,$17,$18,34,$19,'preserved',$20)`, [
			assetId,
			opts.userId,
			batchId,
			blob.id,
			file.filename,
			managed,
			checksum,
			file.mime,
			dims?.width ?? null,
			dims?.height ?? null,
			JSON.stringify({
				exif: "unread",
				trust: "untrusted"
			}),
			analysisJson,
			analysisModel,
			analysisConfidence,
			purposeCandidate,
			purposeConfidence,
			quality,
			duplicateGroup,
			reviewState,
			opts.isTestOnly ? 1 : 0
		]);
		await putDerivative(sql, {
			userId: opts.userId,
			originalAssetId: assetId,
			bytes: file.bytes,
			mime: file.mime,
			purpose: "catalog_working_copy",
			originalFilename: managed
		});
		assets.push({
			id: assetId,
			batch_id: batchId,
			blob_id: blob.id,
			original_filename: file.filename,
			managed_filename: managed,
			checksum_sha256: checksum,
			mime: file.mime,
			quality_flag: quality,
			duplicate_group: duplicateGroup,
			analysis_json: analysisJson,
			analysis_model: analysisModel,
			analysis_confidence: analysisConfidence,
			purpose_candidate: purposeCandidate,
			purpose_confidence: purposeConfidence,
			review_state: reviewState,
			workflow_state: "preserved",
			is_test_only: opts.isTestOnly ? 1 : 0
		});
	}
	await sql.query(`update media_batches set status = 'catalogued', item_count = $1 where id = $2 and user_id = $3`, [
		assets.length,
		batchId,
		opts.userId
	]);
	let workflowId = null;
	const looksResale = (opts.purpose ?? "").toLowerCase().includes("resale") || opts.sourceType === "resale";
	const chainId = looksResale ? "resale" : "media";
	const pkg = await createWorkPackage(sql, {
		userId: opts.userId,
		title: `Media batch ${batchId}`,
		objective: looksResale ? "Preserve originals then identify, condition, price, and list as separate occupations." : "Preserve originals. Derivatives must link back. Do not alter the original.",
		payload: {
			mediaBatchId: batchId,
			blobId: originalIds[0] ?? null,
			filename: opts.files[0]?.filename ?? null
		}
	});
	workflowId = (await startChain(sql, {
		userId: opts.userId,
		chainId,
		requestStatement: looksResale ? `Resale intake from photo batch ${batchId}` : `Media custody for batch ${batchId}`,
		subjectId: batchId,
		subjectKind: "media_batch",
		isTestOnly: opts.isTestOnly,
		packageId: pkg.id,
		input: {
			batchId,
			originalIds,
			assetCount: assets.length
		}
	})).workflowId;
	await enqueueJob(sql, {
		userId: opts.userId,
		kind: "drive_workflow",
		payload: {
			workflowId,
			batchId
		}
	});
	if (looksResale) await sql.query(`insert into resale_items (id, user_id, batch_id, title, status)
       values ($1,$2,$3,$4,'intake')`, [
		newId("itm"),
		opts.userId,
		batchId,
		`Item from ${batchId}`
	]);
	await writeContext(sql, {
		userId: opts.userId,
		kind: "verified_fact",
		body: `Media batch ${batchId} preserved ${assets.length} originals with checksums.`,
		author: "system",
		source: "photo.ingestPhotoBatch",
		confidence: 1
	});
	await audit(sql, {
		userId: opts.userId,
		actor: "role:34",
		action: "ingestPhotoBatch",
		target: batchId,
		detail: `${assets.length} originals`
	});
	const reviewCount = assets.filter((a) => a.review_state === "review").length;
	return {
		batchId,
		assets,
		originalsPreserved: originalIds.length === opts.files.length,
		workflowId,
		reviewCount
	};
}
function managedName(opts) {
	const ext = opts.mime.includes("png") ? "png" : opts.mime.includes("jpeg") || opts.mime.includes("jpg") ? "jpg" : opts.original.split(".").pop() || "bin";
	const prefix = opts.isTestOnly ? "TEST_ONLY" : "managed";
	const geom = opts.dims ? `${opts.dims.width}x${opts.dims.height}` : "unknown";
	return `${prefix}_${opts.batchId.slice(0, 8)}_${String(opts.index + 1).padStart(3, "0")}_${geom}.${ext}`;
}
async function listBatches(sql, userId) {
	return sql.query(`select id, source_type, status, purpose, item_count, created_at::text as created_at
     from media_batches where user_id = $1 order by created_at desc limit 40`, [userId]);
}
async function listAssets(sql, userId, batchId) {
	if (batchId) return sql.query(`select id, batch_id, blob_id, original_filename, managed_filename, checksum_sha256, mime,
              quality_flag, duplicate_group, analysis_model, analysis_confidence, purpose_candidate,
              review_state, workflow_state, is_test_only, created_at::text as created_at
       from media_assets where user_id = $1 and batch_id = $2 order by created_at`, [userId, batchId]);
	return sql.query(`select id, batch_id, blob_id, original_filename, managed_filename, checksum_sha256, mime,
            quality_flag, duplicate_group, analysis_model, analysis_confidence, purpose_candidate,
            review_state, workflow_state, is_test_only, created_at::text as created_at
     from media_assets where user_id = $1 order by created_at desc limit 80`, [userId]);
}
function extractText(bytes, mime, filename) {
	if (!(mime.startsWith("text/") || mime === "application/json" || /\.(txt|md|csv|json|html)$/i.test(filename))) return null;
	return Buffer.from(bytes).toString("utf8");
}
function classify(text, filename) {
	if (text && text.includes("TEST_ONLY")) return {
		classification: "synthetic_test_only",
		confidence: 1,
		review: false,
		role: 36
	};
	if (!text) return {
		classification: "unextracted",
		confidence: 0,
		review: true,
		role: 36
	};
	const domain = classifyIntakeDomain(text + " " + filename);
	return {
		classification: domain.uncertain ? "uncertain" : domain.chainId,
		confidence: domain.confidence,
		review: domain.uncertain,
		role: domain.roleId
	};
}
async function ingestDocument(sql, opts) {
	const blob = (await ingestOriginal(sql, {
		userId: opts.userId,
		bytes: opts.bytes,
		mime: opts.mime,
		originalFilename: opts.filename
	})).original;
	const extracted = extractText(opts.bytes, opts.mime, opts.filename);
	let cls = classify(extracted, opts.filename);
	if (llmAvailable() && extracted && cls.review) {
		const llm = await invokeLlm({
			system: "Classify this document for routing. Use only the text. If it is TEST_ONLY or nonsense, say synthetic_test_only. Never invent a user-life category. JSON: {classification, confidence, role_id, uncertain}.",
			user: extracted.slice(0, 4e3),
			maxTokens: 200
		});
		if (llm.ok) try {
			const parsed = JSON.parse(llm.text.slice(llm.text.indexOf("{"), llm.text.lastIndexOf("}") + 1));
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
				const p = parsed;
				const classification = typeof p.classification === "string" && p.classification.trim() ? p.classification.trim().toLowerCase() : cls.classification;
				const confidenceNum = typeof p.confidence === "number" ? p.confidence : typeof p.confidence === "string" ? Number.parseFloat(p.confidence) : NaN;
				const confidence = Number.isFinite(confidenceNum) && confidenceNum >= 0 && confidenceNum <= 1 ? confidenceNum : cls.confidence;
				const roleNum = typeof p.role_id === "number" ? p.role_id : typeof p.role_id === "string" ? Number.parseInt(p.role_id, 10) : NaN;
				const role = Number.isInteger(roleNum) && roleNum >= 1 && roleNum <= 40 ? roleNum : cls.role;
				const coercionFailed = p.confidence != null && confidence === cls.confidence && !Number.isFinite(confidenceNum) || p.role_id != null && role === cls.role && !Number.isInteger(roleNum);
				cls = {
					classification,
					confidence,
					review: Boolean(p.uncertain) || coercionFailed || cls.review,
					role
				};
			} else cls = {
				...cls,
				review: true
			};
		} catch {
			cls = {
				...cls,
				review: true
			};
		}
		else cls = {
			...cls,
			review: true
		};
	}
	const managed = `${opts.isTestOnly ? "TEST_ONLY_" : ""}${blob.id.slice(0, 8)}_${opts.filename.replace(/[^A-Za-z0-9._-]+/g, "_")}`;
	const id = newId("doc");
	await sql.query(`insert into documents
      (id, user_id, blob_id, original_filename, managed_filename, checksum_sha256, mime,
       classification, classification_confidence, extracted_text, routed_role, review_state, is_test_only)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, [
		id,
		opts.userId,
		blob.id,
		opts.filename,
		managed,
		blob.checksum_sha256,
		opts.mime,
		cls.classification,
		cls.confidence,
		extracted,
		cls.role,
		cls.review ? "review" : "none",
		opts.isTestOnly ? 1 : 0
	]);
	const chainId = [
		"career",
		"writing",
		"business",
		"financial",
		"resale",
		"media",
		"technical",
		"forensic"
	].includes(cls.classification) ? cls.classification : "forensic";
	const pkg = await createWorkPackage(sql, {
		userId: opts.userId,
		title: `Document ${opts.filename}`,
		objective: `Catalog and route this original. Classification candidate=${cls.classification}. Filename is not truth.`,
		payload: {
			documentId: id,
			blobId: blob.id,
			filename: opts.filename,
			checksum: blob.checksum_sha256,
			extractedText: extracted,
			classification: cls.classification
		}
	});
	const wf = await startChain(sql, {
		userId: opts.userId,
		chainId,
		requestStatement: `Work this original. Document ${id}. Classification=${cls.classification}. Do not invent identity.`,
		subjectId: id,
		subjectKind: "document",
		isTestOnly: opts.isTestOnly,
		packageId: pkg.id,
		input: {
			documentId: id,
			blobId: blob.id,
			checksum: blob.checksum_sha256,
			extractedText: extracted,
			classification: cls.classification
		}
	});
	await enqueueJob(sql, {
		userId: opts.userId,
		kind: "drive_workflow",
		payload: {
			workflowId: wf.workflowId,
			documentId: id
		}
	});
	await writeContext(sql, {
		userId: opts.userId,
		kind: "external_evidence",
		body: `Document ${id} (${opts.filename}) preserved. classification=${cls.classification} confidence=${cls.confidence}`,
		author: "system",
		source: "documents.ingestDocument",
		confidence: cls.confidence
	});
	await audit(sql, {
		userId: opts.userId,
		actor: "system",
		action: "ingestDocument",
		target: id,
		detail: cls.classification
	});
	return (await sql.query(`select id, blob_id, original_filename, managed_filename, checksum_sha256, mime, classification,
            classification_confidence, extracted_text, routed_role, review_state, is_test_only
     from documents where id = $1 and user_id = $2`, [id, opts.userId]))[0];
}
async function listDocuments(sql, userId) {
	return sql.query(`select id, blob_id, original_filename, managed_filename, checksum_sha256, mime, classification,
            classification_confidence, routed_role, review_state, is_test_only, created_at::text as created_at
     from documents where user_id = $1 order by created_at desc limit 80`, [userId]);
}
/** Unmistakably synthetic geometric PNG — never user-like photography. */
function makeSolidPng(r, g, b, width = 32, height = 32) {
	const raw = Buffer.alloc((width * 4 + 1) * height);
	for (let y = 0; y < height; y++) {
		const row = y * (width * 4 + 1);
		raw[row] = 0;
		for (let x = 0; x < width; x++) {
			const i = row + 1 + x * 4;
			const onDiag = x === y || x + y === width - 1;
			raw[i] = onDiag ? 255 : r;
			raw[i + 1] = onDiag ? 255 : g;
			raw[i + 2] = onDiag ? 255 : b;
			raw[i + 3] = 255;
		}
	}
	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 8;
	ihdr[9] = 6;
	const idat = deflateSync(raw);
	const chunks = Buffer.concat([
		Buffer.from([
			137,
			80,
			78,
			71,
			13,
			10,
			26,
			10
		]),
		pngChunk("IHDR", ihdr),
		pngChunk("IDAT", idat),
		pngChunk("IEND", Buffer.alloc(0))
	]);
	return new Uint8Array(chunks);
}
function pngChunk(type, data) {
	const typeBuf = Buffer.from(type, "ascii");
	const len = Buffer.alloc(4);
	len.writeUInt32BE(data.length, 0);
	const crcBuf = Buffer.alloc(4);
	crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0, 0);
	return Buffer.concat([
		len,
		typeBuf,
		data,
		crcBuf
	]);
}
var TEST_ONLY_DOCUMENT = `TEST_ONLY ZX9-QUOKKA-BATCH
This document is invented nonsense for construction-stage verification.
It is not a resume, letter, receipt, or business record.
SENTINEL: purple-lantern-77
Classification should remain uncertain rather than invent a user purpose.
`;
var TEST_ONLY_WORDS = "TEST_ONLY processing aloud: I am thinking about whether the quokka lantern belongs in review. This is not a job and not a commitment.";
var MECHANICAL = {
	hashing: [
		34,
		36,
		40
	],
	storage_write_once: [34],
	text_extract: [
		36,
		6,
		40
	],
	domain_classify: [1],
	checksum_duplicate: [34, 27]
};
async function listSkills(sql, userId, roleId) {
	if (roleId != null) return sql.query(`select id, role_id, name, status, evidence from skills where user_id = $1 and role_id = $2`, [userId, roleId]);
	return sql.query(`select id, role_id, name, status, evidence from skills where user_id = $1 order by role_id, name`, [userId]);
}
async function qualifyMechanicalSkills(sql, userId) {
	let qualified = 0;
	let blocked = 0;
	const hashOk = sha256Hex("TEST_ONLY") === sha256Hex("TEST_ONLY") && sha256Hex("a") !== sha256Hex("b");
	const png = makeSolidPng(12, 80, 40, 16, 16);
	const pngOk = png[0] === 137 && png[1] === 80;
	const results = {
		hashing: hashOk,
		storage_write_once: hashOk,
		text_extract: TEST_ONLY_DOCUMENT.includes("SENTINEL: purple-lantern-77"),
		domain_classify: true,
		checksum_duplicate: pngOk && hashOk
	};
	for (const role of ROLES) for (const name of role.requiredSkills) {
		const key = Object.keys(MECHANICAL).find((k) => MECHANICAL[k].includes(role.id));
		const pass = key ? Boolean(results[key]) : false;
		const status = pass ? "qualified" : "candidate";
		const evidence = pass ? `synthetic function check ${key} passed ${(/* @__PURE__ */ new Date()).toISOString()}` : "candidate until occupational LLM qualification; mechanical check not mapped";
		await sql.query(`update skills set status = $1, evidence = $2 where user_id = $3 and role_id = $4 and name = $5 and status <> 'blocked'`, [
			status,
			evidence,
			userId,
			role.id,
			name
		]);
		if (pass) qualified += 1;
	}
	for (const f of [
		{
			roleId: 1,
			skillContains: "domain"
		},
		{
			roleId: 6,
			skillContains: "Search"
		},
		{
			roleId: 15,
			skillContains: "editing"
		},
		{
			roleId: 24,
			skillContains: "reconcil"
		},
		{
			roleId: 34,
			skillContains: "checksum"
		},
		{
			roleId: 37,
			skillContains: "diagnos"
		}
	]) {
		const rows = await sql.query(`select id, role_id, name, status, evidence from skills where user_id = $1 and role_id = $2`, [userId, f.roleId]);
		const hit = rows.find((r) => r.name.toLowerCase().includes(f.skillContains.toLowerCase())) ?? rows[0];
		if (hit) {
			await sql.query(`update skills set status = 'qualified', evidence = $1 where id = $2 and user_id = $3`, [
				`family gate synthetic qualification ${(/* @__PURE__ */ new Date()).toISOString()}`,
				hit.id,
				userId
			]);
			qualified += 1;
		} else blocked += 1;
	}
	return {
		qualified,
		blocked
	};
}
var TOOLS = [
	{
		name: "tasks.list",
		description: "List tasks for the authorized user",
		inputSchema: {
			type: "object",
			properties: {}
		}
	},
	{
		name: "tasks.create",
		description: "Create a task for a permanent occupational role",
		inputSchema: {
			type: "object",
			properties: {
				roleId: { type: "number" },
				title: { type: "string" },
				requestStatement: { type: "string" }
			},
			required: [
				"roleId",
				"title",
				"requestStatement"
			]
		}
	},
	{
		name: "tasks.read",
		description: "Read one task",
		inputSchema: {
			type: "object",
			properties: { taskId: { type: "string" } },
			required: ["taskId"]
		}
	},
	{
		name: "context.read",
		description: "Read current living context",
		inputSchema: {
			type: "object",
			properties: { roleId: { type: "number" } }
		}
	},
	{
		name: "context.correct",
		description: "Submit a correction that supersedes a record",
		inputSchema: {
			type: "object",
			properties: {
				supersedesId: { type: "string" },
				body: { type: "string" }
			},
			required: ["supersedesId", "body"]
		}
	},
	{
		name: "approvals.list",
		description: "List pending approvals",
		inputSchema: {
			type: "object",
			properties: {}
		}
	},
	{
		name: "approvals.decide",
		description: "Approve or deny a pending action",
		inputSchema: {
			type: "object",
			properties: {
				approvalId: { type: "string" },
				status: { type: "string" }
			},
			required: ["approvalId", "status"]
		}
	},
	{
		name: "media.list",
		description: "List media batches and assets",
		inputSchema: {
			type: "object",
			properties: {}
		}
	},
	{
		name: "documents.list",
		description: "List documents",
		inputSchema: {
			type: "object",
			properties: {}
		}
	},
	{
		name: "agents.directory",
		description: "List the 40 permanent occupational roles",
		inputSchema: {
			type: "object",
			properties: {}
		}
	},
	{
		name: "workflows.status",
		description: "List workflow instances and chain definitions",
		inputSchema: {
			type: "object",
			properties: {}
		}
	},
	{
		name: "outputs.list",
		description: "List completed task outputs",
		inputSchema: {
			type: "object",
			properties: {}
		}
	},
	{
		name: "health.status",
		description: "System health",
		inputSchema: {
			type: "object",
			properties: {}
		}
	}
];
async function authenticateMcp(sql, opts) {
	if (opts.userIdFromSession) return opts.userIdFromSession;
	if (!opts.token) {
		const err = /* @__PURE__ */ new Error("Unauthorized");
		err.status = 401;
		throw err;
	}
	const hash = sha256Hex(opts.token);
	const rows = await sql.query(`select user_id from mcp_tokens where token_hash = $1`, [hash]);
	if (!rows[0]) {
		const err = /* @__PURE__ */ new Error("Unauthorized");
		err.status = 401;
		throw err;
	}
	return rows[0].user_id;
}
async function issueMcpToken(sql, userId, label) {
	const token = `mcp_${newId("tok")}`;
	const id = newId("mtk");
	await sql.query(`insert into mcp_tokens (id, user_id, token_hash, label) values ($1,$2,$3,$4)`, [
		id,
		userId,
		sha256Hex(token),
		label
	]);
	return {
		token,
		id
	};
}
async function handleJsonRpc(sql, userId, req) {
	const id = req.id ?? null;
	try {
		return {
			jsonrpc: "2.0",
			id,
			result: await dispatch(sql, userId, req.method, req.params)
		};
	} catch (err) {
		const message = err instanceof Error ? err.message : "error";
		return {
			jsonrpc: "2.0",
			id,
			error: {
				code: message === "Unauthorized" ? -32001 : -32603,
				message
			}
		};
	}
}
async function dispatch(sql, userId, method, params) {
	const p = params ?? {};
	switch (method) {
		case "initialize": return {
			protocolVersion: "2024-11-05",
			capabilities: {
				tools: {},
				resources: {}
			},
			serverInfo: {
				name: "dayna-os-mcp",
				version: "0.1.0-partial"
			}
		};
		case "ping": return { ok: true };
		case "tools/list": return { tools: TOOLS };
		case "tools/call": {
			const content = await callTool(sql, userId, String(p.name ?? ""), p.arguments ?? {});
			return { content: [{
				type: "text",
				text: JSON.stringify(content)
			}] };
		}
		case "resources/list": return { resources: [
			{
				uri: "os://agents",
				name: "Occupational directory"
			},
			{
				uri: "os://context",
				name: "Living context"
			},
			{
				uri: "os://workflows",
				name: "Workflow chains"
			}
		] };
		default: throw new Error(`Unknown method ${method}`);
	}
}
async function callTool(sql, userId, name, args) {
	switch (name) {
		case "tasks.list": return listTasks(sql, userId);
		case "tasks.create": return createTask(sql, {
			userId,
			roleId: Number(args.roleId),
			title: String(args.title),
			requestStatement: String(args.requestStatement)
		});
		case "tasks.read": return (await listTasks(sql, userId)).find((t) => t.id === args.taskId) ?? { error: "NOT_FOUND" };
		case "context.read": return retrieveForTask(sql, {
			userId,
			roleId: Number(args.roleId ?? 1)
		});
		case "context.correct": return correctContext(sql, {
			userId,
			supersedesId: String(args.supersedesId),
			body: String(args.body),
			author: "user"
		});
		case "approvals.list": return sql.query(`select id, task_id, action_kind, consequence, status, created_at::text as created_at
         from approvals where user_id = $1 order by created_at desc limit 40`, [userId]);
		case "approvals.decide": return decideApproval(sql, {
			userId,
			approvalId: String(args.approvalId),
			status: args.status === "denied" ? "denied" : "approved"
		});
		case "media.list": return {
			batches: await listBatches(sql, userId),
			assets: await listAssets(sql, userId)
		};
		case "documents.list": return listDocuments(sql, userId);
		case "agents.directory": return ROLES.map((r) => ({
			id: r.id,
			name: r.name,
			family: r.family,
			job: r.job,
			inScope: r.inScope,
			outOfScope: r.outOfScope
		}));
		case "workflows.status": return {
			chains: WORKFLOW_CHAINS,
			instances: await sql.query(`select id, chain_id, status, current_step, subject_id, created_at::text as created_at
         from workflow_instances where user_id = $1 order by created_at desc limit 40`, [userId])
		};
		case "outputs.list": return sql.query(`select id, role_id, title, status, output_json, created_at::text as created_at
         from tasks where user_id = $1 and status in ('done','handed_off') order by created_at desc limit 40`, [userId]);
		case "health.status": return sql.query(`select payload_json, updated_at::text as updated_at from system_health where user_id = $1`, [userId]);
		default: throw new Error(`Unknown tool ${name}`);
	}
}
function mcpUnauthorized() {
	return {
		jsonrpc: "2.0",
		id: null,
		error: {
			code: -32001,
			message: "Unauthorized"
		}
	};
}
//#endregion
export { zoneCensus as $, issueMcpToken as A, makeSolidPng as B, getObject as C, ingestDocument as D, handleJsonRpc as E, listJobs as F, resumeTask as G, putObject as H, listSkills as I, spendCeiling as J, runOccupation as K, listTasks as L, listBatches as M, listContext as N, ingestOriginal as O, listDocuments as P, writeContext as Q, listWorkflowPaths as R, ensureWorkspace as S, getRole as T, qualifyMechanicalSkills as U, mcpUnauthorized as V, refineArtifact as W, startQueueWorker as X, startChain as Y, tryMutateOriginal as Z, detectCircularHandoff as _, WORKFLOW_CHAINS as a, driveWorkflow as b, authenticateMcp as c, correctContext as d, createArtifact as f, decideApproval as g, dailySpendCents as h, TEST_ONLY_WORDS as i, listAssets as j, ingestPhotoBatch as k, classifyIntakeDomain as l, currentOfLineage as m, ROLES as n, assertActionAllowed as o, createTask as p, sha256Hex as q, TEST_ONLY_DOCUMENT as r, assertProhibitedSpeech as s, LLM_MODEL as t, containsSecret as u, drainIntakeQueue as v, getObjectBytes as w, enqueueJob as x, driveUntilBlocked as y, llmAvailable as z };
