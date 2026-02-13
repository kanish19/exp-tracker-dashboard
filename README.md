
# Expense Dashboard – Technical Documentation

This document provides a deep dive into the internal mechanics of the **Expense Dashboard**. The project is built using a "Vanilla" stack: **HTML5, CSS3, and modern JavaScript (ES6+)**, without the overhead of external frameworks.

---

## 1. Project Architecture

The project follows a modular structure where concerns are separated into three distinct layers:

```text
expense-dashboard/
├── index.html   → Structure (UI layout & DOM elements)
├── styles.css   → Presentation (Styling, layout & responsiveness)
└── app.js       → Logic (State management, calculations & events)
```

---

## 2. UI Structure (`index.html`)

The HTML file defines the skeleton of the application, using semantic tags for better accessibility and SEO.

### 2.1 Dashboard Layout
The application is split into two main containers using a CSS Grid layout:
*   `<aside class="sidebar">`: Contains the branding and navigation links.
*   `<main class="content">`: Houses the dynamic summary cards, the visual chart, and the transaction history.

### 2.2 Dynamic Elements
Key elements use unique `id` attributes to allow JavaScript to target them precisely:
*   **Stats:** `<h3 id="income">`, `<h3 id="expense">`, `<h3 id="balance">`.
*   **List:** `<ul id="transactionList">` acts as a container for dynamically generated items.
*   **Modal:** `<div id="transactionModal" class="modal hidden">` serves as the popup form for data entry.

---

## 3. Styling & Layout (`styles.css`)

The design focus is on a modern, dark-themed user interface that is fully responsive.

### 3.1 Design System
We use CSS Variables (`:root`) for centralized theme management:
```css
:root {
  --bg: #0e0e0e;
  --panel: #181818;
  --accent: #4f8cff;
  --success: #2ecc71;
  --danger: #e74c3c;
}
```

### 3.2 Visibility Logic
Instead of manipulating `element.style.display` in JavaScript, we use a utility class. This keeps the logic clean and allows for CSS transitions:
```css
.hidden {
  display: none !important;
}
```

---

## 4. Logical Engine (`app.js`)

The JavaScript file handles the "State" of the application.

### 4.1 Data Model
Transactions are stored as an **Array of Objects**. Each object represents a single financial movement:
```js
{
  id: 1715200000, // Timestamp used as unique ID
  name: "Freelance Project",
  amount: 1200,
  type: "income" // 'income' or 'expense'
}
```

### 4.2 Local Storage (Persistence)
To ensure data isn't lost on page refresh, we use the `localStorage` API:
*   **Saving:** `localStorage.setItem("transactions", JSON.stringify(transactions));`
*   **Loading:** `JSON.parse(localStorage.getItem("transactions")) || [];`

### 4.3 The "Render" Cycle
The `render()` function is the most critical part of the logic. Whenever data changes, the following happens:
1.  **Filtering:** The list is filtered based on user search or category selection.
2.  **Calculation:** The total income, expense, and balance are recalculated using `.reduce()` or a loop.
3.  **DOM Injection:** The `transactionList` is cleared and rebuilt using `.innerHTML`.
4.  **Chart Update:** The Chart.js instance is destroyed and recreated with new data to prevent visual glitches.

---

## 5. Feature Breakdown

### 5.1 Chart.js Integration
We use the **Chart.js** library for the doughnut chart. To prevent memory leaks, we check if a chart instance already exists before creating a new one:
```js
if (window.myChart) window.myChart.destroy();
window.myChart = new Chart(ctx, config);
```

### 5.2 Form Handling
When a user submits the "Add Transaction" form:
1.  `event.preventDefault()` stops the page from reloading.
2.  Values are grabbed from the inputs.
3.  Basic validation ensures the amount is greater than zero.
4.  The new object is pushed to the main array.
5.  `render()` and `save()` are called.

---

## 6. Technical Benefits

| Feature | Benefit |
| :--- | :--- |
| **Vanilla JS** | Zero dependencies, lightning-fast load times, and deep control over the DOM. |
| **Event Delegation** | Handlers are attached efficiently to manage clicks on dynamically added list items. |
| **Non-Destructive Filtering** | Searching for a transaction doesn't delete others; it only changes what is currently visible. |
| **Mobile First** | CSS Flexbox and Media Queries ensure the dashboard works on phones and tablets. |

---

## 7. Future Scalability

The current architecture is designed to be easily extendable:
*   **Categories:** Adding a `category` key to the object would allow for color-coded labels.
*   **CSV Export:** A function can be added to parse the `transactions` array into a downloadable file.
*   **Date Range:** Adding a `date` picker to the UI to filter transactions by month or year.

---

## 8. Summary Table

| Layer | Primary Technology | Responsibility |
| :--- | :--- | :--- |
| **Structure** | HTML5 | Defining data containers and input fields. |
| **Style** | CSS3 / Grid / Flexbox | Visual layout, colors, and responsive behavior. |
| **Logic** | JavaScript (ES6) | State management, calculations, and LocalStorage. |
| **Visuals** | Chart.js | Rendering data into a readable doughnut chart. |