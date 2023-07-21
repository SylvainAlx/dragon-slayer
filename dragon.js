//données
const dragon = {
  pv: 100,
  zoneRouge: null,
  dice: null,
  bonus: 0,
  malus: 0,
};
const player = {
  nom: "",
  pv: 100,
  zoneRouge: null,
  dice: null,
  bonus: 0,
  malus: 0,
};

const start = document.getElementById("start");
const main = document.getElementById("main");
const bouton = document.getElementById("bouton");
const displayNom = document.getElementById("displayNom");
const pvPlayer = document.getElementById("pvJoueur");
const pvDragon = document.getElementById("pvDragon");
const history = document.getElementById("history");
const facile = document.getElementById("facile");
const normal = document.getElementById("normal");
const difficile = document.getElementById("difficile");
const mode = document.getElementById("mode");
const reload = document.getElementById("reload");
const meterDragon = document.querySelector("#meterDragon");
const meterPlayer = document.querySelector("#meterJoueur");

//Jeu
let tour = 0;
pv();
scroll();

start.addEventListener("click", () => {
  player.nom = prompt("Qui affronte le dragon ?");
  displayNom.innerHTML = "PV " + player.nom;
  if (player.nom) {
    hidden(start);
    hidden(mode);
  } else {
    alert("Le nom de l'adversaire du dragon est obligatoire");
  }
});

facile.addEventListener("click", () => {
  difficulty(0);
  load();
});
normal.addEventListener("click", () => {
  difficulty(1);
  load();
});
difficile.addEventListener("click", () => {
  difficulty(2);
  load();
});
bouton.addEventListener("click", () => {
  bouton.innerHTML = "TOUR SUIVANT";
  initiative();
  scroll();
});
reload.addEventListener("click", () => {
  window.location.reload();
});

//fonctions

function difficulty(mode) {
  if (mode === 0) {
    init(dice(5, 10), dice(10, 10), dice(2, 6), 0, 0, dice(2, 6));
    displayInfo("MODE FACILE", "h3", "green");
  } else if (mode === 1) {
    init(dice(10, 10), dice(10, 10), 0, 0, 0, 0);
    displayInfo("MODE NORMAL", "h3", "orange");
  } else if (mode === 2) {
    dragon.pv += dice(10, 10);
    player.pv += dice(7, 10);
    dragon.bonus = dice(1, 6);
    player.malus = dice(1, 6);
    displayInfo("MODE DIFFICILE", "h3", "red");
  }
}
function load() {
  meterPlayer.max = player.pv;
  meterDragon.max = dragon.pv;
  pv();
  hidden(main);
  hidden(mode);
  hidden(reload);
}
function dice(n, x) {
  const min = 1;
  const max = x + 1;
  let result = 0;
  for (let i = n; i >= 1; i--) {
    const random = Math.floor(Math.random() * (max - min)) + min;
    result = result + random;
  }
  return result;
}
function initiative() {
  let player = dice(10, 6);
  let dragon = dice(10, 6);
  if (player > dragon) {
    joueurAttaque();
  } else {
    dragonAttaque();
  }
}
function joueurAttaque() {
  const attaque = dice(3, 6);
  const attaqueTotale = Math.floor(
    attaque + attaque * (player.bonus / 100) - attaque * (player.malus / 100)
  );
  tour++;
  displayInfo(`Tour ${tour} :`, "h3", "#880000");
  displayInfo(
    `${player.nom} a joué et a infligé ${attaqueTotale} points de dégats au dragon`,
    "p"
  );
  dragon.pv -= attaqueTotale;
  pv();
  console.log(attaque);
}
function dragonAttaque() {
  const attaque = dice(3, 6);
  const attaqueTotale = Math.floor(
    attaque + attaque * (dragon.bonus / 100) - attaque * (dragon.malus / 100)
  );
  tour++;
  displayInfo(`Tour ${tour} :`, "h3", "#880000");
  displayInfo(
    `Le dragon a joué et a infligé ${attaqueTotale} points de dégats a ${player.nom}`,
    "p"
  );
  player.pv -= attaqueTotale;
  pv();
  console.log(attaque);
}
function hidden(element) {
  element.classList.toggle("hidden");
}
function displayInfo(text, element, couleur, fz) {
  const nouvelleInfo = document.createElement(element);
  nouvelleInfo.innerHTML = text;
  history.append(nouvelleInfo);
  if (couleur) {
    nouvelleInfo.style.color = couleur;
  }
  if (fz) {
    nouvelleInfo.style.fontSize = fz;
  }
}
function pv() {
  pvPlayer.innerHTML = player.pv;
  pvDragon.innerHTML = dragon.pv;
  meterPlayer.value = player.pv;
  meterDragon.value = dragon.pv;
  if (player.pv <= 0) {
    end("Le dragon");
  } else if (dragon.pv <= 0) {
    end(player.nom);
  }
}
function init(dPV, pPV, dM, dB, pM, pB) {
  dragon.pv += dPV;
  player.pv += pPV;
  dragon.malus = dM;
  dragon.bonus = dB;
  player.malus = pM;
  player.bonus = pB;
  meterPlayer.low = player.pv / 3;
  meterDragon.low = dragon.pv / 3;
  bouton.innerHTML = "NOUVEAU TOUR";
}
function scroll() {
  history.scrollTop = history.scrollHeight;
}
function end(perso) {
  displayInfo(`${perso} à gagné !`, "h2", "darkred", "40px");
  hidden(bouton);
}
