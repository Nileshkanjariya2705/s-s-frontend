import * as yup from "yup"
export const reviewsAndRatingSchema = yup.object().shape({
    reviews: yup.string().required("Reviews_Error"),
})

export const ReviewSchema = yup.object().shape({
    reviews: yup.string().optional(),
})

export const ConfirmationReviewSchema = yup.object().shape({
    reviews: yup.string().optional().nullable(),
})

export const replacementProductSchema = yup.object().shape({
    replace_product: yup
        .array()
        .of(
            yup.object().shape({
                product: yup.string().required("product is required"),
                reason: yup
                    .string()
                    .required("Reason for replacement is required"),
            })
        )
        .required(),
})
export const refundProductSchema = yup.object().shape({
    refund_product: yup
        .array()
        .of(
            yup.object().shape({
                product: yup.string().required("product is required"),
                reason: yup.string().required("Reason for refund is required"),
            })
        )
        .required(),
})
