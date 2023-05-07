import useCube from "./components/Cube/useCube";
import useFloor from "./components/Floor/useFloor";
import Render from "./components/Render/Render";
import "./global.css";

const sceneName = "sceneTest";

function Test() {
  useCube({ name: "cube1", sceneName });
  useCube({ name: "cube2", sceneName });
  useFloor({ name: "floor", sceneName });

  return <Render />;
}

export default Test;
