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
import Shooter from "../../components/Character/Shooter";
import ShooterControls from "../../components/Controls/ShooterControls";

function React() {
  const navigate = useNavigate();
  const alreadyNavigated = useRef(false);

  const handlePreload = useCallback(async () => {
    const { load } = stateStorage.get("scene");

    // it shall be in the public folder!!
    const ambient = load.preload("ambient", "/assets/glb/sands_location.glb");

    // it shall be in the public folder!!
    const character = load.preload("m4", "/assets/glb/guns/classic_m4.glb");

    await Promise.all([ambient, character]);
  }, []);

  useEffect(() => {
    globalState.set("3d_view", true);
  }, []);

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
    return [0, 20, 0];
  }, []);

  const handleStart = useCallback(() => {
    stateStorage.set("every_thing_is_loaded", true);
  }, []);

  const handleTraverse = useCallback((child: any) => {}, []);

  const handleAfterMainSetted = useCallback(() => {}, []);

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
        <Shooter
          characterRotationPI={0.8}
          name="m4"
          asset="m4"
          isMainCharacter
          onAddMovement={handleStart}
          onAfterMainSetted={handleAfterMainSetted}
          // @ts-expect-error in a hurry
          onDefaultPosition={handleDefaultPosition}
        />

        <ShooterControls />
      </Enable3d>
    </>
  );
}

export default React;
