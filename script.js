// Round 1: the encyclopedia page is static HTML and CSS.
// This file is created now so the project structure is complete.
// Round 2 adds adoption, Feed and Play here.
// Round 3 adds growth rules, saved progress and Start Over here.

// Small job for now: print the current year in the footer.
const yearSpan = document.getElementById("year");

if (yearSpan !== null) {
  yearSpan.textContent = String(new Date().getFullYear());
}
