"use client"

import { useFamily } from "@/context/FamilyContext";
import { inviteUserToFamily } from "@/services/firebaseService";
import React, { useState } from "react";

const AddUsersForm: React.FC = () => {
  const [emails, setEmails] = useState("");

  const { familyData, isLoading } = useFamily();


  const handleInvites = async () => {
    const emailList = emails.split(",").map((email) => email.trim()); // Separando e limpando os e-mails
    try {
      const promises = emailList.map((email) =>
        inviteUserToFamily(familyData.familyId, email)
      );
      await Promise.all(promises);
      alert("Convites enviados com sucesso!");
      setEmails(""); // Limpa o campo após enviar os convites
    } catch (error) {
      console.error("Erro ao enviar convites:", error);
      alert("Erro ao enviar convites");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-lg font-semibold mb-2">
        Adicionar Membros à Família
      </h2>
      <textarea
        className="w-full h-32 p-2 border rounded focus:outline-none focus:shadow-outline"
        placeholder="Digite os e-mails dos membros, separados por vírgula"
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
      />
      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleInvites}
      >
        Enviar Convites
      </button>
    </div>
  );
};

export default AddUsersForm;
