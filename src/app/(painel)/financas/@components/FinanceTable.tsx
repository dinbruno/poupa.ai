"use client";

import { LordIcon } from "@/components/LordIcon";
import Modal from "@/components/Modal";
import TabPanel from "@/components/TabPanel";
import { useEffect, useState } from "react";
import FinanceForm from "./FinanceForm";
import { useFamily } from "@/context/FamilyContext";
import {
  deleteFinance,
  getFinancesByUser,
  getFinancesByUserWithDataFilter,
  getFinancesByUserWithFilter,
  getFinancesPage,
} from "@/services/firebaseService";
import {
  ArrowDownCircleIcon,
  ArrowDownIcon,
  ArrowUpCircleIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyDollarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ArrowSmallDownIcon } from "@heroicons/react/20/solid";
import { ArrowSmallUpIcon } from "@heroicons/react/20/solid";
import useConfirmationModal from "@/hooks/useConfirmation";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const Months = Object.freeze({
  0: "Janeiro",
  1: "Fevereiro",
  2: "Março",
  3: "Abril",
  4: "Maio",
  5: "Junho",
  6: "Julho",
  7: "Agosto",
  8: "Setembro",
  9: "Outubro",
  10: "Novembro",
  11: "Dezembro",
});

const currentMonth = new Date().getMonth();

export default function FinancasComponent() {
  const [open, setOpen] = useState(false);
  const [finances, setFinances] = useState([] as any[]);
  const [editingFinanceId, setEditingFinanceId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const handleModal = (financeId = "") => {
    setEditingFinanceId(financeId);
    setOpen(!open);
  };

  const { user } = useFamily();

  const getAllFinances = async () => {
    try {
      const financesData = await getFinancesByUserWithFilter(
        user.uid,
        new Date(new Date().getFullYear(), selectedMonth, 1),
        new Date(new Date().getFullYear(), selectedMonth + 1, 0, 23, 59, 59)
      );
      setFinances(financesData);
      setTotalPages(Math.ceil(financesData.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Erro ao buscar finanças:", error);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const { requestConfirmation, modal } = useConfirmationModal();

  const confirmDeletion = (
    title: string,
    id: string,
    internalName?: string
  ) => {
    requestConfirmation(
      `Tem certeza que deseja excluir o campo ${title}? Esta ação é irreversível e pode ocasionar em perda de dados.`,
      () => deleteFinance(id),
      () => toast.error("Ação cancelada")
    );
  };

  const income = finances.reduce((acc, curr) => {
    if (curr.type === "Entrada") {
      const value = parseFloat(curr.value);
      return acc + (isNaN(value) ? 0 : value);
    }
    return acc;
  }, 0);

  const expenses = finances.reduce((acc, curr) => {
    if (curr.type === "Despesa") {
      const value = parseFloat(curr.value);
      return acc + (isNaN(value) ? 0 : value);
    }
    return acc;
  }, 0);

  const balance = income - expenses;

  const deleteItem = async (id: string, title: string) => {
    try {
      await deleteFinance(id);
      await getAllFinances();
      toast.success(`Campo ${title} excluído com sucesso!`, {
        position: "top-right",
        style: {
          width: "400px",
          accentColor: "#333",
          backgroundColor: "#f4f4f4",
          color: "#333",
        },
      });
    } catch (error) {
      console.error("Erro ao excluir campo:", error);
      toast.error("Erro ao excluir campo");
    }
  };

  useEffect(() => {
    getAllFinances();
  }, []);

  useEffect(() => {
    getAllFinances();
  }, [selectedMonth]);

  return (
    <div className="px-2 sm:px-0">
      <Modal open={open} setOpen={setOpen}>
        <FinanceForm
          financeId={editingFinanceId}
          selectedMonth={selectedMonth}
          handleModal={handleModal}
          getAllFinances={getAllFinances}
        />
      </Modal>

      {modal}

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900 text-primary">
            Finanças
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Acompanhe suas finanças e mantenha o controle de seus gastos e
            rendimentos.
          </p>
        </div>
      </div>
      {/* <TabPanel /> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-3">
          <LordIcon
            src="https://cdn.lordicon.com/bhjlwchu.json"
            trigger="loop"
            colors={{ primary: "#8975E6", secondary: "#8975E6" }}
          />

          <div>
            <div className="text-sm font-medium text-gray-500">Entradas</div>
            <div className="flex gap-5">
              <div className="text-lg font-semibold">
                R$ {income.toFixed(2)}
              </div>
              <div className="text-sm font-medium text-green-600 flex items-center">
                <ArrowUpCircleIcon
                  className="h-5 w-5 mr-1"
                  aria-hidden="true"
                />
                {income}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-3 relative">
          <LordIcon
            src="https://cdn.lordicon.com/nhciuzew.json"
            trigger="loop"
            colors={{ primary: "#8975E6", secondary: "#8975E6" }}
          />
          <div>
            <div className="text-sm font-medium text-gray-500">Saídas</div>
            <div className="flex gap-5">
              <div className="text-lg font-semibold">
                R$ {expenses.toFixed(2)}
              </div>
              <div className="text-sm font-medium text-red-600 flex items-center">
                <ArrowDownCircleIcon
                  className="h-5 w-5 mr-1"
                  aria-hidden="true"
                />
                {expenses}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-3">
          <LordIcon
            src="https://cdn.lordicon.com/lbivruks.json"
            trigger="loop"
            colors={{ primary: "#8975E6", secondary: "#8975E6" }}
          />
          <div>
            <div className="text-sm font-medium text-gray-500">Saldo</div>
            <div className="flex gap-5">
              <div className="text-lg font-semibold">
                R$ {balance.toFixed(2)}
              </div>
              <div className="text-sm font-medium ">
                {/* Condicional para mostrar seta para cima ou para baixo baseado no saldo */}
                {balance > 0 ? (
                  <div className="flex items-center text-green-500">
                    <ArrowUpIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                    Ascendente
                  </div>
                ) : (
                  <div className="flex items-center text-orange-400">
                    <ArrowDownCircleIcon
                      className="h-5 w-5 mr-1"
                      aria-hidden="true"
                    />
                    Descendente
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <select
            value={selectedMonth}
            className="mt-2 block w-40 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Object.entries(Months).map(([index, name]) => (
              <option key={index} value={index}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => handleModal("")}
            className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 px-4">
            <div className="inline-block min-w-full py-2 align-middle sm:px-4">
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
                    {finances
                      .slice(startIndex, endIndex)
                      .map(
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
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex gap-1 items-center justify-end">
                              <button
                                className="text-primary hover:text-indigo-900"
                                onClick={() => handleModal(finance.id)}
                              >
                                Editar
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() =>
                                  deleteItem(finance.id, finance.name)
                                }
                              >
                                <TrashIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Anterior
                    </a>
                    <a
                      href="#"
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Próximo
                    </a>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando{" "}
                        <span className="font-medium">{currentPage}</span> dos{" "}
                        <span className="font-medium">{ITEMS_PER_PAGE}</span> de{" "}
                        <span className="font-medium">{totalPages}</span>{" "}
                        resultado(s)
                      </p>
                    </div>
                    <div>
                      <nav
                        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination"
                      >
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Anterior</span>
                          <ChevronLeftIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              currentPage === page
                                ? "z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                                : "text-gray-900 hover:bg-gray-50"
                            } ring-1 ring-inset ring-gray-300`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        >
                          <span className="sr-only">Próximo</span>
                          <ChevronRightIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
