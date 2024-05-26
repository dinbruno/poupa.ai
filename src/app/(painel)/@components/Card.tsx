import React from 'react';

interface CardProps {
  title: string;
  value: string;
}

const Card: React.FC<CardProps> = ({ title, value }) => (
  <div className="p-4 bg-white shadow rounded-lg h-24">
    <h5 className="text-lg font-bold">{title}</h5>
    <p className="text-2xl">{value}</p>
  </div>
);

export default Card;
