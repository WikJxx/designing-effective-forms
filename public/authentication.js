import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");

const injectUserData = (user) => {
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");

  const [firstName, lastName] = user.displayName?.split(" ") || ["", ""];
  if (firstNameInput) firstNameInput.value = firstName;
  if (lastNameInput) lastNameInput.value = lastName;
  if (emailInput) emailInput.value = user.email || "";
};

// 🔁 Logowanie z przekierowaniem
signInButton.addEventListener("click", () => {
  signInWithRedirect(auth, provider);
});

// 🔚 Wylogowanie
signOutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Zostałeś wylogowany!");
  } catch (error) {
    console.error("Błąd wylogowania:", error);
  }
});

// 🧠 Odbiór danych po przekierowaniu
getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      console.log("Zalogowano przez redirect:", result.user);
      injectUserData(result.user);
    }
  })
  .catch((error) => {
    console.error("Błąd po przekierowaniu:", error);
  });

// 👁️ Obserwator stanu użytkownika
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Użytkownik zalogowany:", user);
    injectUserData(user);
  }
});
