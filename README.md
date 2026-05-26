# tip-calculator

# SpliTip // Tip CAlculator 💸

SpliTip is a sleek, single-screen interactive web application engineered to calculate tips and split bills across groups with absolute precision. Built entirely on a native vanilla frontend stack, the application processes inputs reactively in real time—eliminating the need for a legacy "Calculate" button—while introducing defensive UX logic to mitigate floating-point rounding discrepancies and input breaking errors.

👉 **[Live Production Demo](https://tip-calculator-sg7v.onrender.com/)**

---

## 🚀 How to Run Locally

Because this project is built using native web technologies, it has **zero external software dependencies**. There are no development servers to configure or `npm install` packages to download.

### Quick Launch (Direct File Protocol)
1. **Clone or Download** this repository to your machine.
2. Locate the project directory and **double-click** the `index.html` file.
3. The application will instantly initialize inside your default web browser via the `file:///` protocol.

### Professional Launch (Live Server)
1. Open the project folder inside **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey) via the Extensions Marketplace (`Ctrl + Shift + X`).
3. Open `index.html`, right-click within the editor window, and select **Open with Live Server** (or click the **`((•))` Go Live** button in the bottom status bar).
4. Your browser will automatically mount the app locally at `http://127.0.0.1:5500/index.html`.

---

## 🛠️ Tech Stack & Architecture

* **Markup:** Semantic HTML5 Structure
* **Styling:** Responsive CSS3 Layout (Powered by CSS Grid & Custom Properties)
* **Logic Engine:** Vanilla JavaScript (ES6+ Native Event-Driven Execution Architecture)

### Key Engineering Features
* **Zero Layout Shift Validation:** Custom inline validation error fields use absolute structural constraints. Warning tags transition smoothly into place via opacity toggles without altering form geometries or shifting text nodes unexpectedly.
* **Keystroke Interception & Sanitization:** Implements low-level keyboard listeners that explicitly prevent the entry of invalid math operators (`+`, `-`, `e`, `E`) inside numeric text layouts, safeguarding the parsing engine from execution crashes.
* **Optimized Mobile Input Modes:** Maps dedicated interactive layouts (`inputmode="decimal"` and `inputmode="numeric"`) to physical mobile touch screens, prompting the correct financial/integer keypads automatically.

---

## 📐 Rounding Policy Defense

SpliTip utilizes a strict **Ceiling Rounding Strategy at the Cent Layer**:
$$\text{Rounded Individual Share} = \frac{\lceil(\text{Raw Individual Share} \times 100)\rceil}{100}$$

Standard financial applications relying on round-to-nearest arithmetic (like `.toFixed(2)`) frequently trigger **merchant shortfall bugs**. For example, a group of 3 splitting a \$10.00 bill using a regular round-down rule will owe \$3.33 each, culminating in a \$9.99 pool that leaves a \$0.01 unpaid balance at the point of sale. 

By calculating the mathematical ceiling at the second decimal unit, SpliTip rounds fractional pennies upward. Splitting \$10.00 three ways evaluates cleanly to **\$3.34** per individual. The collective group smoothly accumulates \$10.02—guaranteeing the restaurant invoice is settled completely without cash friction.

---

## 📄 Documentation Addendums
For an expanded architectural review, including edge-case verification matrices, accessible keyboard navigation breakdowns, and technical design justifications, please refer to the accompanying **`ANSWERS.md`** file located in the root repository folder.
