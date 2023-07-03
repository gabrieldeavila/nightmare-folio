/* eslint-disable @typescript-eslint/no-floating-promises */
import { AudioManager } from "@yandeu/audio";
import { useCallback, useEffect } from "react";
import { globalState, stateStorage } from "react-trigger-state";
import Message from "../../components/2d/Controls/Message";
import StartTip from "../../components/2d/Tips/StartTip";
import Ambient from "../../components/Ambient/Ambient";
import Camera from "../../components/Camera/Camera";
import Character from "../../components/Character/Character";
import Controls from "../../components/Controls/Controls";
import Enable3d from "../../components/Enable/Enable";
import Initial from "../../components/Initial/Initial";
import Lights from "../../components/Lights/Lights";
import Preload from "../../components/Preload/Preload";
import Loading from "../Loading/Loading";

function Enabled() {
  const handlePreload = useCallback(async () => {
    const { load } = stateStorage.get("scene");

    // it shall be in the public folder!!
    const ambient = load.preload(
      "ambient-start",
      "/assets/glb/fantasy_eco_city.glb"
    );

    // it shall be in the public folder!!
    const character = load.preload(
      "mario-start",
      "/assets/glb/mario-t-pose.glb"
    );

    load.preload("mario-start-idle", "/assets/glb/mario.glb");

    load.preload("mario-start-walking", "/assets/glb/mario-walking.glb");

    load.preload("mario-start-running", "/assets/glb/mario-running.glb");

    load.preload(
      "mario-start-walking_backwards",
      "/assets/glb/mario-walking_backwards.glb"
    );

    load.preload(
      "mario-start-running_backwards",
      "/assets/glb/mario-running_backwards.glb"
    );

    load.preload(
      "mario-start-walking_left",
      "/assets/glb/mario-walking_left.glb"
    );

    load.preload(
      "mario-start-walking_right",
      "/assets/glb/mario-walking_right.glb"
    );

    load.preload(
      "mario-start-running_left",
      "/assets/glb/mario-running_left.glb"
    );

    load.preload(
      "mario-start-running_right",
      "/assets/glb/mario-running_right.glb"
    );

    await Promise.all([ambient, character]);
  }, []);

  const handleUpdate = useCallback(() => {}, []);
  const handleInitialSounds = useCallback(async () => {
    const audio = new AudioManager();
    await audio.load("start_song", "/assets/mp3/Happy Acoustic Folk", "mp3");
    await audio.load("select", "/assets/mp3/select", "mp3");

    stateStorage.set("audio", audio);

    const sound = await audio.add("start_song");

    // dimish the volume
    sound.setVolume(0.1);
    sound.setLoop(true);

    sound.play();

    globalState.set("start_song", sound);
    globalState.set("audio", audio);
  }, []);

  useEffect(() => {
    // remove the audio on unmount
    return () => {
      const song = globalState.get("start_song");

      if (song) {
        song.stop();
      }
      stateStorage.set("every_thing_is_loaded", false);
      const deleteKeys = ["ambient_childs", "scene"];

      deleteKeys.forEach((key) => {
        globalState.delete(key);
      });
    };
  }, []);

  const handleDefaultPosition = useCallback(() => {
    return [0, 5, -3];
  }, []);

  const handleStart = useCallback(() => {
    stateStorage.set("every_thing_is_loaded", true);
  }, []);

  const handleTraverse = useCallback((child: any) => {
    if (child.name === "react") {
      globalState.set("react", child);
    } else if (child.name.includes("MysteryBlock")) {
      globalState.set("mysteryBlock", child);
    }
  }, []);

  const handleAfterMainSetted = useCallback(() => {
    const { character, physics } = globalState.get("scene");
    const react = globalState.get("react");
    const mysteryBlock = globalState.get("mysteryBlock");
    const audio = globalState.get("audio");

    physics.add.collider(character, react, async () => {
      if (stateStorage.get("start_tip") === "react") return;

      stateStorage.set("start_tip", "react");
      const sound = await audio.add("select");
      sound.play();
    });

    physics.add.collider(character, mysteryBlock, async () => {
      if (stateStorage.get("start_tip") === "mistery_block") return;

      stateStorage.set("start_tip", "mistery_block");
      const sound = await audio.add("select");
      sound.play();
    });
  }, []);

  return (
    <>
      <Loading />
      <Message />
      <StartTip />
      <Enable3d name="start-scene">
        <Initial defaultRight={250} />
        <Preload onPreload={handlePreload} />
        <Lights />
        <Camera />
        <Ambient
          name="ambient-start"
          onStart={handleInitialSounds}
          onTraverse={handleTraverse}
        />
        <Character
          characterRotationPI={0.8}
          name="main-start"
          asset="mario-start"
          isMainCharacter
          onAddMovement={handleStart}
          onAfterMainSetted={handleAfterMainSetted}
          // @ts-expect-error in a hurry
          onDefaultPosition={handleDefaultPosition}
        />

        <Controls onUpdate={handleUpdate} />
      </Enable3d>
    </>
  );
}

export default Enabled;
