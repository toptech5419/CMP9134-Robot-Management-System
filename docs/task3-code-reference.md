# Task 3 — AI Code Snippets Reference

Code patterns provided by AI heuristic evaluation (Iteration 2). All snippets reviewed,
understood, and adapted before use in `client/index.html`.

## Snippet 1 — Global command status aria-live region

```html
<!-- add inside persistent status bar -->
<div id="global-cmd-status" aria-live="polite" aria-atomic="true" class="sb-item" style="min-width:220px;">
  <span class="sb-label">Last Cmd</span>
  <span id="global-cmd-text" class="sb-val">No commands issued</span>
</div>
```

**Modification made:** Integrated into the custom `.status-bar` layout. Added `aria-atomic="true"` so screen readers announce the full status text on each update, not just the changed portion.

## Snippet 2 — E-STOP long-press (1.5s hold)

```javascript
const estop = document.querySelector('.status-bar .s-estop');
let estopTimer = null;
const LONGPRESS_MS = 1500;

function triggerEstop() {
  document.body.insertAdjacentHTML('afterbegin',
    '<div id="estop-banner" role="alert" aria-live="assertive" ...>EMERGENCY STOP TRIGGERED</div>');
  // TODO: call API / websocket to send estop
}

estop.addEventListener('mousedown', () => {
  estopTimer = setTimeout(triggerEstop, LONGPRESS_MS);
});
estop.addEventListener('touchstart', () => {
  estopTimer = setTimeout(triggerEstop, LONGPRESS_MS);
});
['mouseup','mouseleave','touchend','touchcancel'].forEach(ev =>
  estop.addEventListener(ev, () => { clearTimeout(estopTimer); estopTimer = null; }));
```

**Modifications made:**
- Used `#estop-btn` selector (Bootstrap button ID) instead of class selector
- Added keyboard support (`keydown`/`keyup` for Space and Enter) for accessibility
- Added CSS `@keyframes estop-fill` animation to give visual progress feedback during hold
- Added `aria-live="assertive"` on E-STOP overlay (not just banner) so screen readers announce immediately
- Added recovery procedure steps to the overlay
- Added `resetEstop()` function to restore system after E-STOP

## Snippet 3 — Global command feed (aria-live list)

```html
<ul id="cmd-feed" class="s-item" aria-live="polite" style="list-style:none;padding:0;margin:0;max-width:360px;">
  <!-- entries appended by JS: <li data-cmdid="123">[12:23:10] Move to (12,9) — Accepted</li> -->
</ul>
```

**Modifications made:**
- Implemented as a single `<span id="global-cmd-text">` within the status bar rather than a `<ul>` list, to save horizontal space in the status bar
- The audit log table serves as the persistent command history feed
- `aria-live="polite"` applied to the status bar item so changes are announced without interrupting the user
