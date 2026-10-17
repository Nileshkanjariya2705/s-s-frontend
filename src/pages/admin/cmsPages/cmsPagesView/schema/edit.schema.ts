import * as yup from "yup";

export const createBlogSchema = (language: string) => {
  return yup.object().shape({
    [`author_name_${language}`]: yup
      .string()
      .required("Author name is required"),
    [`title_${language}`]: yup.string().required("Title name is required"),
    // [`blog_content_${language}`]: yup
    //   .string()
    //   .required("Blog content is required"),
    // cover_image: yup
    //   .mixed()
    //   .test("fileOrStringType", "Invalid image type", (value) => {
    //     if (
    //       value instanceof File &&
    //       !["image/jpeg", "image/png"].includes(value.type)
    //     ) {
    //       return false;
    //     }
    //     if (typeof value === "string") {
    //       return true;
    //     }
    //     return false;
    //   }),
    // author_image: yup
    //   .mixed()
    //   .test("fileOrStringType", "Invalid image type", (value) => {
    //     if (
    //       value instanceof File &&
    //       !["image/jpeg", "image/png"].includes(value.type)
    //     ) {
    //       return false;
    //     }
    //     if (typeof value === "string") {
    //       return true;
    //     }
    //     return false;
    //   }),
  });
};

export const UpdateBlogSchema = yup.object().shape({
  title: yup.string().required("Title  is required"),
  banner_heading: yup.string().required("Blog content name is required"),
  blog_content: yup.string().required("Blog content name is required"),
  blog_image: yup
    .mixed()
    .test("fileType", "Invalid image type", (value: any) => {
      if (!value || !value[0]) {
        return true;
      }
      return value && ["image/jpeg", "image/png"].includes(value[0].type);
    }),
});

export const aboutUsValidationSchema = yup.object().shape({
  banner_section_heading: yup
    .string()
    .required("Banner section heading  is required"),
  banner_section_subheading: yup
    .string()
    .required("Banner Section Subheading required"),

  banner_section_collections: yup.array().of(
    yup.object().shape({
      error: yup.string().required("Collection Text is required"),
    })
  ),
  button_text: yup.string().required("Button Text required"),
  button_link: yup.string().required("Button Link required"),

  choose_us_header: yup.string().required("Choose Us Header required"),
  choose_us_card: yup.array().of(
    yup.object().shape({
      error: yup.string().required("Choose Us Text is required"),
      image: yup.mixed().required("image is required"),
    })
  ),

  // banner_section_img: yup.array().of(
  //   yup.object().shape({
  //     image: yup
  //       .mixed()
  //       .test("banner_section_img", "Invalid image type", (value: any) => {
  //         if (value && value.length !== 0) {
  //           if (!value[0]) {
  //             return false;
  //           }
  //           return value && ["image/jpeg", "image/png"].includes(value[0].type);
  //         } else {
  //           return true;
  //         }
  //       }),
  //   })
  // ),

  // blog_image: yup
  //   .mixed()
  //   .test("fileType", "Invalid image type", (value: any) => {
  //     if (!value || !value[0]) {
  //       return true;
  //     }
  //     return value && ["image/jpeg", "image/png"].includes(value[0].type);
  //   }),
});
