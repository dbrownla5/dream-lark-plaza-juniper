# Build Directive: Cloudflare Agent and Data System

## 1. Controlling task

Build the Cloudflare-based agent and data system, connect it securely to the live MCP domain `mcp.thewelllivedcitizenco.com`, and prepare the real containers, workflows, routing, permanent agents, and agent spaces so Dayna can begin dropping in files and photos for automatic handling.

Use and complete the existing Cloudflare work. Do not restart this as an abstract design exercise, replace it with a smaller prototype, or begin working through Dayna’s corpus and projects before the system that will handle them exists.

The division of responsibility is:

**Build the system and its workforce now. Dayna brings real work into the system after it is ready.**

The system must already know how to receive work, identify the functions required, route it to qualified agents, apply the correct skills and tools, preserve evidence and context, handle uncertainty, and return the result. Dayna should not have to design the agents or document her entire life and workload before the system can be built.

## 2. How to interpret the supplied sources

Use the sources in this order:

1. Dayna’s original project instructions.
2. Dayna’s specific build instructions.
3. The actual COMET naming and folder-organization instructions.
4. Builder assignments and verified outputs.
5. Dayna’s corrections when Codex mixed projects, reduced the task, or built the wrong thing.
6. The newest explicit correction wherever it conflicts with an older interpretation.
7. The independent technical audit as evidence of the current implementation state, not as authority to reduce the requested build.
8. The permanent workforce blueprint as the controlling occupational design.

Do not summarize the previous chats from memory and treat the summary as the project specification. Separate Dayna’s instructions from assistant interpretations. Exclude assistant inventions. Preserve genuinely unresolved items instead of guessing.

COMET must be recovered from the actual instructions and source material. The corrected record identifies it as a folder-naming and organization system Claude had begun applying across the folders. It was not established as the product name, a master agent, an architectural hierarchy, or merely an R2 bucket called `comet`.

## 3. Source estate and boundaries

Dayna consolidated every potentially usable or potentially confusing project file into her development drive under COMET, including:

- the data and corpus work from the last several months;
- 37 repositories that have already been stripped and sorted, although they are not perfectly set up;
- most prior Codex work from the `C:` drive;
- source bundles and examples from Gemini, Antigravity, Claude, ChatGPT, and Codex;
- four or five different approaches to the project;
- example agent systems, Cloudflare builds, Workers, MCP work, prompts, rubrics, and operating structures;
- old drafts, copy, websites, builds, photos, business material, job-search material, resale material, and other future work.

The development-drive material is mounted into Codex’s native project area under `C:\Users\dayna\...`, where Codex had already been creating project files. The physical location and mounted working path are not interchangeable. Do not guess the mounted path or collapse it into `E:\COMET`, `C:\COMET`, a Cloudflare bucket, or an older Codex path. Use the exact mounted path Dayna identifies.

The Gemini framing is a material source. Its skills may have been wrong, but its investment in the build and its framing of the project were strong. Evaluate it together with the Antigravity, Claude, ChatGPT, and Codex material for useful ways to build the system, live with how Dayna works, learn her style, and later use hard-proof documents and approved examples to train rubrics. Do not dismiss those sources as failed versions, and do not copy them without evaluation.

The following boundaries apply:

- The master dashboard Dayna made about a year ago was for the website and business. It is not this project’s agent dashboard.
- The 37 repositories are for study and reference. Do not mix them into the agents, registry, runtime, or active build simply because they are present.
- Do not organize, rewrite, classify, move, rename, deduplicate, train on, or begin performing the work inside the corpus, drafts, copy, prior websites, prior builds, business files, job-search files, resale files, personal records, documents, or photo collections.
- Those materials become agent work after the agent functions and working environment are ready.
- Existing examples and prior implementations are construction material and evidence. They are neither automatically authoritative nor automatically disposable.

## 4. Verified current implementation state

The independent technical audit concluded that current operational readiness is **FAIL**, while also finding meaningful work worth preserving. The immediate problem is assembly and integration, not the absence of all prior work.

The audit was read-only and modified no files, configurations, Cloudflare resources, or tasks.

### Verified local components

The audited workspace contained:

- a Cloudflare Worker candidate;
- a SQLite-backed Durable Object candidate;
- D1 and R2 integration code;
- an authentication service-binding contract;
- a Streamable HTTP MCP handler;
- agent and skill definition registries;
- a provider-independent LLM routing library;
- an in-memory living-model implementation;
- a task-state and approval runtime;
- a static dashboard prototype;
- five test files;
- a Wrangler configuration and dependency lockfile.

The relevant implementation areas were:

- `app/cloudflare/index.ts` — Worker entrypoint;
- `app/cloudflare/workspace-do.ts` — Durable Object workspace;
- `app/cloudflare/mcp.ts` — MCP handler;
- `app/cloudflare/auth.ts` — authentication boundary;
- `app/agents/definitions.ts` — agent definitions;
- `app/agents/skills.ts` — skill registry generator;
- `app/llm/runtime.ts` — LLM runtime;
- `app/core/living-model.ts` — living model;
- `app/worker/task-runtime.ts` — task runtime;
- `app/ui/app.js` — dashboard prototype;
- `wrangler.jsonc` — Cloudflare configuration.

### Verified tests and build failure

Thirty-one unit tests passed and none failed. They covered agent-definition validation, skill separation and qualification, task-scoped permissions, principal expiry, raw-secret rejection, living-context history and filtering, stale-context invalidation, LLM fallback and data boundaries, model budgets and circuit breaking, structured-output validation, task approval and recovery, auto-mode readiness, one-question-at-a-time behavior, and avoiding unnecessary questions when evidence can be discovered.

These tests establish only the behavior they test. They do not establish an operational end-to-end system.

Typechecking failed with four errors because `Env` was undefined in two locations in `app/cloudflare/index.ts` and two locations in `app/cloudflare/workspace-do.ts`.

The package exposed `test`, `typecheck`, and `check`. It did not expose the `validate` script implied in earlier work history.

### Verified Cloudflare configuration facts

The local Wrangler configuration contained:

- D1 `database_id: "local-placeholder"`;
- a service binding to `dayna-access-verifier`;
- an R2 bucket named `dayna-private-ai-files`;
- `workers_dev: false`;
- a Durable Object migration.

These are local declarations, not evidence that matching live Cloudflare resources exist.

The audit did not verify the live Worker, R2 bucket, D1 database, authentication service, Durable Object namespace, Access application or policy, custom route, MCP endpoint, client registration, secrets, or service tokens. Earlier `C:\COMET` Worker and live-account claims belong to a separate, partially audited estate and must not be silently treated as this project’s live backing services.

### Verified dashboard state

The audited dashboard was a disconnected simulation:

- tasks were stored in browser `localStorage`;
- content was labeled `SAMPLE`, prototype, or not connected;
- agent work was simulated with timers and locally edited objects;
- context changes affected only the current browser state;
- the UI attempted to load a missing `resident-registry.json`;
- it fell back to 20 hardcoded candidate roles;
- it called none of the Worker’s task, context, approval, export, or MCP routes.

The dashboard and backend were separate products. The older business/website dashboard is also separate from both.

### Verified missing integrations

- Agent definitions existed, but all qualifications were candidates and no real agent runner completed the full definition → qualified skills → scoped context → LLM/tools → evidence → result → write-back cycle.
- The claimed 145 skills were generated descriptions, not evidence of sourced, installed, assigned, trained, or qualified skills.
- The LLM library had provider-independent controls but only a mock adapter and no connection to the Worker, agents, tasks, or dashboard.
- Living context was split between an in-memory test implementation and a Durable Object SQLite implementation with no single production path.
- Permission contracts existed, but the assumed identity verifier and live authentication path were unverified.
- MCP supported `initialize`, `tools/list`, and `tools/call` with four context/task/approval tools, but lacked the remaining production client, authorization, file, agent, lifecycle, retry, and conformance work.
- R2 was used only for JSON workspace exports. There was no working file and photo workspace.
- Validation was shallow and did not cover the connected product.
- No durable integration ledger established ownership, handoffs, supersession, review, live-resource reconciliation, or the provenance of generated skills.

## 5. System to build

### Cloudflare and MCP

- Secure and deploy the system behind `mcp.thewelllivedcitizenco.com`.
- Build the MCP connection through which Dayna, approved AI clients, and qualified agents access the system.
- Use Cloudflare Workers as the execution and routing layer.
- Reconcile existing live Cloudflare resources before changing or recreating them.
- Connect the provider-independent LLM layer to an actual provider and the real agent runtime.
- Connect authentication, permissions, living context, tasks, files, agents, tools, review states, and outputs through the Worker and MCP runtime.

### Private R2 structure

Create the actual private intake and storage structure for:

- original documents;
- original photos and media;
- working derivatives;
- grouped and classified material;
- agent-ready inputs;
- review queues;
- completed outputs;
- catalogued records;
- archived and provenance-preserved material.

Create upload hooks so every file or photo Dayna drops into the system enters a visible processing workflow.

### Photo and media workflow

Preserve originals while qualified image agents:

- identify batches;
- group related photos;
- detect duplicates and unusable images;
- classify probable purpose;
- create safe derivatives;
- crop or edit approved working copies;
- prepare resale images;
- extract useful evidence;
- connect images to item and project records;
- send uncertain material to review instead of inventing answers.

Original-media custody, identification, condition assessment, derivative preparation, pricing, listing preparation, and publishing remain separate functions.

### Document workflow

Uploaded documents must be:

- preserved;
- text-extracted;
- classified;
- connected to projects and records;
- routed to qualified agents;
- analyzed with provenance;
- corrected without destroying the source.

### Living context and dashboard

Unify living context into the production path used by the Worker, agents, MCP clients, and dashboard. It must keep Dayna’s words separate from agent interpretation and retain corrections, evidence, uncertainty, current state, provenance, permissions, and supersession.

Connect the dashboard to the real Worker, storage, tasks, agents, living context, permissions, review queues, and outputs. Uploaded material, agent decisions, corrections, processing status, failures, and outputs must remain visible and synchronized.

The working experience must allow Dayna to enter naturally from her PC or phone, add material, inspect what is happening, correct the system, approve actions when required, retrieve results, and resume without catching the agents up again. It must not require Dayna to code, use Git, administer repositories, or reconstruct context for each agent.

## 6. Permanent workforce

The permanent workforce contains 40 occupational roles. They are not temporary builders, prompts, model personalities, skill descriptions, registry entries, or functioning agents merely because they have names.

1. Natural-Language Intake Coordinator
2. Work Planner and Result Integrator
3. Continuity and Correction Steward
4. Daily Priorities and Follow-Up Coordinator
5. Thinking and Decision Partner
6. Research and Evidence Analyst
7. Job Discovery Researcher
8. Role Fit and Opportunity Analyst
9. Resume Specialist
10. Application Materials Specialist
11. Interview Preparation Specialist
12. Application Pipeline Coordinator
13. Professional Correspondence Specialist
14. Personal and Sensitive Communication Specialist
15. Writing and Voice Editor
16. Brand and Web Copywriter
17. Business Opportunity Analyst
18. Service and Offer Designer
19. Revenue and Commercial Pricing Analyst
20. Market Positioning Strategist
21. Campaign and Outreach Planner
22. Social Content Producer and Publisher
23. Personal Cash-Flow and Bills Analyst
24. Business Bookkeeping and Financial Records Specialist
25. Consignment Settlement Specialist
26. Ecosystem Reliability and Integration Maintainer
27. Resale Intake and Item Record Specialist
28. Product Identification and Attribution Researcher
29. Condition and Measurements Specialist
30. Comparable-Sales Researcher
31. Resale Pricing Analyst
32. Marketplace Listing Specialist
33. Inventory, Order, and Fulfillment Coordinator
34. Original Media and Photo Custodian
35. Image Selection and Resale Preparation Specialist
36. File Discovery, Provenance, and Organization Specialist
37. Software and Repository Diagnostician
38. Software Implementation and Release Specialist
39. Computer and Desktop Support Specialist
40. Forensic Timeline and Evidence Package Specialist

The complete supplied occupational definition for each role remains controlling. Each agent must be implemented with its stated:

- permanent job and separate-agent reason;
- in-scope work;
- out-of-scope work;
- authority and prohibitions;
- inputs and outputs;
- required skills;
- tools and access;
- living-model obligations;
- evaluation, failure, handoff, and separation rules.

Create the actual space in which each permanent agent operates:

- role and permission definitions;
- compatible, qualified skill access;
- bounded Worker operations;
- relevant R2 locations;
- living-context access;
- work queues;
- evidence requirements;
- outputs;
- review states;
- failure and recovery states.

Begin placing the designed agents into those spaces so they become functioning workers rather than roster entries.

Qualified agents may make classification and routing decisions when the answer cannot be predetermined, while retaining evidence, uncertainty, permissions, review behavior, and Dayna’s ability to inspect or correct the result.

## 7. Required role separation

- Intake captures and routes the request; the Work Planner decomposes and assembles accepted work; qualified specialists execute; Continuity governs durable context and corrections.
- Research collects and evaluates evidence but does not absorb the requesting specialist’s judgment.
- Career work remains separated among discovery, fit, resume, application materials, interview preparation, and pipeline tracking.
- Professional correspondence, sensitive personal communication, voice editing, and brand/web copy remain separate.
- Business opportunity analysis, offer design, commercial pricing, positioning, campaign planning, and content production remain separate.
- Personal cash flow, business bookkeeping, and consignment settlement remain separate.
- Resale work remains separated among intake, identification, condition, comparables, pricing, listing, and fulfillment.
- Original-media custody remains separate from derivative image preparation.
- File discovery remains separate from research, forensic reconstruction, and domain interpretation.
- Software diagnosis remains separate from implementation, ecosystem reliability, and desktop support.

## 8. Skills, rubrics, and functioning agents

A generated skill description is not an installed or qualified skill. A role definition is not a functioning permanent agent.

Source, install, assign, and evaluate compatible skills using the supplied skills and example material before inventing replacements.

Every agent’s permanent operating rubric must cover:

- evidence quality;
- occupational scope;
- required handoffs;
- authority to act, propose, or require approval;
- treatment of Dayna’s corrections;
- separation of Dayna’s words from agent inference;
- uncertainty handling;
- original and provenance preservation;
- compatible skill and tool use;
- completion criteria;
- review and failure behavior;
- recovery from interrupted or failed work.

These requirements remain active during every task. They are not temporary demonstrations that disappear after qualification.

The agent runtime must perform the complete operating cycle: load the role, apply task-scoped permissions, obtain relevant living context, activate only qualified skills and tools, invoke the selected LLM, retain evidence and uncertainty, produce the output, write back state and results, and enter review or failure correctly.

## 9. Assembly order

1. Confirm the exact mounted source path and active project path without touching the protected corpus or reference material.
2. Preserve and recheck the existing project, tests, and audited facts.
3. Repair the Worker environment typing and restore the build gate without weakening tests.
4. Create one deterministic resident-agent and sourced-skill registry; remove the missing-file and hardcoded-fallback split.
5. Serve and connect the existing agent dashboard through the Worker while keeping unconnected behavior honestly labeled.
6. Replace browser-only simulation with real task, context, approval, status, and event paths.
7. Unify the living-context implementations into the Cloudflare runtime used by the agents, MCP clients, and dashboard.
8. Connect a real provider through the existing provider-independent LLM layer.
9. Source, install, assign, evaluate, and qualify actual skills.
10. Implement the agent runner and begin activating permanent agents inside their bounded spaces.
11. Reconcile the existing live Cloudflare estate before changing or recreating resources.
12. Complete authentication, authorization, MCP client access, file tools, agent tools, retries, and recovery.
13. Build the private R2 document and photo intake system, upload hooks, manifests, processing workflows, review queues, derivatives, outputs, catalog, and archive.
14. Connect all system state to the dashboard and living model.
15. Make the system ready for Dayna and approved AI agents to enter, add real material, and refine workflows through use.

This order does not reduce the task to a local vertical slice. It prevents another redesign while carrying the existing work through to the requested Cloudflare, MCP, file, agent, dashboard, and cross-device system.

## 10. Completion condition

The task is complete when Dayna can enter the real system, upload a document or photo batch, and have it:

1. preserved as an original;
2. recorded in a visible intake workflow;
3. classified and routed without unsupported invention;
4. handled by qualified agents with the correct skills, context, permissions, evidence requirements, review states, and failure behavior;
5. connected to the relevant projects and records;
6. processed through safe derivatives or evidence-linked document analysis;
7. shown in the dashboard with its decisions, corrections, status, uncertainty, failures, and outputs;
8. synchronized through the living model and MCP system;
9. inspectable and correctable by Dayna;
10. resumable from another device without Dayna catching the agents up again.

Do not substitute another plan, audit, roster, prototype, dashboard mockup, corpus-organization project, or explanation for this build. Build the tools and agent functions first so the actual business, job-search, resale, writing, records, photo, and recovery work can begin inside them.
