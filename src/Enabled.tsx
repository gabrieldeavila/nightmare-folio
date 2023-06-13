import { AudioManager } from "@yandeu/audio";
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
import { checkDirection } from "./components/Custom/direction";
import GOOMBA, { type TGoomba, goombaArray } from "./components/Custom/goomba";
import { changeRotation } from "./components/Custom/rotation";
import Enable3d from "./components/Enable/Enable";
import Initial from "./components/Initial/Initial";
import Lights from "./components/Lights/Lights";
import Preload from "./components/Preload/Preload";
import Header from "./components/Welcome/Header/Header";
import "./global.css";

function Enabled() {
  const [scene] = useTriggerState({ name: "scene" });

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

  const handleDefaultPosition = useCallback((name: TGoomba) => {
    return GOOMBA[name].position;
  }, []);

  const handleAddMovement = useCallback((goomba: any, name: string) => {
    stateStorage.set(name, goomba);
    globalState.set(`${name}_direction`, "right");
  }, []);

  const [startedPlaying, setStartedPlaying] = useTriggerState({
    name: "started_playing",
    initial: false,
  });

  const handleUpdate = useCallback(() => {
    const charNames = goombaArray;

    if (!startedPlaying) return;

    for (const charName of charNames) {
      if (
        checkDirection(
          charName,
          GOOMBA[charName].position,
          GOOMBA[charName].left_limit,
          "right"
        )
      ) {
        return;
      }

      if (
        checkDirection(
          charName,
          GOOMBA[charName].position,
          GOOMBA[charName].right_limit,
          "left"
        )
      ) {
        return;
      }

      changeRotation(charName);
    }
  }, [startedPlaying]);

  const handleInitialSounds = useCallback(async () => {
    const isUsing3dView = globalState.get("header-form")?.switch ?? true;

    globalState.set("3d_view", isUsing3dView);

    const audio = new AudioManager();
    await audio.load("mario_song", "/assets/mp3/theme_song", "mp3");
    await audio.load("mamma_mia", "/assets/mp3/mamma_mia", "mp3");
    await audio.load("jump", "/assets/mp3/jump", "mp3");

    stateStorage.set("audio", audio);

    const sound = await audio.add("mario_song");

    sound.setLoop(true);

    sound.play();

    setStartedPlaying(true);
  }, [setStartedPlaying]);

  const [mainChar] = useTriggerState({
    name: "main_character",
  });

  // only gets the last goomba to add physics to all of `em
  const [goomba] = useTriggerState({ name: "goomba_0" });

  useEffect(() => {
    if (!mainChar || !goomba) return;
    const view3d = globalState.get("3d_view");

    const scene = globalState.get("scene");
    for (const charName of goombaArray) {
      const goombaObj = globalState.get(charName);
      // add collision detection
      scene.physics.add.collider(mainChar, goombaObj, async () => {
        // apply force X to the other direction of the main character
        const lastApplied = stateStorage.get("last_applied_force");
        if (lastApplied == null || new Date().getTime() - lastApplied > 1000) {
          const audio = stateStorage.get("audio");

          const sound = await audio.add("mamma_mia");
          sound.play();

          stateStorage.set("last_applied_force", new Date());
          // min 1 - max 5
          const randomForce = Math.random() * 1.5 + 1;

          // if is left, apply force to the right and vice versa
          const current = globalState.get("goomba_0_direction");
          const xForce = current === "left" ? 10 : -10;

          mainChar.body.applyForceX(xForce * randomForce);
          mainChar.body.applyForceZ(randomForce);
          const force = view3d ? 20 : 5;
          mainChar.body.applyForceY(force * randomForce);
        }
      });
    }
  }, [mainChar, goomba]);

  const handleJump = useCallback(async () => {
    const audio = stateStorage.get("audio");

    const sound = await audio.add("jump");
    sound.setVolume(0.05);
    sound.play();
  }, []);

  const handleStart = useCallback(
    (childs: any) => {
      // add collision detection between the camera and the childs
    },
    [scene]
  );

  return (
    <>
      {!startedPlaying && <Header onClick={handleInitialSounds} />}
      <div>
        <Enable3d>
          <Initial />
          <Preload onPreload={handlePreload} />
          <Lights />
          <Camera />
          <Ambient onStart={handleStart} />
          <Character
            characterRotationPI={0.8}
            name="main"
            asset="mario"
            isMainCharacter
          />
          <Character
            characterRotationPI={1.5}
            name="goomba_1"
            asset="goomba"
            onDefaultAnimation={handleDefaultAnimation}
            // @ts-expect-error in a hurry
            onDefaultPosition={handleDefaultPosition}
            onAddMovement={handleAddMovement}
          />
          <Character
            characterRotationPI={1.5}
            name="goomba_0"
            asset="goomba"
            onDefaultAnimation={handleDefaultAnimation}
            // @ts-expect-error in a hurry
            onDefaultPosition={handleDefaultPosition}
            onAddMovement={handleAddMovement}
          />
          <Controls onUpdate={handleUpdate} onJump={handleJump} />
        </Enable3d>
      </div>
    </>
  );
}

export default Enabled;
