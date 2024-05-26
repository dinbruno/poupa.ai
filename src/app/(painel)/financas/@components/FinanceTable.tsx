"use client";

import { LordIcon } from "@/components/LordIcon";
import Modal from "@/components/Modal";
import TabPanel from "@/components/TabPanel";
import { useEffect, useState } from "react";
import FinanceForm from "./FinanceForm";
import { useFamily } from "@/context/FamilyContext";
import { getFinancesByUser } from "@/services/firebaseService";

export default function FinancasComponent() {
  const [open, setOpen] = useState(false);
  const [finances, setFinances] = useState([] as any[]);
  const [editingFinanceId, setEditingFinanceId] = useState("");

  const handleModal = (financeId = "") => {
    setEditingFinanceId(financeId);
    setOpen(!open);
  };

  const { user } = useFamily();

  const getAllFinances = async () => {
    try {
      const finances = await getFinancesByUser(user.uid);
      console.log(finances, "users");
      setFinances(finances);
    } catch (error) {
      console.error("Erro ao buscar finanças:", error);
    }
  };

  useEffect(() => {
    getAllFinances();
  }, []);

  return (
    <div className="">
      <Modal open={open} setOpen={setOpen}>
        <FinanceForm financeId={editingFinanceId} />
      </Modal>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => handleModal("")}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Adicionar
          </button>
        </div>
      </div>
      <TabPanel />
      <div className="">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Nome
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Tipo
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Valor
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Despesa/Rendimento Fixa
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {finances.map(
                      (finance: {
                        id: string;
                        name: string;
                        type: string;
                        value: string;
                        isFixedExpense: boolean;
                      }) => (
                        <tr key={finance.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {finance.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {finance.type}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {finance.value}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {finance.isFixedExpense ? "Sim" : "Não"}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              className="text-indigo-600 hover:text-indigo-900"
                              onClick={() => handleModal(finance.id)}
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
