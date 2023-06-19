/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { JoyStick, THREE } from "enable3d";
import { memo, useCallback, useEffect, useMemo } from "react";
import _ from "lodash";
import {
  globalState,
  stateStorage,
  useTriggerState,
} from "react-trigger-state";
import Jump from "./Jump/Jump";
import type { IControl } from "./interface";

const Controls = memo(({ onUpdate, onJump }: IControl) => {
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
    const view3D = globalState.get("3d_view");

    const { camera, moveTop, moveRight, move, canJump } = scene;
    // console.log(scene.character.position.y, scene.character.position.x);

    if (
      scene.character.position.y < -15.2 ||
      scene.character.position.y > 200
    ) {
      // it moves the character to the zero position
      stateStorage.set("is_falling", false);
      scene.isJumping = false;

      stateStorage.set("last_check", Date.now());
      // remove the collision
      // set body to be kinematic
      scene.character.body.setCollisionFlags(2);

      // set the new position
      scene.character.position.set(-60, 5, 3.75);
      scene.character.body.needUpdate = true;

      // this will run only on the next update if body.needUpdate = true
      scene.character.body.once.update(() => {
        // set body back to dynamic
        scene.character.body.setCollisionFlags(0);

        // if you do not reset the velocity and angularVelocity, the object will keep it
        scene.character.body.setVelocity(0, 0, 0);
        scene.character.body.setAngularVelocity(0, 0, 0);
      });
    }

    if (
      !view3D &&
      (scene.character.position.z > 4 || scene.character.position.z < 3.72)
    ) {
      scene.character.position.set(
        scene.character.position.x,
        scene.character.position.y + 1,
        3.75
      );
      scene.character.body.needUpdate = true;
      scene.character.body.setCollisionFlags(2);

      // this will run only on the next update if body.needUpdate = true
      scene.character.body.once.update(() => {
        // set body back to dynamic
        scene.character.body.setCollisionFlags(0);

        // if you do not reset the velocity and angularVelocity, the object will keep it
        scene.character.body.setVelocity(0, 0, 0);
        scene.character.body.setAngularVelocity(0, 0, 0);
      });
    }
    if (character != null ?? character.body) {
      scene.light.position.x = character.position.x;
      scene.light.position.y = character.position.y + 200;
      scene.light.position.z = character.position.z + 100;
      scene.light.target = character;
      let updateMoveTop = moveTop;

      /**
       * Update Controls
       */
      // prevents from moving the camera to the ground
      if (camera.position.y - 0.25 > scene.character.position.y) {
        updateMoveTop *= -3;
      } else {
        updateMoveTop = 3;
      }

      let theta = 1.56;
      const speed = 100 * keys.shift.isDown ? 5 : 2;

      if (!view3D && view3D != null) {
        controls.offset.x = 0;
        controls.offset.y = 0;
        controls.offset.z = 10;
        controls.theta = 0;
        controls.phi = 0;

        if (!stateStorage.get("is_view")) {
          stateStorage.set("is_view", true);
        }
        scene.character.rotation.set(0, Math.PI * 0.5, 0);

        controls.update(0, 0);
      } else {
        if (stateStorage.get("is_view")) {
          controls.offset.x = 0;
          controls.offset.y = 1;
          controls.offset.z = 0;
          controls.phi = 15;

          stateStorage.set("is_view", false);
        }

        const v3 = new THREE.Vector3();

        const rotation = camera.getWorldDirection(v3);
        theta = Math.atan2(rotation.x, rotation.z);
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

        controls.update(moveRight * 3, updateMoveTop);
      }

      if (!isTouchDevice) scene.moveRight = scene.moveTop = 0;
      /**
       * Player Turn
       */

      const isFallingTrue = stateStorage.get("is_falling");

      if (isFallingTrue) {
        scene.startedFalling = Date.now();
        scene.fallingFrom = character.position.y;
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
          scene.moveTop = top * 10;
          scene.moveRight = right * 10;
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

      // if is not using 3d view, it's 2d, therefore the w and s keys are used to move the character, so the w becomes a and s becomes d
      const clonedKeys = _.cloneDeep(keys);

      if (!view3D && view3D != null) {
        clonedKeys.w = keys.d;
        clonedKeys.s = keys.a;
        clonedKeys.space = keys.w.isDown ? keys.w : keys.space;

        // removes the w and s keys
        clonedKeys.a.isDown = false;
        clonedKeys.d.isDown = false;

        // gets which key is down
        if (clonedKeys.lastDown === "d") clonedKeys.lastDown = "w";
        else if (clonedKeys.lastDown === "a") clonedKeys.lastDown = "s";
      }

      const { lastDown } = clonedKeys;

      if (
        clonedKeys.space.isDown &&
        ((canJump && !scene.isJumping) || !scene.isDoubleJumping)
      ) {
        scene.jump();
      } else if ((clonedKeys.w.isDown && lastDown === "w") || move) {
        if (
          !["running", "walking"].includes(character.animation.current) ||
          scene.nowIs !== clonedKeys.shift.isDown
        ) {
          scene.nowIs = clonedKeys.shift.isDown;

          if (clonedKeys.shift.isDown) {
            character.animation.play("running");
          } else {
            character.animation.play("walking");
          }
        }

        const x = Math.sin(theta) * speed;
        const y = character.body.velocity.y;
        const z = view3D ? Math.cos(theta) * speed : 0;

        character.body.setVelocity(x, y, z);
      } else if (clonedKeys.d.isDown && lastDown === "d") {
        // add a rotation to the left
        const x = Math.sin(theta - Math.PI / 2) * speed;
        const y = character.body.velocity.y;
        const z = view3D ? Math.cos(theta - Math.PI / 2) * speed : 0;
        character.body.setVelocity(x, y, z);
        // add a transition to be smooth
        // now the character is moving
        // smoothly
        const smooth = 0.1;
        const x2 = character.position.x + x * smooth;
        const y2 = character.position.y + y * smooth;
        const z2 = view3D ? character.position.z + z * smooth : 0;
        character.position.set(x2, y2, z2);

        if (
          !["walking_right", "running_right"].includes(
            character.animation.current
          ) ||
          scene.nowIs !== clonedKeys.shift.isDown
        ) {
          scene.nowIs = clonedKeys.shift.isDown;

          if (clonedKeys.shift.isDown) {
            character.animation.play("running_right");
          } else {
            character.animation.play("walking_right");
          }
        }
      } else if (clonedKeys.a.isDown && lastDown === "a") {
        // add a rotation to the right
        const x = Math.sin(theta + Math.PI / 2) * speed;
        const y = character.body.velocity.y;
        const z = view3D ? Math.cos(theta + Math.PI / 2) * speed : 0;
        character.body.setVelocity(x, y, z);

        if (
          !["running_left", "walking_left"].includes(
            character.animation.current
          ) ||
          scene.nowIs !== clonedKeys.shift.isDown
        ) {
          scene.nowIs = clonedKeys.shift.isDown;

          if (clonedKeys.shift.isDown) {
            character.animation.play("running_left");
          } else {
            character.animation.play("walking_left");
          }
        }
        // also change the rotation of the character
      } else if (clonedKeys.s.isDown && lastDown === "s") {
        // walks backwards
        const x = Math.sin(theta + Math.PI) * speed;
        const y = character.body.velocity.y;
        const z = view3D ? Math.cos(theta + Math.PI) * speed : 0;
        character.body.setVelocity(x, y, z);
        if (
          !["running_backwards", "walking_backwards"].includes(
            character.animation.current
          ) ||
          scene.nowIs !== clonedKeys.shift.isDown
        ) {
          scene.nowIs = clonedKeys.shift.isDown;

          if (clonedKeys.shift.isDown) {
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
    void onUpdate?.(delta, time);
    return () => {
      document.removeEventListener("keydown", pressTrue);
      document.removeEventListener("keyup", pressFalse);
    };
  }, [handleControls, delta, update, time, onUpdate]);

  return <Jump onJump={onJump} />;
});

Controls.displayName = "Controls";

export default Controls;
