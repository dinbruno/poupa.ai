"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useFamily } from "@/context/FamilyContext";
import {
  addFinance,
  getFinanceById,
  updateFinance,
} from "@/services/firebaseService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputComponent from "@/components/Input/InputComponent";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

const schema = yup
  .object({
    type: yup.string().required("Tipo é obrigatório"),
    value: yup
      .number()
      .required("Valor é obrigatório")
      .positive("Valor deve ser positivo"),
    name: yup.string().required("Nome é obrigatório"),
    area: yup.string().required("Área é obrigatória"),
    description: yup.string().required("Descrição é obrigatória"),
    isFixedExpense: yup.boolean(),
  })
  .required();

const FinanceForm = ({
  financeId = "",
  selectedMonth,
  handleModal,
  getAllFinances,
}: {
  financeId?: string;
  selectedMonth: any;
  handleModal: (value: string) => void;
  getAllFinances: () => void;
}) => {
  const { user } = useFamily();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    register,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "Entrada",
      value: 0,
      name: "",
      area: "",
      description: "",
      isFixedExpense: false,
    },
  });

  const type = watch("type");

  const onSubmit = async (data: any) => {
    if (financeId) {
      await updateFinance(financeId, data);
    } else {
      await addFinance(data, user.uid);
    }
    await getAllFinances();
    handleModal("");
    toast.success("Operação financeira salva com sucesso!", {
      position: "top-right",
      style: {
        width: "400px",
        accentColor: "#333",
        backgroundColor: "#f4f4f4",
        color: "#333",
      },
    });
  };

  useEffect(() => {
    const loadFinanceData = async () => {
      if (financeId) {
        try {
          const financeData = await getFinanceById(financeId);
          if (financeData) {
            reset(financeData); // Usar os dados recebidos para preencher o formulário
          }
        } catch (error) {
          console.error("Erro ao buscar dados da finança:", error);
          // Tratar possíveis erros, como mostrar uma mensagem ao usuário
        }
      }
    };

    loadFinanceData();
  }, [financeId, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-5 gap-4 items-center"
    >
      <div className="col-span-3">
        <Controller
          name="type"
          control={control}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <>
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tipo de operação
              </label>
              <select
                name={name}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="Entrada">Entrada</option>
                <option value="Despesa">Despesa</option>
              </select>
            </>
          )}
        />
      </div>

      <InputComponent
        inputMode="text"
        type="text"
        control={control}
        name="name"
        className="col-span-2"
        label="Nome"
        error={errors.name}
        placeholder="Insira o nome da operação financeira"
      />

      <div className="col-span-2">
        <label
          htmlFor="value"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Valor
        </label>
        <Controller
          name="value"
          control={control}
          render={({ field: { onChange, value, name } }) => (
            <NumericFormat
              name={name}
              value={value || ""}
              thousandSeparator="."
              defaultValue={null}
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale={true}
              prefix={"R$ "}
              allowNegative={false}
              placeholder="Insira o valor da operação financeira"
              className={`block w-full rounded-md border py-1.5 text-gray-900 focus:ring-indigo-500 ${
                errors.value ? "border-red-500" : "border-gray-300"
              }`}
              onValueChange={(values) => {
                // Certifique-se de passar o valor numérico para o `onChange`
                const { floatValue } = values;
                onChange(floatValue || ""); // Use um valor padrão caso `floatValue` seja undefined
              }}
            />
          )}
        />
        {errors.value && (
          <span className="error-message">{errors.value.message}</span>
        )}
      </div>

      <InputComponent
        inputMode="text"
        type="text"
        control={control}
        name="area"
        className="col-span-3"
        label="Area"
        error={errors.area}
        placeholder="Insira a área da operação financeira"
      />

      <div className="col-span-5">
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Adicione uma descrição
              </label>
              <div className="mt-2">
                <textarea
                  name={name}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
            </div>
          )}
        />
      </div>

      <div className="col-span-4">
        <Controller
          name="isFixedExpense"
          control={control}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <div className="relative flex items-start">
              <div className="flex h-6 items-center">
                <input
                  type="checkbox"
                  name={name}
                  ref={ref}
                  checked={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label htmlFor={name} className="font-medium text-gray-900">
                  {type === "Entrada" ? "Entrada Fixa" : "Despesa Fixa"}
                </label>
                <p id={`${name}-description`} className="text-gray-500">
                  {type === "Entrada"
                    ? "Marque se a entrada for fixa"
                    : "Marque se a despesa for fixa"}
                </p>
              </div>
            </div>
          )}
        />
      </div>

      <div className="flex justify-end pr-8">
        <button
          type="submit"
          className="w-64 rounded-md bg-primary text-white font-semibold px-4 py-2.5 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default FinanceForm;
