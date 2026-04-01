---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-01
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | grep-based verification (no Vitest for Phase 1 — infrastructure only) |
| **Config file** | none — Phase 2 will install Vitest for animation testing |
| **Quick run command** | `vite build 2>&1 | head -20` |
| **Full suite command** | `vite build && grep -rn "three\|@react-three" src/ && echo "FAIL: Three.js refs found" || echo "PASS"` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `vite build 2>&1 | head -20`
- **After every plan wave:** Run full suite command
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | DEP-01 | grep | `grep "GearLoader" src/App.jsx \| grep -v "3D\|Three"` | N/A | pending |
| 01-01-02 | 01 | 1 | DEP-04 | grep | `grep -rn "SectionScene\|HeroScene" src/components/home/ \| wc -l` (expect 0) | N/A | pending |
| 01-01-03 | 01 | 1 | DEP-02, DEP-03, DEP-05 | build | `vite build 2>&1 \| grep -v "three\|@react-three" && echo PASS` | N/A | pending |
| 01-02-01 | 02 | 2 | THM-01 | grep | `grep 'class="dark"' index.html && ! grep -q "DarkModeToggle" src/components/layout/Navbar.jsx` | N/A | pending |
| 01-02-02 | 02 | 2 | THM-02, THM-03, THM-04 | grep | `grep "Inter" tailwind.config.js && ! grep -q "1a56db\|Plus Jakarta\|DM Sans" tailwind.config.js` | N/A | pending |
| 01-03-01 | 03 | 2 | INF-01 | grep | `grep "LazyMotion" src/App.jsx && grep "domAnimation" src/App.jsx` | N/A | pending |
| 01-03-02 | 03 | 2 | INF-02 | node | `node --input-type=module -e "import{SCENE_DURATIONS}from'./src/lib/motionTokens.js';const s=SCENE_DURATIONS.reduce((a,b)=>a+b,0);console.log(s>=10&&s<=14?'PASS':'FAIL')"` | N/A | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- Existing grep-based infrastructure covers all Phase 1 requirements
- Vitest installation deferred to Phase 2 (animation testing requires it; infrastructure removal does not)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No FOUC (light mode flash) | THM-01 | Race condition timing cannot be reliably grepped | Load page in incognito browser, observe no white flash before dark background |
| Bundle size reduction ~490KB | DEP-05 | Requires comparing before/after build sizes | Run `vite build` before and after, compare dist sizes |

---

## Validation Sign-Off

- [x] All tasks have automated verify or manual fallback
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none — grep-only approach)
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
