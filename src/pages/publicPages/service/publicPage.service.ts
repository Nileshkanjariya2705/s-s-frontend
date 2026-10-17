import { AxiosError } from "axios";
import { ApiParamsType } from "components/table/types";
import { axiosGet, axiosPost } from "../../../axios/method";

export const getBlogList = async (
  langauge: string,
  apiParams: ApiParamsType
) => {
  try {
    const response = await axiosPost("/blog/blog-list", {
      langauge,
      apiParams,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getPageData = async (page_title: string) => {
  try {
    const response = await axiosGet("/get/cms-page", { page_title });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const userContactForm = async (data: any) => {
  try {
    const response = await axiosPost("/cms/getInTouch", { ...data });
    return response;
  } catch (error: any) {
    return error;
  }
};

export const getAboutUsBlogList = async (langauge: string) => {
  try {
    const response = await axiosPost("/about/blog-list", {
      langauge,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};
export const getRelatedBlog = async (langauge: string) => {
  try {
    const response = await axiosPost("/blog/blog-details/related-blog", {
      langauge,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getHomeBlogList = async (langauge: string) => {
  try {
    const response = await axiosPost("/home/blog-list", {
      langauge,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getContactBlogList = async (langauge: string) => {
  try {
    const response = await axiosPost("/contact/blog-list", {
      langauge,
    });
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getAboutUsReviews = async () => {
  try {
    const response = await axiosPost("/about/reviews", {});
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getHomeReviews = async () => {
  try {
    const response = await axiosPost("/home/reviews", {});
    return response;
  } catch (err: any) {
    return err;
  }
};

export const getCmsPage = async (page_title: any) => {
  try {
    const response = await axiosGet("/get/cms-page", page_title);
    return response;
  } catch (err: unknown) {
    return (err as AxiosError).response;
  }
};
