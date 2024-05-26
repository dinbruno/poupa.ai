"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

interface FamilyData {
  familyId: string;
  members: any[];
  admin: string;
}

interface UserData {
  email: string;
  name: string;
  uid: string;
  profileImageUrl?: string;
  familyId: string;
  coverImageUrl?: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  region: string;
}

interface FamilyContextType {
  familyData: FamilyData;
  isLoading: boolean;
  user: UserData;
  updateFamilyData: (data: FamilyData) => Promise<void>;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [familyData, setFamilyData] = useState<FamilyData>({
    familyId: "",
    members: [],
    admin: "",
  });
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData>({
    email: "",
    name: "",
    uid: "",
    region: "",
    city: "",
    firstName: "",
    lastName: "",
    streetAddress: "",
    familyId: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        const userData = await fetchUserData(authUser.uid);
        const familyData = await fetchFamilyData(authUser.uid);
        setUser(userData);
        setFamilyData(familyData);
      } else {
        setUser({
          email: "",
          name: "",
          uid: "",
          region: "",
          city: "",
          firstName: "",
          lastName: "",
          streetAddress: "",
          familyId: "",
        });
        setFamilyData({ familyId: "", members: [], admin: "" });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string): Promise<UserData> => {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return {
      familyId: "",
      email: "",
      name: "",
      uid: "",
      region: "",
      city: "",
      firstName: "",
      lastName: "",
      streetAddress: "",
    };
  };

  const fetchFamilyData = async (uid: string): Promise<FamilyData> => {
    const familyDocRef = doc(db, "families", uid);
    const docSnap = await getDoc(familyDocRef);
    return docSnap.exists()
      ? (docSnap.data() as FamilyData)
      : { familyId: "", members: [], admin: uid };
  };

  const updateFamilyData = async (data: FamilyData) => {
    try {
      if (user) {
        await setDoc(doc(db, "families", user.uid), data);
        setFamilyData(data);
      }
    } catch (error) {
      console.error("Failed to update family data:", error);
    }
  };

  return (
    <FamilyContext.Provider
      value={{ familyData, isLoading, user, updateFamilyData }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error("useFamily must be used within a FamilyProvider");
  }
  return context;
};
