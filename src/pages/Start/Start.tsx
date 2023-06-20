/* eslint-disable @typescript-eslint/no-floating-promises */
import { AudioManager } from "@yandeu/audio";
import { useCallback, useEffect } from "react";
import {
  globalState,
  stateStorage,
  useTriggerState,
} from "react-trigger-state";
import Ambient from "../../components/Ambient/Ambient";
import Camera from "../../components/Camera/Camera";
import Character from "../../components/Character/Character";
import Controls from "../../components/Controls/Controls";
import { checkDirection } from "../../components/Custom/direction";
import GOOMBA, {
  goombaArray,
  type TGoomba,
} from "../../components/Custom/goomba";
import { handleAfterMainSetted } from "../../components/Custom/handleAfterMainSetted";
import { changeRotation } from "../../components/Custom/rotation";
import Enable3d from "../../components/Enable/Enable";
import Initial from "../../components/Initial/Initial";
import Lights from "../../components/Lights/Lights";
import Preload from "../../components/Preload/Preload";

function Enabled() {
  const handlePreload = useCallback(async () => {
    const { load } = stateStorage.get("scene");

    // it shall be in the public folder!!
    const ambient = load.preload("ambient", "/assets/glb/fantasy_eco_city.glb");

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

  const handleUpdate = useCallback(() => {}, []);

  const handleInitialSounds = useCallback(async () => {}, []);

  const handleDefaultPosition = useCallback(() => {
    return [0, 10, -30000];
  }, []);

  return (
    <Enable3d>
      <Initial />
      <Preload onPreload={handlePreload} />
      <Lights />
      <Camera />
      <Ambient onStart={handleInitialSounds} />
      <Character
        characterRotationPI={0.8}
        name="main"
        asset="mario"
        isMainCharacter
        onAfterMainSetted={handleAfterMainSetted}
        // @ts-expect-error in a hurry
        onDefaultPosition={handleDefaultPosition}
      />

      <Controls onUpdate={handleUpdate} />
    </Enable3d>
  );
}

export default Enabled;
