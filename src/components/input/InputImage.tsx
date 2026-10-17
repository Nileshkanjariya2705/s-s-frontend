import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import {
  FieldValues,
  UseFormRegister,
  Path,
  FieldErrors,
} from "react-hook-form";
import { ImageSize } from "constant/common.constant";
import { useIntl } from "react-intl";

interface InputProps<T extends FieldValues> {
  label?: React.ReactNode;
  id: Path<T>;
  type: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors | any;
  disabled?: boolean;
  style?: string;
  value?: string | null;
  multiple?: boolean;
  getBase64?: boolean;
  setValue?: any;
  isMulitple?: boolean;
  onlySvg?: boolean;
  name?: string;
  index?: number;
  errorKey?: string;
  height?: number;
  supportImage?: boolean;
  setSupportImage?: Dispatch<SetStateAction<boolean>>;
}

const InputImage = <T extends FieldValues>({
  label,
  id,
  errors,
  register,
  type,
  disabled,
  required,
  style,
  value,
  setValue,
  isMulitple = true,
  errorKey,
  onlySvg = false,
  height = 80,
  supportImage,
  setSupportImage,
}: InputProps<T>) => {
  const intl = useIntl();
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [imgData, setImgData] = useState<string | null>(value ? value : null);
  let errorMessage: { message: string } | undefined = undefined;
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

  const onChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (
      selectedFile &&
      selectedFile.type.includes("image") &&
      selectedFile.size <= ImageSize
    ) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result as string);
      });
      reader.readAsDataURL(selectedFile);
    }
  };

  const clearImage = useCallback(() => {
    setValue(isMulitple ? `${id}.fileName` : `${id}`, FileList);
    setImgData(null);
  }, []);
  useEffect(() => {
    if (!!value) {
      setImgData(value);
    }
  }, [value]);
  const registerdata = register(id, {
    required: required,
    onChange: (e: ChangeEvent<HTMLInputElement>) => onChangePicture(e),
  });
  useEffect(() => {
    if (supportImage === false) {
      clearImage();
      setSupportImage?.(true);
    }
  }, [supportImage]);
  return (
    <div className="w-full">
      <label
        className="text-sm font-medium  text-black mb-3 inline-block "
        htmlFor={id}
      >
        {label && (
          <>
            {label} {required && <span className="text-red-600">*</span>}
          </>
        )}
      </label>

      {imgData ? (
        <>
          <div className="h-80 hidden"></div>
          <div
            className={`relative cs-width-img p-5 rounded-2xl border border-dashed 
             ${`h-${height}`} border-primarycolor/20`}
          >
            {!disabled && (
              <button
                className="absolute right-3 top-3 p-2 w-6 h-6 flex items-center justify-center text-lg leading-7 bg-primarycolor rounded-xl text-white focus:outline-none"
                onClick={clearImage}
              >
                <span className="mt-[1px]"> &times;</span>
              </button>
            )}
            <div className="bg-slate-100 p-2 rounded-lg w-full h-full">
              <img
                id={id}
                className={`w-full h-full  object-top object-contain rounded-2xl`}
                draggable={false}
                {...register(id as Path<T>, { required })}
                src={imgData}
                alt="Preview"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <input
              id={id}
              type={type}
              disabled={disabled}
              className={clsx(
                style
                  ? style
                  : `bg-white border border-black/10 focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-[11px] leading-6 px-4 pr-28 file-select`,
                disabled && `opacity-50 cursor-default`
              )}
              {...registerdata}
              ref={(e) => {
                registerdata.ref(e);
                imageRef.current = e;
              }}
              name={id}
              accept={onlySvg ? "image/svg+xml" : "image/*"}
            />
          </div>
        </>
      )}
      <div>
        {errorMessage ? (
          <small className="text-sm font-semibold text-red-500 block  mt-1">
            {intl.formatMessage({
              id: errorMessage.message as string,
            })}
          </small>
        ) : null}
      </div>
    </div>
  );
};

export default InputImage;
