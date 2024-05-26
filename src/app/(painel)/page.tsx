"use client";

import React, { useEffect, useState } from "react";
import {
  getFinancesByUser,
  getFamilyFinances,
} from "@/services/firebaseService";
import MixedBarChart from "./@components/MixedBarChart";
import PieChartComponent from "./@components/PieChartComponent";
import TransactionsTable from "./@components/TransactionTable";
import Card from "./@components/Card";
import { useFamily } from "@/context/FamilyContext";
import { UserIcon } from "@heroicons/react/24/outline";

function DashboardPage() {
  const [finances, setFinances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, familyMembers } = useFamily();

  console.log("familyMembers", familyMembers);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFinancesByUser(user.uid);
        setFinances(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch finances", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const totalIncome = finances.reduce(
    (acc, curr: any) => (curr.type === "Entrada" ? acc + curr.value : acc),
    0
  );
  const totalExpenses = finances.reduce(
    (acc, curr: any) => (curr.type === "Despesa" ? acc + curr.value : acc),
    0
  );
  const balance = totalIncome - totalExpenses;

  return (
    <div className="">
      <div className="grid grid-cols-6  gap-4">
        <div className="col-span-4 grid grid-cols-3 gap-4 ">
          <Card title="Total Income" value={`$${totalIncome}`} />
          <Card title="Total Expenses" value={`$${totalExpenses}`} />
          <Card title="Balance" value={`$${balance}`} />
          <div className="bg-white w-full col-span-3 rounded-md shadow ">
            <MixedBarChart data={finances} />
          </div>
        </div>
        <div className="col-span-2 flex flex-col items-center justify-center">
          <div className="shadow bg-white w-full h-full">
            <div className="flex justify-center items-center">
              <PieChartComponent data={finances} />
            </div>
          </div>
          <div className="bg-white rounded-md shadow w-full mt-4 p-4">
            <h2 className="text-2xl font-bold">Family Members</h2>
            <div className="flex -space-x-4 mt-3">
              {familyMembers.map((member: any, index: number) => (
                <span title={`${member.firstName } ${member.lastName} `} key={index}>
                  {member?.profileImageUrl ? (
                    <img
                      key={member.id}
                      src={member.profileImageUrl}
                      alt={`Foto de ${member.firstName}`}
                      className="w-10 h-10 rounded-full border-2 border-white"
                      style={{ zIndex: familyMembers.length - index }}
                    />
                  ) : (
                    <UserIcon className="w-10 h-10 rounded-full border-2 border-white" />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 shadow ">
        <TransactionsTable transactions={finances.slice(0, 10)} />
      </div>
    </div>
  );
}

export default DashboardPage;
