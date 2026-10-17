import { statusStyle } from "components/table/columns/Supplier.column";
import { DataSourceProps } from "pages/admin/cmsPages/cmsPagesList/types/cmsPages.type";

export const perPage = 10;

export enum RoleConstant {
  superAdmin = "SUPER_ADMIN",
  storeOwner = "STORE_OWNER",
  supplierOwner = "SUPPLIER_OWNER",
}
export const dataSourceRows = (dataSourceCount: DataSourceProps) => {
  const data = [
    {
      uuid: "1d798d04-8756-44b5-a3d3-23cd450f32d4",
      title: "Blogs",
      count: dataSourceCount.getCountOfBlogs,
      url: "blog-list",
    },
    {
      uuid: "ab3521ad-9a68-4b06-baf9-a2037901e5b0",
      title: "Reviews",
      count: dataSourceCount.getCountOfReview,
      url: "review-list",
    },
    {
      uuid: "fc18d51c-18de-4579-8706-ecb48b8a0e4c",
      title: "FAQs",
      count: dataSourceCount.getCountOfFaqs,
      url: "faq-list",
    },
  ];

  const mappedData: DataSourceProps[] = data.map((item) => ({
    title: item.title,
    getCountOfBlogs: item.count,
    getCountOfReview: item.count,
    getCountOfFaqs: item.count,
    url: item.url,
  }));

  return mappedData;
};

export const responseType = {
  Failed: "failed",
  Success: "success",
};

export const toastType = {
  Error: "error",
  Success: "success",
};

export const cmsPages = {
  Home: "home",
  AboutUs: "about-us",
  ContactUs: "contact-us",
  Blog: "blog",
  Review: "review",
  Faq: "faq",
  Blog_details: "Blog-details",
};
export const ImageSize = 10000000;

export const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/png",
  "image/svg",
  "image/svg+xml",
];
export const SUPPORTED_FORMATS_IMAGE = [
  "image/jpeg",
  "image/svg",
  "image/svg+xml",
  "image/png",
];
export const SVG_SUPPORTED_FORMATS = ["image/svg", "image/svg+xml"];

export const categoryCards = 6;
export const featuredCards = 4;

export const ProfileDropdown = [
  {
    name: "Dashboard",
    icon: "icon-dashboard",
    path: "/dashboard",
  },
  {
    name: "Log-out",
    icon: "icon-logout",
    path: "/logout",
  },
];

export const StatusStyles = {
  INACTIVE:
    "text-primaryRed bg-primaryRed/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center",
  ACTIVE:
    "text-lightgreen bg-lightgreen/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
};

export const GeneralReportItems = {
  Total_Suppliers: "Total Suppliers",
  Total_Store_Owners: "Total Store Owners",
  Total_Products: "Total Products",
  Total_Categories: "Total Categories",
  Total_Transactions: "Total Transactions",
  Total_BankTransfers: "Total BankTransfers",
};
export const statusStyles: statusStyle = {
  IN_TRANSIT:
    "text-secondaryOrange bg-secondaryOrange/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center whitespace-nowrap",
  PACKAGED:
    "text-darkgrey bg-darkgrey/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center",
  ACCEPTED:
    "text-secondaryBlue bg-secondaryBlue/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
  DELIVERED:
    "text-lightgreen bg-lightgreen/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
  CANCELLED:
    "text-primaryRed bg-primaryRed/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center",
  PENDING:
    "text-primaryRed bg-primaryRed/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
  INACTIVE: "",
  ACTIVE: "",
  REJECTED:
    "text-purple bg-purple/20 text-xs font-medium rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
  PAID: "text-Primarygreen bg-Primarygreen/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
  OPEN: "text-secondaryOrange bg-secondaryOrange/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center whitespace-nowrap",
  CLOSED:
    "text-primaryRed bg-primaryRed/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center",
  NEW: "text-secondaryBlue bg-secondaryBlue/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
  QUOTED:
    "text-secondaryOrange bg-secondaryOrange/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
  EXPIRED:
    "text-primaryRed bg-primaryRed/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
  COMPLETED:
    "text-primaryGreen bg-secondaryGreen/20 text-xs font-medium  rounded-xl px-2 py-1.5 inline-flex items-center justify-center ",
};

export let monthData_en: { [key: number]: string } = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export let monthData_ar: { [key: number]: string } = {
  1: "يناير",
  2: "فبراير",
  3: "مارس",
  4: "أبريل",
  5: "مايو",
  6: "يونيو",
  7: "يوليو",
  8: "أغسطس",
  9: "سبتمبر",
  10: "أكتوبر",
  11: "نوفمبر",
  12: "ديسمبر",
};

export let monthData_ur: { [key: number]: string } = {
  1: "جنوری",
  2: "فروری",
  3: "مارچ",
  4: "اپریل",
  5: "مئی",
  6: "جون",
  7: "جولائی",
  8: "اگست",
  9: "ستمبر",
  10: "اکتوبر",
  11: "نومبر",
  12: "دسمبر",
};

export const purchaseReuestStatus = {
  QUOTED: "QUOTED",
  COMPLETED: "COMPLETED",
  NEW: "NEW",
  EXPIRED: "EXPIRED",
  BUY_NOW: "BUY_NOW",
};



export const purchaseRequestStatusOptions = (lang: string): { value: string; label: string }[] | undefined => {
  if (lang === "en") {
    return [
      {
        value: "QUOTED",
        label: "Quoted",
      },
      {
        value: "COMPLETED",
        label: "Completed",
      },
      {
        value: "NEW",
        label: "New",
      },
      {
        value: "EXPIRED",
        label: "Expired",
      },
      {
        value: "BUY_NOW",
        label: "Buy Now",
      },
    ];
  }
  if (lang === "ar") {
    return [
      {
        value: "QUOTED",
        label: "مقتبس",
      },
      {
        value: "COMPLETED",
        label: "منجز",
      },
      {
        value: "NEW",
        label: "جديد",
      },
      {
        value: "EXPIRED",
        label: "منتهي الصلاحية",
      },
      {
        value: "BUY_NOW",
        label: "اشتر الآن",
      },
    ];
  }
  if (lang === "ur") {
    return [
      {
        value: "QUOTED",
        label: "حوالہ دیا",
      },
      {
        value: "COMPLETED",
        label: "مکمل",
      },
      {
        value: "NEW",
        label: "نیا",
      },
      {
        value: "EXPIRED",
        label: "ختم ہو چکا ہے",
      },
      {
        value: "BUY_NOW",
        label: "ابھی خریدیں",
      },
    ];
  }
  return undefined;
};
