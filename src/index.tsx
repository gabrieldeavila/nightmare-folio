import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Test from "./Test";
import Enabled from "./Enabled";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Test /> */}
    <Enabled />
  </React.StrictMode>
);
