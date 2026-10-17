import { useCallback } from "react";

const useAutoFocus = () => {
  const inputRef = useCallback((inputElement:any) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return inputRef;
};

export default useAutoFocus;
