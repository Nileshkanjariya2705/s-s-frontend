export interface CmsPageInterface {
  page_title: string;
}
export interface BlogHeaderType {
  blogData: SingleBlogHeaderType[];
  page_banner: string;
}
export type SingleBlogHeaderType = {
  heading: string;
  description: string;
  page: string;
};

export interface UserContactType {
  pageTitle: string;
  heading: string;
  subHeding: string;
  supportTitle: string;
  title1: string;
  subTitle1: string;
  title2: string;
  subTitle2: string;
  title3: string;
  subTitle3: string;
  contact: { image?: File[] }[] | undefined | [];
}

export interface UserContactPublicPageType {
  pageTitle: string;
  heading: string;
  subHeding: string | undefined;
  supportTitle: string;
  title1: string;
  subTitle1: string;
  title2: string;
  subTitle2: string;
  title3: string;
  subTitle3: string;
  contact: { image: string }[];
}

export type FaqType = {
  faqHeading: string;
  faqSubHeading: string;
  faqImage: { image?: File[] }[] | undefined | [];
};

export type FaqDetailUpdate = {
  answer_ar: string;
  question_en: string;
  answer_en: string;
  question_ar: string;
  question_ur: string;
  answer_ur: string;
};

// export type FaqDetailListingType = {
//   uuid: string | undefined;
//   answer_ar?: string | null;
//   question_en?: string | null;
//   answer_en?: string | null;
//   question_ar?: string | null;
//   question_ur?: string | null;
//   answer_ur?: string | null;
// };

export type FaqDetailListingType = {
  uuid: string | undefined;
  [key: string]: string | undefined;
};

// const arr: FaqDetailListingType[] = [
//   { uuid: "", question_en: "", answer_en: "" },
//   { uuid: "", question_ar: "", answer_ar: "" },
//   { uuid: "", question_ur: "", answer_ur: "" },
// ];

export type CmsType = {
  cms_content_ar: string;
  cms_content_en: string;
  cms_content_ur: string;
};

export type HomeType = {
  heading: string;
  bannerButtonText1: string;
  subheding: string;
  bannerButtonText2: string;
  Collection1: string;
  Collection2: string;
  FooterIcon1: string;
  FooterIcon2: string;
  FooterIcon3: string;
  FooterIcon4: string;
  productsCount: string;
  banner_section_img: { fileName?: File[] }[] | undefined | [];
  catHeading: string;
  catSubheding: string;
  category: { image?: File[]; text: string }[] | undefined | [];
  [key: string]: any;
  communityHeading: string;
  communitySubheding: string;
  CommTitle1: string;
  ComSubheading1: string;
  commButtonText1: string;
  commButtonText2: string;
  CommTitle2: string;
  ComSubheading2: string;
  community_network_img: { fileName?: File[] }[] | undefined | [];
  purchaseHeading: string;
  purchaseSubheding: string;
  PurchaseButtonText: string;
  purchase_section_img: { fileName?: File[] }[] | undefined | [];
  imageHeading1: string;
  imageSubheading1: string;
  imageHeading2: string;
  imageSubheading2: string;
  dynamic_section_img: { fileName?: File[] }[] | undefined | [];
  featuredHeading: string;
  featuredSubheding: string;
  featured_products:
    | {
        image?: File[];
        end_date: string;

        // day?: string;
        // hour?: string;
        // min?: string;
        // sec?: string;
        title: string;
        subTitle: string;
        price?: string;
        rating: string;
        featuredButtonText: string;
        featuredButtonLink: string;
      }[]
    | undefined
    | [];

  offerHeading: string;
  offerSubheding: string;
  offerTitle1: string;
  offerDescription1: string;
  offerTitle2: string;
  offerDescription2: string;
  offerTitle3: string;
  offerDescription3: string;
};
export type ModeType = "Edit" | "Create";

export interface AboutUsType {
  banner_section_heading: string;
  banner_section_subheading: string;
  banner_section_collections: { value: string; text: string }[] | undefined;
  choose_us_header: string;
  choose_us_description: string;
  our_team_description: string;
  our_team_header: string;

  about_page_banner: string;
  // our_team: [];
  choose_us_card:
    | { image?: File[]; header: string; description: string }[]
    | undefined
    | [];

  button_text: string;
  our_team:
    | {
        image?: File[];
        position: string;
        name: string;
      }[]
    | undefined
    | [];
  banner_section_img: any;
  // banner_section_img: { image?: File[]; fileName: string }[]  | [];
}

export interface AboutUsPublicPagesType {
  banner_section_heading: string;
  banner_section_subheading: string;
  banner_section_collections: { value: string; text: string }[] | undefined;
  choose_us_header: string;
  choose_us_description: string;
  about_page_banner: string;
  choose_us_card: [];
  button_link: string;
  button_text: string;
  our_team: [];
  banner_section_img: [];
  our_team_header: string;
  our_team_description: string;
}

export interface Blog {
  [key: string]: string | undefined | number;
  uuid: string;
  cover_image?: string | number;
  created_at: string;
  // title_en: string;
  // body_en: string;
  slug: string;
}

export interface FaqTypes {
  faqHeading: string;
  faqSubHeading: string;
  faqImage: { image: string }[];
}

export interface HeaderType {
  heading: string | undefined;
  description: string | undefined;
}

export interface ReviewCard {
  [key: string]: string | undefined | number;
  rating: number;
}
export type BlogData = {
  uuid: string | undefined;
  title_en: string;
  body_en: string;
  author_name_en: string;
  title_ar: string;
  body_ar: string;
  author_name_ar: string;
  title_ur: string;
  body_ur: string;
  author_name_ur: string;
  created_at: string | undefined;
  cover_image: File[] | undefined;
  author_image: File[] | undefined;
  slug: string;
};

export type BlogHeaderData = {
  page_banner: string;
  page: string;
  heading: string;
  description: string;
};
export type SingleBlog = {
  uuid: string;
  [key: string]: string | undefined | number;
  cover_image: string;
  created_at: string;
  slug: string;
};

export type ReviewHeaderDataType = {
  cms_content_ur: string;
  cms_content_en: string;
  cms_content_ar: string;
};

export type ReviewHeaderFormFields = {
  reviewHeaderSection:
    | {
        id?: string;
        page: string;
        heading: string;
        description: string;
      }[]
    | undefined;
};

export type reviewHeader = {
  id?: string;
  page: string;
  heading: string;
  description: string;
};

export type Language = "en" | "ur" | "ar";

export type ReviewListType = {
  uuid: string | undefined;
  rating: string;
  customer_name_en: string;
  customer_name_ar: string;
  customer_name_ur: string;
  customer_designation_en: string;
  customer_designation_ar: string;
  customer_designation_ur: string;
  card_description_en: string;
  card_description_ar: string;
  card_description_ur: string;
  profile_image: File[];
};
export type HomePagePublicType = {
  heading: string;
  bannerButtonText1: string;
  subheding: string;
  bannerButtonLink1: string;
  bannerButtonText2: string;
  bannerButtonLink2: string;
  Collection1: string;
  Collection2: string;
  FooterIcon1: string;
  FooterIcon2: string;
  FooterIcon3: string;
  FooterIcon4: string;
  productsCount: string;
  banner_section_img: { fileName: string }[];
  catHeading: string;
  catSubheding: string;
  category: { text: string; image: string; name: string }[];
  communityHeading: string;
  communitySubheding: string;
  CommTitle1: string;
  ComSubheading1: string;
  commButtonText1: string;
  commButtonLink1: string;
  commButtonText2: string;
  commButtonLink2: string;
  CommTitle2: string;
  ComSubheading2: string;
  community_network_img: { fileName: string }[] | undefined | [];
  purchaseHeading: string;
  purchaseSubheding: string;
  PurchaseButtonText: string;
  PurchaseButtonLink: string;
  purchase_section_img: { fileName: string }[] | undefined | [];
  imageHeading1: string;
  imageSubheading1: string;
  imageHeading2: string;
  imageSubheading2: string;
  dynamic_section_img: { fileName: string }[] | undefined | [];
  featuredHeading: string;
  featuredSubheding: string;
  featured_products:
    | {
        image: string;
        // day: string;
        // hour: string;
        // min: string;
        // sec: string;
        end_date: string;
        title: string;
        subTitle: string;
        price: string;
        rating: string | number;
        featuredButtonText: string;
        featuredButtonLink: string;
      }[]
    | undefined
    | [];

  offerHeading: string;
  offerSubheding: string;
  offerTitle1: string;
  offerDescription1: string;
  offerTitle2: string;
  offerDescription2: string;
  offerTitle3: string;
  offerDescription3: string;
};

export type UserContactSchemaType = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null | undefined;
  message: string;
};
