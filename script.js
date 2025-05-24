import { auth, provider, signInWithPopup, signOut, db, doc, setDoc, getDoc, updateDoc, collection, getDocs, query, orderBy, limit } from './firebase.js';
// script.js - Lógica de SaddeyVerse

// Próximamente: lógica para juegos, ranking, logros...

console.log("SaddeyVerse cargado 🚀");
// ====================
// Trivia Saddey
// ====================

// Datos: Preguntas de la trivia
const preguntasTrivia = [
  {
    pregunta: "¿Cómo se llama el canal principal de SoySaddey?",
    opciones: ["SaddeyZone", "SoySaddey", "TheSadLife"],
    respuesta: "SoySaddey"
  },
  {
    pregunta: "¿Qué género de juegos suele jugar Saddey?",
    opciones: ["Shooter", "Aventuras gráficas", "Survival Horror"],
    respuesta: "Survival Horror"
  },
  {
    pregunta: "¿Cuál es el saludo característico de Saddey?",
    opciones: ["¡Hey, SadGang!", "¡Buenas, SadCrew!", "¡Hola, mis SadLovers!"],
    respuesta: "¡Buenas, SadCrew!"
  }
];

// Estado del juego
let preguntaActual = 0;
let puntos = 0;

// Elementos del DOM
const triviaBtn = document.getElementById("triviaBtn");
const gamesSection = document.getElementById("games");
const rankingList = document.getElementById("rankingList");
const logrosContainer = document.getElementById("logrosContainer");

// Evento para iniciar la trivia
triviaBtn.addEventListener("click", iniciarTrivia);

function iniciarTrivia() {
  gamesSection.innerHTML = "<h2>🎮 Trivia Saddey</h2>";
  mostrarPregunta();
}

function mostrarPregunta() {
  if (preguntaActual < preguntasTrivia.length) {
    const q = preguntasTrivia[preguntaActual];
    const opcionesHTML = q.opciones
      .map(opcion => `<button class="opcionBtn">${opcion}</button>`)
      .join("");

    gamesSection.innerHTML += `
      <div class="pregunta">
        <p>${q.pregunta}</p>
        ${opcionesHTML}
      </div>
    `;

    document.querySelectorAll(".opcionBtn").forEach(btn => {
      btn.addEventListener("click", e => {
        if (e.target.textContent === q.respuesta) {
          puntos += 10;
        }
        preguntaActual++;
        mostrarPregunta();
      });
    });
  } else {
    finalizarTrivia();
  }
}

function finalizarTrivia() {
  gamesSection.innerHTML = `
    <h2>🎮 Trivia Finalizada</h2>
    <p>Tu puntaje: <strong>${puntos}</strong></p>
    <button onclick="window.location.reload()">Jugar de nuevo</button>
  `;

  guardarEnRanking(puntos);
}

function guardarEnRanking(puntos) {
  const nombre = prompt("¡Felicidades! Ingresa tu nombre para el ranking:");
  if (!nombre) return;

  const ranking = JSON.parse(localStorage.getItem("rankingSaddey")) || [];
  ranking.push({ nombre, puntos });
  localStorage.setItem("rankingSaddey", JSON.stringify(ranking));

  actualizarRanking();
}

function actualizarRanking() {
  const ranking = JSON.parse(localStorage.getItem("rankingSaddey")) || [];
  const top = ranking.sort((a, b) => b.puntos - a.puntos).slice(0, 10);

  rankingList.innerHTML = top
    .map((player, index) => `<li>#${index + 1} - ${player.nombre}: ${player.puntos} pts</li>`)
    .join("");
}

// Actualizar ranking al cargar la página
actualizarRanking();

// ====================
// Autenticación con Firebase
// ====================

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
let usuarioActual = null;

// Login con Google
loginButton.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    usuarioActual = result.user;
    alert(`¡Bienvenido, ${usuarioActual.displayName}!`);
    loginButton.style.display = "none";
    logoutButton.style.display = "inline-block";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
});

// Logout
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    usuarioActual = null;
    alert("Sesión cerrada correctamente.");
    loginButton.style.display = "inline-block";
    logoutButton.style.display = "none";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});
