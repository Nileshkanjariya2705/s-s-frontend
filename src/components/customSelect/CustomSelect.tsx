import { ChangeEvent } from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Select from "react-select";

interface Options {
  value: string | boolean;
  label?: string;
  isdisabled?: boolean;
}

interface InputProps<TForm extends FieldValues> {
  parentClass?: string;
  inputClass?: string;
  value?: string;
  placeholder?: string;
  error?: FieldError | any;
  type?: string;
  name: Path<TForm>;
  label?: React.ReactNode;
  options: Options[];
  register: UseFormRegister<TForm>;
  isMulti?: boolean;
  control: Control<TForm, any>;
  onExtChange?: (value: any) => void;
  isDisabled?: boolean;
  isClearable?: boolean;
  hideSelectedValue?: boolean;
  selectedOption?: Options[] | string | number;
  errorKey?: string;
  required: boolean;
  isSearchable?: boolean;
  handleSelectChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const CustomSelect = <TForm extends FieldValues>(props: InputProps<TForm>) => {
  const {
    name,
    register,
    parentClass,
    label,
    inputClass,
    placeholder,
    options,
    error,
    isMulti = false,
    control,
    onExtChange,
    isDisabled,
    isClearable,
    hideSelectedValue,
    selectedOption,
    errorKey,
    required,
    handleSelectChange,
    isSearchable = true,
    ...rest
  } = props;

  let errorMessage: { message: string } | undefined = undefined;
  const intl = useIntl();
  if (Object.keys(error).length) {
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

      errorMessage = getError(error, errorKey.split("."));
    } else {
      errorMessage = error[name];
    }
  }

  const DefaultOption = options.find(
    (opt) => opt.value === selectedOption || opt.label === selectedOption
  );
  return (
    <>
      <div className={`${parentClass ? parentClass : ""} relative`}>
        {label && (
          <label className="text-sm font-medium text-black mb-3 inline-block">
            {label && (
              <>
                {label} {required && <span className="text-red-600">*</span>}
              </>
            )}
          </label>
        )}
        <Controller
          name={name}
          control={control}
          defaultValue={
            selectedOption
              ? Array.isArray(selectedOption) && selectedOption.length > 0
                ? (selectedOption.map((option) =>
                    option.value.toString()
                  ) as any)
                : DefaultOption
              : isMulti
              ? []
              : ""
          }
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <Select
                isClearable={isClearable ? true : false}
                isDisabled={isDisabled ? isDisabled : false}
                {...register(name as Path<TForm>, {
                  required,
                  onChange: handleSelectChange
                    ? (e) => handleSelectChange(e)
                    : undefined,
                })}
                controlShouldRenderValue={
                  hideSelectedValue !== undefined ? hideSelectedValue : true
                }
                className={`${inputClass || ""}cs-select custom-select-box`}
                placeholder={
                  placeholder || (
                    <>
                      <label className="text-black/30 font-medium text-sm">
                        {<FormattedMessage id="Choose" />} {label}
                      </label>
                    </>
                  )
                }
                {...rest}
                options={options}
                isMulti={isMulti}
                isSearchable={isSearchable}
                value={
                  value && isMulti
                    ? Array.isArray(value) &&
                      options.filter((option) => value.includes(option.value))
                    : options.find((c) => c.value === value.toString()) ||
                      DefaultOption ||
                      ""
                }
                isOptionDisabled={(option: any) =>
                  option.isdisabled ? true : false
                }
                defaultValue={options.find(
                  (opt) =>
                    opt.value === selectedOption || opt.label === selectedOption
                )}
                onChange={(selectedOption: any) => {
                  if (Array.isArray(selectedOption)) {
                    const tempSelectedOption = selectedOption.map(
                      (obj) => obj.value
                    );
                    onChange(tempSelectedOption);
                    onExtChange && onExtChange(selectedOption);
                  } else if (selectedOption) {
                    onChange(selectedOption.value);
                    onExtChange && onExtChange(selectedOption);
                  } else {
                    onChange(null);
                  }
                }}
                onBlur={() => {
                  onBlur();
                }}
              />
            );
          }}
          rules={{ required: required }}
        />
        {errorMessage ? (
          <small className="text-sm font-semibold text-red-500 block mt-1">
            {intl.formatMessage({
              id: errorMessage.message as string,
            })}
          </small>
        ) : null}
      </div>
    </>
  );
};

export default CustomSelect;
