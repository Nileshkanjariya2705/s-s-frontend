import { useSelector } from "react-redux";
import GlobalLoader from "components/globalLoader/GlobalLoader";
import { RouteInterface } from "../../types/generalTypes";
import { RootState } from "store";
import StoreOwnerSideBar from "layout/sidebars/StoreOwnerSideBar";
import SupplierSideBar from "layout/sidebars/SupplierSideBar";
import MemberSideBar from "layout/sidebars/MemberSideBar";
import { RoleConstant } from "constant/common.constant";
import AdminLayout from "layout/adminLayout/AdminLayout";
import { Suspense } from "react";
import PrivateLayout from "layout/privateLayout/PrivateLayout";
import PublicLayout from "layout/publicLayout/PublicLayout";
import Loading from "components/globalLoader/Loading";

const RequiredAuth = (props: RouteInterface) => {
  const { token, role } = useSelector((state: RootState) => ({
    token: state.token.token,
    email: state.account.email,
    role: state.account.role,
    uuid: state.account.uuid,
  }));

  if (
    props.isPublic &&
    props.isAdmin &&
    !token &&
    !localStorage.getItem("S&S_authtoken")
  ) {
    return (
      <>
        <Suspense fallback={<GlobalLoader />}>
          <props.element />
        </Suspense>
      </>
    );
  } else if (
    props.isPublic &&
    !token &&
    !localStorage.getItem("S&S_authtoken")
  ) {
    return (
      <>
        <PublicLayout>
          <props.element />
        </PublicLayout>
      </>
    );
  } else if (token && role === RoleConstant.superAdmin) {
    if (props.isPublic) {
      return (
        <>
          <PublicLayout>
            <props.element />
          </PublicLayout>
        </>
      );
    } else {
      return (
        <div className="flex min-w-0 flex-auto bg-Primarycolors p-5 lg:p-8 h-screen overflow-hidden">
          <AdminLayout>
            <props.element />
          </AdminLayout>
        </div>
      );
    }
  } else if (token && role === RoleConstant.supplierOwner) {
    if (props.isPublic) {
      return (
        <>
          <PublicLayout>
            <props.element />
          </PublicLayout>
        </>
      );
    } else if (
      !props.isPublic &&
      !props.isAdmin &&
      props.isPrivate &&
      props.withoutSideBar
    ) {
      return (
        <PublicLayout>
          <div className="px-5 py-5 md:px-5 md:py-10 mt-86px min-h-[950px]">
            <div className="container mx-auto">
              {/* <div className="flex space-y-30px xl:space-y-0 xl:space-x-30px flex-wrap xl:flex-nowrap"> */}
              <Suspense fallback={<GlobalLoader />}>
                <props.element />
              </Suspense>
              {/* </div> */}
            </div>
          </div>
        </PublicLayout>
      );
    } else {
      return (
        <PrivateLayout>
          <div className="px-5 py-5 md:px-5 md:py-10 mt-86px min-h-[950px]">
            <div className="container mx-auto">
              <div className="flex space-y-5 lg:space-y-30px xl:space-y-0 xl:space-x-30px flex-wrap xl:flex-nowrap rtl:space-x-reverse items-start">
                {<SupplierSideBar />}
                <Suspense
                  fallback={
                    <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  }
                >
                  <props.element />
                </Suspense>
              </div>
            </div>
          </div>
        </PrivateLayout>
      );
    }
  } else if (token && role === RoleConstant.storeOwner) {
    if (props.isPublic) {
      return (
        <>
          <PublicLayout>
            <props.element />
          </PublicLayout>
        </>
      );
    } else if (
      !props.isPublic &&
      !props.isAdmin &&
      props.isPrivate &&
      props.withoutSideBar
    ) {
      return (
        <PublicLayout>
          <div className="px-5 py-5 md:px-5 md:py-10 mt-86px min-h-[950px]">
            <div className="container mx-auto">
              {/* <div className="flex space-y-30px xl:space-y-0 xl:space-x-30px flex-wrap xl:flex-nowrap"> */}
              <Suspense
                fallback={
                  <Loading className="flex items-center justify-center w-full h-screen bg-white/80 z-[999]" />
                }
              >
                <props.element />
              </Suspense>
              {/* </div> */}
            </div>
          </div>
        </PublicLayout>
      );
    } else {
      return (
        <PrivateLayout>
          <div className="px-5 py-5 md:px-5 md:py-10 mt-86px min-h-[950px] ">
            <div className="container mx-auto">
              <div className="flex space-y-5 lg:space-y-30px xl:space-y-0 xl:space-x-30px flex-wrap xl:flex-nowrap rtl:space-x-reverse items-start">
                {<StoreOwnerSideBar />}
                <Suspense
                  fallback={
                    <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  }
                >
                  <props.element />
                </Suspense>
              </div>
            </div>
          </div>
        </PrivateLayout>
      );
    }
  } else if (token && role) {
    //it will certainly default role made by owner
    if (props.isPublic) {
      return (
        <>
          <PublicLayout>
            <props.element />
          </PublicLayout>
        </>
      );
    } else if (
      !props.isPublic &&
      !props.isAdmin &&
      props.isPrivate &&
      props.withoutSideBar
    ) {
      return (
        <PublicLayout>
          <div className="px-5 py-5 md:px-5 md:py-10 mt-86px min-h-[950px]">
            <div className="container mx-auto">
              <Suspense fallback={<GlobalLoader />}>
                <props.element />
              </Suspense>
            </div>
          </div>
        </PublicLayout>
      );
    } else {
      return (
        <PrivateLayout>
          <div className="px-5 py-5 md:px-5 md:py-70px mt-86px min-h-[820px]">
            <div className="container mx-auto">
              <div className="flex space-y-5 lg:space-y-30px xl:space-y-0 xl:space-x-30px flex-wrap xl:flex-nowrap rtl:space-x-reverse items-start">
                <Suspense
                  fallback={
                    <Loading className="!mt-0 w-full h-full bg-white/70 flex items-center justify-center z-[999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  }
                >
                  {<MemberSideBar />}
                  <props.element />
                </Suspense>
              </div>
            </div>
          </div>
        </PrivateLayout>
      );
    }
  } else {
    return <GlobalLoader />;
  }
};

export default RequiredAuth;
