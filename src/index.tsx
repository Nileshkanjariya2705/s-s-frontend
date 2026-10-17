import ReactDOM from "react-dom/client";
import "./index.css";
import "./icons.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "assets/css/style.css";
import setupAxios from "./axios/method";
import { Provider } from "react-redux";
import { store } from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

setupAxios();

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
