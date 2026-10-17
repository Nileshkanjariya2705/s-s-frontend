import {
  Control,
  FieldErrors,
  UseFormRegister,
  useFieldArray,
} from "react-hook-form";
import { PurchaseReqType } from "../types/purchaseRequest.types";
import InputImage from "components/input/InputImage";
import { Button } from "components/button/Button";

interface NestedFormProps {
  id: number;
  register: UseFormRegister<PurchaseReqType>;
  control: Control<PurchaseReqType>;
  errors: FieldErrors<PurchaseReqType>;
  setValue?: Function;
}
const NestedImages = ({
  id,
  register,
  errors,
  control,
  setValue,
}: NestedFormProps) => {
  const { fields, append, remove } = useFieldArray<PurchaseReqType>({
    control,
    name: `product_details.${id}.images`,
  });
  return (
    <>
      <div>
        {fields.map((_item, index) => (
          <div
            className="cs-border-disable relative flex flex-wrap  w-full justify-between py-8 border my-8 p-3 border-dashed border-primarycolor mt-2 "
            key={_item?.id}
          >
            <div className="relative w-1/3 cs-full px-2 flex justify-center">
              <InputImage
                required={true}
                label="Product Image"
                errors={errors}
                id={`product_details.${id}.images.${index}`}
                errorKey={`product_details.${id}.images.${index}`}
                register={register}
                setValue={setValue}
                type="file"
              />
            </div>

            <div className="relative w-full px-2 mt-5 ">
              {fields.length > 1 && (
                <Button
                  className="text-base font-medium text-secondaryOrange border border-secondaryOrange py-2.5 px-10 rounded-xl transition-all duration-300 hover:bg-secondaryOrange hover:text-white"
                  type="button"
                  onClick={() => {
                    remove(index);
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          append({
            product_images: undefined,
          });
        }}
        className="uppercase flex items-center gap-2 bg-primarycolor/10 text-primarycolor px-7 py-3 text-base font-bold rounded-xl"
      >
        <i className="icon-plus text-14px"></i>Add Images
      </button>
    </>
  );
};

export default NestedImages;
