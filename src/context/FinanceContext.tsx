"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import { useFamily } from "./FamilyContext"; // Supondo que você tenha um contexto de família
import { getFamilyFinances, getFinancesByUser } from "@/services/firebaseService";

interface Finance {
  id: string;
  type: string;
  value: number;
  name: string;
  area: string;
  description: string;
  isFixedExpense: boolean;
}

interface FinanceContextType {
  userFinances: Finance[];
  familyFinances: Finance[];
  loading: boolean;
  fetchUserFinances: () => void;
  fetchFamilyFinances: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, familyData } = useFamily();
  const [userFinances, setUserFinances] = useState<Finance[]>([]);
  const [familyFinances, setFamilyFinances] = useState<Finance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.uid) {
      fetchUserFinances();
    }
    if (familyData?.familyId) {
      fetchFamilyFinances();
    }
  }, [user, familyData]);

  const fetchUserFinances = async () => {
    setLoading(true);
    const fetchedFinances = await getFinancesByUser(user.uid);
    setUserFinances(fetchedFinances);
    setLoading(false);
  };

  const fetchFamilyFinances = async () => {
    setLoading(true);
    const fetchedFinances = await getFamilyFinances(familyData.familyId);
    setFamilyFinances(fetchedFinances);
    setLoading(false);
  };

  return (
    <FinanceContext.Provider value={{ userFinances, familyFinances, loading, fetchUserFinances, fetchFamilyFinances }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};
