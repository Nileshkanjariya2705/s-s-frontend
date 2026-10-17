import * as yup from "yup";

export const ChooseBranchSchema = yup.object().shape({
    branch: yup.string().required("Branch required"),
});
