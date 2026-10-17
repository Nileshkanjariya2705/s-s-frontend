import { ChangeEvent } from "react";
import clsx from "clsx";

import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { useIntl } from "react-intl";
import useLocale from "hooks/useLocale";

interface InputProps<T extends FieldValues> {
  label?: React.ReactNode;
  id?: Path<T>;
  type: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors | any;
  disabled?: boolean;
  placeholder?: string;
  style?: string;
  value?: string | number;
  readonly?: boolean;
  errorKey?: string;
  checked?: boolean;
  HandleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  HandleBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: Path<T>;
  isChatInput?: boolean;
  fixDecimal?: boolean;
  handleClick?: any;
}

const Input = <T extends FieldValues>({
  label,
  id,
  errors,
  register,
  type,
  disabled,
  required,
  placeholder,
  style,
  value,
  readonly,
  errorKey,
  HandleChange,
  HandleBlur,
  name,
  checked,
  isChatInput,
  fixDecimal,
  handleClick,
}: InputProps<T>) => {
  let errorMessage: { message: string } | undefined = undefined;
  const { language } = useLocale();
  const intl = useIntl();
  if (Object.keys(errors).length) {
    if (errorKey) {
      const getError = (err: any, errorKeyArr: string[]): any => {
        const tempKeys = [...errorKeyArr];
        const currentKey = tempKeys.shift();

        if (err && currentKey) {
          if (tempKeys.length === 0) {
            return err[currentKey];
          }
          return getError(err[currentKey], tempKeys);
        }
        return;
      };

      errorMessage = getError(errors, errorKey.split("."));
    } else {
      errorMessage = errors[id];
    }
  }
  const handleDecimalValidation = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/(\..*)\./g, "$1")
      .replace(/(\.[\d]{2})./g, "$1");
  };

  return (
    <>
      {label && (
        <>
          <label
            className={`${
              isChatInput
                ? "hidden"
                : "text-sm font-medium text-black mb-3 inline-block "
            }`}
            htmlFor={id}
          >
            {label && (
              <>
                {label} {required && <span className="text-red-600">*</span>}
              </>
            )}
          </label>
        </>
      )}
      <input
        id={id}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        {...register(name ? name : (id as Path<T>), {
          required,
          onChange: HandleChange
            ? (e) => {
                HandleChange(e);
              }
            : undefined,
          onBlur: HandleBlur ? (e) => HandleBlur(e) : undefined,
        })}
        defaultValue={value}
        readOnly={readonly}
        className={clsx(
          style
            ? style
            : `bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 w-full placeholder:text-black/30 placeholder:font-medium text-sm accent-primarycolor rounded-xl block  py-3 leading-[22px] px-4`,
          disabled && `cursor-default`
        )}
        name={name ? name : id}
        checked={checked}
        onInput={(e: ChangeEvent<HTMLInputElement>) => {
          if (fixDecimal) {
            handleDecimalValidation(e);
          }
        }}
        onClick={handleClick}
        dir={language === "en" ? "ltr" : "rtl"}
      />

      {errorMessage && errorMessage?.message ? (
        <small className="text-sm w-full font-semibold text-red-500 block mt-1">
          {intl.formatMessage({
            id: errorMessage?.message as string,
          })}
        </small>
      ) : null}
    </>
  );
};

export default Input;
