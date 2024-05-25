//Dependencies
import { Control, FieldError } from "react-hook-form";

export type InputProps = {
  label?: string;
  control: Control<any>;
  formatChars?: any;
  name: string;
  showCount?: boolean;
  allowClear?: boolean;
  icon?: JSX.Element;
  placeholder?: string;
  type?: string;
  custonStyle?: {};
  error?: FieldError;
  inputMode: "search" | "text" | "email" | "tel" | "url" | "none" | "numeric" | "decimal";
  prefix?: any;
  min?: string | number;
  mask?: string;
  prefixmask?: string;
  defaultValue?: string | number;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  tabindex?: number;
  autoFocus?: boolean;
  handleBlur?: (e: string) => void;
  handleFocus?: (e: string) => void;
  handleOnChange?: (e: string) => void;
  className?: string
};