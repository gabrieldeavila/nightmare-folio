/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { THREE } from "enable3d";
import { memo, useCallback, useEffect, useMemo } from "react";
import {
  globalState,
  stateStorage,
  useTriggerState,
} from "react-trigger-state";
import Jump from "./Jump/Jump";

let clearJumpTimeout: any = null;

const Controls = memo(() => {
  const [scene] = useTriggerState({ name: "scene" });
  const [mainUpdate] = useTriggerState({ name: "main_scene_update" });
  const { delta, time, update } = useMemo(
    () => ({
      delta: mainUpdate?.[0],
      time: mainUpdate?.[1],
      update: mainUpdate?.[2],
    }),
    [mainUpdate]
  );
  const [isTouchDevice] = useTriggerState({ name: "is_touch_device" });
  const [character] = useTriggerState({ name: "main_character" });
  const [controls] = useTriggerState({ name: "controls" });

  const handleControls = useCallback(() => {
    if (scene == null || character?.position == null || controls == null) {
      return;
    }
    const keys = globalState.get("keys");

    const { camera, moveTop, moveRight, move, canJump } = scene;

    if (character != null ?? character.body) {
      scene.light.position.x = character.position.x;
      scene.light.position.y = character.position.y + 200;
      scene.light.position.z = character.position.z + 100;
      scene.light.target = character;

      /**
       * Update Controls
       */
      controls.update(moveRight * 3, -moveTop * 3);
      if (!isTouchDevice) scene.moveRight = scene.moveTop = 0;
      /**
       * Player Turn
       */
      const speed = 4;
      const v3 = new THREE.Vector3();

      const rotation = camera.getWorldDirection(v3);
      const theta = Math.atan2(rotation.x, rotation.z);
      const rotationMan = character.getWorldDirection(v3);
      const thetaMan = Math.atan2(rotationMan.x, rotationMan.z);
      character.body.setAngularVelocityY(0);

      const l = Math.abs(theta - thetaMan);
      let rotationSpeed = isTouchDevice != null ? 2 : 4;
      const d = Math.PI / 24;

      if (l > d) {
        if (l > Math.PI - d) rotationSpeed *= -1;
        if (theta < thetaMan) rotationSpeed *= -1;
        character.body.setAngularVelocityY(rotationSpeed);
      }

      if (scene.isFalling && character.animation.current !== "falling") {
        character.animation.play("falling");
      }

      // detects if the character is on the ground
      // if it's below 0.1 it means it's on the ground

      const isFalling =
        (scene.initialFall || scene.isJumping) &&
        scene.lastPosition != null &&
        scene.lastPosition?.y > character.position.y;

      scene.lastPosition = character.position.clone();

      if (isFalling) {
        character.animation.play("falling", 250, false);
        scene.lastAnimationEndsIn = Date.now() + 350;
        console.log("ok");

        scene.isFalling = false;

        clearTimeout(clearJumpTimeout);

        clearJumpTimeout = setTimeout(() => {
          character.animation.play("idle");
          scene.initialFall = false;
          scene.isJumping = false;
          scene.canJump = true;
        }, 950);
      }

      /**
       * Player Move
       */
      if (keys.w.isDown || move) {
        // if (character.animation.current === "idle" && this.canJump)
        if (character.animation.current === "idle") {
          character.animation.play("running");
        }

        const x = Math.sin(theta) * speed;
        const y = character.body.velocity.y;
        const z = Math.cos(theta) * speed;

        character.body.setVelocity(x, y, z);
      } else {
        const now = Date.now();

        if (
          character.animation.current !== "idle" &&
          character.animation.current !== "falling_to_roll" &&
          !scene.isFalling &&
          canJump &&
          scene.lastAnimationEndsIn < now
        ) {
          // sees if a animation is playing and if the character is on the ground
          const animation = character.animation.current;
          console.log(scene.lastAnimationEndsIn, animation, "grr");
          character.animation.play("idle");
        }
      }

      if (keys.space.isDown && canJump && !scene.isJumping) {
        scene.jump();
      }
    }
  }, [character, controls, isTouchDevice, scene]);

  useEffect(() => {
    const press = (e: any, isDown: boolean) => {
      e.preventDefault();

      const keys = stateStorage.get("keys");
      const { keyCode } = e;
      switch (keyCode) {
        case 87: // w
          keys.w.isDown = isDown;
          break;
        case 38: // arrow up
          keys.w.isDown = isDown;
          break;
        case 32: // space
          keys.space.isDown = isDown;
          break;
      }
    };

    const pressTrue = (e: any) => press(e, true);

    const pressFalse = (e: any) => press(e, false);

    document.addEventListener("keydown", pressTrue);
    document.addEventListener("keyup", pressFalse);
    handleControls();

    return () => {
      document.removeEventListener("keydown", pressTrue);
      document.removeEventListener("keyup", pressFalse);
    };
  }, [handleControls, delta, update, time]);

  return <Jump />;
});

Controls.displayName = "Controls";

export default Controls;
