# CURRENT BUILD CONTRACT

Condensed immutable requirements copied from TAB 01, TAB 02 and TAB 03 of the
DAYNA MCP/LLM BUILD EXECUTION PACKET, rev. 23 August 2026.

This file is a **transcription of requirements, not an interpretation of them.** No item here
may be softened, merged, deferred, or marked TBD. Where the packet fixes an outcome, the
outcome is fixed; only the mechanism is open, and only inside the stated acceptance criteria.

---

## PART A — WHAT IS BEING BUILT (TAB 01 §1.2)

- A remotely hosted / off-site **MCP + LLM operating system**.
- A **real production server** that remains available when Dayna's PC is off. Localhost is
  development tooling only, never production.
- A **real responsive website / web application** used by Dayna and authorized AI workers.
  It is **not** a chat page, builder-session surface, static mockup, or browser-local
  simulation.
- A **real LLM-backed permanent agent runtime** with guardrails, role boundaries, qualified
  skills/tools, permissions, approvals, evidence, review/failure behavior, and recovery.
- **Forty permanent occupational roles** (TAB 04). They are occupations, not project-specific
  bots.
- **Durable living context and correction propagation** shared by the web app, MCP, agent
  runtime, and workflows.
- **Remote database/catalog state** and **remote object/file storage** with preserved
  originals and derivative lineage.
- **Automated document and media workflows**, including event-driven photo/media intake that
  does not depend on manual drag/drop or manual routing.
- **Cross-device persistence**, real logs/status, backups/recovery, and low-admin/low-cost
  operation appropriate to a new business.

---

## PART B — USER OPERATING MODEL (TAB 02)

These are **product requirements**, because they describe how the system must work in daily use.

### B.1 Primacy of time and cognitive load (§2.1)

- The system exists to **return time**, not create a second job maintaining AI infrastructure.
- Architecture requiring repeated setup, re-teaching, prompt rebuilding, manual routing, or
  backend administration **fails the purpose even if technically sophisticated**.
- Dayna is the **principal/decision-maker** — not the terminal operator, prompt engineer,
  deployment administrator, or database caretaker.
- Every major implementation decision is tested against: *does this reduce recurring user
  effort while preserving required control and evidence?*

### B.2 Conversational and voice-first input (§2.2)

- Dayna speaks/dictates stream-of-consciousness and processes ideas **with** the AI, not at it.
- Natural-language intake must understand nonlinear conversation **without turning every
  sentence into a command or a permanent fact**.
- Voice dictation / transcribed text is ordinary input. The web app must accept long
  unstructured input cleanly. A microphone/transcription surface may be added, but the system
  **must not require special prompt syntax** for normal work.
- When material intent is genuinely unresolved after checking context/evidence, ask **one
  concise consequential question** — never a long intake interview.

### B.3 Brainstorming, refinement and continuity (§2.3)

- The system must distinguish **exploratory brainstorming** from **active refinement/work**.
- Brainstorming may be remembered as temporary/exploratory context **without becoming settled
  fact, commitment, or a replacement draft**.
- When refining any artifact, revisions remain in the **same lineage** through repeated edits —
  including 100+ iterations.
- **An AI response is not automatically a new draft.** A new lineage starts only when Dayna
  explicitly asks to start over, create a new direction/version, or clearly resets the artifact.
- Previous versions remain recoverable. **A casual new thought must not overwrite a carefully
  refined artifact.**
- Corrections propagate into future authorized work while history remains visible.

### B.4 User words, AI inference and source authenticity (§2.4)

- Direct user statements must remain **distinguishable** from AI inference, external evidence,
  calculated values, recommendations, and generated text.
- **Prior AI-generated writing must not be learned as Dayna's authentic voice** unless she
  explicitly approves it as a voice source.
- Filenames, metadata, summaries, labels, prior AI claims, and prior status documents are
  **not truth merely because they exist**.
- Originals and evidence retain provenance. Corrections supersede prior state **without
  silently rewriting history**.

### B.5 Dynamic work, not project-married agents (§2.5)

- Dayna changes gears rapidly across business building, career/job search, writing, marketing,
  resale, financial/record work, websites/software, research, and more.
- The 40 permanent agents are **occupations**. They are not married to a project, client,
  folder, or current task.
- The same qualified occupational role works on different authorized projects at different
  times.
- New work should normally **add/qualify skills, tools, workflow templates, or records** — not
  create a new permanent agent for every task.
- The foundation must be a **launchpad that evolves without rebuilding the core ecosystem**.

---

## PART C — REQUIRED PRODUCTION COMPONENTS (TAB 03 §3.1)

1. Remote web application/server and HTTPS production URL.
2. MCP server using the **same production state** as the web app.
3. Real LLM/provider integration through a **provider abstraction**.
4. Forty permanent occupational role contracts **loaded by the runtime**.
5. Skill/tool/connector registry and **qualification evidence**.
6. Task/workflow engine, role routing, structured handoffs, review, approval, failure, retry
   and resume.
7. Authentication and **task-scoped authorization**.
8. Living-context / version / supersession system.
9. Persistent **relational** catalog/database for authoritative records.
10. Remote object/file storage for originals and derivatives.
11. Media/photo ingestion, analysis, cataloging, naming, derivative editing and downstream
    workflow automation.
12. Document ingestion, extraction, cataloging, evidence and routing.
13. User-friendly **server-backed** dashboard/application.
14. Event/audit log, health status, backup/export, recovery and cost/usage controls.

---

## PART D — REQUIRED AUTHORITATIVE DATA ENTITIES (TAB 03 §3.2)

- Identities / authorized clients / workspaces / projects
- Tasks, work packages, workflow instances and task/workflow events
- Permanent role registry, skill/tool registry and qualification records
- Agent runs, context used, evidence used, outputs and rubric results
- Approvals, review queues, failures, retries and recovery points
- Living-context entries: sources, types, confidence, scope, permissions, versions,
  supersessions
- Media assets, batches, original manifests, derivatives, duplicate groups, quality flags,
  catalog relationships
- Documents, extraction records, classifications, evidence links, version/output relationships
- Resale item records and other domain records required by the permanent occupational workflows
- Connector definitions/state, system health, deployment/version metadata and audit history

---

## PART E — STORAGE MODEL (TAB 03 §3.3)

| Zone | Rule |
|---|---|
| **Originals** | Immutable / logically write-once after verified ingest. |
| **Intake** | Newly arrived material awaiting processing. |
| **Temporary/cache** | Transient transfer/processing copies; clearable **only** under explicit verified rules. |
| **Derivatives** | Working/edited/transcoded versions that **always link to an original**. |
| **Review** | Uncertain, blocked, or approval-required material. |
| **Agent-ready** | Normalized/authorized working inputs where helpful. |
| **Outputs** | Completed deliverables and machine outputs. |
| **Catalog/archive** | Long-term organized records and provenance-preserved history. |

---

## PART F — PHOTO/MEDIA INTAKE PIPELINE (TAB 03 §3.4)

> **CRITICAL: DRAG/DROP IS NOT THE WORKFLOW.**
> A dashboard upload is **one intake path, not the system design**. Media arriving through any
> authorized source must enter the **same durable event-driven pipeline automatically**. Build
> an ingestion adapter/API/queue so future device/cloud/source connectors do not require
> redesign.

Required ordered behavior:

1. Media arrives via web app, intake API, authorized connector, watched/synced source, or
   another approved ingestion adapter.
2. Create an intake/batch record **immediately**.
3. Write the original to **remote durable storage before downstream processing**.
4. Verify persistence and checksum; record immutable original identity and original filename.
5. Read metadata as **evidence with trust status**. Never treat EXIF or filename as
   automatically correct.
6. Run authorized vision/content analysis and **preserve tool/model provenance**.
7. Group related images/batches/items with confidence and uncertainty.
8. Detect exact/near duplicates and unusable/low-quality images **without deleting originals**.
9. Create candidate purpose/category/item/project/client relationships; route uncertain
   relationships to review.
10. Generate content-informed **managed filenames** for catalogued/working copies while
    preserving original identity and name.
11. Decide whether derivatives are needed for the actual downstream use. Create
    **non-destructive derivatives only; never alter the original**.
12. For resale or other domain flows, **hand work to the proper occupational roles** instead of
    making one image script identify, assess, price, list, and publish everything.
13. Write all relationships, decisions, derivatives, review state and workflow state to the
    authoritative catalog.
14. **Trigger the next workflow automatically** based on evidence, purpose and permissions.
15. Clear temporary transfer/cache material **only after durable remote preservation is
    verified**. Deletion from the original phone/photo library is a **separate explicit opt-in
    action, never the default**.

### Minimum media catalog fields (§3.5)

- Immutable media ID; original filename; managed filename(s); checksum; source/source type;
  intake time; batch ID
- MIME/file type, dimensions, technical metadata; EXIF/metadata values **plus trust/
  verification state**
- Original storage reference; derivative references and lineage
- Vision/content analysis, model/tool/source and confidence
- Candidate purpose/category/item and confidence; duplicate group; quality/usability flags
- Project/client/item/workflow relationships with evidence and uncertainty
- Current owner/role, review/approval state, workflow state, errors, retries, downstream
  outputs

---

## PART G — DOCUMENT WORKFLOW (TAB 03 §3.6)

1. Preserve remote original and checksum.
2. Extract text/content where appropriate **without destroying source identity**.
3. Classify **from contents/evidence**; do not trust filenames or old AI summaries.
4. Create catalog/index record and useful managed name where appropriate, **preserving the
   original name**.
5. Associate with project/client/item/matter/workflow records based on evidence and
   permissions.
6. Route to the correct **qualified occupational role/workflow**.
7. Keep evidence links and provenance attached to analysis and output.
8. Allow corrections/supersession **without editing or erasing the original**.

---

## PART H — LIVING CONTEXT (TAB 03 §3.7)

Typed records must distinguish:

`direct user statement` · `verified fact` · `external evidence` · `agent inference` ·
`calculation` · `preference` · `decision` · `temporary idea` · `correction` ·
`superseded state` · `unfinished work`

- Each record retains **source/author, time, scope, permissions, confidence where applicable,
  provenance, and supersession links**.
- Context retrieval is **task- and role-scoped**, not a giant unrestricted memory dump.
- Corrections **propagate to affected future authorized work** while history remains
  recoverable.
- Web app, MCP clients, agents and workflows **all use the same production living-context
  store**.
- Brainstorming/refining/artifact lineage state is durable and visible enough to **prevent
  accidental resets**.

---

## PART I — REAL WEB APPLICATION SURFACES (TAB 03 §3.8)

| Surface | Must show |
|---|---|
| **Home / Daily** | Priorities, waiting items, active work, quick restart points |
| **Intake** | Natural-language/voice-dictated input; file/media/document intake status |
| **Active Work / Workflows** | Task stages, current owner/role, next action, waiting/review/failure/retry state |
| **Agents** | Permanent role directory, qualification/availability, current bounded work — **not fake activity cards** |
| **Media & Catalog** | Batches, originals, managed names, derivatives, item/project links, review states |
| **Documents** | Originals, extracted/classified records, relationships, evidence, outputs |
| **Review & Approvals** | Clear pending decisions **and consequences** |
| **Living Context / Corrections** | Inspect source/type/current/superseded records; submit corrections |
| **Outputs / History** | Completed work, versions, evidence references, restart/reuse paths |
| **System Health / Connections** | Deployment version, provider/connectors, errors, queues, backups/health, cost/usage alerts |

---

## PART J — MCP AND AI-WORKER SURFACE (TAB 03 §3.9)

- MCP uses the **same production persistence, permissions, catalog, living context, tasks,
  workflows and outputs** as the web app.
- Authorized clients discover **bounded** capabilities and use tools/resources/prompts
  appropriate to their permissions.
- Minimum operating capabilities cover: tasks/workflows, context, files/media/documents,
  role/agent directory, approvals/review, catalog lookup, outputs, status.
- **Unauthorized access fails closed.** A separate fake MCP state or sample-only endpoint
  **does not count**.

---

## PART K — PERMANENT AGENT OPERATING CYCLE (TAB 03 §3.10)

Every permanent agent run executes this cycle:

1. Load the **full** occupational role contract.
2. Load task-scoped authority/permissions.
3. Retrieve relevant **authorized** living context.
4. Keep user statements **distinct** from agent interpretation.
5. Activate **only qualified** skills and permitted tools/connectors.
6. Invoke the **real** selected LLM/provider.
7. Gather/retain required evidence and provenance.
8. Perform the bounded occupational task and **validate structured output**.
9. Evaluate against the permanent operating rubric.
10. Write task state, run evidence, output and context changes.
11. **Hand off** when another occupation is required.
12. **Stop for approval/review** when required.
13. **Fail visibly** and preserve recoverable state when blocked/interrupted.
14. **Resume from durable state** without Dayna re-explaining the task.

---

## PART L — BUILDER/TOOL/CREDENTIAL BEHAVIOR (TAB 03 §3.11)

- Use own terminal, filesystem, Git, test runners, CI, deployment CLI/API, connected services
  and credential helpers when authorized.
- **Before asking Dayna to set something up manually, inspect what already exists and attempt
  the work directly.**
- If only Dayna can authorize an account/OAuth/secret: initiate the supported authorization
  flow and request **one specific action**. Do **not** send a list of terminal commands or
  manual cloud plumbing the agent can perform after authorization.
- **Never print or store raw secrets** in source, prompts, evidence logs, or agent-visible
  context.
- Use Git commits/tags at stage boundaries so a later agent can recover known-good behavior.

---

## PART N — ZERO-BUDGET CONSTRAINT (controlling requirement, added 2026-08-24)

Stated directly by Dayna and therefore a **requirement** under TAB 01 §1.1, ranking above every
implementation preference in this document:

> "you are making this entire thing work on nearly free opensource tools - even if it requires
> over 100 ... i have zero money to invest in this - get creative"

### Binding rules

1. **The recurring cost target is $0.** Not "cheap." Not "low." Zero out-of-pocket.
2. **Free-tier and open-source components only.** Paid tiers, trials that convert to paid, and
   anything requiring a card on file to remain functional are **out of scope** unless Dayna
   explicitly authorizes that specific spend.
3. **Component count is not a constraint. Cost is.** Assembling 100+ free/open-source pieces is
   acceptable and expected. "Fewest services" (§1.3) is subordinate to zero cost, and must
   never be used as an argument for a paid product.
4. **Complexity from this constraint is the builder's burden, never Dayna's.** More moving
   parts must not translate into more administration for her (§2.1). The builder operates it.
5. **Self-hosted open source is the default answer** wherever a paid managed service would
   otherwise be chosen — database, object storage, queue, auth, search, monitoring, backup.
6. **No lock-in to a free tier.** Every component must be replaceable, because free tiers get
   withdrawn. Storage, database and LLM provider access are written behind abstractions so a
   provider can be swapped by configuration, not by rewrite. This extends the LLM provider
   abstraction already required by §3.1.
7. **Durability is not negotiable for cost.** Dayna's originals must survive the loss of any
   single free-tier account. Preservation of originals outranks convenience and outranks
   component count.
8. **Every candidate must be verified free at the time of selection**, with the specific free
   allowance recorded as evidence. A provider's terms at training time are not evidence.

### Consequence for the platform decision

The hosting question that was previously open is now **bounded**: the platform must be
assembled from free-forever allowances and self-hosted open source. Any prior recommendation in
this repository's history that assumed a monthly spend is **void** and must not be inherited
(TAB 01 §1.1 — prior claims are evidence, never requirements).

The selection is still made on TAB 01 §1.3 whole-system criteria and on §4a of
`contracts/stage_rules.md` — builder convenience remains an invalid argument. Candidates must
be verified live before selection, and the verification recorded as stage evidence.

### N.1 — Candidate zero-cost stack (researched 2026-08-24; VERIFY BEFORE SELECTION)

**The ask is not reduced by the zero-budget constraint.** Every required component in PART C
has a free-forever or open-source equivalent. The constraint changes *how* a capability is
obtained, never *whether* it exists. Recorded here so no later agent proposes cutting scope for
cost.

| Required component (§3.1) | Zero-cost path | Cost |
|---|---|---|
| Remote server, always-on, HTTPS URL | Oracle Cloud **Always Free** ARM VM — persistent, public IP, generous egress. Fallbacks: Google Cloud always-free `e2-micro`, Fly.io free allowance, Hugging Face Spaces | $0 |
| HTTPS / TLS certificates | Caddy or nginx + Let's Encrypt, auto-renewing | $0 |
| Persistent relational catalog | **PostgreSQL self-hosted** on the VM — no row caps, no storage caps, no free-tier ceiling | $0 |
| Remote object/file storage | **MinIO** (S3-compatible) self-hosted on VM disk, **plus** an off-box replica of originals to a free-tier bucket (Backblaze B2 / Cloudflare R2 free allowances) for durability | $0 |
| Task/workflow engine + queue, retry, resume | Postgres-backed queue (`pgmq`, `graphile-worker`, or equivalent) — durable, transactional, no extra service | $0 |
| Authentication + task-scoped authorization | Self-hosted open-source auth (Auth.js / Lucia / Keycloak) | $0 |
| Real LLM/provider integration | Dayna's existing **Google AI Pro** → Gemini API access plus its monthly credit; Gemini free tier as baseline. Behind the §3.1 provider abstraction so the provider is swappable | $0 |
| Media ingestion, analysis, derivatives | `libvips`/ImageMagick, `ffmpeg`, `exiftool` — all open source, all self-hosted | $0 |
| Document ingestion + extraction | Apache Tika, `pdfminer`/`pypdf`, Tesseract OCR | $0 |
| Event/audit log, health, observability | Postgres-backed audit log; Prometheus + Grafana + Loki self-hosted if richer telemetry is warranted | $0 |
| Backup / export / recovery | `restic` or `borg` → free-tier off-site bucket, on a schedule; plus Git for code and configuration | $0 |
| CI / scheduled jobs | GitHub Actions free allowance; system cron on the VM | $0 |
| Web application + MCP server | Self-hosted on the same VM, sharing one production state as §3.9 requires | $0 |

**Why this is not a downgrade.** Self-hosted Postgres and MinIO have **no row limits, no
storage tiers, and no seat counts** — the ceilings that make paid free-tiers painful simply do
not exist. No vendor can withdraw an allowance and break the system. The trade is that patching,
monitoring, and recovery become the builder's responsibility, which §2.1 and Dayna's explicit
instruction already assign to the builder rather than to her.

**Verification obligations before this stack is selected (TAB 01 §1.4 — a claim is not proof):**

1. Oracle's Always Free ARM allowance has been reduced for some new accounts (reports of
   4 OCPU / 24 GB provisioning as 2 OCPU / 12 GB), and ARM capacity is **not guaranteed** in
   popular regions — "out of capacity" on provisioning is common. The reduced 2 OCPU / 12 GB
   shape is still sufficient for this system, but **capacity must be confirmed by actually
   provisioning**, not assumed. Fallback providers above must be ready.
2. Every free allowance must be re-verified live at selection time and the specific limit
   recorded as stage evidence. Terms known at training time are not evidence.
3. Account creation requires Dayna's authorization. Per §3.11 the builder requests **one
   precise action** and performs all technical setup itself afterward.

Sources consulted 2026-08-24: [Oracle free tier changes](https://terminalbytes.com/oracle-cloud-free-tier-changes-2026/),
[Oracle free tier summary](https://cloudpricecheck.com/free-tier/oracle),
[ARM capacity issue](https://github.com/oeufmeister/oci-arm-host-capacity).

---

## PART M — ACCEPTANCE POSTURE

- Nothing is `WORKING` before **Stage 15** and independent `AUDIT_PASS`.
- Construction stages verify **code/functions only**, with unmistakably synthetic fixtures.
- **Zero contact with Dayna's corpus during Stages 00–14.**
- Full detail: `contracts/stage_rules.md`.
