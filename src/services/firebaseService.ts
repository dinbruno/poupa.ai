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
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

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

  const familyDocRef = await addDoc(collection(db, "families"), {
    name: familyName,
    admin: user.uid,
    members: [user.uid],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(familyDocRef, {
    familyId: familyDocRef.id,
  });

  const userData = {
    email: email,
    uid: user.uid,
    familyId: familyDocRef.id, 
    familyName: familyName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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

export const inviteUserToFamily = async (familyId: string, email: string) => {
  const password = generatePassword();
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    const familyDocRef = doc(db, "families", familyId);
    await updateDoc(familyDocRef, {
      members: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    });

    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
      email: email,
      familyId: familyId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw new Error("Falha ao convidar usuário para a família.");
  }
};

export const addFinance = async (financeData: any, userId: string) => {
  const financeCollectionRef = collection(db, "finances");

  const docRef = await addDoc(financeCollectionRef, {
    ...financeData,
    userId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "finances", docRef.id), {
    id: docRef.id,
  });

  return {
    id: docRef.id,
    ...financeData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
};

export const updateFinance = (id: string, financeData: any) => {
  const financeDoc = doc(db, "finances", id);
  return updateDoc(financeDoc, {
    ...financeData,
    updatedAt: serverTimestamp(),
  });
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
    createdAt: doc.data().createdAt,
    updatedAt: doc.data().updatedAt,
  }));
};

export const getFamilyMembers = async (familyId: string) => {
  const userCollectionRef = collection(db, "users");
  const q = query(userCollectionRef, where("familyId", "==", familyId));

  try {
    const querySnapshot = await getDocs(q);
    const members = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return members;
  } catch (error) {
    console.error("Erro ao buscar membros da família:", error);
    throw new Error("Falha ao buscar membros da família.");
  }
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

export const getFinancesPage = async (
  userId: string,
  page: number,
  itemsPerPage: number,
  lastDocSnapshot = null
) => {
  const financeCollectionRef = collection(db, "finances");
  let q = query(
    financeCollectionRef,
    where("userId", "==", userId),
    orderBy("createdAt"),
    limit(itemsPerPage)
  );

  if (page > 1 && lastDocSnapshot) {
    q = query(q, startAfter(lastDocSnapshot));
  }

  const querySnapshot = await getDocs(q);

  const finances: any[] = [];
  let lastVisible = null;
  querySnapshot.forEach((doc) => {
    finances.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  if (!querySnapshot.empty) {
    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  }

  console.log(finances);

  // Você também pode querer retornar o total de finanças para calcular o número total de páginas
  const totalCountRef = await getDocs(
    query(financeCollectionRef, where("userId", "==", userId))
  );
  const totalItems = totalCountRef.docs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    finances,
    totalPages,
    totalItems,
    lastDocSnapshot: lastVisible,
  };
};

export const getFinancesByUserWithDataFilter = async (
  userId: string,
  month: any
) => {
  const startOfMonth = new Date(new Date().getFullYear(), month, 1);
  const endOfMonth = new Date(
    new Date().getFullYear(),
    month + 1,
    0,
    23,
    59,
    59
  );

  const q = query(
    collection(db, "finances"),
    where("userId", "==", userId),
    where("createdAt", ">=", startOfMonth),
    where("createdAt", "<=", endOfMonth),
    where("isFixedExpense", "==", true)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getFinancesByUserWithFilter = async (
  userId: string,
  start: Date,
  end: Date,
  includeFixed: boolean = false
) => {
  const financeCollectionRef = collection(db, "finances");
  let queries = [
    query(
      financeCollectionRef,
      where("userId", "==", userId),
      where("createdAt", ">=", start),
      where("createdAt", "<=", end)
    )
  ];

  if (includeFixed) {
    queries.push(query(financeCollectionRef, where("userId", "==", userId), where("isFixedExpense", "==", true)));
  }

  const snapshots = await Promise.all(queries.map(getDocs));
  const finances = new Map();

  snapshots.forEach(snapshot => {
    snapshot.docs.forEach(doc => {
      finances.set(doc.id, {...doc.data(), id: doc.id});
    });
  });

  return Array.from(finances.values());
};

