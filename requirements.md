# RoleRedesign — Requirements

**App:** RoleRedesign — AI Workforce Impact Analyser
**Repo:** cslcs-gen/role-redesign
**CNAME:** redesign.buildjoynow.com
**Version:** v0.01
**Stack:** React + Vite + GitHub Actions + GitHub Pages + Cloudflare Worker + Claude API (claude-sonnet-4-6)

---

## 1. Access Control

### AC-01 Share Code Gate
- AC-01a: Landing page displays a share code input field
- AC-01b: On submit, frontend POSTs code to Cloudflare Worker `/api/auth`
- AC-01c: Worker validates code against `CF_SHARE_CODE` env var (never in frontend)
- AC-01d: Wrong code returns 401 with "Invalid share code" message
- AC-01e: Correct code triggers Telegram notification and returns `{ sessionId, status: "pending" }`

### AC-02 Telegram Approval Gate
- AC-02a: Worker sends Telegram message on valid share code:
  ```
  🔐 RoleRedesign access request
  Time: [ISO timestamp]
  Code used: R3d35ignt0g3ther
  Approve? Reply /approve_[sessionId] or /deny_[sessionId]
  ```
- AC-02b: App shows "Approval request sent. Please wait..." waiting screen
- AC-02c: Frontend polls `/api/status?sessionId=X` every 5 seconds
- AC-02d: Worker stores approval state in KV: key `session:[sessionId]`, value `pending|approved|denied`
- AC-02e: `/approve_[sessionId]` Telegram webhook → KV set to `approved` → poll returns 200 `{ status: "approved" }`
- AC-02f: `/deny_[sessionId]` → KV set to `denied` → user sees "Access denied" screen
- AC-02g: App unlocks within 30 seconds of `/approve` being sent
- AC-02h: Session tokens expire after 4 hours (KV TTL)

### AC-03 Admin Panel
- AC-03a: Route `/admin` — protected by `CF_ADMIN_CODE` env var
- AC-03b: Admin can update share code (stored in KV, overrides env var)
- AC-03c: Admin can update Telegram Bot Token
- AC-03d: Admin can update Telegram Chat ID
- AC-03e: Admin panel shows last 10 access requests: timestamp, status (pending/approved/denied)
- AC-03f: Changes take effect without redeployment

---

## 2. Landing Page

### LP-01
- LP-01a: Clear purpose statement: what the app does and who it is for
- LP-01b: Page loads in under 3 seconds on 4G
- LP-01c: Three pre-loaded example roles displayed as preview cards:
  - Healthcare Enforcement Officer
  - HR Manager
  - Finance Analyst
- LP-01d: Clicking an example card shows a preview of that role's output (read-only)
- LP-01e: Share code entry field is prominent and accessible (ARIA labelled)

---

## 3. Multi-Step Input Form (5 Steps)

### FORM-01 Step 1 — Organisation Context
- FORM-01a: Fields: Organisation Name (required), Sector (required, dropdown + free text), Department (required)
- FORM-01b: Validation: all fields required before proceeding

### FORM-02 Step 2 — Role Context
- FORM-02a: Fields: Role Title (required), Seniority Level (required: Junior / Mid / Senior / Lead / Director)
- FORM-02b: Validation: both fields required

### FORM-03 Step 3 — Line Manager Input
- FORM-03a: Fields: Team Structure (free text), Key Outcomes Expected (free text), Strategic Priorities (free text)
- FORM-03b: At least one field must be populated

### FORM-04 Step 4 — Task Input
- FORM-04a: "Download Excel Template" button downloads pre-built .xlsx with columns:
  - Task / Activity | Time Spent (%) | Routine or Judgment? | Current Pain Point | If AI did this, I could instead…
- FORM-04b: Upload completed .xlsx file OR paste task list as free text
- FORM-04c: Minimum 5 tasks required to proceed — validation enforced
- FORM-04d: Parsed tasks displayed in a review table before proceeding
- FORM-04e: Excel parsing handles merged cells and blank rows gracefully

### FORM-05 Step 5 — Staff Self-Reflection (optional)
- FORM-05a: For each task from Step 4, an optional free-text field: "If AI handled this task, I could instead focus on…"
- FORM-05b: Pre-populated from uploaded Excel column 5 where present
- FORM-05c: Can be skipped entirely; skipping does not degrade output quality

---

## 4. Claude Chain (4 Steps)

### CHAIN-01 Step 1 — Task Decomposition
- CHAIN-01a: Each uploaded/pasted task is decomposed into atomic work units
- CHAIN-01b: Output: structured JSON array of atomic tasks with parent task reference

### CHAIN-02 Step 2 — Displacement Scoring
- CHAIN-02a: Each atomic task scored 0–100 for AI displacement risk
- CHAIN-02b: Score accompanied by plain-English explanation (1–2 sentences)
- CHAIN-02c: Score thresholds: 0–30 Human-Only, 31–69 Augment, 70–100 Automate

### CHAIN-03 Step 3 — Classification
- CHAIN-03a: Each task classified: Automate / Augment / Human-Only
- CHAIN-03b: Classification consistent with displacement score
- CHAIN-03c: Tasks grouped by category: 6+ categories (e.g. Admin, Compliance, Analysis, Communication, Decision-Making, Relationship Management)

### CHAIN-04 Step 4 — Role Redesign Generation
- CHAIN-04a: Suggested new role title
- CHAIN-04b: Retained responsibilities (Human-Only tasks)
- CHAIN-04c: New AI-augmented responsibilities
- CHAIN-04d: Superpower narrative — what this person can now own that was not previously possible (min 150 words)
- CHAIN-04e: Suggested AI tools relevant to this role (min 3, with brief description each)
- CHAIN-04f: New Role Proposals where functions no longer fit existing role (title + brief)
- CHAIN-04g: Upskilling Priorities — ranked list, each with effort level (Low/Medium/High) and suggested learning direction
- CHAIN-04h: Full output generated in under 2 minutes for 8 tasks

---

## 5. Output Visualisations

### VIZ-01 Radar Chart
- VIZ-01a: Renders using Recharts
- VIZ-01b: Shows 6+ task categories on axes
- VIZ-01c: Plots volume/weight of tasks per category
- VIZ-01d: Responsive — renders correctly on mobile (320px+) and desktop

### VIZ-02 Bar Chart
- VIZ-02a: Renders using Recharts
- VIZ-02b: Shows Automate / Augment / Human-Only split as percentages
- VIZ-02c: Colour coded: Red (Automate), Amber (Augment), Green (Human-Only)

### VIZ-03 Function Shift Map
- VIZ-03a: Two-column layout: "Moves to AI" | "Remains Human"
- VIZ-03b: Third column: "New Functions that Emerge"
- VIZ-03c: Each entry has task name + brief note
- VIZ-03d: Mobile: collapses to stacked single column with clear labels

### VIZ-04 Redesigned Role Brief
- VIZ-04a: Suggested new role title displayed prominently
- VIZ-04b: Retained responsibilities as bulleted list
- VIZ-04c: New AI-augmented responsibilities as bulleted list
- VIZ-04d: Superpower narrative as styled prose block
- VIZ-04e: Suggested AI tools as cards (tool name + description)
- VIZ-04f: New Role Proposals as expandable cards
- VIZ-04g: Upskilling Priorities as ranked table with effort badge

---

## 6. Pre-Loaded Examples

### EX-01 Healthcare Enforcement Officer
- 8 sample tasks pre-loaded
- Produces output with 6+ categories on radar chart
- Output differs demonstrably from other two examples

### EX-02 HR Manager
- 8 sample tasks pre-loaded
- Produces output with 6+ categories on radar chart
- Output differs demonstrably from other two examples

### EX-03 Finance Analyst
- 8 sample tasks pre-loaded
- Produces output with 6+ categories on radar chart
- Output differs demonstrably from other two examples

---

## 7. GitHub Actions Deployment

### DEPLOY-01
- DEPLOY-01a: `.github/workflows/deploy.yml` triggers on push to `main`
- DEPLOY-01b: Steps: checkout → setup Node 20 → npm install → npm run build → deploy `dist/` to `gh-pages` branch
- DEPLOY-01c: Uses `peaceiris/actions-gh-pages@v3`
- DEPLOY-01d: `GITHUB_TOKEN` used for authentication (no PAT needed)
- DEPLOY-01e: `CNAME` file with `redesign.buildjoynow.com` included in `dist/`

### DEPLOY-02 Vite Config
- DEPLOY-02a: `vite.config.js` sets `base: '/'` for custom domain deployment
- DEPLOY-02b: Build output goes to `dist/`

---

## 8. Security

### SEC-01
- SEC-01a: No API keys, tokens, or secrets in any frontend code or repo
- SEC-01b: All Claude API calls proxied through Cloudflare Worker
- SEC-01c: Worker enforces CORS — only `redesign.buildjoynow.com` origin accepted in production
- SEC-01d: Rate limiting: max 10 auth attempts per IP per hour via KV counter
- SEC-01e: Rate limiting: max 5 Claude API calls per session
- SEC-01f: Input sanitisation on all free-text fields before sending to Claude
- SEC-01g: Excel upload limited to 2MB, `.xlsx` only
- SEC-01h: `.env` and any secret files in `.gitignore`

---

## 9. Non-Functional Requirements

- NFR-01: Mobile-first responsive design (320px minimum)
- NFR-02: WCAG 2.1 AA colour contrast on all text
- NFR-03: Loading states on all async operations
- NFR-04: Error boundaries on all React components
- NFR-05: Graceful degradation if Telegram is unreachable (fallback: auto-approve after 60s with log entry)
- NFR-06: All outputs exportable as PDF (print stylesheet)
