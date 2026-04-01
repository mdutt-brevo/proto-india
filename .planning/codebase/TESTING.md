# Testing Patterns

**Analysis Date:** 2026-04-01

## Test Framework

**Status:** No testing framework currently configured or in use.

**Run Commands:**
- Testing infrastructure does not exist in `package.json`
- No test scripts defined (npm run test not available)
- ESLint only linting tool configured (`npm run lint`)

## Test File Organization

**Current State:** No test files exist in the codebase.

**Recommended Structure (when implemented):**
- Co-located: Test files placed next to source files
- Naming: `ComponentName.test.jsx` or `ComponentName.spec.jsx`
- Example layout:
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Button.test.jsx
│   │   ├── SectionHeading.jsx
│   │   └── SectionHeading.test.jsx
├── hooks/
│   ├── useInView.js
│   └── useInView.test.js
├── pages/
│   ├── HomePage.jsx
│   └── HomePage.test.jsx
```

## Test Types Needed (Not Yet Implemented)

### Unit Tests

**Scope:** Individual components and hooks

**Examples to test:**

1. **`useInView` hook** (`src/hooks/useInView.js`):
   - Verify IntersectionObserver is created with correct options
   - Verify `setIsInView(true)` fires when element enters viewport
   - Verify observer only fires once (unobserves after first intersection)
   - Verify cleanup disconnects observer on unmount
   - Test with custom `options` parameter merging

2. **`useDarkMode` hook** (`src/hooks/useDarkMode.jsx`):
   - Verify localStorage preference is read on mount
   - Verify system preference fallback works
   - Verify toggle() switches dark class on `<html>`
   - Verify localStorage persists preference across sessions
   - Verify error thrown if used outside DarkModeProvider

3. **Button component** (`src/components/ui/Button.jsx`):
   - Verify correct variant class applied (primary, accent, outline)
   - Verify renders as `<button>` when no href
   - Verify renders as `<Link>` for internal routes
   - Verify renders as `<a>` for external URLs with `target="_blank"`
   - Verify arrow icon renders when `arrow={true}`
   - Verify `id` prop applied for QA tracking

4. **SectionHeading component** (`src/components/ui/SectionHeading.jsx`):
   - Verify animation state changes based on `isInView`
   - Verify `center` prop controls text alignment
   - Verify subtitle renders conditionally
   - Verify custom className merged correctly

### Integration Tests

**Scope:** Component interactions, data flow, routing

**Examples to test:**

1. **Navbar navigation**:
   - Mobile menu toggles on button click
   - Menu closes when route changes
   - Scroll state affects navbar styling (transparent → solid)
   - Active link highlighted correctly based on current route

2. **Form submissions**:
   - `ContactPage.jsx` form validates all required fields
   - Error state when field is empty
   - Alert message on successful submit
   - TODO: Form data sent to backend (not yet implemented)

3. **Dark mode provider**:
   - DarkModeProvider wraps App correctly
   - useDarkMode() accessible in child components
   - Toggle updates all child elements
   - Theme persists across navigation

4. **Lazy-loaded pages**:
   - Pages render inside Suspense boundaries
   - Loading fallback shown while lazy component loads
   - Page content renders after load completes
   - Scroll resets on route change

## Mock Strategy (When Testing Implemented)

**What to Mock:**

1. **IntersectionObserver** (required for useInView):
   ```javascript
   // Mock pattern
   const mockObserver = {
     observe: jest.fn(),
     unobserve: jest.fn(),
     disconnect: jest.fn(),
   };
   global.IntersectionObserver = jest.fn(() => mockObserver);
   ```

2. **External libraries**:
   - `react-router-dom`: Use `<MemoryRouter>` for testing routes
   - `lucide-react`: Icons can be mocked or rendered normally in tests
   - Three.js components: Mock Canvas and hooks from `@react-three/fiber`

3. **localStorage**:
   ```javascript
   // Mock pattern
   const localStorageMock = {
     getItem: jest.fn(),
     setItem: jest.fn(),
     removeItem: jest.fn(),
   };
   global.localStorage = localStorageMock;
   ```

**What NOT to Mock:**

- React hooks (useState, useEffect, useContext) — test the behavior they produce
- Component render logic — test actual DOM output
- Internal component state transitions
- Custom hooks' logic (mock only external dependencies)

## Form Testing Pattern (Example for ContactPage, QuotePage)

**Current state:** Forms use `alert()` for success feedback. Integration tests should verify:

```javascript
// Test structure (when RTL tests are added)
describe("ContactForm", () => {
  test("submits form and shows alert on success", async () => {
    render(<ContactPage />);
    
    const nameInput = screen.getByRole("textbox", { name: /your name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const submitButton = screen.getByRole("button", { name: /send message/i });
    
    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "john@example.com");
    await userEvent.click(submitButton);
    
    expect(window.alert).toHaveBeenCalledWith("Thank you!...");
  });

  test("requires all fields before submit", async () => {
    render(<ContactPage />);
    const submitButton = screen.getByRole("button", { name: /send message/i });
    
    await userEvent.click(submitButton);
    
    // HTML5 validation should prevent submission
    // Verify form data not cleared (form not submitted)
  });
});
```

## Testing Animation States

**Pattern for `useInView` animations:**

```javascript
// Test that animation class applies based on isInView state
describe("Hero", () => {
  test("stats animate in sequence when scrolled into view", async () => {
    // Mock useInView to return [ref, true]
    jest.mock("../../hooks/useInView", () => ({
      useInView: jest.fn(() => [{ current: null }, true]),
    }));
    
    render(<Hero />);
    const stats = screen.getAllByRole("text"); // or use data-testid
    
    // Verify each stat has animate-stamp-in with staggered delay
    stats.forEach((stat, i) => {
      expect(stat).toHaveStyle(`animation-delay: ${i * 0.12}s`);
    });
  });
});
```

## Coverage Gaps (Critical Gaps to Address)

**High Priority:**

1. **useInView hook** — Core animation trigger, zero test coverage
   - Intersection logic is critical to visible animations
   - Easy to test with mocked IntersectionObserver

2. **Form validation** — ContactPage and QuotePage have no validation tests
   - HTML5 validation exists but not verified
   - TODO comments indicate incomplete backend integration

3. **Dark mode toggle** — useDarkMode has side effects on DOM
   - localStorage persistence not tested
   - System preference fallback not tested
   - Provider error handling not tested

4. **Routing and navigation** — No route-based tests
   - Link components not tested
   - Page lazy-loading not tested
   - Mobile menu closing on nav not tested

**Medium Priority:**

5. **Component rendering** — Basic render tests for all components
6. **API integration** (when backend added) — ContactPage and QuotePage forms
7. **Three.js scenes** — HeroScene and SectionScene (complex; consider E2E for visual regression)

## Recommended Testing Setup (Not Yet Implemented)

**Framework suggestion:** Vitest + React Testing Library

**Installation (when ready):**
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Config file needed:** `vitest.config.js` with:
- React JSX preset
- jsdom environment for DOM APIs
- Globals for describe/test/expect

**Example setup:**
```javascript
// vitest.config.js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
  },
});
```

**Add to package.json scripts:**
```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest --coverage"
```

## Testing Three.js Components

**Challenge:** HeroScene and SectionScene use Canvas and WebGL rendering.

**Approach for unit tests:**
- Mock `@react-three/fiber` Canvas component
- Test props passed to Canvas (camera, gl, etc.)
- Test child components receive correct props

**Approach for visual regression:**
- Consider E2E testing (Playwright) with screenshot comparison
- Not recommended for unit test suite due to rendering complexity

**Example mock:**
```javascript
jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children, ...props }) => (
    <div data-testid="canvas" {...props}>{children}</div>
  ),
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({ camera: {} })),
}));
```

## Known Gaps to Address

1. **No error boundaries** — White screen crashes not caught
2. **Form backend integration TODO** — ContactPage.jsx and QuotePage.jsx have TODO comments
3. **No logging/monitoring** — Errors in 3D scenes not reported
4. **Lazy-loaded component errors** — Suspense fallbacks exist but no error fallbacks
5. **No async form state** — Forms show alert but don't track loading/success state

---

*Testing analysis: 2026-04-01*
