import { useSelector } from "react-redux";
import { RootState } from "store";

const useLocale = () => {
  const { language } = useSelector((state: RootState) => ({
    language: state.language.language,
  }));

  return {
    language,
  };
};

export default useLocale;
