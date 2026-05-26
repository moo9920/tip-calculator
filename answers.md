
# Engineering Design & Architecture (ANSWERS.md)

## 1. How to Run

Because this project is built using native web technologies, it requires **zero software dependencies**, package installations (`npm install`), or compilation steps to execute locally.

### Local Execution Steps
1. **Clone or download** this repository to your local machine.
2. Locate the project folder containing `index.html`, `style.css`, and `script.js`.
3. **Launch the app:**
   * **The Standard Native Way:** Double-click the `index.html` file. It will instantly launch in your default web browser using the standard file protocol (`file:///`).
   * **The Live Reload Development Way:** Open the folder in **VS Code**, install the **Live Server** extension by Ritwick Dey, open `index.html`, and click the **Go Live** button in the bottom status bar to mount the app locally at `http://127.0.0.1:5500/index.html`.

### Live Production Deployment URL
The application is fully deployed and available publicly on the web at:  
👉 **`https://tip-calculator-sg7v.onrender.com/`**

---

## 2. Stack & Design Choices

### Frontend Stack Rationale
I selected a **Vanilla Stack (HTML5, CSS3, native ES6+ JavaScript)** for this single-screen utility app instead of a modern framework (like React or Vue) for three key reasons:
1. **Zero Framework Overhead:** A highly focused tool does not warrant the performance tax of heavy runtime libraries, virtual DOM diffing, or massive `node_modules` configurations. 
2. **Instant Reactivity:** Standard DOM input elements paired with direct `input` listeners natively achieve real-time synchronization with minimal memory usage, yielding a perfect 100/100 performance score on Lighthouse.
3. **Long-Term Maintainability:** Native web standards do not suffer from breaking framework dependency updates, ensuring the codebase remains functional indefinitely without maintenance.

### Key Visual & Interaction Decisions

* **Decision 1: Absolute Layout Preservation for Input Fields**
  * **Affected Area:** The data label row (`.label-row`) and error tracking spans (`.error-msg`) located immediately above the input elements.
  * **The Rationale:** In a live-updating app with no explicit "Calculate" button, inline validation errors appear and disappear dynamically as the user types. If the form fields shift downwards to accommodate an appearing error message, the target inputs slide out from beneath the user's mouse pointer or thumb mid-keystroke. To completely eliminate this jarring layout shift, error spaces are given absolute layout boundaries and transition via opacity (`opacity 0.2s ease`). The interface geometry remains completely rigid, protecting the typing flow.
* **Decision 2: Contextual Input-Mode Keypad Mapping**
  * **Affected Area:** The `inputmode` attributes on the numeric text elements (`#bill-input`, `#custom-tip-input`, `#people-input`).
  * **The Rationale:** Relying solely on standard HTML `type="number"` can introduce complex validation failures on mobile devices, allowing characters like `+`, `-`, and scientific notation `e`. It can also bring up a suboptimal keyboard layout. I explicitly mapped `inputmode="decimal"` to the bill field to force a clean financial decimal pad on iOS and Android viewports, and `inputmode="numeric"` to the headcount field to enforce a clean integer keypad—proactively preventing users from entering fractional human beings.

---

## 3. Responsive Design & Accessibility Matrix

### Viewport Adaptability (360px Mobile vs. 1440px Desktop)
* **On a 360px wide smartphone viewport:** The app collapses automatically into a single vertical column. Inputs occupy the upper viewport, and the output screen cascades immediately below it. The tip presets scale into a comfortable 2-column tapping grid for optimal thumb interactions. Numeric outputs utilize a strict CSS `word-break: break-all` fallback rule, ensuring that edge-case inputs (such as massive numbers) gracefully wrap into multiple text lines rather than breaking the container box boundaries.
* **On a 1440px desktop viewport:** The layout container expands smoothly to a capped maximum width of `920px` to maintain optimal reading contrast. The content scales side-by-side using a balanced 2-column setup via CSS Grid (`grid-template-columns: 1fr 1fr`), positioning the inputs on the left and the output panel stably on the right.

### Accessibility Implementations

* **Handled (Keyboard Navigation & Focus Tracking):** Sighted keyboard-only users can step through every single input and interactive button in sequential order natively via the `Tab` index. Active selections like the tip buttons use an explicitly styled `:focus-visible` ring tracking our primary visual theme color (`--clr-primary-light`) to maintain context.
* **Knowingly Skipped (Assertive Screen Reader Live Outputs):** While error states employ `aria-live="polite"`, I knowingly skipped adding an aggressive `aria-live="assertive"` region to the real-time calculated total strings. Because the application evaluates totals continuously on *every single keystroke*, an assertive speech synthesizer would constantly interrupt a blind user as they type a value digit-by-digit (e.g., typing a bill of `1`, then `5`, then `0` would forcefully read three separate fragmented updates aloud). Instead, totals are quietly updated and left to be inspected on-demand once data entry is complete.

---

## 4. AI Usage

* **AI Tool Utilized:** Gemini
* **Prompt Submitted:** *"Build a single-screen tip calculator and bill splitter as a web app. Use only html, css, javascript. The user enters a bill amount, a tip percentage, and a number of people, and the app shows what each person owes — updating live as they type, with no calculate button."
* **Generated Output Received:** A foundational, three-file native architecture handling basic `input` listeners and displaying calculated output text fields.

### Engineering Refactor of AI Code (The Pivot)
The input to the (bill amount) was accepting operators such as + or -, I prevent them since it should only recieved the bill amount as a number.

```javascript

// Custom Refactored Low-Level Keystroke Interceptor
[billInput, customTipInput, peopleInput].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (['+', '-', 'e', 'E'].includes(e.key)) {
      e.preventDefault(); // Intercepts and blocks the invalid symbol completely
    }
  });
});
