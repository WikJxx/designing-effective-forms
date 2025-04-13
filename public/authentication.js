import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Konfiguracja Firebase
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

provider.addScope("email");
provider.addScope("profile");

provider.setCustomParameters({
  prompt: "select_account"
});

// Przycisk logowania/wylogowania
const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");

// Ukrywanie/pokazywanie przycisków
const toggleButtons = (user) => {
  if (user) {
    signInButton.style.display = "none";
    signOutButton.style.display = "inline-block";
  } else {
    signInButton.style.display = "inline-block";
    signOutButton.style.display = "none";
  }
};

// Wypełnianie formularza danymi z konta Google
const injectUserData = (user) => {
  if (!user) return;
  console.log("USER:", user);
  const [firstName, lastName] = user.displayName?.split(" ") || ["", ""];
  document.getElementById("firstName").value = firstName;
  document.getElementById("lastName").value = lastName;
  document.getElementById("email").value = user.email || "";
};

// Obsługa logowania
signInButton.addEventListener("click", () => {
  sessionStorage.setItem("redirecting", "true");
  signInWithRedirect(auth, provider);
});

// Obsługa wylogowania
signOutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Zostałeś wylogowany!");
    sessionStorage.removeItem("redirecting");
    toggleButtons(null);
  } catch (err) {
    console.error("Błąd wylogowania:", err);
  }
});

getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      injectUserData(result.user);
      toggleButtons(result.user);
    }
    sessionStorage.removeItem("redirecting");
  })
  .catch((error) => {
    console.error("Błąd po redirectcie:", error);
  });

onAuthStateChanged(auth, (user) => {
  const wasRedirecting = sessionStorage.getItem("redirecting") === "true";
  if (user && !wasRedirecting) {
    injectUserData(user);
  }
  toggleButtons(user);
});

toggleButtons(null);
