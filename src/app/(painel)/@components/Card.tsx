import { BanknotesIcon, ChartBarIcon, CurrencyBangladeshiIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: 'cash' | 'chart'; // Tipo de ícone como uma propriedade
}

const iconMapper = {
  cash: <BanknotesIcon className="h-6 w-6  text-green-500" />, // Ícone para dinheiro
  chart: <ChartBarIcon className="h-6 w-6 text-blue-500" /> // Ícone para gráfico
};

const Card: React.FC<CardProps> = ({ title, value, icon }) => (
  <div className="p-4 bg-white shadow rounded-lg flex items-center space-x-4">
    <div className="flex-shrink-0">
      {iconMapper[icon]} 
    </div>
    <div>
      <h5 className="text-lg font-bold text-primary">{title}</h5>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Card;
