/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  ExtendedObject3D,
  FirstPersonControls,
  PointerDrag,
  PointerLock,
  THREE,
} from "enable3d";
import { memo, useCallback, useEffect } from "react";
import { stateStorage, useTriggerState } from "react-trigger-state";
import type { ICharacter } from "./interface";

const Shooter = memo(
  ({
    name,
    isMainCharacter,
    characterRotationPI,
    asset,
    onDefaultPosition,
    onAddMovement,
    onAfterMainSetted,
  }: ICharacter) => {
    const [isTouchDevice] = useTriggerState({ name: "is_touch_device" });
    const [create] = useTriggerState({ name: "main_scene_create" });
    const [scene] = useTriggerState({ name: "scene" });
    const [ambient] = useTriggerState({ name: "ambient_childs" });

    const handleCharacter = useCallback(async () => {
      if (scene == null || ambient == null) return;

      const currChars = stateStorage.get("all_characters");

      // if the character already exists, don't create it again
      if (currChars?.[name] != null) return;
      // add the character to the all_characters object
      stateStorage.set("all_characters", {
        ...currChars,
        [name]: true,
      });
      const { load, add, camera, physics, canvas } = scene;

      const object = await load.gltf(asset);

      const characterObj = object.scene.children[0];
      const newChar = new ExtendedObject3D();
      newChar.name = name;
      newChar.rotateY(Math.PI + 0.1); // a hack
      newChar.add(characterObj);

      newChar.rotation.set(0, Math.PI * characterRotationPI, 0);

      const position = onDefaultPosition?.(name) ?? [-60, 5, 3.75];
      // const position = onDefaultPosition?.(name) ?? [100, -3, 3.75];

      newChar.position.set(...position);

      /**
       * Add the player to the scene with a body
       */
      add.existing(newChar);
      physics.add.existing(newChar, {
        shape: "sphere",
        mass: 1,
        radius: 0.25,
        width: 0.5,
        offset: { y: -0.25 },
      });

      newChar.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
      });

      newChar.body.setDamping(0.5, 0.5);
      newChar.body.setFriction(1);
      newChar.body.setAngularFactor(0, 0, 0);

      // https://docs.panda3d.org/1.10/python/programming/physics/bullet/ccd
      newChar.body.setCcdMotionThreshold(1e-7);
      newChar.body.setCcdSweptSphereRadius(0.25);

      onAddMovement?.(newChar, name);
      if (isMainCharacter) {
        scene.character = newChar;

        /**
         * Add 3rd Person Controls
         */
        scene.controls = new FirstPersonControls(camera, newChar, {
          offset: new THREE.Vector3(0, 5, 0),
          targetRadius: 0,
          // @ts-expect-error - no types
          sensitivity: {
            x: 0.15,
            y: 0.15,
          },
        });
        /**
         * Add Pointer Lock and Pointer Drag
         */
        if (!isTouchDevice) {
          const pl = new PointerLock(canvas);
          const pd = new PointerDrag(canvas);
          pd.onMove((delta) => {
            if (pl.isLocked()) {
              scene.moveTop = -delta.y;
              scene.moveRight = delta.x;
            }
          });
        }

        stateStorage.set("controls", scene.controls);
        stateStorage.set("main_character", newChar);
        setTimeout(() => {
          scene.isFalling = true;
          scene.manFalling = true;
        });
        onAfterMainSetted?.(newChar, physics);
      }
    }, [
      scene,
      ambient,
      name,
      asset,
      isMainCharacter,
      characterRotationPI,
      onDefaultPosition,
      onAddMovement,
      isTouchDevice,
      onAfterMainSetted,
    ]);

    useEffect(() => {
      handleCharacter().catch((err) => console.log(err));
    }, [handleCharacter, ambient, create]);

    return null;
  }
);

Shooter.displayName = "Character";

export default Shooter;
