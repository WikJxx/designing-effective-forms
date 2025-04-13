import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

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

const userSignIn = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Zalogowany:", user);

      const [firstName, lastName] = user.displayName?.split(" ") || ["", ""];
      document.getElementById("firstName").value = firstName;
      document.getElementById("lastName").value = lastName;
      document.getElementById("email").value = user.email || "";
    })
    .catch((error) => {
      console.error("Błąd logowania:", error);
    });
};

const userSignOut = async () => {
  signOut(auth)
    .then(() => {
      alert("Zostałeś wylogowany!");
    })
    .catch((error) => {
      console.error("Błąd wylogowania:", error);
    });
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Użytkownik zalogowany:", user);
    // W razie gdyby logowanie odbyło się wcześniej
    const [firstName, lastName] = user.displayName?.split(" ") || ["", ""];
    document.getElementById("firstName").value = firstName;
    document.getElementById("lastName").value = lastName;
    document.getElementById("email").value = user.email || "";
  }
});

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);
