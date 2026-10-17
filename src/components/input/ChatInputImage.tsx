import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  //   useState,
} from "react";
import {
  FieldValues,
  UseFormRegister,
  Path,
  FieldErrors,
} from "react-hook-form";
import { ImageSize } from "constant/common.constant";

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
  hidden?: any;
  height?: number;
  imgData: any;
  setImgData: any;
}

const ChatInputImage = <T extends FieldValues>({
  id,
  errors,
  register,
  type,
  disabled,
  required,
  value,
  hidden,
  setValue,
  isMulitple = true,
  errorKey,
  imgData,
  setImgData,
}: InputProps<T>) => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [fileType, setFileType] = useState<string>("IMAGE");
  const [fileName, setFileName] = useState<string>("");

  //   const [imgData, setImgData] = useState<string | null>(value ? value : null);
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
      setFileType("IMAGE");
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result as string);
      });
      reader.readAsDataURL(selectedFile);
    } else if (
      selectedFile &&
      e.target.files?.[0].type.includes("application")
    ) {
      setFileType("PDF");
      setFileName(selectedFile.name);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(selectedFile);
    } else {
      setFileType("VIDEO");
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      if (selectedFile) {
        reader.readAsDataURL(selectedFile);
      }
    }
  };
  const clearImage = useCallback(() => {
    setValue(isMulitple ? `${id}.fileName` : `${id}`, null);
    setImgData(null);
  }, []);
  useEffect(() => {
    if (!!value) setImgData(value);
  }, [value]);
  const registerdata = register(id, {
    required: required,
    onChange: (e: ChangeEvent<HTMLInputElement>) => onChangePicture(e),
  });
  function renderContent(condition: string) {
    switch (condition) {
      case "PDF":
        return <div className="relative px-3 flex items-start gap-3">
          <h4 className="text-base text-black">{fileName}</h4>
          {!disabled && (
            <button
              className="relative p-2 w-6 h-6 flex items-center justify-center text-lg leading-7 bg-primarycolor rounded-xl text-white focus:outline-none"
              onClick={clearImage}
            >
              <i className="icon-close text-10px p-0.5"></i>
            </button>
          )}
          </div>;
      case "VIDEO":
        return (
          <div className="relative w-36 h-36">
            <video className="w-full h-full object-cover" controls>
              <source src={imgData} />
            </video>
            {!disabled && (
              <button
                className="absolute right-2 top-2 p-2 w-6 h-6 flex items-center justify-center text-lg leading-7 bg-primarycolor rounded-xl text-white focus:outline-none"
                onClick={clearImage}
              >
                &times;
              </button>
            )}
          </div>
        );
      default:
        return (
          <div className="w-28 h-28 relative">
            <img
              id={id}
              draggable={false}
              {...register(id as Path<T>, { required })}
              src={imgData}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            {!disabled && (
              <button
                className="absolute right-2 top-2 p-2 w-6 h-6 flex items-center justify-center text-lg leading-7 bg-primarycolor rounded-xl text-white focus:outline-none"
                onClick={clearImage}
              >
                &times;
              </button>
            )}
          </div>
        );
    }
  }

  return (
    <div className="overflow-hidden relative">
      {imgData ? (
        <>
          {renderContent(fileType)}
        </>
      ) : (
        <>
          <div className="relative">
            <input
              id={id}
              type={type}
              disabled={disabled}
              hidden={hidden}
              {...registerdata}
              ref={(e) => {
                registerdata.ref(e);
                imageRef.current = e;
              }}
              name={id}
              accept={
                "image/jpeg,image/png,image/jpg,image/svg+xml,video/mp4,application/pdf,application/msword"
              }
            />
          </div>
        </>
      )}
      <div>
        {errorMessage ? (
          <small className="text-sm font-semibold text-red-500 block  mt-1">
            {errorMessage.message as string}
          </small>
        ) : null}
      </div>
    </div>
  );
};

export default ChatInputImage;
