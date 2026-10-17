import {
    FieldErrors,
    FieldValues,
    Path,
    UseFormRegister,
} from "react-hook-form"
import clsx from "clsx"
import { useIntl } from "react-intl"

interface TextAreaProps<T extends FieldValues> {
    parentClass?: string
    inputClass?: string
    id: Path<T>
    value?: string
    placeholder?: string
    errors?: FieldErrors | any
    type?: string
    required?: boolean
    style?: string
    disabled?: boolean
    name: Path<T>
    label?: React.ReactNode
    register?: UseFormRegister<T>
    fieldLimit?: number
    errorKey?: string
    readonly?: boolean

    rows?: number
}
const TextArea = <T extends FieldValues>({
    parentClass,
    label,
    inputClass,
    type,
    name,
    id,
    required,
    placeholder,
    register,
    disabled,
    errors,
    readonly,
    style,
    fieldLimit,
    errorKey,
    rows,
    ...rest
}: TextAreaProps<T>) => {
    const intl = useIntl()
    let errorMessage: { message: string } | undefined = undefined
    if (Object.keys(errors).length) {
        if (errorKey) {
            const getError = (err: any, errorKeyArr: string[]): any => {
                const tempKeys = [...errorKeyArr]
                const currentKey = tempKeys.shift()

                if (err && currentKey) {
                    if (tempKeys.length === 0) {
                        return err[currentKey]
                    }
                    return getError(err[currentKey], tempKeys)
                }
                return
            }

            errorMessage = getError(errors, errorKey.split("."))
        } else {
            errorMessage = errors[id]
        }
    }

    return (
        <>
            <label
                className='text-sm font-medium text-black mb-3 inline-block'
                htmlFor={id}
            >
                {label}
                {required && <span className='text-red-600 ml-1'>*</span>}
            </label>

            <div className='relative'>
                <textarea
                    rows={rows ?? 5}
                    cols={100}
                    disabled={disabled}
                    readOnly={readonly}
                    className={clsx(
                        style
                            ? style
                            : ` resize-none bg-white border border-black/10  focus:ring-0 focus:outline-none text-gray-900 placeholder:text-black/30 placeholder:font-medium text-sm rounded-xl block w-full py-3 leading-6 px-4`,
                        disabled && `opacity-50 cursor-default`
                    )}
                    placeholder={`${placeholder ? placeholder : ""}`}
                    {...(register &&
                        register(name, { required: "Reason_Error" }))}
                    {...rest}
                    maxLength={fieldLimit}
                />
                {errorMessage ? (
                    <small className='text-sm font-semibold text-red-500 block  mt-1'>
                        {intl.formatMessage({
                            id: errorMessage.message as string,
                        })}
                    </small>
                ) : null}
            </div>
        </>
    )
}

export default TextArea
