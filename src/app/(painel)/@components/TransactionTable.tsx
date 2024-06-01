import React from "react";
import moment from "moment";
import { date } from "@/utils/functions";

interface Transaction {
  id: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  type: string;
  value: number;
  name: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-semibold text-xl mb-4">Transações Recentes</h4>
      <table className="min-w-full">
        <thead className="min-w-full divide-y divide-gray-300">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              Nome da Transação
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              Data
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              Tipo
            </th>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              Valor
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                {transaction.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {" "}
                {moment(
                  new Date(
                    transaction.createdAt.seconds * 1000 +
                      transaction.createdAt.nanoseconds / 1000000
                  )
                ).format("DD/MM/YYYY")}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {transaction.type}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`R$${transaction.value}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
