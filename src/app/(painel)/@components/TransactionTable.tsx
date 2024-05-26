import React from "react";
import moment from "moment";

interface Transaction {
  id: string;
  createdAt: string;
  type: string;
  amount: number;
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
      <h4 className="font-semibold text-xl mb-4">Recent Transactions</h4>
      <table className="min-w-full">
        <thead className="min-w-full divide-y divide-gray-300">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Date</th>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Type</th>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{transaction.name}</td>
              <td  className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{moment(transaction.createdAt).format("DD/MM/YYYY")}</td>
              <td  className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.type}</td>
              <td  className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{`$${transaction.amount}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
