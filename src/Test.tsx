import useAtom from "./components/Atom/useAtom";
import useFloor from "./components/Floor/useFloor";
import Render from "./components/Render/Render";
import useScene from "./components/Scene/useScene";
import "./global.css";

const sceneName = "sceneTest";

function Test() {
  useScene({ name: sceneName });
  // useAtom({ name: "cube1", sceneName, position: [4, 6, 1, 20, 99] });
  useAtom({ name: "cube3", sceneName, position: [1, 1, 2, 2] });
  useAtom({ name: "cube2", sceneName, position: [1, 4, 1, 20] });
  useFloor({ name: "floor", sceneName });

  return <Render sceneName={sceneName}></Render>;
}

export default Test;
