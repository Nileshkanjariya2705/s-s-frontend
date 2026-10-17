import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  Control,
} from "react-hook-form";
import { useIntl } from "react-intl";
interface DatePicker<T extends FieldValues> {
  label?: React.ReactNode;
  id?: Path<T>;
  required?: boolean;
  errors: FieldErrors | any;
  placeholder?: string;
  name: Path<T>;
  errorKey?: string;
  control?: Control<T>;
  disabled?: boolean;
  minDate?:boolean 
}

const DatePicker = <T extends FieldValues>({
  label,
  errors,
  name,
  id,
  required,
  placeholder,
  errorKey,
  control,
  disabled,
  minDate = true
}: DatePicker<T>) => {
  let errorMessage: { message: string } | undefined = undefined;
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

  let handleColor = (time: Date) => {
    return time.getHours() > 12 ? "text-success" : "text-error";
  };
  const filterPassedTime = (time: Date) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <>
      <label
        className="text-sm font-medium text-black inline-block mb-3"
        htmlFor={id}
      >
        {label && (
          <>
            {label} {required && <span className="text-red-600 ">*</span>}
          </>
        )}
      </label>
      <div className="relative w-full cs-datepicker-css">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => {
            return (
              <>
                <svg
                  className="w-4 h-4 text-gray-500 absolute top-4 left-5 z-10"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                </svg>
                <ReactDatePicker
                  showTimeSelect
                  onChange={onChange}
                  selected={value ? new Date(value) : null}
                  placeholderText={`${placeholder ? placeholder : ""}`}
                  timeClassName={handleColor}
                  filterTime={filterPassedTime}
                  minDate={minDate ? new Date(): null}
                  disabled={disabled}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="bg-white border  border-black/10 pl-12 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block py-3 px-4 leading-[22px] w-full"
                />
              </>
            );
          }}
        />
        {errorMessage ? (
          <small className="text-sm font-semibold text-red-500 block  mt-1">
            {intl.formatMessage({
              id: errorMessage.message as string,
            })}
          </small>
        ) : null}
      </div>
    </>
  );
};

export default DatePicker;
