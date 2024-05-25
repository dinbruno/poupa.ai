import { auth, db } from "../lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";

// Registra um novo usuário
export const registerUser = async (
  email: string,
  password: string,
  familyName: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  const familyId = user.uid;

  const familyData = {
    name: familyName,
    admin: user.uid,
    members: [user.uid],
  };

  const userData = {
    email: email,
    uid: user.uid,
    familyId: familyId,
  } as any

  if (familyName) {
    const familyDocRef = doc(db, "families", familyId);
    await setDoc(familyDocRef, familyData);

    userData.familyName = familyName; 
  }

  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, userData);

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

// Desloga o usuário
export const logoutUser = async () => {
  await signOut(auth);
};

function generatePassword() {
  const chars =
    "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
  let password = "";
  for (let i = 0; i < 12; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
}

// Adiciona um usuário e envia convite para redefinir senha
export const inviteUserToFamily = async (familyId: string, email: string) => {
  const password = generatePassword(); // Gerar uma senha aleatória
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Adiciona o usuário na coleção da família
    const familyDocRef = doc(db, "families", familyId);
    await updateDoc(familyDocRef, {
      members: arrayUnion(userId),
    });

    // Enviar e-mail para reset de senha
    sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  }
};
