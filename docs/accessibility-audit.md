# Accessibility Audit — GCS Interactive Prototype

**Week 6 Workshop — Task 4**
**File audited:** `client/index.html`
**Standards:** WCAG 2.1 AA · LEPSI (Legal/Ethical)
**Three-part audit:** Structural (W3C) · Colour Contrast (WebAIM) · Keyboard Navigation

---

## Part 1 — Structural Audit (W3C)

### Method
HTML structure analysed manually against W3C accessibility rules (equivalent to Nu HTML Checker).

### Issues Found & Fixed

| Issue | Location | Fix Applied |
|---|---|---|
| `<canvas>` missing `role` and `aria-label` | `#robot-map` | Added `role="img"` + `aria-label` describing robot position |
| `<canvas>` had no fallback text for screen readers | `#robot-map` | Added descriptive fallback text inside `<canvas>` element |
| Canvas was potentially reachable by Tab key | `#robot-map` | Added `tabindex="-1"` to exclude from tab order |
| `aria-label` on canvas was static | `#robot-map` | Updated dynamically via JS on every `renderMap()` call |

### What Was Already Correct

- `<title>RMS Ground Control Station</title>` — present ✓
- All `<input>` elements have matching `<label for="">` tags ✓
- `<button>` elements used for all interactive controls (no div-as-button) ✓
- `role="alertdialog"` on E-STOP overlay — correct ARIA role ✓
- `aria-live="assertive"` on E-STOP overlay — screen readers announce immediately ✓
- `aria-live="polite"` on status bar command area ✓
- `aria-live="polite"` on login error, move error, banners ✓
- `aria-label` on E-STOP button describing hold behaviour ✓
- `aria-valuenow/min/max` on battery progress bar ✓

---

## Part 2 — Colour Contrast Audit (WCAG AA: 4.5:1 minimum)

### Method
WCAG 2.1 relative luminance formula applied to all custom colour pairs. Bootstrap 5 dark-mode utility colours verified against card body background `#212529`.

### Failures Found (Before Fix)

| Colour Pair | Ratio | Result |
|---|---|---|
| `#666666` (sb-label) on `#0a0a0f` (status bar) | 3.44:1 | **FAIL** |
| `#666666` (sb-label) on `#13131f` (sb-item) | 3.21:1 | **FAIL** |
| `#666666` (map-legend) on `#212529` (card) | 2.69:1 | **FAIL** |
| `#666666` (cmd-stage) on `#1e1e2e` (stage bg) | 2.86:1 | **FAIL** |
| `#198754` (text-success) on `#212529` | 3.40:1 | **FAIL** |
| `#6c757d` (text-muted) on `#212529` | 3.29:1 | **FAIL** |

### Fixes Applied & Verified

| Colour Pair | Ratio | Result |
|---|---|---|
| `#888888` (sb-label) on `#13131f` | **5.19:1** | PASS ✓ |
| `#888888` (sb-label) on `#0a0a0f` | **5.57:1** | PASS ✓ |
| `#999999` (map-legend) on `#212529` | **5.41:1** | PASS ✓ |
| `#888888` (cmd-stage) on `#1e1e2e` | **4.63:1** | PASS ✓ |
| `#75b798` (text-success-emphasis) on `#212529` | **6.60:1** | PASS ✓ |
| `#adb5bd` (text-muted-accessible) on `#212529` | **7.43:1** | PASS ✓ |
| `#4dabf7` (focus ring) on `#0a0a0f` | **7.98:1** | PASS ✓ |

### Colours That Already Passed

| Colour Pair | Ratio | Result |
|---|---|---|
| `#ffffff` on `#13131f` (sb-val) | 18.41:1 | PASS ✓ |
| `#dee2e6` on `#212529` (form labels) | 11.85:1 | PASS ✓ |
| `#ffffff` on `#0d6efd` (primary button) | 4.50:1 | PASS ✓ |
| `#ffffff` on `#dc3545` (danger button) | 4.53:1 | PASS ✓ |
| `#ffc107` on `#212529` (warning text) | 9.46:1 | PASS ✓ |

---

## Part 3 — Manual Keyboard Navigation Audit

### Method
Tested Tab-only navigation and Enter-key activation without mouse. Checked focus ring visibility.

### Test Results

| Test | Result |
|---|---|
| Tab from username → password → role select → Login button | PASS ✓ |
| Enter key on Login button submits form | PASS ✓ |
| Tab to Status Bar → E-STOP button reachable | PASS ✓ |
| Tab through nav → status bar items → Move X input → Move Y input → MOVE button | PASS ✓ |
| Enter key on MOVE button triggers move action | PASS ✓ |
| Canvas excluded from tab order (`tabindex="-1"`) | PASS ✓ |
| Focus ring visible on all interactive elements | PASS ✓ (3px `#4dabf7` outline + glow shadow) |
| E-STOP activates on Space/Enter hold (keyboard long-press) | PASS ✓ (keydown/keyup listeners) |
| Tab skips disabled buttons when disconnected | PASS ✓ (disabled attribute applied) |

### Focus Style Applied

```css
:focus-visible {
  outline: 3px solid #4dabf7 !important;  /* 7.98:1 contrast on dark bg */
  outline-offset: 3px !important;
  box-shadow: 0 0 0 4px rgba(77,171,247,0.25) !important;
}
/* Fallback for browsers not supporting :focus-visible */
button:focus, input:focus, select:focus, a:focus {
  outline: 3px solid #4dabf7;
  outline-offset: 3px;
}
```

---

## Summary

| Part | Issues Found | Issues Fixed | Status |
|---|---|---|---|
| W3C Structural | 4 | 4 | PASS ✓ |
| WCAG AA Contrast | 6 | 6 | PASS ✓ |
| Keyboard Navigation | 0 | — | PASS ✓ |

**Overall result: WCAG 2.1 AA compliant** for all audited criteria.

---

## LEPSI Relevance

This audit directly addresses the **L (Legal)** component of LEPSI:
- WCAG 2.1 compliance is a legal requirement under the UK Equality Act 2010 and the
  EU Web Accessibility Directive for web-based systems.
- A Ground Control Station used in safety-critical robotics must be operable by users
  with visual or motor impairments — non-compliance creates both legal liability and
  safety risk.
