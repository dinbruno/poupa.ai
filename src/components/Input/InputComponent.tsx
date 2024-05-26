// Dependencies
import { Controller } from "react-hook-form";
import InputMask from "react-input-mask";

// Style

// Types
import { InputProps } from "./input.types";

const InputComponent = ({
  label,
  error,
  control,
  name,
  mask,
  handleBlur,
  handleFocus,
  handleOnChange,
  placeholder,
  disabled,
  type,
  defaultValue,
  required,
  inputMode,
  tabindex,
  loading,
  icon,
  min,
  className,
  autoFocus = false,
}: InputProps) => {
  return (
    <div className={`${className} w-full`}>
      {label && (
        <label className={`${!!required && "required"} block text-sm font-medium leading-6 text-gray-900`}>{label}</label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <>
            {mask ? (
              <InputMask
                {...field}
                maskChar={null}
                alwaysShowMask={false}
                autoFocus={autoFocus}
                type={type}
                min={min ? min : 1}
                inputMode={inputMode || "text"}
                disabled={disabled || loading}
                placeholder={placeholder}
                value={field.value || ""}
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:primary sm:text-sm sm:leading-6 ${
                  icon ? "pr-11" : ""
                }`}
                onBlur={() => handleBlur && handleBlur(field.value)}
                onFocus={() => handleFocus && handleFocus(field.value)}
                onChange={(e) => {
                  field.onChange(e);
                  handleOnChange && handleOnChange(e.target.value);
                }}
                tabIndex={tabindex || 1}
                mask={mask}
              />
            ) : (
              <input
                {...field}
                autoFocus={autoFocus}
                type={type}
                min={min ? min : 1}
                inputMode={inputMode || "text"}
                disabled={disabled || loading}
                placeholder={placeholder}
                value={field.value || ""}
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6  ${
                  icon ? "pr-11" : ""
                } `}
                onBlur={() => handleBlur && handleBlur(field.value)}
                onFocus={() => handleFocus && handleFocus(field.value)}
                onChange={(e) => {
                  field.onChange(e);
                  handleOnChange && handleOnChange(e.target.value);
                }}
                tabIndex={tabindex || 1}
              />
            )}
          </>
        )}
      />
      {icon}
      {error?.message && <span className="error-message">{error.message}</span>}
    </div>
  );
};

export default InputComponent;
