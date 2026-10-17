import { RefObject, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSidebarOpen } from "../reducers/sidebar.reducer";
export const useOutsideAlterer = (
  type: string,
  ref: RefObject<HTMLElement>
) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (type === "sidebar") {
          dispatch(setSidebarOpen(false));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line
  }, [ref]);
};
