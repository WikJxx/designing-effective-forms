import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Konfiguracja Firebase z Twojego projektu
const firebaseConfig = {
  apiKey: "AIzaSyAhHt4CRMcysvrZD9ewkDwIMy51rCw77Ak",
  authDomain: "form-35d15.firebaseapp.com",
  projectId: "form-35d15",
  storageBucket: "form-35d15.appspot.com",
  messagingSenderId: "365580171039",
  appId: "1:365580171039:web:bd1dd097151f756b1eb22a",
  measurementId: "G-FFFCLYQGHH"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");

// Logowanie
const userSignIn = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);

      // Wstrzykiwanie danych użytkownika do formularza
      document.getElementById("firstName").value = user.displayName?.split(" ")[0] || "";
      document.getElementById("lastName").value = user.displayName?.split(" ")[1] || "";
      document.getElementById("email").value = user.email || "";
    })
    .catch((error) => {
      console.error("Błąd logowania:", error);
    });
};

// Wylogowanie
const userSignOut = async () => {
  signOut(auth)
    .then(() => {
      alert("Zostałeś wylogowany!");
    })
    .catch((error) => {
      console.error("Błąd wylogowania:", error);
    });
};

// Obserwator zmiany stanu
onAuthStateChanged(auth, (user) => {
  if (user) {
    alert("Zalogowano przez Google!");
    console.log("Zalogowany użytkownik:", user);
  }
});

// Podpięcie przycisków
signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);
