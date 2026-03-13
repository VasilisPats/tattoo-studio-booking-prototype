# GitHub Issues Guide — Artisan Studio Showcase

> **Purpose**: This document defines the rules every AI agent (and human contributor) must
> follow when creating, updating, or closing GitHub Issues and Milestones on the
> `VasilisPats/artisan-studio-showcase` repository. Feed this file to the agent at the
> start of every new chat session to keep work organized and milestones on track.

---

## 1. Repository Reference

| Key | Value |
|-----|-------|
| **Owner** | `VasilisPats` |
| **Repo** | `artisan-studio-showcase` |
| **Default branch** | `main` |
| **Tech stack** | Vite · React · TypeScript · Tailwind CSS · shadcn-ui |

---

## 2. Labels

Use the labels below. If a label does not yet exist, create it before assigning it.

### Type labels (required — pick one)

| Label | Color | Description |
|-------|-------|-------------|
| `enhancement` | `#A2EEEF` | New feature or request *(default)* |
| `bug` | `#D73A4A` | Something isn't working *(default)* |
| `documentation` | `#0075CA` | Improvements or additions to documentation *(default)* |
| `design` | `#C5DEF5` | Visual / UX change with no logic impact |
| `chore` | `#E4E669` | Maintenance, CI, configs, dependencies |
| `refactor` | `#FBCA04` | Code cleanup without logic change |

### Priority labels (required — pick one)

| Label | Color | Description |
|-------|-------|-------------|
| `urgent` | `#B60205` | Blocks launch or breaks production |
| `high priority` | `#D93F0B` | Must be done in the current milestone |
| `medium priority` | `#FBCA04` | Should be done soon, not blocking |
| `low priority` | `#0E8A16` | Nice to have |

### Area labels (optional — pick all that apply)

| Label | Color | Description |
|-------|-------|-------------|
| `hero` | `#BFD4F2` | Hero section |
| `nav` | `#BFD4F2` | Navigation / header |
| `portfolio` | `#BFD4F2` | Portfolio / gallery section |
| `booking` | `#BFD4F2` | Book-your-session flow |
| `process` | `#BFD4F2` | Process section |
| `i18n` | `#BFD4F2` | Internationalization (EL / EN) |
| `seo` | `#BFD4F2` | SEO and meta tags |
| `performance` | `#BFD4F2` | Performance optimization |
| `accessibility` | `#BFD4F2` | Accessibility improvements |
| `infra` | `#BFD4F2` | Build, deploy, CI/CD |

### Status labels (managed automatically by agents)

| Label | Color | Description |
|-------|-------|-------------|
| `ready` | `#0E8A16` | Fully specified, ready to work on |
| `in-progress` | `#FBCA04` | An agent or dev is actively working on it |
| `blocked` | `#D73A4A` | Waiting on external input or dependency |
| `review` | `#1D76DB` | Implementation done, needs human review |

### Default GitHub labels (kept for general use)

| Label | Color | Description |
|-------|-------|-------------|
| `duplicate` | `#CFD3D7` | This issue or pull request already exists |
| `good first issue` | `#7057FF` | Good for newcomers |
| `help wanted` | `#008672` | Extra attention is needed |
| `invalid` | `#E4E669` | This doesn't seem right |
| `question` | `#D876E3` | Further information is requested |
| `wontfix` | `#FFFFFF` | This will not be worked on |

---

## 3. Issue Templates

### 3.1 Feature / Enhancement

```markdown
## Description
[What the feature does and why it matters]

## Acceptance Criteria
- [ ] Criterion 1 (e.g., Page loads without errors)
- [ ] Criterion 2 (e.g., User can click X)

## Design Notes
[Link mockup, screenshot, or describe the expected visual result]

## Technical Notes
[Optional: Brief note on implementation strategy, e.g., "Using generic-ui library"]
```

### 3.2 Bug Report

```markdown
## Bug Description
[What is happening vs. what should happen]

## Steps to Reproduce
1. …
2. …

## Expected Result
[What should happen instead]

## Screenshots / Logs
[Attach any evidence]

## Environment
- Browser:
- OS:
- Viewport / Device:
```

### 3.3 Chore / Maintenance

```markdown
## Description
[What maintenance work is needed and why]

## Tasks
- [ ] Task 1
- [ ] Task 2

## Impact
[What parts of the codebase are affected]
```

---

## 4. Issue Lifecycle Rules

### 4.1 Creating an issue
1. **Title**: Use a short, imperative sentence → `Add language toggle to navbar`
2. **Labels**: Assign exactly **one type label** and **one priority label**. Add area labels if applicable.
3. **Milestone**: Always assign the issue to an active milestone (see §5).
4. **Body**: Use the matching template from §3.
5. **Assignees**: Leave blank unless the agent is starting work immediately.

### 4.2 Execution (During Work)
1. Add label `in-progress` and remove `ready`.
2. Assign yourself (or note the agent session in a comment).
3. Post a short comment: _"Starting work — plan: [1-2 sentence summary]."_
4. **Branching**: Create a specific branch for each issue.
   - Naming: `feat/<issue-ID>-short-description` or `fix/<issue-ID>-short-description`
5. **Commits**: All commit messages must reference the issue ID.
   - Format: `[#ISSUE_ID] Commit message` (e.g., `[#12] Add responsive styles to header`)
6. Post a comment whenever a significant sub-task is completed.
7. Reference relevant commits or PRs using `#<number>` or SHA.

### 4.3 Completion (End of Task)
1. **Verify**: Ensure all Acceptance Criteria from the issue are met.
2. Remove `in-progress`, add `review`.
3. Post a summary comment listing what was done and any follow-up items.
4. If a PR exists, reference it → `Closes #<issue>` in the PR body.

### 4.4 Closing
1. Close the issue only after human review confirms acceptance.
   - Tool: `issue_write` (method: `update`, state: `closed`)
2. Add a final comment summarizing the resolution (recommended for complex tasks).

---

## 5. Milestones

Milestones group issues into deliverable phases. Every issue **must** belong to a milestone.

### How to manage milestones
1. **Create** a new milestone when a new phase of work is planned.
2. **Title format**: `v<X.Y> — <Short Description>` (e.g. `v1.0 — MVP Launch`).
3. **Due date**: Always set a target date.
4. **Description**: One paragraph explaining the goal and scope.

### Milestone lifecycle
| Action | When |
|--------|------|
| Create | At the start of a new planned phase |
| Update description | When scope changes |
| Close | When all issues inside are closed |

### Suggested initial milestones

| Milestone | Description |
|-----------|-------------|
| `v1.0 — MVP Launch` | Core website live: hero, nav, portfolio gallery, process, booking form, i18n (EL/EN) |
| `v1.1 — Polish & Performance` | Animations, SEO fine-tuning, Lighthouse score improvements, a11y audit |
| `v1.2 — Content & Marketing` | Final real images, copy refinements, analytics integration |

> **Note to agents**: Before creating issues, check if these milestones exist.
> If not, create them using the GitHub API.

---

## 6. Agent Instructions — Start of Every Chat

When you (the AI Agent) read this file, you must:

1. **Acknowledge** that you will track your work using GitHub Issues.
2. **Ask** the user for the specific Issue ID if you cannot find one, or ask for permission to create it.

### Agent Checklist

Run this checklist at the beginning of every agent session:

```
1. ✅ Read this file (GITHUB_ISSUES_GUIDE.md).
2. ✅ Verify GitHub MCP connection (search for the repo).
3. ✅ List open milestones — create any missing ones from §5.
4. ✅ List open issues — understand current state before creating new ones.
5. ✅ When the user requests work:
   a. Check if an issue already exists for it.
   b. If not, ask for permission to create one following §3 and §4.
   c. Assign it to the correct milestone.
   d. Update status labels as you work.
   e. Post progress comments with [#ISSUE_ID] references.
   f. On completion, move to `review` and summarize.
```

---

## 7. Quick Reference — MCP Tool Mapping

| Action | MCP Tool |
|--------|----------|
| Create issue | `issue_write` (method: `create`) |
| Update issue | `issue_write` (method: `update`) |
| Read issue details | `issue_read` (method: `get`) |
| List issues | `list_issues` |
| Search issues | `search_issues` |
| Add comment | `add_issue_comment` |
| Create PR | `create_pull_request` |
| Create branch | `create_branch` |

---

> **Last updated**: 2026-03-07
> **Maintained by**: VasilisPats + AI agents
