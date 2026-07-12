# BMS Product Backlog

This file is the shared product contract for the BMS / ELV portfolio and knowledge-network project. It is maintained by the Product / Backlog Agent and consumed by Execution, QA, Review, and Release / GitHub Archive agents.

## Product North Star

Turn the site from a strong BMS demo into a professional portfolio where a recruiter, technical manager, or industry peer can understand the owner's BMS / ELV / controls integration depth within 3 minutes.

The product must keep both identities:

- Public portfolio: target roles, engineering judgment, case evidence, contact path.
- Knowledge network: editable topology, protocol relationships, device evidence, plant and power-management concepts.

## Agent Roles

### Product / Backlog Agent

- Responsibility: maintain product direction, priority, scope boundaries, backlog structure, item clarity, and dependencies.
- Allowed changes: edit `BACKLOG.md` and product planning docs when needed.
- Not allowed: implement product code, perform final QA, or replace Review Agent acceptance.

### Execution Agent

- Responsibility: read `BACKLOG.md`, select the highest-priority actionable `Todo` item, implement it, verify locally, and mark it `Review Needed`.
- Allowed changes: edit application source, styles, tests, implementation docs, and backlog status/evidence for implemented items.
- Not allowed: invent broad scope outside the backlog unless required to complete an accepted item.

### QA Agent

- Responsibility: run functional, browser, responsive, accessibility, and regression checks requested by backlog items.
- Allowed changes: add or update test artifacts and QA notes.
- Not allowed: redefine product scope or accept final product quality on behalf of Review.

### Review Agent

- Responsibility: inspect completed work, judge whether it meets the backlog item, and mark items `Accepted` or return them to `Todo` with concrete notes.
- Allowed changes: edit `BACKLOG.md` review notes and append/update review notes in `BMS网站求职展示优化建议.md`.
- Not allowed: implement product code unless explicitly asked by the user.

### Release / GitHub Archive Agent

- Responsibility: after QA and Review acceptance, prepare release batches, upload confirmed work to GitHub, record release evidence, and archive finished Codex threads.
- Allowed changes: release notes, git metadata, `BACKLOG.md` release records, and Codex thread archive state for completed work.
- Not allowed: release work that has not passed QA and Review, claim GitHub upload without confirmed push evidence, or archive threads with unfinished or blocked work.

## Workflow

1. Product / Backlog Agent keeps this file structured, prioritized, and scoped.
2. Execution Agent picks items in this order: `P0`, `P1`, `P2`, then `P3`.
3. Execution Agent changes an item from `Todo` to `In Progress` before implementation.
4. Execution Agent changes an item to `Review Needed` after implementation and records files changed plus verification performed.
5. QA Agent independently verifies implemented behavior and changes status to `QA Passed` or returns it to `Todo` / `Blocked` with concrete failure notes.
6. Review Agent validates `QA Passed` work and changes status to `Accepted` or returns it to `Todo`.
7. Release / GitHub Archive Agent groups accepted items into release batches, uploads to GitHub, records evidence, then archives completed threads.
8. Blocked items must include the blocking reason and exact user input or external dependency needed.

## Status Values

- `Todo`: ready for implementation.
- `In Progress`: currently being implemented by Execution.
- `Review Needed`: implemented and waiting for QA validation.
- `QA Passed`: independently verified by QA and ready for Review acceptance.
- `Accepted`: reviewed and considered complete.
- `Release Ready`: accepted work is ready to commit and upload.
- `GitHub Uploaded`: release batch has been pushed to GitHub and recorded with evidence.
- `Archived`: completed release batch or role thread has been archived.
- `Blocked`: cannot proceed without user input or external dependency.
- `Deferred`: intentionally postponed because it is lower-value, dependent on later scope, or not required for the current portfolio push.
- `Out of Scope`: does not support the BMS / ELV portfolio and knowledge-network positioning.

## Scope Decisions

### Do Now

- Make mobile first impression professional and readable.
- Keep the graph useful without letting the desktop editor dominate mobile.
- Reduce initial bundle pressure from Three.js and React Flow.
- Preserve current accepted portfolio summary, case studies, and node evidence.

### Do Later

- Real CV/contact wiring after mobile and performance basics are stable.
- Sharable node/case links after the graph model and routing/export shape are clearer.
- Full evidence editing after inspector and schema ownership are separated.
- PDF, SVG, Mermaid, or presentation export after core portfolio conversion paths work.

### Avoid

- A pure marketing landing page that replaces the usable knowledge network.
- Vendor-specific positioning that makes one BMS brand the default truth.
- Decorative visual work that does not improve BMS / ELV credibility.
- Complex contact forms, LMS-style lessons, or generic blog features that dilute the portfolio.

## Current Priority Queue

1. `P2-002 Mobile Portfolio Overview` has passed QA and is waiting for Review Agent final acceptance.
2. `P2-003 Mobile Graph Containment` follows because it protects mobile usability.
3. `P2-004 Mobile Inspector and Dense Modules` finishes the mobile readability pass.
4. `P2-005 Performance Vendor Splitting` reduces bundle pressure.
5. `P2-006 Feature Module Lazy Loading` follows if bundle pressure remains high.
6. `P2-007 Data and Schema Split` starts architecture cleanup without visual churn.
7. `REL-001 GitHub Upload And Archive Setup` is blocked until git, GitHub remote/authentication, release batch, and archive targets are confirmed.

## Accepted Foundation

### P1-001 Portfolio Summary First Impression

- Status: `Accepted`
- Owner: Execution Agent
- Goal: make the first screen immediately explain the target role, strongest BMS capabilities, protocol stack, proof material, and contact/CV path.
- Acceptance Criteria:
  - First viewport clearly communicates BMS / ELV / controls integration positioning.
  - Includes target roles, core strengths, industry stack, and proof points.
  - Existing tool actions such as save/export remain available without dominating the hero.
- Risks:
  - Future UI changes could let tool controls dominate the portfolio CTA again.
  - CV link is still placeholder-level and should not be treated as final contact conversion.
- Dependencies:
  - Real CV/contact assets are deferred to `P3-002`.
- Review Notes:
  - Accepted on 2026-07-10.
  - `npm.cmd run build` succeeds.
  - `detect.mjs --json src` returns `[]`.
  - Desktop DOM/screenshot verification shows BMS / ELV positioning, target roles, strengths, stack, proof material, and CTA links.
  - Mobile is readable enough for this item; deeper mobile refinement remains under `P2-002` through `P2-004`.

### P1-002 Engineering Case Studies

- Status: `Accepted`
- Owner: Execution Agent
- Goal: add case studies that convert the knowledge network into hiring-friendly engineering stories.
- Acceptance Criteria:
  - At least two case studies are visible in the UI.
  - Each case follows `Problem`, `System`, `Action`, `Result`, and `Evidence`.
  - Cases cover realistic BMS scenarios such as mixed protocol integration, chiller plant sequencing, power metering, SQL trends, or commissioning.
- Risks:
  - Case studies can become keyword lists if future edits remove concrete engineering decisions.
  - Over-expanding cases could make the portfolio feel like a text-heavy wiki.
- Dependencies:
  - None for current accepted scope.
- Review Notes:
  - Accepted on 2026-07-10.
  - `npm.cmd run build` succeeds.
  - `detect.mjs --json src` returns `[]`.
  - UI verification found 3 visible `.case-card` entries under `#cases`.
  - Each case includes `Problem`, `System`, `Action`, `Result`, and `Evidence`.
  - Case evidence includes concrete engineering terms such as UDP 47808, BBMD, MS/TP MAC/baud rate, register offsets, CT ratio, MeterIntervals schema, and sequence/point-list proof.

### P1-003 Node Engineering Evidence

- Status: `Accepted`
- Owner: Execution Agent
- Goal: upgrade knowledge nodes from generic descriptions to verifiable engineering assets.
- Acceptance Criteria:
  - Important nodes expose practical details such as point schedules, protocol parameters, troubleshooting notes, database strategy, sequence logic, or commissioning evidence.
  - Inspector renders the evidence in a scannable format.
  - Empty or missing evidence does not break the UI.
- Risks:
  - Old saved graphs in `localStorage` may not contain new built-in evidence until reset.
  - Evidence can drift out of date if data and schema stay embedded in one large app file.
- Dependencies:
  - Architecture cleanup in `P2-007` will make future evidence changes safer.
- Review Notes:
  - Accepted on 2026-07-10.
  - `npm.cmd run build` succeeds.
  - `detect.mjs --json src` returns `[]`.
  - `DeviceData` supports optional `evidence`.
  - All 12 built-in portfolio nodes include practical `evidence` arrays.
  - Inspector renders an `Engineering evidence` block and missing evidence degrades gracefully.

## Active Backlog

### P2-001 Interaction Feedback

- Status: `Accepted`
- Owner: Execution Agent
- Source: `BMS网站求职展示优化建议.md`
- Goal: make save, export, reset, add-device, and no-results states feel product-grade.
- Acceptance Criteria:
  - Save displays a success or failure toast.
  - Reset asks for confirmation or provides a clear undo path.
  - Add device focuses or highlights the new node.
  - Filter/search no-results state explains how to recover.
  - Export success/failure gives clear feedback.
- Risks:
  - Toasts or confirmations could obscure important graph controls on small screens.
  - Reset confirmation can slow expert desktop use if it is too heavy-handed.
- Dependencies:
  - None remaining for this accepted item.
  - Mobile graph overflow and dense mobile layout concerns remain scoped to `P2-003` and `P2-004`.
- Files Changed:
  - `src/App.tsx`
  - `src/styles.css`
- Verification From Execution:
  - `npm.cmd run build` succeeds.
  - Playwright verified Save success toast, Add device toast plus selected-node highlight, search/filter empty state, Reset confirmation dialog, and Export JSON download plus toast.
  - Build still reports the existing large chunk warning, which belongs to `P2-005` and `P2-006`.
- QA Notes:
  - QA Passed on 2026-07-10.
  - `npm.cmd run build` succeeds.
  - Playwright verified Save success toast, Add device toast plus visible selected-node highlight and inspector focus, search/filter no-results recovery copy, Reset confirmation dismiss and accept paths, and Export JSON download filename plus toast.
  - Desktop and mobile screenshots captured:
    - `artifacts/qa-p2-001-desktop-20260710.png`
    - `artifacts/qa-p2-001-mobile-20260710.png`
    - `artifacts/qa-p2-001-mobile-empty-20260710.png`
  - Mobile document-level overflow check passed at 390x844. The graph remains an internal horizontal scroll workspace, which is acceptable for this item and remains covered by `P2-003`.
  - Browser verification found no application console errors. Chromium emitted WebGL `ReadPixels` performance warnings during the Three.js canvas screenshot path; not treated as a blocking app defect.
- Review Notes:
  - Accepted on 2026-07-10 after QA marked this item `QA Passed`.
  - Review Agent did not skip QA; acceptance was performed only after QA notes and screenshots were present.
  - Review re-ran `npm.cmd run build`: passed.
  - Review re-ran `detect.mjs --json src`: returned `[]`.
  - Source review confirmed product-grade feedback paths for Save, Add device, Reset confirmation, Export success/failure, and filter/search empty state.
  - Domain acceptance: the added feedback improves trust in the BMS knowledge editor without changing the accepted portfolio/case/evidence content. The existing large bundle warning remains correctly scoped to `P2-005` / `P2-006`.

### P2-002 Mobile Portfolio Overview

- Status: `QA Passed`
- Owner: Execution Agent
- Source: `PRODUCT.md`, `DESIGN.md`, `BMS网站求职展示优化建议.md`
- Goal: make the mobile first screen prioritize hiring/story readability before the full editor experience.
- Acceptance Criteria:
  - Mobile first viewport clearly shows BMS / ELV positioning, target roles, and 3 to 5 strongest capabilities.
  - Primary portfolio CTAs remain reachable without forcing a long scroll through editor controls.
  - Tool actions such as Save, Export, Add, and Reset are visually secondary on mobile.
  - Text does not overlap, clip, or require horizontal scrolling at common mobile widths.
  - Desktop first impression remains unchanged except for harmless responsive CSS.
- Risks:
  - Hiding too much can make mobile feel like a static landing page instead of a knowledge network.
  - Over-stacking all portfolio content can create another very tall mobile page.
- Dependencies:
  - Builds on accepted `P1-001`.
  - Must not reopen `P1-001` unless the portfolio summary itself regresses.
- Files Changed:
  - `src/App.tsx`
  - `src/styles.css`
- Verification From Execution:
  - `npm.cmd run build` succeeds.
  - Playwright verified mobile widths `390x844` and `375x667`: hero is first in mobile document flow, BMS / ELV positioning is visible, target roles are present, 4 core strengths are visible, primary portfolio CTA is reachable, and the hero has no text overflow.
  - Playwright verified document-level horizontal overflow is `0` at both mobile widths for this item scope.
  - Mobile screenshots captured:
    - `artifacts/execution-p2-002-mobile-390.png`
    - `artifacts/execution-p2-002-mobile-375.png`
  - Mobile tool actions were visually demoted: hero Save/Export use compact secondary treatment and network toolbar buttons use secondary styling on small screens.
  - Build still reports the existing large chunk warning, which belongs to `P2-005` and `P2-006`.
- QA Notes:
  - QA Passed on 2026-07-10.
  - `npm.cmd run build` succeeds.
  - `node C:/Users/Figo/.agents/skills/impeccable/scripts/detect.mjs --json src` returns `[]`.
  - Started local Vite on `http://127.0.0.1:5177/` for browser verification.
  - Playwright verified mobile widths `390x844` and `375x667`: portfolio hero is first in mobile flow, BMS / ELV positioning is visible, all 4 target role chips are visible, 4 core strengths are visible, and primary `View cases` / `Open demo` CTAs are reachable in the first viewport.
  - Verified mobile tool actions are visually secondary: hero `Save` / `Export JSON` use compact muted `tool-action` styling; network `Add device` and reset controls use secondary toolbar styling and appear after the portfolio CTA area.
  - Verified no hero text/button overflow, no document-level horizontal scrolling, and no browser console/page errors at both mobile widths.
  - Desktop regression check passed at `1440x1000`: headline, all 3 portfolio summary stacks, primary CTAs, and graph/editor entry remain visible with no document-level horizontal overflow.
  - QA screenshots captured:
    - `artifacts/qa-p2-002-mobile-390-viewport-20260710.png`
    - `artifacts/qa-p2-002-mobile-375-viewport-20260710.png`
    - `artifacts/qa-p2-002-mobile-390-full-20260710.png`
    - `artifacts/qa-p2-002-mobile-375-full-20260710.png`
    - `artifacts/qa-p2-002-desktop-viewport-20260710.png`
  - Build still reports the known large chunk warning; this is not blocking for `P2-002` and remains scoped to `P2-005` / `P2-006`.

### P2-003 Mobile Graph Containment

- Status: `Review Needed`
- Owner: Execution Agent
- Source: `BMS网站求职展示优化建议.md`
- Goal: prevent React Flow from creating disruptive horizontal overflow or forcing desktop-editor behavior on phones.
- Acceptance Criteria:
  - Mobile page has no document-level horizontal scrolling caused by the graph.
  - Graph area uses bounded dimensions with internal pan/scroll behavior where needed.
  - Mobile default presentation is read-only overview or preview-first; edit actions are available through a deliberate entry point.
  - MiniMap and dense graph controls are hidden, simplified, or moved when they crowd mobile.
  - Desktop graph editing remains fully usable.
- Risks:
  - React Flow gesture handling can conflict with page scroll on touch devices.
  - A read-only default can frustrate users if the edit entry point is hidden.
- Dependencies:
  - Should follow or ship with `P2-002` so mobile hierarchy is clear before graph containment is tuned.
- Implementation Evidence:
  - Added a preview-first mobile graph mode with a deliberate `Edit network` entry point.
  - Bounded the React Flow canvas to the mobile viewport and removed document-level overflow.
  - Hid MiniMap, graph controls, and the editing toolbar until mobile edit mode is enabled.
  - Preserved the full desktop editor and verified the mobile editor at a 390 x 844 viewport.
  - `pnpm run build` passes; the known large bundle warning remains scoped to `P2-005` / `P2-006`.
  - Browser smoke tests found no console errors on the React workspace or VAV simulator.

### P2-004 Mobile Inspector and Dense Modules

- Status: `Todo`
- Owner: Execution Agent
- Source: `BMS网站求职展示优化建议.md`
- Goal: make inspector, 3D plant, power, and data-architecture sections readable on small screens without dumping the entire desktop workspace into one long stack.
- Acceptance Criteria:
  - Inspector becomes a compact section, drawer, or collapsed panel on mobile.
  - Secondary labels, dense metrics, and micro tags are reduced where needed.
  - 3D plant keeps core operating-mode controls but removes or simplifies secondary mobile labels.
  - Tables or dense data panels use responsive layouts that do not clip text.
  - Mobile screenshots show no obvious overlap, occlusion, or unreadable compressed controls.
- Risks:
  - Drawer behavior can introduce keyboard/focus issues.
  - Simplifying dense modules can remove evidence that matters to technical reviewers.
- Dependencies:
  - Should follow `P2-002` and `P2-003`.
  - May benefit from QA mobile screenshots before Review Agent acceptance.

### P2-005 Performance Vendor Splitting

- Status: `Todo`
- Owner: Execution Agent
- Source: `BMS网站求职展示优化建议.md`
- Goal: reduce initial bundle pressure by separating heavy vendors from the main app chunk.
- Acceptance Criteria:
  - Vite/Rollup build separates `three` and `react-flow` vendor code where practical.
  - Build output shows the main app chunk is smaller than the current approximately `1.37 MB` uncompressed chunk, or documents why vendor splitting is insufficient.
  - Public first screen does not require Three.js execution before useful portfolio content appears.
  - No runtime regression in graph or 3D plant after splitting.
- Risks:
  - Manual chunking can improve cacheability without improving first meaningful render if imports stay eager.
  - Chunk names and sizes may vary by build tooling, so evidence must compare before/after output.
- Dependencies:
  - Can start after mobile items, or earlier if execution is blocked on mobile design details.

### P2-006 Feature Module Lazy Loading

- Status: `Todo`
- Owner: Execution Agent
- Source: `BMS网站求职展示优化建议.md`
- Goal: lazy-load heavy feature modules so the portfolio summary is available before graph and 3D cost is paid.
- Acceptance Criteria:
  - `ChillerPlant` or equivalent 3D module uses `React.lazy` / `Suspense` or an equivalent route/viewport-based loading strategy.
  - Network editor splitting is evaluated and implemented where practical.
  - Loading states use lightweight skeletons or compact placeholders rather than blank space.
  - Build succeeds and interactive modules still work after loading.
- Risks:
  - Lazy loading can create visual jumps if placeholders do not reserve stable space.
  - Splitting the network editor may be risky while `src/App.tsx` still owns most state.
- Dependencies:
  - Best paired with or after `P2-007` if state ownership blocks a clean split.

### P2-007 Data and Schema Split

- Status: `Todo`
- Owner: Execution Agent
- Source: `BMS网站求职展示优化建议.md`
- Goal: begin code-structure cleanup by moving stable data and graph schema concerns out of the main app file without changing behavior.
- Acceptance Criteria:
  - Device, edge, brand, protocol, layer, portfolio summary, and case-study data move into clearly named files under `src/data/`.
  - Graph import/export types or validation helpers move into `src/schemas/knowledgeGraph.ts` or an equivalent local pattern.
  - `src/App.tsx` becomes smaller and easier to scan without visual or interaction changes.
  - `npm.cmd run build` succeeds.
- Risks:
  - Large mechanical moves can create subtle import or type regressions.
  - Mixing visual redesign with this item would make review harder.
- Dependencies:
  - None, but should preserve all accepted P1 content exactly.

### P2-008 Network Component Split

- Status: `Deferred`
- Owner: Execution Agent
- Source: `BMS网站求职展示优化建议.md`
- Goal: move network UI pieces into focused components after the data split is stable.
- Acceptance Criteria:
  - `src/components/network/` contains graph, toolbar, device node, and inspector components.
  - Component boundaries follow existing state ownership rather than forcing a large architecture rewrite.
  - Build succeeds and graph editing behavior is unchanged.
- Risks:
  - Too much component splitting before state is understood can make behavior harder to trace.
- Dependencies:
  - Depends on `P2-007`.

### P2-009 Plant, Power, and Data Architecture Component Split

- Status: `Deferred`
- Owner: Execution Agent
- Source: `BMS网站求职展示优化建议.md`
- Goal: separate the 3D plant, power-management, and data-architecture modules into maintainable feature folders.
- Acceptance Criteria:
  - `src/components/plant/` owns the chiller plant module and supporting controls/primitives.
  - `src/components/power/` owns power-management UI.
  - `src/components/data-architecture/` owns trend/SQL/data architecture UI.
  - Build succeeds and current visuals/behavior remain stable.
- Risks:
  - 3D state and animation code can be fragile during mechanical moves.
- Dependencies:
  - Depends on `P2-007`.
  - May be easier after `P2-006`.

## Release and Archive Workflow

This workflow starts only after relevant items have passed QA, been marked `Accepted` by Review, and been explicitly marked `Release Ready`.

1. Release / GitHub Archive Agent checks the local release environment:
   - `git rev-parse --is-inside-work-tree`
   - `git status --short`
   - `git remote -v`
   - GitHub authentication availability, such as `gh auth status` or a usable HTTPS/SSH remote.
   - `npm.cmd run build`
2. If the project is not a git repository, there is no GitHub remote, authentication is unavailable, or the release batch is not confirmed, keep `REL-001` as `Blocked` and record the missing setup.
3. If release prerequisites are satisfied:
   - stage only intended project files;
   - create a commit message tied to the accepted backlog batch;
   - push to the configured GitHub remote;
   - record commit hash, remote URL, branch, push time, and verification summary in this file.
4. After confirmed GitHub upload, archive completed Codex threads that no longer have active work:
   - archive only completed role threads or release batches;
   - do not archive threads with `Todo`, `In Progress`, `Review Needed`, `QA Passed`, or `Blocked` work;
   - use the Codex `set_thread_archived` tool for thread archiving.

## Later Backlog

### P3-001 Industry Detail Expansion

- Status: `Todo`
- Owner: Product / Execution Agent
- Source: `BMS网站求职展示优化建议.md`
- Goal: strengthen industry-specific evidence so BMS peers see practical site and commissioning experience.
- Acceptance Criteria:
  - Topology details include IP / VLAN / BBMD / routing.
  - BACnet object examples include AI, AO, BI, BO, AV, BV, Schedule, Trend Log, and Alarm.
  - Modbus examples include address, function code, data type, scale, and common polling risks.
  - Troubleshooting path includes ping, Wireshark, BACnet discovery, timeout, and register validation.
  - Chiller plant details include CHWS/CHWR/CWS/CWR, DP, flow, valve command, and pump status.
  - Power details include CT/PT ratio, tariff period, missing interval, and wrong multiplier.
  - SQL details include `point_id + timestamp` indexing, retention, and backup/restore.
- Risks:
  - More detail can reduce scanability if not organized as evidence or drill-down content.
- Dependencies:
  - Should follow mobile readability and data split work.

### P3-002 Real CV and Contact Path

- Status: `Todo`
- Owner: Product / Execution Agent
- Source: `PRODUCT.md`, `BMS网站求职展示优化建议.md`
- Goal: convert portfolio interest into real contact or interview opportunities.
- Acceptance Criteria:
  - `Download CV` or `View CV` points to a real asset or clearly valid route.
  - At least two contact/source channels are present, such as Email, LinkedIn, GitHub, or portfolio source.
  - Contact path is easy to find on desktop and mobile.
  - No complex contact form is introduced.
- Risks:
  - Requires user-provided personal/contact assets; placeholders should not ship as final.
  - Public personal information may need privacy review.
- Dependencies:
  - Requires user input for actual CV/contact links.

### P3-003 Share and Export Path

- Status: `Todo`
- Owner: Product / Execution Agent
- Source: `BMS网站求职展示优化建议.md`
- Goal: let a node, case, or graph state be shared independently for interviews or client conversations.
- Acceptance Criteria:
  - Current node or case link can be copied.
  - JSON export includes a version number.
  - Future export paths for PDF / SVG / Mermaid are documented but not overbuilt.
- Risks:
  - Stable deep links require clear routing and graph state ownership.
  - Export scope can expand quickly into a document-generation project.
- Dependencies:
  - Should follow `P2-007`.

## Release Readiness

### REL-001 GitHub Upload And Archive Setup

- Status: `Blocked`
- Owner: Release / GitHub Archive Agent
- Source: User request and delegation on 2026-07-10
- Goal: after QA and Review acceptance, upload completed work to GitHub, record release evidence, and archive completed Codex role threads.
- Acceptance Criteria:
  - Release Agent records local release checks: `git rev-parse --is-inside-work-tree`, `git status --short`, `git remote -v`, GitHub authentication availability, and `npm.cmd run build`.
  - If any blocking condition remains, no commit, push, repository creation, or thread archive is attempted.
  - If unblocked, only intended project files are staged and committed.
  - GitHub upload evidence includes commit hash, branch, remote URL, push time, and release summary.
  - Thread archive evidence names the archived role threads and confirms they had no active `Todo`, `In Progress`, `Review Needed`, `QA Passed`, or `Blocked` work.
- Current release candidate:
  - `P1-001 Portfolio Summary First Impression` is `Accepted`.
  - `P1-002 Engineering Case Studies` is `Accepted`.
  - `P1-003 Node Engineering Evidence` is `Accepted`.
  - `P2-001 Interaction Feedback` is `Accepted`.
  - No explicit release batch is marked `Release Ready`.
- Blocking Conditions:
  - Project is not a git repository; `git rev-parse --is-inside-work-tree` fails.
  - No GitHub remote can be verified because `git remote -v` cannot run outside a git repository.
  - GitHub CLI `gh` is not installed or not available on `PATH`.
  - GitHub authentication is not verified.
  - Git status cannot provide an unrecorded-change baseline until git is initialized or restored.
  - User has not confirmed whether to initialize git in this folder or restore an existing repository.
  - User has not provided the target GitHub repository URL / remote name.
  - User has not confirmed the accepted scope or release batch that should be uploaded.
  - User has not confirmed which completed Codex role threads should be archived after upload evidence is recorded.
- Risks:
  - Initializing a new repository in the wrong folder could capture generated artifacts or unrelated local files.
  - Uploading before Review acceptance could publish work that is still only QA-passed or in progress.
  - Archiving too early could hide active or blocked agent work.
- Dependencies:
  - Requires user confirmation of git setup, GitHub destination, authenticated push method, release batch, and archive thread list.
  - Requires Review acceptance for any product items included in the release batch.
- Release action status:
  - Build for release: `Not run in this pass`; waiting for user confirmation of git setup, GitHub repo URL, and authentication method.
  - Commit hash: `N/A - blocked before commit`.
  - Remote URL: `N/A - no git repository / remote`.
  - Push time: `N/A - push not attempted`.
  - Archive status: `Not attempted`; completed threads may only be archived after a confirmed GitHub upload.
- Required user confirmation:
  - Confirm whether to initialize git in this folder or restore an existing repository.
  - Provide the GitHub repository URL / remote name.
  - Provide or confirm an authenticated push method, such as GitHub CLI after installation or another git credential flow.
  - Confirm which accepted scope or release batch should be marked `Release Ready`.
  - Confirm which completed Codex role threads should be archived after upload evidence is recorded.

## Automation Contract

The recurring automation should run this division of labor every 3 hours:

1. Inspect BMS-related threads.
2. If `BACKLOG.md` is missing, malformed, or unclear, ask Product / Backlog Agent to repair structure, scope, priorities, dependencies, and risks.
3. If there are `Review Needed` items, ask QA Agent to verify them and mark `QA Passed`, `Todo`, or `Blocked`.
4. If there are `QA Passed` items, ask Review Agent to perform professional/domain acceptance and mark `Accepted` or return to `Todo`.
5. If there are accepted items ready to ship and `REL-001` is not blocked, ask Release / GitHub Archive Agent to build, commit, push to GitHub, record release evidence, and archive completed threads.
6. If `REL-001` is blocked, do not repeatedly ask Release Agent to upload; report the missing git/GitHub setup in the scheduler summary.
7. If there are no QA/Review/Release items waiting and Execution Agent is idle, ask Execution Agent to read `BACKLOG.md`, pick the next actionable `Todo` item, implement it, verify it, and mark it `Review Needed`.
8. If Product / Backlog Agent is idle and backlog needs prioritization or splitting, ask it to maintain backlog quality.
9. Do not ask Product / Backlog, QA, Review, or Release agents to implement feature code.
10. Do not ask Execution Agent to create broad new review scope.
11. If any thread is actively running, do not interrupt it; leave it to finish the current turn.

## Review Log

### 2026-07-10 QA Agent Pass - P2-002

- Verified `P2-002 Mobile Portfolio Overview`.
- Ran `npm.cmd run build`: passed, with the known large chunk warning remaining under `P2-005` / `P2-006`.
- Ran `node C:/Users/Figo/.agents/skills/impeccable/scripts/detect.mjs --json src`: returned `[]`.
- Started local Vite on `http://127.0.0.1:5177/` for browser verification.
- Playwright checked mobile `390x844` and `375x667`, desktop `1440x1000`, document-level horizontal overflow, hero text/button overflow, target roles, core strengths, primary CTAs, secondary tool-action styling, and console/page errors.
- Captured QA screenshots:
  - `artifacts/qa-p2-002-mobile-390-viewport-20260710.png`
  - `artifacts/qa-p2-002-mobile-375-viewport-20260710.png`
  - `artifacts/qa-p2-002-mobile-390-full-20260710.png`
  - `artifacts/qa-p2-002-mobile-375-full-20260710.png`
  - `artifacts/qa-p2-002-desktop-viewport-20260710.png`
- Marked `P2-002 Mobile Portfolio Overview` as `QA Passed`.
- Did not process `REL-001`; it remains blocked by git/GitHub/release confirmation prerequisites.

### 2026-07-10 Product / Backlog Release Flow Maintenance

- Preserved the five-stage Product / Execution / QA / Review / Release workflow.
- Kept GitHub upload and Codex thread archive process in `Release and Archive Workflow`.
- Consolidated `REL-001 GitHub Upload And Archive Setup` into a single authoritative `Release Readiness` item.
- Clarified `REL-001` blocking conditions, required user confirmations, risks, dependencies, and release action status.
- Updated `P2-001 Interaction Feedback` dependency wording to match its accepted status.
- Did not implement product code, run QA, perform Review acceptance, upload to GitHub, or archive threads.

### 2026-07-10 QA Agent Pass

- Verified `P2-001 Interaction Feedback`.
- Ran `npm.cmd run build`: passed.
- Started local Vite on `http://127.0.0.1:5176/` for browser verification.
- Playwright checked Save, Export JSON, Add device, Reset confirmation dismiss/accept, no-results recovery copy, selected-node highlight, inspector selection, mobile viewport, and console/page errors.
- Captured QA screenshots:
  - `artifacts/qa-p2-001-desktop-20260710.png`
  - `artifacts/qa-p2-001-mobile-20260710.png`
  - `artifacts/qa-p2-001-mobile-empty-20260710.png`
- Marked `P2-001 Interaction Feedback` as `QA Passed`.

### 2026-07-10 Review Agent Five-Stage Pass

- Read latest `BACKLOG.md` after Product / Execution / QA / Review / Release workflow update.
- Confirmed Review Agent acceptance must only happen after QA marks an item `QA Passed`.
- Reviewed `P2-001 Interaction Feedback` only because it was already marked `QA Passed`.
- Ran `npm.cmd run build`: passed, with the known large chunk warning remaining under `P2-005` / `P2-006`.
- Ran `node C:/Users/Figo/.agents/skills/impeccable/scripts/detect.mjs --json src`: returned `[]`.
- Accepted `P2-001 Interaction Feedback`.
- Did not review or accept `P2-002 Mobile Portfolio Overview` because it is still `In Progress` and has not passed QA.

### 2026-07-10 Product / Backlog Pass

- Rebuilt `BACKLOG.md` structure around Product, Execution, QA, and Review responsibilities.
- Preserved accepted P1 items and `P2-001` as `Review Needed`.
- Split broad mobile, performance, and architecture recommendations into smaller executable items.
- Added explicit risks and dependencies to every active/later backlog item.
- Added scope decisions for do-now, do-later, and avoid categories.
- Did not implement product code or perform final acceptance review.

### 2026-07-10 Review Agent Pass

- Reviewed `P1-001`, `P1-002`, and `P1-003`.
- Ran `npm.cmd run build`: passed.
- Ran `node C:/Users/Figo/.agents/skills/impeccable/scripts/detect.mjs --json src`: returned `[]`.
- Started local Vite on `http://127.0.0.1:5175/` for browser verification.
- Captured review screenshots:
  - `artifacts/review-desktop-20260710.png`
  - `artifacts/review-mobile-20260710.png`
- Accepted:
  - `P1-001 Portfolio Summary First Impression`
  - `P1-002 Engineering Case Studies`
  - `P1-003 Node Engineering Evidence`
