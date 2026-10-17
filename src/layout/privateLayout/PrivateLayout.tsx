import { Outlet } from "react-router-dom";
import PrivateHeader from "./PrivateHeader";
import PrivateFooter from "./PrivateFooter";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "components/ErrorBoundary/ErrorPage";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="hidden p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <>
        <div className="w-full ">
          <ErrorBoundary fallback={<ErrorPage />}>
            <PrivateHeader />
            {children}
            <Outlet />
            <PrivateFooter />
          </ErrorBoundary>
        </div>
      </>
    </>
  );
};

export default PrivateLayout;
