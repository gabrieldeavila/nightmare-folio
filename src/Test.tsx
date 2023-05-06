import useCube from "./components/Cube/useCube";
import Render from "./components/Render/Render";
import "./global.css";

function Test() {
  useCube({ name: "cube1" });
  useCube({ name: "cube2" });

  return <Render />;
}

export default Test;
