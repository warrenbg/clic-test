const startBtn = document.getElementById("start");
const clickBtn = document.getElementById("clickBtn");
const pseudoInput = document.getElementById("pseudo");
const durationSelect = document.getElementById("duration");
const compteur = document.getElementById("compteur");
const resultat = document.getElementById("resultat");
const classement = document.getElementById("classement");
const scoreBody = document.getElementById("scoreBody");

let clics = 0;
let intervalID, timer;

startBtn.addEventListener("click", () => {
  const pseudo = pseudoInput.value.trim();
  const tempsTotal = parseInt(durationSelect.value);

  if (!pseudo) {
    alert("Entre un pseudonyme avant de commencer !");
    return;
  }

  clics = 0;
  resultat.textContent = "";
  classement.textContent = "";
  compteur.textContent = `Temps restant : ${tempsTotal}s`;
  clickBtn.disabled = false;
  startBtn.disabled = true;
  pseudoInput.disabled = true;
  durationSelect.disabled = true;
  clickBtn.classList.remove('flames');

  let temps = tempsTotal;
  intervalID = setInterval(() => {
    temps--;
    compteur.textContent = `Temps restant : ${temps}s`;
    if (temps <= 0) clearInterval(intervalID);
  }, 1000);

  timer = setTimeout(() => {
    clickBtn.disabled = true;
    startBtn.disabled = false;
    pseudoInput.disabled = false;
    durationSelect.disabled = false;
    const cps = (clics / tempsTotal).toFixed(2);
    compteur.textContent = "Temps écoulé !";
    resultat.textContent = `${pseudo}, tu as fait ${clics} clics (${cps} cps) !`;
    afficherClassement(clics, pseudo);
    enregistrerScore(pseudo, clics, cps);
    afficherTopScores();

    if (cps > 4) {
      clickBtn.classList.add('flames');
    }
  }, tempsTotal * 1000);
});

clickBtn.addEventListener("click", () => {
  clics++;
});

function afficherClassement(clics, pseudo) {
  let titre = "";
  if (clics < 10) titre = "🐢 Tortue";
  else if (clics < 20) titre = "⚡ Rapide";
  else if (clics < 30) titre = "🔥 Expert";
  else titre = "👑 Élite";
  classement.textContent = `Rang de ${pseudo} : ${titre}`;
}

function enregistrerScore(pseudo, clics, cps) {
  let scores = JSON.parse(localStorage.getItem("topScores")) || [];
  scores.push({ pseudo, clics, cps: parseFloat(cps) });
  scores.sort((a, b) => b.clics - a.clics);
  scores = scores.slice(0, 10);
  localStorage.setItem("topScores", JSON.stringify(scores));
}

function afficherTopScores() {
  let scores = JSON.parse(localStorage.getItem("topScores")) || [];
  scoreBody.innerHTML = "";
  scores.forEach((score, index) => {
    scoreBody.innerHTML += `<tr>
      <td>${index + 1}</td>
      <td>${score.pseudo}</td>
      <td>${score.clics}</td>
      <td>${score.cps.toFixed(2)}</td>
    </tr>`;
  });
}

afficherTopScores();

// Optional: Register service worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
