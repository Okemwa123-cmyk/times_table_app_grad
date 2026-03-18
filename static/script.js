const numberEl = document.getElementById("number");
const answerEl = document.getElementById("answer");
const newProblemButton = document.getElementById("newProblem");
const showAnswerButton = document.getElementById("showAnswer");

let currentProblem = { n1: 0, n2: 0, product: 0 };

let baseHue = Math.random() * 360;
let lastBgTimestamp = null;

function setBackgroundHue(hue) {
  const hue1 = hue % 360;
  const hue2 = (hue1 + 120) % 360;

  document.documentElement.style.setProperty("--bg1", `hsl(${hue1}, 82%, 82%)`);
  document.documentElement.style.setProperty("--bg2", `hsl(${hue2}, 74%, 92%)`);
  document.documentElement.style.setProperty("--accent", `hsl(${hue1}, 92%, 54%)`);
  document.documentElement.style.setProperty("--accent2", `hsl(${hue2}, 88%, 56%)`);
}

function animateBackground(timestamp) {
  if (!lastBgTimestamp) lastBgTimestamp = timestamp;
  const deltaMs = timestamp - lastBgTimestamp;
  lastBgTimestamp = timestamp;

  // Rotate 15 degrees per second (slow, smooth transition)
  baseHue = (baseHue + (deltaMs / 1000) * 15) % 360;
  setBackgroundHue(baseHue);
  requestAnimationFrame(animateBackground);
}

function setLoading(isLoading) {
  newProblemButton.disabled = isLoading;
  showAnswerButton.disabled = isLoading;
  newProblemButton.textContent = isLoading ? "Loading…" : "New problem";
  numberEl.classList.toggle("loading", isLoading);
}

function showAnswer() {
  if (currentProblem.product == null) return;
  answerEl.textContent = `${currentProblem.n1} × ${currentProblem.n2} = ${currentProblem.product}`;
}

async function loadProblem() {
  setLoading(true);
  answerEl.textContent = "Click “Show answer” to reveal the product.";

  try {
    const resp = await fetch("/number");
    if (!resp.ok) throw new Error(`Server error: ${resp.status}`);

    const value = await resp.json();
    currentProblem = {
      n1: value.n1,
      n2: value.n2,
      product: value.n1 * value.n2,
    };

    numberEl.textContent = `${value.n1} × ${value.n2} = ?`;
  } catch (err) {
    console.error(err);
    numberEl.textContent = "Oops!";
    answerEl.textContent = "Try refreshing the page.";
  } finally {
    setLoading(false);
  }
}

newProblemButton.addEventListener("click", loadProblem);
showAnswerButton.addEventListener("click", showAnswer);
window.addEventListener("DOMContentLoaded", () => {
  loadProblem();
  requestAnimationFrame(animateBackground);
});
