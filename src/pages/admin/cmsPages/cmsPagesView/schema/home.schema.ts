import { ImageSize, SUPPORTED_FORMATS } from "constant/common.constant";
import * as yup from "yup";

export const HomeSchema = yup.object().shape({
  heading: yup.string().required("Banner_Heading_Required_Error"),
  subheding: yup.string().required("Banner_Sub_Heading_Required_Error"),
  bannerButtonText1: yup.string().required("Button_Text_Required_Error"),
  bannerButtonText2: yup.string().required("Button_Text_Required_Error"),
  Collection1: yup.string().required("Collection_Required_Error"),
  Collection2: yup.string().required("Collection_Required_Error"),
  FooterIcon1: yup.string().required("Footer_Icon_Required_Error"),
  FooterIcon2: yup.string().required("Footer_Icon_Required_Error"),
  FooterIcon3: yup.string().required("Footer_Icon_Required_Error"),
  FooterIcon4: yup.string().required("Footer_Icon_Required_Error"),
  productsCount: yup.string().required("Product_Count_Required_Error"),
  banner_section_img: yup.array().of(
    yup.object().shape({
      fileName: yup
        .mixed<File[]>()
        .test("FILE_SIZE", "Image_Require_Error", (value: any) => {
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
            (value &&
              value.length > 0 &&
              SUPPORTED_FORMATS.includes(value[0].type))
        ),
    })
  ),
  catHeading: yup.string().required("Category_Heading_Required_Error"),
  catSubheding: yup.string().required("Category_Sub_Heading_Required_Error"),
  category: yup.array().of(
    yup.object().shape({
      text: yup.string().required("Category_Required_Error"),
    })
  ),

  communityHeading: yup.string().required("Community_Heading_Required_Error"),
  communitySubheding: yup
    .string()
    .required("Community_Sub_Heading_Required_Error"),
  CommTitle1: yup.string().required("Title_Required_Error"),
  ComSubheading1: yup.string().required("Community_Sub_Heading_Required_Error"),
  commButtonText1: yup.string().required("Button_Text_Required_Error"),
  commButtonText2: yup.string().required("Button_Text_Required_Error"),
  CommTitle2: yup.string().required("Title_Required_Error"),
  ComSubheading2: yup.string().required("Community_Sub_Heading_Required_Error"),
  community_network_img: yup.array().of(
    yup.object().shape({
      fileName: yup
        .mixed<File[]>()
        .test("FILE_SIZE", "Image_Require_Error", (value: any) => {
          return !value || value.length > 0;
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
    })
  ),

  purchaseHeading: yup.string().required("Purchase_Heading_Required_Error"),
  purchaseSubheding: yup
    .string()
    .required("Purchase_Sub_Heading_Required_Error"),
  PurchaseButtonText: yup.string().required("Button_Text_Required_Error"),
  purchase_section_img: yup.array().of(
    yup.object().shape({
      fileName: yup
        .mixed<File[]>()
        .test("FILE_SIZE", "Image_Require_Error", (value: any) => {
          return !value || value.length > 0;
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
    })
  ),

  imageHeading1: yup.string().required("Image_Heading_Required_Error"),
  imageSubheading1: yup.string().required("Image_Heading_Required_Error"),
  imageHeading2: yup.string().required("Image_Heading_Required_Error"),
  imageSubheading2: yup.string().required("Image_Heading_Required_Error"),
  dynamic_section_img: yup.array().of(
    yup.object().shape({
      fileName: yup
        .mixed<File[]>()
        .test("FILE_SIZE", "Image_Require_Error", (value: any) => {
          return !value || value.length > 0;
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
    })
  ),

  featuredHeading: yup.string().required("Feature heading  is required"),
  featuredSubheding: yup
    .string()
    .required("Feature_Sub_Heading_Required_Error"),
  featured_products: yup.array().of(
    yup.object().shape({
      image: yup
        .mixed<File[]>()
        .test("REQUIRED", "Image_Require_Error", (value: any) => {
          return !value || value.length > 0;
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
      end_date: yup.string().required("Date is required"),
      title: yup.string().required("Product_Title_Required_Error"),
      subTitle: yup.string().required("Product_Sub_Title_Required_Error"),
      price: yup
        .mixed<string>()
        .test("is-required", "Price_Required_Error", (value) => {
          return value !== undefined && value !== null && value !== "";
        })
        .test("is-number", "Price_Number_Error", (value: any) => {
          return !isNaN(value);
        })
        .test("is-positive", "Price_Positive_Error", (value: any) => {
          return isNaN(value) || value > 0;
        }),
      rating: yup.string().required("Rating_Required_Error"),
      featuredButtonText: yup
        .string()
        .required("Product_Button_Text_Required_Error"),
      featuredButtonLink: yup
        .string()
        .required("Product_Button_Link_Required_Error"),
    })
  ),

  offerHeading: yup.string().required("Offer_Heading_Required_Error"),
  offerSubheding: yup.string().required("Offer_Sub_Heading_Required_Error"),
  offerTitle1: yup.string().required("Title_Required_Error"),
  offerDescription1: yup.string().required("Description_Required_Error"),
  offerTitle2: yup.string().required("Title_Required_Error"),
  offerDescription2: yup.string().required("Description_Required_Error"),
  offerTitle3: yup.string().required("Title_Required_Error"),
  offerDescription3: yup.string().required("Description_Required_Error"),
});
