import RoutesWrapper from "./Routes";
import { BrowserRouter } from "react-router-dom";
import "./global.css";

function App() {
  return (
    <BrowserRouter>
      <RoutesWrapper />
    </BrowserRouter>
  );
}

export default App;
