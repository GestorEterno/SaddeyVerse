// firebase.js

// Importa las funciones necesarias desde los módulos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Tu configuración de Firebase (la que copiaste)
const firebaseConfig = {
  apiKey: "AIzaSyDv6s_Es1mg9wQm3yTmNxRTbLaj1Ayc-gI",
  authDomain: "saddeyverse.firebaseapp.com",
  projectId: "saddeyverse",
  storageBucket: "saddeyverse.firebasestorage.app",
  messagingSenderId: "618729425497",
  appId: "1:618729425497:web:b6f2a36e5573ae989bbf48",
  measurementId: "G-0SJ9ZBJ859"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Exportar Firebase para usar en otros archivos
export { auth, db, provider, signInWithPopup, signOut, doc, setDoc, getDoc, updateDoc };
