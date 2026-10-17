import { AxiosError } from "axios";

import { ReviewHeaderFormFields } from "../types/cms.types";
import { axiosDelete, axiosGet, axiosPost } from "../../../../../axios/method";

export const getSingleBlog = async (slug: string, langauge: string) => {
  try {
    const response = await axiosPost("/blog", {
      slug,
      langauge,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};
export const getSingleBlogById = async (uuid: string, langauge: string) => {
  try {
    const response = await axiosPost("/blog/get-single", {
      uuid,
      langauge,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateBlogHeader = async (data: string, lang: string) => {
  try {
    const response = await axiosPost("/blog/update-header", {
      data,
      lang,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const deleteBlog = async (id: string) => {
  try {
    const response = await axiosDelete(`/blog/delete/${id}`);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateContactUs = async (formData: any) => {
  try {
    const response = await axiosPost("/cms/contact-us", formData);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateHomePage = async (formData: any) => {
  try {
    const response = await axiosPost("/cms/updateSpecificPage", formData);
    return response;
  } catch (err: any) {
    return err;
  }
};
export const getSingleReview = async (uuid: string) => {
  try {
    const response = await axiosPost("/cms-review/singleReview", {
      uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const deleteSingleReview = async (reviewId: string) => {
  try {
    const response = await axiosPost("/cms-review/delete/", {
      reviewId,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getBlogList = async (langauge: string) => {
  try {
    const response = await axiosPost("/blog/blog-list", {
      langauge,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateReview = async ({
  page,
  data,
  key,
}: {
  page?: string;
  data: ReviewHeaderFormFields;
  key: string;
}) => {
  try {
    const response = await axiosPost("/cms/updateReviewPage", {
      page,
      data,
      key,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getReviewList = async () => {
  try {
    const response = await axiosGet("/cms-review");
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};

export const updateAboutUs = async (formData: any) => {
  try {
    const response = await axiosPost("/cms/about-us", formData);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateFaqPage = async (formData: any) => {
  try {
    const response = await axiosPost("/cms-faq", formData);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const addFaqQuestionAnswer = async (values: any) => {
  try {
    const response = await axiosPost("/cms-faq/create", values);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getFaqDetail = async (langauge: string) => {
  try {
    const response = await axiosGet("/cms-faq/getFaq", { langauge });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getFaqBlog = async (uuid: string) => {
  try {
    const response = await axiosPost("/cms-faq/get", {
      uuid,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const updateFaq = async (uuid: any, data: any) => {
  try {
    const response = await axiosPost("/cms-faq/updateFaq", {
      uuid,
      data,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const deleteFaq = async (id: string) => {
  try {
    const response = await axiosDelete(`/cms-faq/delete/${id}`);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getCategoryWiseData = async (categoryId: string) => {
  try {
    const response = await axiosGet(`/cms/getSingleCategory/${categoryId}`);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getAdminCategory = async (lang: string) => {
  try {
    const response = await axiosGet("/cms/getCategory", { lang });
    return response;
  } catch (err: any) {
    return err;
  }
};
