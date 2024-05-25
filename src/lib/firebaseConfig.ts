// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYpUR4Nw7ZUBk4GdhSZp1DrC5h6EpHc9I",
  authDomain: "poupa-ai-dc4a9.firebaseapp.com",
  projectId: "poupa-ai-dc4a9",
  storageBucket: "poupa-ai-dc4a9.appspot.com",
  messagingSenderId: "739121641577",
  appId: "1:739121641577:web:ff0295d711e12bd768caf8",
  measurementId: "G-BR8W553R6T",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
