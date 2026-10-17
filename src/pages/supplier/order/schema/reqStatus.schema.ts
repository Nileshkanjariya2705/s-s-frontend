import * as yup from "yup"

export const reqStatusSchema = yup.object({
    reason: yup.string().optional(),
})
