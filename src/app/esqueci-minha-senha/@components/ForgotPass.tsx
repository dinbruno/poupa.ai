"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo from "@/assets/png/logo.png";
import { Toaster, toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { set } from "firebase/database";
import { useRouter } from "next/navigation";
import "../../../app/globals.css";
import { handleFirebaseError } from "@/app/utils/functions";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";

const ForgotPassComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleRecovery = async () => {
    if (!email) {
      setError("Por favor, insira um email válido.");
      return;
    }
    try {
        setError("");
      await sendPasswordResetEmail(auth, email);
      toast.success("Email de recuperação enviado com sucesso!");

      setTimeout(() => {
        router.push("/entrar");
      }, 2000);
    } catch (error: any) {
      setError(handleFirebaseError(error.code));
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Toaster />
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <Image
          width={1000}
          height={1000}
          className="mx-auto w-32"
          src={logo}
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Recupere sua conta <span className="text-primary">poupa.ai</span>
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className=" rounded-sm">
          <span title="Voltar para o Login">
            <Link
              href={"/entrar"}
              className="flex items-center w-10 bg-primary text-white justify-center rounded-md my-4 hover:bg-secondary"
            >
              <ArrowLeftCircleIcon className="" />
            </Link>
          </span>
        </div>
        {error && (
          <div className="my-4 p-2 bg-red-100 text-red-600 rounded-xl">
            {error}
          </div>
        )}
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleRecovery}
              className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Enviar email de recuperação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassComponent;
