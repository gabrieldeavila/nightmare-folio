import RoutesWrapper from "./Routes";
import { BrowserRouter } from "react-router-dom";
import "./global.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./Translate/Translate";

function App() {
  return (
    <BrowserRouter>
      <RoutesWrapper />
      <I18nextProvider i18n={i18n} />
    </BrowserRouter>
  );
}

export default App;
