import { staticMessages } from "i18n/messages/messages";
import { Router } from "./routing/Router";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useEffect } from "react";

const App = () => {
  const { language, open } = useSelector((state: RootState) => ({
    open: state.sidebar.open,
    language: state.language.language,
  }));

  useEffect(() => {
    const bodyElement = document.body;
    if (language !== "en") {
      bodyElement.setAttribute("dir", "rtl");
    } else {
      bodyElement.setAttribute("dir", "ltr");
    }
    open
      ? bodyElement.classList.add("overflow-hidden")
      : bodyElement.classList.remove("overflow-hidden");
  }, [language, open]);
  return (
    <div className="App">
      <div className="App">
        <IntlProvider locale={language} messages={staticMessages[language]}>
          <Router />
        </IntlProvider>
      </div>
    </div>
  );
};

export default App;
