"use client"

import React, { useState } from 'react';
import { registerUser } from '../../services/firebaseService';
import "../../app/globals.css";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [familyName, setFamilyName] = useState('');

  const handleSignup = async () => {
    try {
      const user = await registerUser(email, password, familyName);
      console.log('Usuário registrado com sucesso:', user);
    } catch (error) {
      console.error('Erro no registro:', error);
    }
  };

  return (
    <div>
      <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Nome da Família (opcional)" onChange={(e) => setFamilyName(e.target.value)} />
      <button onClick={handleSignup}>Registrar</button>
    </div>
  );
};

export default SignupPage;
