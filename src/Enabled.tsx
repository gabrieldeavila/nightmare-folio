// disable eslint
/* eslint-disable */
import { useCallback } from "react";
import { stateStorage } from "react-trigger-state";
import Ambient from "./components/Ambient/Ambient";
import Camera from "./components/Camera/Camera";
import Character from "./components/Character/Character";
import Controls from "./components/Controls/Controls";
import Enable3d from "./components/Enable/Enable";
import Initial from "./components/Initial/Initial";
import Lights from "./components/Lights/Lights";
import Preload from "./components/Preload/Preload";
import "./global.css";

const animations = {
  stop: ["idle", "hiphop"],
  fall: ["falling", "falling_to_roll"],
  walk: ["walking"],
  jump: ["jumping"],
  run: ["running"],
};

function Enabled() {
  const handlePreload = useCallback(async () => {
    const { load } = stateStorage.get("scene");

    // it shall be in the public folder!!
    const ambient = load.preload("ambient", "/assets/glb/ambient.glb");

    // it shall be in the public folder!!
    const character = load.preload("cat", "/assets/glb/CatMac.glb");

    await Promise.all([ambient, character]);
  }, []);

  return (
    <div>
      <Enable3d>
        <Initial />
        <Preload onPreload={handlePreload} />
        <Lights />
        <Camera />
        <Ambient />
        <Character name="main" asset="cat" isMainCharacter />
        {/* <Character name="test" asset="cat" /> */}
        <Controls />
      </Enable3d>
    </div>
  );
}

export default Enabled;
