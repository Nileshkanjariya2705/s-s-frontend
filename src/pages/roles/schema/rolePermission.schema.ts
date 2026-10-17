import * as yup from "yup"

export const rolePermissionSchema = yup.object().shape({
    rolename: yup.string().required("Role_Error"),
    rolename_ar: yup.string().required("Role_Error_ar"),
    rolename_ur: yup.string().required("Role_Error_ur"),
    status: yup.string().required("Role_Status"),
})

