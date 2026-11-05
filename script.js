// Round 3: growth rules, saved progress and Start Over.
//
// The whole site is three plain files: index.html (structure),
// style.css (look) and this file (behaviour). No framework is used.

// ---------------------------------------------------------------
// 1. Rules that never change
// ---------------------------------------------------------------
const STORAGE_KEY = "virtualDogParkPetV1"; // the name of the slot in localStorage
const MAX_HAPPINESS = 100;
const MIN_HAPPINESS = 0;
const HAPPINESS_STEP = 10;        // Feed and Play
const HAPPINESS_DROP_PER_DAY = 5; // Next Day
const STARTING_HAPPINESS = 50;
const MAX_NAME_LENGTH = 20;

const BREED_IMAGES = {
  "Beagle": "assets/beagle.svg",
  "Golden Retriever": "assets/golden-retriever.svg",
  "Poodle": "assets/poodle.svg"
};

// How full the growth bar is for each stage.
const GROWTH_PERCENT = {
  "Puppy": 33,
  "Young Dog": 66,
  "Adult Dog": 100
};

// ---------------------------------------------------------------
// 2. Page elements
// ---------------------------------------------------------------
const adoptForm = document.getElementById("adopt-form");
const breedSelect = document.getElementById("breed-select");
const nameInput = document.getElementById("dog-name");
const formMessage = document.getElementById("form-message");

const petSection = document.getElementById("pet");
const petName = document.getElementById("pet-name");
const petBreed = document.getElementById("pet-breed");
const petDay = document.getElementById("pet-day");
const petStage = document.getElementById("pet-stage");
const petHappiness = document.getElementById("pet-happiness");
const petImage = document.getElementById("pet-image");

const growthTrack = document.getElementById("growth-track");
const growthFill = document.getElementById("growth-fill");

const feedButton = document.getElementById("feed-btn");
const playButton = document.getElementById("play-btn");
const nextDayButton = document.getElementById("next-day-btn");
const startOverButton = document.getElementById("start-over-btn");

const yearSpan = document.getElementById("year");

// ---------------------------------------------------------------
// 3. The state: one dog, or null when nobody has been adopted
// ---------------------------------------------------------------
let currentPet = null; // { name, breed, day, happiness }

// ---------------------------------------------------------------
// 4. Rules in one place
// ---------------------------------------------------------------
function clamp(value, minimum, maximum) {
  if (value < minimum) {
    return minimum;
  }
  if (value > maximum) {
    return maximum;
  }
  return value;
}

// Day 1 is a Puppy, days 2 and 3 are a Young Dog, day 4 onward is an Adult Dog.
// Every part of the page asks this one function, so the rules cannot disagree.
function stageFor(day) {
  if (day <= 1) {
    return "Puppy";
  }
  if (day <= 3) {
    return "Young Dog";
  }
  return "Adult Dog";
}

// ---------------------------------------------------------------
// 5. Saving and loading (localStorage keeps text, so we use JSON)
// ---------------------------------------------------------------
function savePet() {
  if (currentPet === null) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPet));
}

function loadPet() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    return null;
  }

  try {
    const data = JSON.parse(raw);

    // If the saved value is damaged, ignore it instead of breaking the page.
    if (typeof data.name !== "string" || data.name.trim() === "") {
      return null;
    }

    return {
      name: data.name.slice(0, MAX_NAME_LENGTH),
      breed: BREED_IMAGES[data.breed] ? data.breed : "Beagle",
      day: Math.max(1, Number(data.day) || 1),
      happiness: clamp(Number(data.happiness) || 0, MIN_HAPPINESS, MAX_HAPPINESS)
    };
  } catch (error) {
    return null;
  }
}

// ---------------------------------------------------------------
// 6. Draw the current state on the page
// ---------------------------------------------------------------
function renderPet() {
  if (currentPet === null) {
    petSection.hidden = true;
    return;
  }

  petSection.hidden = false;

  const stage = stageFor(currentPet.day);
  const percent = GROWTH_PERCENT[stage];

  // textContent writes plain text, so a name like <b>Bo</b> stays visible
  // as characters instead of becoming HTML.
  petName.textContent = currentPet.name;
  petBreed.textContent = currentPet.breed;
  petDay.textContent = String(currentPet.day);
  petStage.textContent = stage;
  petHappiness.textContent = String(currentPet.happiness);

  petImage.src = BREED_IMAGES[currentPet.breed];
  petImage.alt = "Illustration of " + currentPet.name + " the " + currentPet.breed;

  // The bar shows the stage in size, the words above show it in text.
  growthFill.style.width = percent + "%";
  growthFill.setAttribute("data-stage", stage);
  growthTrack.setAttribute("aria-valuenow", String(percent));
}

// ---------------------------------------------------------------
// 7. Adopt
// ---------------------------------------------------------------
adoptForm.addEventListener("submit", function (event) {
  event.preventDefault();

  let name = nameInput.value.trim(); // no spaces at the two ends

  if (name === "") {
    formMessage.textContent = "Please type a name before you adopt a dog.";
    nameInput.focus();
    return;
  }

  if (name.length > MAX_NAME_LENGTH) {
    name = name.slice(0, MAX_NAME_LENGTH);
  }

  currentPet = {
    name: name,
    breed: breedSelect.value,
    day: 1,
    happiness: STARTING_HAPPINESS
  };

  formMessage.textContent = name + " has been adopted. Say hello!";
  nameInput.value = "";

  savePet();
  renderPet();
});

// ---------------------------------------------------------------
// 8. Feed and Play: +10 happiness, never above 100
// ---------------------------------------------------------------
function addHappiness(amount) {
  if (currentPet === null) {
    return;
  }
  currentPet.happiness = clamp(
    currentPet.happiness + amount,
    MIN_HAPPINESS,
    MAX_HAPPINESS
  );
  savePet();
  renderPet();
}

feedButton.addEventListener("click", function () {
  addHappiness(HAPPINESS_STEP);
});

playButton.addEventListener("click", function () {
  addHappiness(HAPPINESS_STEP);
});

// ---------------------------------------------------------------
// 9. Next Day: one more day, five less happiness, never below 0
// ---------------------------------------------------------------
nextDayButton.addEventListener("click", function () {
  if (currentPet === null) {
    return;
  }
  currentPet.day = currentPet.day + 1;
  currentPet.happiness = clamp(
    currentPet.happiness - HAPPINESS_DROP_PER_DAY,
    MIN_HAPPINESS,
    MAX_HAPPINESS
  );
  savePet();
  renderPet();
});

// ---------------------------------------------------------------
// 10. Start Over: ask first, and keep the dog if the visitor cancels
// ---------------------------------------------------------------
startOverButton.addEventListener("click", function () {
  const agreed = window.confirm(
    "Start over? This deletes your saved dog and cannot be undone."
  );

  if (agreed === false) {
    return; // Cancel keeps the dog
  }

  currentPet = null;
  savePet(); // no dog left, so this removes the saved value
  formMessage.textContent = "Your dog has been removed. You can adopt a new one.";
  nameInput.value = "";
  renderPet();
});

// ---------------------------------------------------------------
// 11. First run: restore the saved dog, then draw the page
// ---------------------------------------------------------------
if (yearSpan !== null) {
  yearSpan.textContent = String(new Date().getFullYear());
}

currentPet = loadPet();
renderPet();
