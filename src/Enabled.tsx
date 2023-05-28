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
    const ambient = load.preload("ambient", "/assets/glb/mario_level_1.glb");


    // it shall be in the public folder!!
    const character = load.preload("mario", "/assets/glb/mario-t-pose.glb");

    load.preload("mario-idle", "/assets/glb/mario.glb");

    load.preload("mario-walking", "/assets/glb/mario-walking.glb");

    load.preload("mario-running", "/assets/glb/mario-running.glb");

    load.preload("mario-walking_backwards", "/assets/glb/mario-walking_backwards.glb");

    load.preload("mario-running_backwards", "/assets/glb/mario-running_backwards.glb");

    load.preload("mario-walking_left", "/assets/glb/mario-walking_left.glb");

    load.preload("mario-walking_right", "/assets/glb/mario-walking_right.glb");

    load.preload("mario-running_left", "/assets/glb/mario-running_left.glb");

    load.preload("mario-running_right", "/assets/glb/mario-running_right.glb");

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
        <Character name="main" asset="mario" isMainCharacter />
        {/* <Character name="test" asset="cat" /> */}
        <Controls />
      </Enable3d>
    </div>
  );
}

export default Enabled;
