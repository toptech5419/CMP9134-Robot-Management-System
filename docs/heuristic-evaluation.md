# Heuristic Evaluation — GCS Dashboard Wireframe

**Week 6 Workshop — Task 2**
**Evaluator type:** AI (GitHub Copilot / GPT-4o multimodal)
**Wireframe evaluated:** `wireframes/dashboard-wireframe.html` (7 screens)
**Frameworks applied:** Norman's 7 Principles + Shneiderman's 8 Golden Rules

---

## Prompt Used

> You are an expert UX/UI Researcher. I have uploaded a low-fidelity wireframe of a Ground Control Station dashboard used to pilot a Virtual Robot. Please conduct a Heuristic Evaluation of this interface based on Norman's 7 Principles and Shneiderman's 8 Golden Rules. Identify at least 3 usability issues and suggest specific improvements.

---

## AI Evaluation Summary

### Executive Summary

| Priority | Issue |
|---|---|
| **Critical** | Connection and command feedback not visible enough — operators may think robot is responding when it is not |
| **Major** | E-STOP placement inconsistent across screens — ambiguous behavior |
| **Major** | No axis labels or scale on grid map — poor spatial mapping |
| **Major** | Role/permission differences not immediately obvious |
| **Medium** | Cognitive load from dense panels and small type |
| **Medium** | Error recovery flows unclear (reconnect, retry policy) |

---

## Issues Identified (6 Total)

### Issue 1 — Inadequate connection & command feedback *(Critical)*
- **Problem:** Connection status and command execution state buried. MOVE can be pressed during Signal Lost. No lifecycle feedback for commands.
- **Heuristics violated:** Norman — Visibility, Feedback, Error Design; Shneiderman — Rules 3, 5, 4
- **Fix applied:** Added persistent top status bar (connection, RTT, battery, status, role). Command lifecycle added: Queued → Accepted → Executing → Complete/Failed.

### Issue 2 — E-STOP placement inconsistent *(Major / Safety-critical)*
- **Problem:** E-STOP appeared in multiple locations across screens. Behaviour on click undefined. Risk of accidental trigger or being missed.
- **Heuristics violated:** Norman — Error Design; Shneiderman — Rule 6 (reversal must be explicit)
- **Fix applied:** E-STOP moved to single fixed location in persistent status bar. Removed from right control panel. Note added pointing to status bar.

### Issue 3 — No axis labels on grid map *(Major)*
- **Problem:** Grid showed robot dot on a plain grey background. No X/Y labels, no scale, no legend. Operators can't relate coordinates to physical position.
- **Heuristics violated:** Norman — Mapping, Conceptual Model; Shneiderman — Rule 8 (reduce memory load)
- **Fix applied:** Added X-axis label (0–5–10–15–20), Y-axis vertical label, robot marker legend, and target marker (T) to show move destination.

### Issue 4 — Role affordances not immediately obvious *(Major)*
- **Problem:** Commander/Viewer differences not prominent enough. Users may not know what they can or cannot do.
- **Heuristics violated:** Norman — Visibility; Shneiderman — Rule 1 (consistency)
- **Fix applied (existing):** Screen 3 already shows RBAC side-by-side comparison. Role chip added to status bar.

### Issue 5 — Dense panels and inconsistent terminology *(Medium)*
- **Problem:** Multiple small fields, overlapping terms (MOVE, Move Robot, Move command).
- **Heuristics violated:** Shneiderman — Rule 8; Norman — Simplify task structure
- **Fix applied (partial):** Status bar consolidates key data. Terminology standardised to "Move Robot" throughout.

### Issue 6 — Error recovery flows unclear *(Medium)*
- **Problem:** Signal Lost and Reconnecting screens show messages but no operator action options or retry timeline.
- **Heuristics violated:** Norman — Error Design; Shneiderman — Rules 3, 4
- **Fix applied (existing):** Screen 4 already shows retry countdown (Attempt 2 of 3 — next in 5s) and distinguishes Signal Lost vs Reconnecting states.

---

## Refinements Applied to Wireframe

| Fix | What changed | Screen affected |
|---|---|---|
| Persistent status bar | Added above navbar: connection, RTT, battery, robot status, role, E-STOP | Screen 2 |
| E-STOP relocation | Removed from right panel, placed in status bar only | Screen 2 |
| Command lifecycle | Added Queued → Accepted → Executing → Complete stages to feedback area | Screen 2 |
| Grid axis labels | Added X-axis labels (0–20), Y-axis label, target marker (T), legend | Screen 2 |

---

## Issues Not Acted On (Rationale)

| Suggestion | Decision |
|---|---|
| Direct map click-to-move | Out of scope — robot API takes `POST /api/move` with explicit x,y coordinates |
| Absolute vs relative move toggle | Over-engineering for assessment scope — API only supports absolute coordinates |
| Path preview / collision warnings | Robot API does not return path planning data |
| Moderated user testing (5–7 participants) | Assessment brief does not require live user testing at this stage |

---

## Conclusion

The AI evaluation identified 6 issues, 3 of which (Issues 1, 2, 3) were directly actionable and have been fixed in the updated wireframe. The remaining issues were either already addressed (Issues 4, 6) or appropriately de-scoped (Issue 5 partial). The wireframe now more closely follows all 8 of Shneiderman's Golden Rules and all 7 of Norman's principles.

---

## Iteration 2 — AI Re-evaluation (HTML file shared directly)

A second AI evaluation was conducted after sharing the actual `wireframes/dashboard-wireframe.html` file. Because the AI could read specific CSS classes and HTML structure, the feedback was more precise.

### New Issues Identified

| # | Issue | Severity | Status |
|---|---|---|---|
| 1 | Command lifecycle (`cmd-lifecycle`) nested only in Move panel — not globally visible | Critical | → Implemented in Task 3 prototype |
| 2 | E-STOP single-click risk — needs long-press protection (1.5s hold) | Major/Critical | → Implemented in Task 3 prototype |
| 3 | Grid map has no robot heading arrow; no click-to-target affordance | Major | Partially addressed (axis labels done; heading arrow in Task 3) |
| 4 | No `aria-live` on dynamic regions — screen readers not informed | Medium | → Implemented in Task 3 prototype |
| 5 | Role chip tooltip missing — viewers don't know why controls are absent | Medium | → Implemented in Task 3 prototype |
| 6 | Error recovery: no explicit safe default stated ("robot will hold position") | Medium | → Addressed in signal-lost banner (Task 3) |

### Code Snippets Provided by AI (Saved for Task 3)

See `docs/task3-code-reference.md` for the 3 copy-paste ready snippets:
1. Global command status `aria-live` region
2. E-STOP long-press JS (1.5s hold detection with `mousedown`/`touchstart`)
3. Global command feed `<ul aria-live="polite">`

### Decision

All 6 new issues are implementation-level concerns (JS behaviour, ARIA attributes) — not wireframe layout issues. They are addressed in the Task 3 interactive prototype (`client/index.html`) rather than in the wireframe.
