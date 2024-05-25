"use client"

import React, { useState } from "react";
import { useFamily } from "@/context/FamilyContext";
import { inviteUserToFamily } from "@/services/firebaseService";

const AddUsersForm: React.FC = () => {
  const [emails, setEmails] = useState("");
  const { familyData, isLoading, user } = useFamily();

  const handleInvites = async () => {
    const emailList = emails.split(",").map(email => email.trim());
    if (emailList.length === 0) {
      alert("Por favor, insira ao menos um email.");
      return;
    }
    try {
      debugger
      await Promise.all(emailList.map(email => inviteUserToFamily(user.familyId, email)));
      alert("Convites enviados com sucesso!");
      setEmails("");
    } catch (error) {
      console.error("Erro ao enviar convites:", error);
      alert("Erro ao enviar convites.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-semibold mb-2">Adicionar Membros à Família</h2>
      <textarea
        className="w-full h-32 p-2 border rounded focus:outline-none focus:shadow-outline"
        placeholder="Digite os e-mails dos membros, separados por vírgula"
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        disabled={isLoading}
      />
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleInvites}
        disabled={isLoading}
      >
        Enviar Convites
      </button>
    </div>
  );
};

export default AddUsersForm;
