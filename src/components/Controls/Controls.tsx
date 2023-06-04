/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { JoyStick, THREE } from "enable3d";
import { memo, useCallback, useEffect, useMemo } from "react";
import {
  globalState,
  stateStorage,
  useTriggerState,
} from "react-trigger-state";
import Jump from "./Jump/Jump";
import type { IControl } from "./interface";

const Controls = memo(({ onUpdate }: IControl) => {
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
      let rotationSpeed = isTouchDevice ? 6 : 1;
      const d = Math.PI / 24;

      if (l > d) {
        if (l > Math.PI - d) rotationSpeed *= -1;
        if (theta < thetaMan) rotationSpeed *= -1;
        character.body.setAngularVelocityY(rotationSpeed);
      }

      const isFallingTrue = stateStorage.get("is_falling");
      // console.log(isFallingTrue);

      if (isFallingTrue) {
        scene.startedFalling = Date.now();
        scene.fallingFrom = character.position.y;
        return;
      } else if (!scene.isJumping) {
        scene.startedFalling = null;
        scene.fallingFrom = null;
        scene.canJump = true;
      }

      /**
       * Player Move
       */
      if (isTouchDevice) {
        const joystick = new JoyStick();
        const axis = joystick.add.axis({
          styles: { left: 35, bottom: 35, size: 100 },
        });

        axis.onMove((event) => {
          /**
           * Update Camera
           */
          // @ts-expect-error FIXME
          const { top, right } = event;
          scene.moveTop = top * 3;
          scene.moveRight = right * 3;
        });
        const buttonA = joystick.add.button({
          letter: "A",
          styles: { right: 35, bottom: 110, size: 80 },
        });
        buttonA.onClick(() => scene.jump());
        const buttonB = joystick.add.button({
          letter: "B",
          styles: { right: 110, bottom: 35, size: 80 },
        });
        buttonB.onClick(() => (scene.move = true));
        buttonB.onRelease(() => (scene.move = false));
      }

      const { lastDown } = keys;

      if (keys.space.isDown && canJump && !scene.isJumping) {
        scene.jump();
      } else if ((keys.w.isDown && lastDown === "w") || move) {
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
      } else if (keys.d.isDown && lastDown === "d") {
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
          !["walking_right", "running_right"].includes(
            character.animation.current
          ) ||
          scene.nowIs !== keys.shift.isDown
        ) {
          scene.nowIs = keys.shift.isDown;

          if (keys.shift.isDown) {
            character.animation.play("running_right");
          } else {
            character.animation.play("walking_right");
          }
        }
      } else if (keys.a.isDown && lastDown === "a") {
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
      } else if (keys.s.isDown && lastDown === "s") {
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
    const options = {
      87: "w",
      38: "w",
      32: "space",
      68: "d",
      39: "d",
      37: "a",
      65: "a",
      83: "s",
      40: "s",
      16: "shift",
    };

    const press = (e: any, isDown: boolean) => {
      e.preventDefault();

      const keys = stateStorage.get("keys");
      const { keyCode } = e;
      // @ts-expect-error FIXME
      const currOption = options[keyCode];
      if (!currOption) return;

      keys[currOption].isDown = isDown;

      if (isDown && !["space", "shift"].includes(currOption)) {
        keys.lastDown = currOption;
      }

      // if it's now down, but there is an option that is down
      // and it's not the same as the current option
      // the lastDown is going to be that
      if (!isDown) {
        // search for the last down
        const lastDown = Object.keys(keys).find((key) => {
          if (key === "lastDown") return false;
          return keys[key].isDown;
        });

        keys.lastDown = lastDown;
      }
    };

    const pressTrue = (e: any) => press(e, true);

    const pressFalse = (e: any) => press(e, false);

    document.addEventListener("keydown", pressTrue);
    document.addEventListener("keyup", pressFalse);
    handleControls();
    onUpdate?.(delta, time);
    return () => {
      document.removeEventListener("keydown", pressTrue);
      document.removeEventListener("keyup", pressFalse);
    };
  }, [handleControls, delta, update, time, onUpdate]);

  return <Jump />;
});

Controls.displayName = "Controls";

export default Controls;
