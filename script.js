// Importa Firebase desde la CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDv6s_Es1mg9wQm3yTmNxRTbLaj1Ayc-gI",
  authDomain: "saddeyverse.firebaseapp.com",
  projectId: "saddeyverse",
  storageBucket: "saddeyverse.firebasestorage.app",
  messagingSenderId: "618729425497",
  appId: "1:618729425497:web:b6f2a36e5573ae989bbf48",
  measurementId: "G-0SJ9ZBJ859"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Elementos del DOM
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
let usuarioActual = null;

// ====================
// Autenticación con Google (Popup)
// ====================

// Login con Google
loginButton.addEventListener("click", async (e) => {
  e.preventDefault(); // Evita recargar la página
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
logoutButton.addEventListener("click", async (e) => {
  e.preventDefault();
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

// ====================
// Trivia Saddey (Juegos)
// ====================

// Array de preguntas
const preguntasTrivia = [
  {
    pregunta: "¿Cuál es el nombre de SoySaddey?",
    opciones: ["Nicolas", "Sebastian", "Mateo", "Nico"],
    respuesta: "Nicolas"
  },
  {
    pregunta: "¿En qué provincia de Argentina vive actualmente?",
    opciones: ["Buenos Aires", "Chaco", "Córdoba", "Santa Fe"],
    respuesta: "Córdoba"
  },
  {
    pregunta: "¿Cuál fue el nombre en el cual se basó Saddey?",
    opciones: ["Sandy", "Santi"],
    respuesta: "Sandy"
  },
  {
    pregunta: "¿Cuál es su color favorito?",
    opciones: ["Azul", "Rojo", "Negro", "Blanco"],
    respuesta: "Azul"
  },
  {
    pregunta: "¿Dónde vivió por un tiempo?",
    opciones: ["Florencio Varela", "Bariloche", "Tigre", "Palermo"],
    respuesta: "Bariloche"
  }
];
  {
    pregunta: "¿Qué día suele hacer streams especiales Saddey?",
    opciones: ["Viernes de terror", "Sábado de retos", "Domingo de chill"],
    respuesta: "Viernes de terror"
  },
  {
    pregunta: "¿Qué color le gusta más a Saddey para su diseño?",
    opciones: ["Cian", "Morado", "Verde"],
    respuesta: "Morado"
  }
];

// Variables para controlar el estado del juego
let preguntasSeleccionadas = [];
let preguntaActual = 0;
let puntos = 0;
const totalPreguntas = 5;

// Elementos del DOM
const gamesSection = document.getElementById("games");
const triviaBtn = document.getElementById("triviaBtn");
const rankingList = document.getElementById("rankingList");

// Evento para iniciar la trivia
triviaBtn.addEventListener("click", iniciarTrivia);

// Función para iniciar la trivia
function iniciarTrivia() {
  // Seleccionar 5 preguntas aleatorias
  preguntasSeleccionadas = preguntasTrivia.sort(() => 0.5 - Math.random()).slice(0, totalPreguntas);
  preguntaActual = 0;
  puntos = 0;
  mostrarPregunta();
}

// Función para mostrar la pregunta actual
function mostrarPregunta() {
  if (preguntaActual < preguntasSeleccionadas.length) {
    const q = preguntasSeleccionadas[preguntaActual];

    const opcionesHTML = q.opciones
      .map(opcion => `<button class="opcionBtn">${opcion}</button>`)
      .join("");

    gamesSection.innerHTML = `
      <h2>🎮 ¿Cuánto conoces a Saddey?</h2>
      <div class="pregunta">
        <p style="font-size:1.2rem; font-weight:bold;">${q.pregunta}</p>
        <div class="opciones" style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${opcionesHTML}
        </div>
        <p style="font-size:0.9rem; margin-top:1rem;">(Pregunta ${preguntaActual + 1} de ${totalPreguntas})</p>
      </div>
    `;

    document.querySelectorAll(".opcionBtn").forEach(btn => {
      btn.addEventListener("click", e => {
        if (e.target.textContent === q.respuesta) {
          puntos += 1;
        }
        preguntaActual++;
        mostrarPregunta();
      });
    });
  } else {
    finalizarTrivia();
  }
}

// Función para finalizar la trivia
function finalizarTrivia() {
  gamesSection.innerHTML = `
    <h2>🎮 Trivia Finalizada</h2>
    <p>Tu puntaje: <strong>${puntos}</strong></p>
    <button onclick="window.location.reload()">Jugar de nuevo</button>
  `;

  guardarEnRanking(puntos);
}

// Función para guardar el puntaje en el ranking
function guardarEnRanking(puntos) {
  const nombre = prompt("¡Felicidades! Ingresa tu nombre para el ranking:");
  if (!nombre) return;

  const ranking = JSON.parse(localStorage.getItem("rankingSaddey")) || [];
  ranking.push({ nombre, puntos });
  localStorage.setItem("rankingSaddey", JSON.stringify(ranking));

  actualizarRanking();
}

// Función para actualizar el ranking
function actualizarRanking() {
  const ranking = JSON.parse(localStorage.getItem("rankingSaddey")) || [];
  const top = ranking.sort((a, b) => b.puntos - a.puntos).slice(0, 100);

  rankingList.innerHTML = top
    .map((player, index) => `<li>#${index + 1} - ${player.nombre}: ${player.puntos} pts</li>`)
    .join("");
}

// Actualizar ranking al cargar la página
actualizarRanking();

console.log("SaddeyVerse cargado 🚀");
