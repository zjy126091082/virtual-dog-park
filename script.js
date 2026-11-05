// Round 2: adopt one dog, then Feed and Play with it.
// The dog lives in a normal JavaScript object in memory.
// Nothing is saved yet, so refreshing the page loses the dog (Round 3 fixes this).

// ---------------------------------------------------------------
// 1. Rules that never change
// ---------------------------------------------------------------
const MAX_HAPPINESS = 100;
const HAPPINESS_STEP = 10;
const STARTING_HAPPINESS = 50;
const MAX_NAME_LENGTH = 20;

// Each breed points at its own local SVG file.
const BREED_IMAGES = {
  "Beagle": "assets/beagle.svg",
  "Golden Retriever": "assets/golden-retriever.svg",
  "Poodle": "assets/poodle.svg"
};

// ---------------------------------------------------------------
// 2. Find the page elements we need
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

const feedButton = document.getElementById("feed-btn");
const playButton = document.getElementById("play-btn");

const yearSpan = document.getElementById("year");

// ---------------------------------------------------------------
// 3. The state: one dog, or null when nobody has been adopted
// ---------------------------------------------------------------
let currentPet = null; // { name: string, breed: string, day: number, happiness: number }

// ---------------------------------------------------------------
// 4. Small helpers
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

// ---------------------------------------------------------------
// 5. Draw the current state on the page
// ---------------------------------------------------------------
function renderPet() {
  if (currentPet === null) {
    // No dog yet: hide the whole "Your Dog" panel.
    petSection.hidden = true;
    return;
  }

  petSection.hidden = false;

  // textContent writes the name as plain text, never as HTML,
  // so a name like <b>Angry</b> is shown as characters, not markup.
  petName.textContent = currentPet.name;
  petBreed.textContent = currentPet.breed;
  petDay.textContent = String(currentPet.day);
  petHappiness.textContent = String(currentPet.happiness);

  // Every new dog starts as a Puppy. Growth rules arrive in Round 3.
  petStage.textContent = "Puppy";

  petImage.src = BREED_IMAGES[currentPet.breed];
  petImage.alt = "Illustration of " + currentPet.name + " the " + currentPet.breed;
}

// ---------------------------------------------------------------
// 6. Adopt: check the name, then create the dog
// ---------------------------------------------------------------
adoptForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // trim() removes spaces at the start and at the end.
  // Spaces inside the name are kept, for example "Big Buddy".
  let name = nameInput.value.trim();

  if (name === "") {
    formMessage.textContent = "Please type a name before you adopt a dog.";
    nameInput.focus();
    return;
  }

  // maxlength on the input already stops typing at 20 characters,
  // but we check again because text can also be pasted in.
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
  renderPet();
});

// ---------------------------------------------------------------
// 7. Feed and Play both add happiness, but never above 100
// ---------------------------------------------------------------
function addHappiness(amount) {
  if (currentPet === null) {
    return;
  }
  currentPet.happiness = clamp(currentPet.happiness + amount, 0, MAX_HAPPINESS);
  renderPet();
}

feedButton.addEventListener("click", function () {
  addHappiness(HAPPINESS_STEP);
});

playButton.addEventListener("click", function () {
  addHappiness(HAPPINESS_STEP);
});

// ---------------------------------------------------------------
// 8. First run
// ---------------------------------------------------------------
if (yearSpan !== null) {
  yearSpan.textContent = String(new Date().getFullYear());
}

renderPet();
