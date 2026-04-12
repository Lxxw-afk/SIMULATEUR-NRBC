let currentScenario = null;

const scenarios = [
  {
    text: "☣️ Fuite chimique détectée dans une zone industrielle.",
    choices: [
      { text: "Se confiner", correct: true },
      { text: "Sortir immédiatement", correct: false },
      { text: "Ignorer l’alerte", correct: false }
    ]
  },
  {
    text: "🧬 Contamination biologique suspectée dans un bâtiment.",
    choices: [
      { text: "Fermer les accès", correct: true },
      { text: "Entrer pour vérifier", correct: false },
      { text: "Attendre", correct: true }
    ]
  },
  {
    text: "☢️ Zone radioactive détectée après incident.",
    choices: [
      { text: "Évacuer", correct: true },
      { text: "Approcher", correct: false },
      { text: "Rester sur place", correct: false }
    ]
  }
];

function trigger() {
  const status = document.getElementById("status");
  status.className = "red";
  status.innerText = "🔴 ALERTE NRBC EN COURS";

  currentScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  document.getElementById("scenario").innerText = currentScenario.text;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  currentScenario.choices.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c.text;
    btn.onclick = () => check(c.correct);
    choicesDiv.appendChild(btn);
  });
}

function check(correct) {
  const feedback = document.getElementById("feedback");

  if (correct) {
    feedback.innerText = "✔️ Bonne décision";
  } else {
    feedback.innerText = "❌ Mauvaise décision";
  }
}
