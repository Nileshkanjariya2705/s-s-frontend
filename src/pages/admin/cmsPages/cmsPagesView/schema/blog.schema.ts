import * as yup from "yup";
const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/svg",
  "image/svg+xml",
];
export const ImageSize = 10000000;
export const createBlogSchema = yup.object().shape({
  author_name_en: yup.string().required("Author_Name_Error"),
  title_en: yup.string().required("Title_Name_Error"),
  body_en: yup.string().required("Blog_Content_Error"),
  author_name_ar: yup.string().required("Author_Name_Error"),
  title_ar: yup.string().required("Title_Name_Error"),
  body_ar: yup.string().required("Blog_Content_Error"),
  author_name_ur: yup.string().required("Author_Name_Error"),
  title_ur: yup.string().required("Title_Name_Error"),
  body_ur: yup.string().required("Blog_Content_Error"),
  slug: yup.string().required("Slug_Error"),
  created_at: yup.string().optional(),
  uuid: yup.string().optional(),
  cover_image: yup
    .mixed<File[]>()
    .test("required", "Cover_Image_Error", function (value: any) {
      return value && value.length > 0;
    })
    .test("FILE_SIZE", "Image_Error", (value: any) => {
      return (
        !value ||
        typeof value === "string" ||
        (value[0] && value[0].size <= ImageSize)
      );
    })
    .test(
      "FILE_FORMAT",
      "Image_Format_Error",
      (value: any) =>
        !value ||
        typeof value === "string" ||
        (value && value.length > 0 && SUPPORTED_FORMATS.includes(value[0].type))
    ),
  author_image: yup
    .mixed<File[]>()
    .test("required", "Author_Image_Error", function (value: any) {
      return value && value.length > 0;
    })
    .test("FILE_SIZE", "Image_Error", (value: any) => {
      return (
        !value ||
        typeof value === "string" ||
        (value[0] && value[0].size <= ImageSize)
      );
    })
    .test(
      "FILE_FORMAT",
      "Image_Format_Error",
      (value: any) =>
        !value ||
        typeof value === "string" ||
        (value && value.length > 0 && SUPPORTED_FORMATS.includes(value[0].type))
    ),
});

export const blogHeaderSchema = yup.object().shape({
  page_banner: yup.string().required("Page_Banner"),
  blogData: yup.array().of(
    yup.object().shape({
      page: yup.string().required("Page_Error"),
      heading: yup.string().required("Heading_Error"),
      description: yup.string().required("Descripton_Error"),
    })
  ),
});
