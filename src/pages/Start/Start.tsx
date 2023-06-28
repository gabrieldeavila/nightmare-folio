/* eslint-disable @typescript-eslint/no-floating-promises */
import { AudioManager } from "@yandeu/audio";
import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { globalState, stateStorage } from "react-trigger-state";
import Message from "../../components/2d/Controls/Message";
import Loading from "../../components/2d/Loader/Loading";
import Ambient from "../../components/Ambient/Ambient";
import Camera from "../../components/Camera/Camera";
import Character from "../../components/Character/Character";
import Controls from "../../components/Controls/Controls";
import Enable3d from "../../components/Enable/Enable";
import Initial from "../../components/Initial/Initial";
import Lights from "../../components/Lights/Lights";
import Preload from "../../components/Preload/Preload";

function Enabled() {
  const navigate = useNavigate();
  const alreadyNavigated = useRef(false);

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

  useEffect(() => {
    globalState.set("3d_view", true);
  }, []);

  const handleUpdate = useCallback(() => {}, []);
  const handleInitialSounds = useCallback(async () => {
    const audio = new AudioManager();
    await audio.load("start_song", "/assets/mp3/Happy Acoustic Folk", "mp3");

    stateStorage.set("audio", audio);

    const sound = await audio.add("start_song");

    // dimish the volume
    sound.setVolume(0.1);
    sound.setLoop(true);

    sound.play();
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
    }
  }, []);

  const handleAfterMainSetted = useCallback(() => {
    const { character, physics } = globalState.get("scene");
    const react = globalState.get("react");

    physics.add.collider(character, react, () => {
      if (alreadyNavigated.current) return;
      alreadyNavigated.current = true;
      navigate("/react");
    });
  }, [navigate]);

  return (
    <>
      <Loading />
      <Message />
      <Enable3d>
        <Initial />
        <Preload onPreload={handlePreload} />
        <Lights />
        <Camera />
        <Ambient onStart={handleInitialSounds} onTraverse={handleTraverse} />
        <Character
          characterRotationPI={0.8}
          name="main"
          asset="mario"
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