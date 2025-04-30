const startBtn = document.getElementById("start");
const clickBtn = document.getElementById("clickBtn");
const pseudoInput = document.getElementById("pseudo");
const compteur = document.getElementById("compteur");
const resultat = document.getElementById("resultat");
const classement = document.getElementById("classement");
const scoreBody = document.getElementById("scoreBody");

let clics = 0;
let temps = 5;
let intervalID;
let timer;

startBtn.addEventListener("click", () => {
  const pseudo = pseudoInput.value.trim();
  if (!pseudo) {
    alert("Entre un pseudonyme avant de commencer !");
    return;
  }

  clics = 0;
  temps = 5;
  resultat.textContent = "";
  classement.textContent = "";
  compteur.textContent = `Temps restant : ${temps} s`;
  clickBtn.disabled = false;
  startBtn.disabled = true;
  pseudoInput.disabled = true;
  clickBtn.classList.remove('flames'); // Retirer les flammes si elles sont activées

  intervalID = setInterval(() => {
    temps--;
    compteur.textContent = `Temps restant : ${temps} s`;
    if (temps <= 0) clearInterval(intervalID);
  }, 1000);

  timer = setTimeout(() => {
    clickBtn.disabled = true;
    startBtn.disabled = false;
    pseudoInput.disabled = false;
    const cps = (clics / 5).toFixed(2);
    compteur.textContent = "Temps écoulé !";
    resultat.textContent = `${pseudo}, tu as fait ${clics} clics (${cps} clics/seconde) !`;
    afficherClassement(clics, pseudo);
    enregistrerScore(pseudo, clics, cps);
    afficherTopScores();

    // Appliquer les flammes si CPS > 4
    if (cps > 4) {
      clickBtn.classList.add('flames');
    }
  }, 5000);
});

clickBtn.addEventListener("click", () => {
  clics++;
});

clickBtn.addEventListener("mousedown", () => {
  clickBtn.classList.add('flames'); // Ajouter les flammes lorsque le bouton est enfoncé
});

clickBtn.addEventListener("mouseup", () => {
  clickBtn.classList.remove('flames'); // Retirer les flammes lorsque le bouton est relâché
});

clickBtn.addEventListener("mouseleave", () => {
  clickBtn.classList.remove('flames'); // Retirer les flammes si la souris quitte le bouton
});

function afficherClassement(clics, pseudo) {
  let titre = "";
  if (clics < 10) {
    titre = "🐢 Tortue";
  } else if (clics < 20) {
    titre = "⚡ Rapide";
  } else if (clics < 30) {
    titre = "🔥 Expert";
  } else {
    titre = "👑 Élite";
  }
  classement.textContent = `Rang de ${pseudo} : ${titre}`;
}

function enregistrerScore(pseudo, clics, cps) {
  let scores = JSON.parse(localStorage.getItem("topScores")) || [];

  // Enregistrer uniquement si le nouveau score est meilleur
  if (scores.length === 0 || clics > scores[0].clics) {
    scores = [{ pseudo, clics, cps: parseFloat(cps) }];
    localStorage.setItem("topScores", JSON.stringify(scores));
  }
}

function afficherTopScores() {
  let scores = JSON.parse(localStorage.getItem("topScores")) || [];

  // Trouver le meilleur score
  const meilleurScore = scores.length > 0 ? scores[0] : null;

  // Réinitialiser le tableau des scores
  scoreBody.innerHTML = "";

  if (meilleurScore) {
    const row = `<tr>
      <td>1</td>
      <td>${meilleurScore.pseudo}</td>
      <td>${meilleurScore.clics}</td>
      <td>${meilleurScore.cps.toFixed(2)}</td>
    </tr>`;
    scoreBody.innerHTML += row;
  }
}

// Afficher le meilleur score au chargement
afficherTopScores();
