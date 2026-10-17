import { ImageSize, SUPPORTED_FORMATS } from "constant/common.constant"
import * as yup from "yup"

export const addProductSchema = yup.object().shape({
    category_uuid: yup.string().required("Category_Appropriate_Error"),
    measurement_uuid: yup.string().required("Measurement_Appropriate_Error"),
    status: yup.string().required("Staff_Status"),
    name_en: yup.string().required("Name_Error"),
    overview_en: yup.string().required("Overview_Error"),
    description_en: yup.string().required("Descripton_Error"),
    specification_en: yup.string().required("Specification_Error"),
    name_ar: yup.string().required("Name_Error"),
    overview_ar: yup.string().required("Overview_Error"),
    description_ar: yup.string().required("Descripton_Error"),
    specification_ar: yup.string().required("Specification_Error"),
    name_ur: yup.string().required("Name_Error"),
    overview_ur: yup.string().required("Overview_Error"),
    description_ur: yup.string().required("Descripton_Error"),
    specification_ur: yup.string().required("Specification_Error"),
    featured_image: yup.string().required("Featured_Image_Error"),
    product_image: yup.array().of(
        yup.object().shape({
            image: yup
                .mixed<File[]>()
                .test("FILE_SIZE", "Image_Require_Error", (value: any) => {
                    return (
                        !value ||
                        typeof value === "string" ||
                        (value[0] && value[0].size <= ImageSize)
                    )
                })
                .test(
                    "FILE_FORMAT",
                    "Image_Format_Error",
                    (value: any) =>
                        !value ||
                        typeof value === "string" ||
                        (value &&
                            value.length > 0 &&
                            SUPPORTED_FORMATS.includes(value[0].type))
                ),
            featured_image: yup.string().optional(),
        })
    ),
})

export const searchFilterSchema = yup.object().shape({
    productName: yup.string().optional(),
    categoryName: yup.string().optional(),
    status:yup.string().optional()
})
