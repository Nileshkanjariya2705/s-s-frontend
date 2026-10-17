import { cmsPages } from "constant/common.constant";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import About from "./component/About";
import BlogHeader from "./component/BlogHeader";
import Contact from "./component/Contact";
import Home from "./component/Home";
import Review from "./component/ReviewHeader";
import { getCmsPage } from "pages/publicPages/service/publicPage.service";
import Faq from "./component/Faq";
import GlobalLoader from "components/globalLoader/GlobalLoader";
import { PageNotFound } from "components/pageNotFound/PageNotFound";

const CmsPageView = () => {
  const cmsParams = useParams();
  const [cmsData, setCmsData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      let change_title = cmsParams?.page;
      const getCmsPagesResponse = await getCmsPage({
        page_title: change_title
          ?.split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      });
      setCmsData(getCmsPagesResponse?.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      return error;
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <GlobalLoader />
      ) : (
        <>
          {cmsData && cmsData !== undefined ? (
            cmsParams?.page === cmsPages.Home ? (
              <Home data={cmsData} />
            ) : cmsParams?.page === cmsPages.ContactUs ? (
              <Contact data={cmsData} />
            ) : cmsParams?.page === cmsPages.Blog ? (
              <BlogHeader data={cmsData} />
            ) : cmsParams?.page == cmsPages.AboutUs ? (
              <About data={cmsData} />
            ) : cmsParams?.page === cmsPages.Review ? (
              <Review data={cmsData} />
            ) : cmsParams?.page === cmsPages.Faq ? (
              <Faq data={cmsData} />
            ) : null
          ) : (
            <>
              <PageNotFound />
            </>
          )}
        </>
      )}
    </>
  );
};
export default CmsPageView;
