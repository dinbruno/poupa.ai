import { auth, db } from "../lib/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

// Registra um novo usuário
export const registerUser = async (
  email: string,
  password: string,
  familyName: string
) => {
  // Criar usuário com autenticação
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  const familyDocRef = await addDoc(collection(db, "families"), {
    name: familyName,
    admin: user.uid,
    members: [user.uid],
  });

  const userData = {
    email: email,
    uid: user.uid,
    familyId: familyDocRef.id,
    familyName: familyName,
  };

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

    // Adiciona o usuário na coleção de usuários com referência à família
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      email: email,
      familyId: familyId,
    });

    // Enviar e-mail para reset de senha
    sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw new Error("Falha ao convidar usuário para a família.");
  }
};

export const addFinance = async (financeData: any, userId: string) => {
  const financeCollectionRef = collection(db, "finances");
  return addDoc(financeCollectionRef, {
    ...financeData,
    userId: userId,
  });
};

export const updateFinance = (id: string, financeData: any) => {
  const financeDoc = doc(db, "finances", id);
  return updateDoc(financeDoc, financeData);
};

export const deleteFinance = (id: string) => {
  const financeDoc = doc(db, "finances", id);
  return deleteDoc(financeDoc);
};

export const getFinancesByUser = async (userId: string) => {
  const q = query(collection(db, "finances"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    type: doc.data().type,
    value: doc.data().value,
    name: doc.data().name,
    area: doc.data().area,
    description: doc.data().description,
    isFixedExpense: doc.data().isFixedExpense,
    userId: doc.data().userId,
  }));
};

export const getFamilyFinances = async (familyId: string) => {
  const q = query(
    collection(db, "finances"),
    where("familyId", "==", familyId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    type: doc.data().type,
    value: doc.data().value,
    name: doc.data().name,
    area: doc.data().area,
    description: doc.data().description,
    isFixedExpense: doc.data().isFixedExpense,
    userId: doc.data().userId,
  }));
};

export const getFinanceById = async (financeId: string) => {
  try {
    const financeRef = doc(db, "finances", financeId);
    const financeSnap = await getDoc(financeRef);
    if (financeSnap.exists()) {
      return { ...financeSnap.data() };
    } else {
      throw new Error("Finança não encontrada");
    }
  } catch (error) {
    console.error("Erro ao buscar finança:", error);
    throw error;
  }
};
