/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { THREE } from "enable3d";
import { memo, useCallback, useEffect, useMemo } from "react";
import { globalState, useTriggerState } from "react-trigger-state";
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
  const [character] = useTriggerState({ name: "character" });
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
      if (isTouchDevice === false) scene.moveRight = scene.moveTop = 0;
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

      /**
       * Player Move
       */
      if (keys.w.isDown === true || move === true) {
        // if (character.animation.current === "idle" && this.canJump)
        if (character.animation.current === "idle") {
          character.animation.play("running");
        }

        const x = Math.sin(theta) * speed;
        const y = character.body.velocity.y;
        const z = Math.cos(theta) * speed;

        character.body.setVelocity(x, y, z);
      } else {
        if (character.animation.current === "running" && canJump != null) {
          character.animation.play("idle");
        }
      }

      if (keys.space.isDown === true && canJump === true) {
        scene.jump();
      }
    }
  }, [character, controls, isTouchDevice, scene]);

  useEffect(() => {
    console.log("damn");
    handleControls();
  }, [handleControls, delta, update, time]);

  return <Jump />;
});

Controls.displayName = "Controls";

export default Controls;
