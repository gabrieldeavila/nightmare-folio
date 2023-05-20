/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { THREE } from "enable3d";
import { memo, useCallback, useEffect, useMemo } from "react";
import {
  globalState,
  stateStorage,
  useTriggerState,
} from "react-trigger-state";
import Jump from "./Jump/Jump";

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
      const speed = 3 * keys.shift.isDown ? 5 : 2;
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

      const isFallingTrue = stateStorage.get("is_falling");

      if (isFallingTrue) {
        // if (isFallingTrue && character.animation.current !== "falling") {
        if (scene.startedFalling == null) {
          scene.startedFalling = Date.now();
          scene.fallingFrom = character.position.y;
          return;
        }

        // if (Date.now() - scene.startedFalling > 500) {
        //   scene.prevAnimation = character.animation.current ?? "idle";
        //   character.animation.play("falling");
        // }
        // } else if (!isFallingTrue && character.animation.current === "falling") {
      } else if (!isFallingTrue) {
        if (Date.now() - scene.startedFalling < 1000) {
          scene.canJump = true;
          scene.startedFalling = null;
          //   character.animation.play(scene.prevAnimation);
          //   scene.canJump = true;
        }
        // } else {
        // } else {
        //   character.animation.play("falling_to_roll", 1200, false);
        //   setTimeout(() => {
        //     character.animation.play(scene.prevAnimation);
        //     scene.canJump = true;
        //   }, 1200);
        // }
      } else if (scene.startedFalling != null) {
        scene.startedFalling = null;
        scene.canJump = true;
        scene.fallingFrom = null;
      }

      if (character.animation.current === "falling") {
        console.log(stateStorage.get("last_body_vector"), character.position);
      }

      /**
       * Player Move
       */
      if (
        scene.isJumping ||
        isFallingTrue ||
        character.animation.current === "falling_to_roll"
      ) {
        return;
      }

      if (
        keys.space.isDown &&
        canJump &&
        character.animation.current === "running" &&
        !scene.isJumping
      ) {
        scene.jump();
      } else if (keys.w.isDown || move) {
        if (
          !["running", "walking"].includes(character.animation.current) ||
          scene.nowIs !== keys.shift.isDown
        ) {
          scene.nowIs = keys.shift.isDown;

          if (keys.shift.isDown) {
            character.animation.play("running");
          } else {
            character.animation.play("walking");
          }
        }

        const x = Math.sin(theta) * speed;
        const y = character.body.velocity.y;
        const z = Math.cos(theta) * speed;

        character.body.setVelocity(x, y, z);
      } else if (keys.d.isDown) {
        // add a rotation to the left
        const x = Math.sin(theta - Math.PI / 2) * speed;
        const y = character.body.velocity.y;
        const z = Math.cos(theta - Math.PI / 2) * speed;
        character.body.setVelocity(x, y, z);
        // add a transition to be smooth
        // now the character is moving
        // smoothly
        const smooth = 0.1;
        const x2 = character.position.x + x * smooth;
        const y2 = character.position.y + y * smooth;
        const z2 = character.position.z + z * smooth;
        character.position.set(x2, y2, z2);

        if (
          !["walking_left", "running_right"].includes(
            character.animation.current
          ) ||
          scene.nowIs !== keys.shift.isDown
        ) {
          scene.nowIs = keys.shift.isDown;

          if (keys.shift.isDown) {
            character.animation.play("running_right");
          } else {
            character.animation.play("walking_left");
          }
        }
      } else if (keys.a.isDown) {
        // add a rotation to the right
        const x = Math.sin(theta + Math.PI / 2) * speed;
        const y = character.body.velocity.y;
        const z = Math.cos(theta + Math.PI / 2) * speed;
        character.body.setVelocity(x, y, z);

        if (
          !["running_left", "walking_left"].includes(
            character.animation.current
          ) ||
          scene.nowIs !== keys.shift.isDown
        ) {
          scene.nowIs = keys.shift.isDown;

          if (keys.shift.isDown) {
            character.animation.play("running_left");
          } else {
            character.animation.play("walking_left");
          }
        }
        // also change the rotation of the character
      } else if (keys.s.isDown) {
        // walks backwards
        const x = Math.sin(theta + Math.PI) * speed;
        const y = character.body.velocity.y;
        const z = Math.cos(theta + Math.PI) * speed;
        character.body.setVelocity(x, y, z);
        if (
          !["running_backwards", "walking_backwards"].includes(
            character.animation.current
          ) ||
          scene.nowIs !== keys.shift.isDown
        ) {
          scene.nowIs = keys.shift.isDown;

          if (keys.shift.isDown) {
            character.animation.play("running_backwards");
          } else {
            character.animation.play("walking_backwards");
          }
        }
      } else {
        const changingPosition = stateStorage.get("changing_position");
        if (
          changingPosition.some((i: string) =>
            character.animation.current.includes(i)
          )
        ) {
          character.animation.play("idle");
        }
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
        case 68: // d
          keys.d.isDown = isDown;
          break;
        case 39: // arrow right
          keys.d.isDown = isDown;
          break;
        case 37: // arrow left
          keys.a.isDown = isDown;
          break;
        case 65: // a
          keys.a.isDown = isDown;
          break;
        case 83: // s
          keys.s.isDown = isDown;
          break;
        case 40: // arrow down
          keys.s.isDown = isDown;
          break;
        case 16: // shift
          keys.shift.isDown = isDown;
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
