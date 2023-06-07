import { useCallback, useEffect } from "react";
import {
  globalState,
  stateStorage,
  useTriggerState,
} from "react-trigger-state";
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
import { AudioManager } from "@yandeu/audio";
import { GTBasic } from "@geavila/gt-design";
import Header from "./components/Welcome/Header/Header";

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

  const handleDefaultAnimation = useCallback(() => {
    return "Take 001";
  }, []);

  const handleDefaultPosition = useCallback(() => {
    return GOOMBA.position;
  }, []);

  const handleAddMovement = useCallback((goomba: any) => {
    stateStorage.set("goomba_0", goomba);
    globalState.set("goomba_0_direction", "right");
    const scene = stateStorage.get("scene");
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

  const [hideHeader, setHideHeader] = useTriggerState({
    name: "hide_header",
    initial: false,
  });

  const handleInitialSounds = useCallback(async () => {
    const audio = new AudioManager();
    await audio.load("mario_song", "/assets/mp3/theme_song", "mp3");
    const sound = await audio.add("mario_song");
    sound.play();

    setHideHeader(true);
  }, [setHideHeader]);

  const [mainChar, setMainChar] = useTriggerState({
    name: "main_character",
  });

  const [goomba, setGoomba] = useTriggerState({ name: "goomba_0" });

  useEffect(() => {
    if (!mainChar || !goomba) return;

    const scene = stateStorage.get("scene");
    // add collision detection
    scene.physics.add.collider(mainChar, goomba, () => {
      // apply force X to the other direction of the main character
      const lastApplied = stateStorage.get("last_applied_force");
      if (lastApplied == null || new Date().getTime() - lastApplied > 1000) {
        stateStorage.set("last_applied_force", new Date());
        mainChar.body.applyForceX(-10);
        // mainChar.body.applyForceZ(23);
        mainChar.body.applyForceY(23);
      }
    });
  }, [mainChar, goomba]);

  return (
    <>
      {!hideHeader && <Header onClick={handleInitialSounds} />}
      <div>
        <Enable3d>
          <Initial />
          <Preload onPreload={handlePreload} />
          <Lights />
          <Camera />
          <Ambient />
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
    </>
  );
}

export default Enabled;
