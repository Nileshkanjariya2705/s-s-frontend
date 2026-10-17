import RequiredAuth from "../components/authGuard/RequiredAuth";
import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { adminRoutes, publicRoutes, userRoutes } from "./routes";
import { RouteInterface } from "../types/generalTypes";
import { PageNotFound } from "components/pageNotFound/PageNotFound";
import GlobalLoader from "components/globalLoader/GlobalLoader";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "reducers/language.reducer";
import { AppDispatch, RootState } from "store";
import { RoleConstant, responseType } from "constant/common.constant";
import {
  handleGetAccountData,
  handleSetUserDetails,
} from "reducers/account.reducer";
import useUserData from "hooks/getUserData";
import { setToken } from "reducers/token.reducer";
import { getMemberRoutes } from "utility/permission";
import ScrollToTop from "components/scrollOnTop/ScrollToTop";
import { resetSocketDetails, setSocket } from "reducers/socket.reducer";
import { io } from "socket.io-client";
import { REACT_APP_BACKEND_URL } from "config";
import useLocale from "hooks/useLocale";
import { Helmet } from "react-helmet";

export const Router = () => {
  return (
    <BrowserRouter>
      <Helmet>
        <title>ORD</title>
      </Helmet>
      <MainRouter />
    </BrowserRouter>
  );
};
const lang = localStorage.getItem("S&S_Lang");
if (lang === null) {
  localStorage.setItem("S&S_Lang", "en");
}

const MainRouter = () => {
  const { language } = useLocale();
  const dispatch = useDispatch<AppDispatch>();
  const [permittedRoutes, setPermittedRoutes] = useState<
    RouteInterface[] | any
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const { given_permissions, token, role, entity_type } = useUserData();
  const socket = useSelector((state: RootState) => ({
    socket: state.socket.socket,
  }));

  const navigate = useNavigate();
  const location = useLocation();
  const url = new URL(window?.location.href);
  const chat = url.pathname.split("/")[1];

  let order_uuid: string;

  if (chat === "chat") {
    order_uuid = url.pathname.split("/")[2];
  }

  const handleInitialApiCalls = async () => {
    try {
      setLoading(true);
      const data = await dispatch(handleGetAccountData() as any);
      if (
        data.payload.responseType !== responseType.Failed &&
        data.payload.is_active
      ) {
        dispatch(handleSetUserDetails({ ...data.payload }));
        if (socket) {
          dispatch(resetSocketDetails());
        }
        const newSocket = io(`${REACT_APP_BACKEND_URL}`, {
          transports: ["websocket"],
        });
        newSocket?.emit("login", data.payload.uuid);
        newSocket?.emit("join_room", order_uuid);
        dispatch(setSocket({ socket: newSocket }));
      } else {
        setLoading(false);
        navigate("/login");
        dispatch(setToken(""));
        localStorage.removeItem("S&S_authtoken");
      }
      setLoading(false);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    if (token) {
      handleInitialApiCalls();
    }
  }, [token]);

  useEffect(() => {
    dispatch(setLanguage({ language: language, page: location.pathname }));
    if (token) {
      // super admin
      const routes = [...publicRoutes];
      if (role === RoleConstant.superAdmin) {
        setPermittedRoutes([...publicRoutes, ...adminRoutes]);
        if (
          !routes.some((url: { path: string }) => {
            return window.location.pathname.startsWith(`/${url.path}`);
          })
        ) {
          navigate("/admin/admin-dashboard");
        } else if (
          userRoutes.storeOwner.some((url: { path: string }) => {
            return window.location.pathname.startsWith(`${url.path}`);
          }) ||
          userRoutes.supplierOwner.some((url: { path: string }) => {
            return window.location.pathname.startsWith(`${url.path}`);
          })
        ) {
          navigate("/admin/admin-dashboard");
        }
      } else if (role === RoleConstant.storeOwner) {
        // store and supplier
        setPermittedRoutes([...publicRoutes, ...userRoutes.storeOwner]);
        if (
          !routes.some((url: { path: string }) =>
            window.location.pathname.startsWith(`/${url.path}`)
          )
        ) {
          navigate("/dashboard");
        }
      } else if (role === RoleConstant.supplierOwner) {
        // store and supplier
        setPermittedRoutes([...publicRoutes, ...userRoutes.supplierOwner]);
        if (
          !routes.some((url: { path: string }) =>
            window.location.pathname.startsWith(`/${url.path}`)
          )
        ) {
          navigate("/dashboard");
        }
      } else if (role && entity_type) {
        // store and supplier member
        const memberRoutes = getMemberRoutes(given_permissions, entity_type);
        setPermittedRoutes([...publicRoutes, ...memberRoutes]);
        if (
          !routes.some((url: { path: string }) =>
            window.location.pathname.startsWith(`/${url.path}`)
          )
        ) {
          navigate("/dashboard");
        }
      }

      // if (location.pathname === "/admin") {
      //     navigate("/admin/admin-dashboard")
      // }
      if (location.pathname === "/login") {
        navigate("/dashboard");
      }
      if (
        role === RoleConstant.storeOwner ||
        role === RoleConstant.supplierOwner
      ) {
        if (window.location.pathname.startsWith(`/admin`)) {
          navigate("/dashboard");
        }
      }
    } else {
      setPermittedRoutes([...publicRoutes]);
      if (
        !publicRoutes.some((url) => {
          return window.location.pathname.startsWith(`/${url.path}`);
        })
      ) {
        navigate("/");
      } else if (location.pathname.includes("/admin")) {
        navigate("/admin");
      } else {
        navigate("/login");
      }
    }
  }, [role, given_permissions, entity_type]);

  const initialRoutes = useMemo(() => {
    if (permittedRoutes.length > 0) {
      const allRoutes = [
        ...(permittedRoutes?.map((route: RouteInterface) => (
          <Route
            index={route?.index ? true : false}
            key={route.path}
            path={route.path}
            element={<RequiredAuth {...route} />}
          ></Route>
        )) || []),
        <Route path="*" element={<PageNotFound />}></Route>,
      ];
      return allRoutes;
    }
    return [];
  }, [permittedRoutes]);
  
  return (
    <>
      {loading ? (
        <GlobalLoader />
      ) : (
        <>
          <ScrollToTop />
          <Routes>
            {initialRoutes.length > 0 && initialRoutes.map((route) => route)}
          </Routes>
        </>
      )}
    </>
  );
};
