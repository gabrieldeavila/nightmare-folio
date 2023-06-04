// disable eslint
import { THREE } from "enable3d";
import { useCallback, useEffect } from "react";
import { globalState, stateStorage } from "react-trigger-state";
import Ambient from "./components/Ambient/Ambient";
import Camera from "./components/Camera/Camera";
import Character from "./components/Character/Character";
import Controls from "./components/Controls/Controls";
import GOOMBA from "./components/Custom/goomba";
import Enable3d from "./components/Enable/Enable";
import Initial from "./components/Initial/Initial";
import Lights from "./components/Lights/Lights";
import Preload from "./components/Preload/Preload";
import "./global.css";
import { checkDirection } from "./components/Custom/direction";
import { changeRotation } from "./components/Custom/rotation";

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

    load.preload(
      "mario-walking_backwards",
      "/assets/glb/mario-walking_backwards.glb"
    );

    load.preload(
      "mario-running_backwards",
      "/assets/glb/mario-running_backwards.glb"
    );

    load.preload("mario-walking_left", "/assets/glb/mario-walking_left.glb");

    load.preload("mario-walking_right", "/assets/glb/mario-walking_right.glb");

    load.preload("mario-running_left", "/assets/glb/mario-running_left.glb");

    load.preload("mario-running_right", "/assets/glb/mario-running_right.glb");

    load.preload("goomba", "/assets/glb/goomba.glb");

    await Promise.all([ambient, character]);
  }, []);

  useEffect(() => {
    const handleListener = () => {
      if (stateStorage.get("is_playing")) return;

      // add song
      const song = new Audio("/assets/mp3/theme_song.mp3");

      // make it volume to 0.25
      song.volume = 0.25;

      song.loop = true;
      song
        .play()
        .then(() => {
          stateStorage.set("is_playing", true);
          // console.log("success");
        })
        .catch(() => console.log());
    };

    // when there's a mouse move, add song
    document.addEventListener("mousemove", handleListener);

    return () => {
      document.removeEventListener("mousemove", handleListener);
    };
  }, []);

  const handleDefaultAnimation = useCallback(() => {
    return "Take 001";
  }, []);

  const handleDefaultPosition = useCallback(() => {
    return GOOMBA.position;
  }, []);

  const handleTraverse = useCallback((object: any) => {
    // if (object.name.includes("limit")) {
    //   console.log(object.name);
    //   const currLimits = globalState.get("limits") || [];
    //   currLimits.push(object);
    //   globalState.set("limits", currLimits);
    // }
  }, []);

  const handleAddMovement = useCallback((goomba: any) => {
    globalState.set("goomba_0", goomba);
    globalState.set("goomba_0_direction", "right");
  }, []);

  const handleUpdate = useCallback(() => {
    const charName = "goomba_0";
    if (
      checkDirection(charName, GOOMBA.position, -63.660186767578125, "right")
    ) {
      return;
    }

    if (checkDirection(charName, GOOMBA.position, -37.60713577270508, "left")) {
      return;
    }

    changeRotation(charName);
  }, []);

  return (
    <div>
      <Enable3d>
        <Initial />
        <Preload onPreload={handlePreload} />
        <Lights />
        <Camera />
        <Ambient onTraverse={handleTraverse} />
        <Character name="main" asset="mario" isMainCharacter />
        <Character
          name="goomba"
          asset="goomba"
          onDefaultAnimation={handleDefaultAnimation}
          onDefaultPosition={handleDefaultPosition}
          onAddMovement={handleAddMovement}
        />
        <Controls onUpdate={handleUpdate} />
      </Enable3d>
    </div>
  );
}

export default Enabled;
