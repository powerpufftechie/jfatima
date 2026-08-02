const form = document.querySelector("#resetForm");
const resultCard = document.querySelector("#resultCard");
const releaseText = document.querySelector("#releaseText");
const focusText = document.querySelector("#focusText");
const actionText = document.querySelector("#actionText");
const copyButton = document.querySelector("#copyButton");
const tryAgainButton = document.querySelector("#tryAgainButton");
const closeResult = document.querySelector("#closeResult");
const savedMessage = document.querySelector("#savedMessage");
const startTimeText = document.querySelector("#startTimeText");

let latestReset = null;

function formatStartTime(date = new Date()) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

const releaseOptions = [
  "You do not need to repair all of yesterday today.",
  "Leave behind the pressure to catch up with everything at once.",
  "Yesterday can be unfinished without defining what happens next.",
  "You are allowed to begin before you feel completely ready."
];

const actionTemplates = {
  low: [
    "Sit somewhere quiet and write the next step in one sentence. Stop after 3 minutes.",
    "Put away one distracting item and work on the smallest part for 5 minutes.",
    "Open what you need and complete one tiny step for 5 minutes."
  ],
  medium: [
    "Set a 7-minute timer and complete the smallest useful part.",
    "Work on one clearly defined piece for 10 minutes, then stop.",
    "Spend 8 focused minutes moving this forward before checking messages."
  ],
  high: [
    "Set a 10-minute timer and create the simplest first version.",
    "Use 10 focused minutes to finish one visible piece.",
    "Take the highest-impact next step for exactly 10 minutes."
  ]
};

function choose(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function cleanFocus(text) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  const firstSentence = trimmed.split(/[.!?]/)[0];
  return firstSentence.length > 110
    ? `${firstSentence.slice(0, 107)}...`
    : firstSentence;
}

function buildLocalReset(carry, matters, energy) {
  const focus = cleanFocus(matters);
  return {
    release: choose(releaseOptions),
    focus: focus.charAt(0).toUpperCase() + focus.slice(1),
    action: choose(actionTemplates[energy])
  };
}

function showReset(reset) {
  const startTime = formatStartTime();
  latestReset = { ...reset, startTime };
  releaseText.textContent = reset.release;
  focusText.textContent = reset.focus;
  actionText.textContent = reset.action;
  startTimeText.textContent = `Start now — ${startTime}`;
  resultCard.classList.remove("hidden");
  resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const carry = formData.get("carry");
  const matters = formData.get("matters");
  const energy = formData.get("energy");

  const reset = buildLocalReset(carry, matters, energy);
  showReset(reset);
});

tryAgainButton.addEventListener("click", () => {
  const formData = new FormData(form);
  const reset = buildLocalReset(
    formData.get("carry"),
    formData.get("matters"),
    formData.get("energy")
  );
  showReset(reset);
});

closeResult.addEventListener("click", () => {
  resultCard.classList.add("hidden");
});

copyButton.addEventListener("click", async () => {
  if (!latestReset) return;

  const text = `DAY ZERO

Release: ${latestReset.release}

Focus: ${latestReset.focus}

Do now: ${latestReset.action}
Start time: ${latestReset.startTime}`;

  try {
    await navigator.clipboard.writeText(text);
    savedMessage.classList.remove("hidden");
    setTimeout(() => savedMessage.classList.add("hidden"), 1800);
  } catch {
    alert("Copy was blocked by the browser. Please select and copy the text manually.");
  }
});
