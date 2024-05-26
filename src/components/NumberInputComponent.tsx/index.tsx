import React from "react";
import { Control, Controller, useFormContext } from "react-hook-form";
import NumericFormat from "react-number-format";

const InputComponent = ({
  label,
  name,
  placeholder,
  className,
  error,
  control,
}: {
  label?: string;
  name: string;
  placeholder: string;
  className: string;
  error: any;
  control: Control<any>;
}) => {
  return (
    <div className={`${className} w-full`}>
      {label && <label>{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <NumericFormat
            value={value}
            onValueChange={(values: any) => {
              const { floatValue } = values;
              onChange(floatValue);
            }}
            thousandSeparator={true}
            decimalSeparator="."
            decimalScale={2}
            fixedDecimalScale={true}
            allowNegative={false}
            placeholder={placeholder}
            className={`block w-full rounded-md border py-1.5 text-gray-900 focus:ring-indigo-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            getInputRef={ref}
          />
        )}
      />
      {error?.message && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default InputComponent;
