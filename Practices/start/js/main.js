// Focus Board starter. Work through the steps in order; each one builds on the last.

const STORAGE_KEY = "focus-board";

const list = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const summary = document.querySelector("#summary");
const themeToggle = document.querySelector("#theme-toggle");
const filterButtons = document.querySelectorAll("[data-filter]");

// STEP 1: Single source of truth.
// Declare `state` with: tasks (array), filter ("all"), theme ("light").
// Each task: { id, text, done, completedOn }.
let state = {
    tasks: [],
    filter: "all",
    theme: "light"
};

// STEP 2: Render.
// Make the DOM reflect `state`. Do not read from the DOM to decide anything.
// - set document.documentElement.dataset.theme
// - set aria-pressed on the filter buttons and theme toggle
// - build one <li class="task" data-id="..."> per visible task (use
//   createElement + textContent, not innerHTML)
// - show/hide #empty-message; update #summary ("2 left · 1 completed today")
function render(state) {
    document.documentElement.dataset.theme = state.theme;
    themeToggle.setAttribute("aria-pressed", state.theme === "dark");
    filterButtons.forEach((button) => {
        button.setAttribute("aria-pressed", button.dataset.filter === state.filter);
    })
}

// STEP 3: setState(change): merge the change, save, render.
// This is the ONLY place state is replaced.
function setState(change) {}

// STEP 4: Persistence.
// saveState: JSON.stringify into localStorage.
// loadState: JSON.parse, and fall back to defaults if the data is missing or
// corrupt (try/catch). Call loadState() when the app starts.
function saveState() {}
function loadState() {}

// STEP 5: Add tasks (form "submit"). Create a task with crypto.randomUUID()
// and add it WITHOUT mutating the old array (spread).

// STEP 6: Toggle and delete using ONE click listener on #task-list
// (event delegation: event.target.closest("[data-id]")).
// Use map() to toggle and filter() to delete.

// STEP 7: Filter buttons and theme toggle. Both are UI state that persist.

// STEP 8: "Clear completed" button.

// STEP 9: Corrupt the saved value in DevTools > Application > Local Storage.
// Does the app still load?

// STEP 10 (stretch): window "storage" event to sync a second tab.
