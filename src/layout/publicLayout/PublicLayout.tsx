import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";
import { Suspense } from "react";
import GlobalLoader from "components/globalLoader/GlobalLoader";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={<GlobalLoader />}>
        <div className="w-full">
          <PublicHeader />
          {children}
          <PublicFooter />
        </div>
      </Suspense>
    </>
  );
};

export default PublicLayout;
