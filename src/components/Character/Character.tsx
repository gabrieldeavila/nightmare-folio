import {
  ExtendedObject3D,
  PointerDrag,
  PointerLock,
  THREE,
  ThirdPersonControls,
} from "enable3d";
import { memo, useCallback, useEffect } from "react";
import { stateStorage, useTriggerState } from "react-trigger-state";
import type { ICharacter } from "./interface";

const Character = memo(
  ({
    name,
    isMainCharacter,
    asset,
    onDefaultAnimation,
    onDefaultPosition,
    onAddMovement,
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
      const { load, add, camera, animationMixers, physics, canvas } = scene;

      const object = await load.gltf(asset);
      let animations: any = [];

      if (isMainCharacter) {
        const options = [
          "idle",
          "walking",
          "running",
          "running_right",
          "running_left",
          "walking_backwards",
          "running_backwards",
          "walking_left",
          "walking_right",
        ];
        const objectInfo: any = {};

        for (const opt of options) {
          const charOpt = await load
            .gltf(`${asset}-${opt}`)
            .catch(() => console.log("error"));

          if (charOpt == null) return;

          animations = [...animations, ...charOpt.animations];
        }

        const armature = await load.gltf(`${asset}-idle`);

        // get asset texture
        for (const child of object.parser.associations.entries()) {
          if (child[0].isMesh) {
            objectInfo[child[0].name] = child[0];
          }
        }

        let index = 0;
        // adds the texture to the armature
        for (const child of armature.scene.children[0].children) {
          const charInfo = objectInfo[child.name];

          if (child.isMesh && charInfo) {
            armature.scene.children[0].children[index].material =
              charInfo.material;
          }

          index++;
        }
        object.scene = armature.scene;
      } else {
        animations = [...animations, ...object.animations];
      }

      const characterObj = object.scene.children[0];

      scene.character = new ExtendedObject3D();
      scene.character.name = name;
      scene.character.rotateY(Math.PI + 0.1); // a hack
      scene.character.add(characterObj);

      scene.character.rotation.set(0, Math.PI * 1.5, 0);

      const position = onDefaultPosition?.() ?? [-60, 5, 3.75];

      scene.character.position.set(...position);

      /**
       * Animations
       */
      // ad the box man's animation mixer to the animationMixers array (for auto updates)
      animationMixers.add(scene.character.animation.mixer);

      object.animations.forEach((animation: any) => {
        if (animation.name != null) {
          scene.character.animation.add(animation.name, animation);
        }
      });

      animations.forEach((animation: any) => {
        if (animation.name != null) {
          scene.character.animation.add(animation.name, animation);
        }
      });

      scene.character.animation.play(onDefaultAnimation?.() ?? "idle");

      /**
       * Add the player to the scene with a body
       */
      add.existing(scene.character);
      physics.add.existing(scene.character, {
        shape: "sphere",
        mass: 1,
        radius: 0.25,
        width: 0.5,
        offset: { y: -0.25 },
      });

      scene.character.body.setFriction(1);
      scene.character.body.setAngularFactor(0, 0, 0);

      // https://docs.panda3d.org/1.10/python/programming/physics/bullet/ccd
      scene.character.body.setCcdMotionThreshold(1e-7);
      scene.character.body.setCcdSweptSphereRadius(0.25);

      onAddMovement?.(scene.character);
      if (isMainCharacter) {
        /**
         * Add 3rd Person Controls
         */
        scene.controls = new ThirdPersonControls(camera, scene.character, {
          offset: new THREE.Vector3(0, 1, 0),
          targetRadius: 3,
          theta: 270,
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
        stateStorage.set("main_character", scene.character);
        setTimeout(() => {
          scene.isFalling = true;
          scene.manFalling = true;
        });

        const groundZero = stateStorage.get("ground_zero");

        physics.add.collider(scene.character, groundZero, () => {
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
        });

        for (const child of ambient) {
          physics.add.collider(scene.character, child, () => {
            if (
              Date.now() - scene.startedFalling > 1000 &&
              scene.startedFalling != null
            ) {
              setTimeout(() => {
                scene.startedFalling = null;
                scene.fallingFrom = null;
                scene.canJump = true;
              });
            }

            stateStorage.set("is_falling", false);
            scene.isJumping = false;

            stateStorage.set("last_check", Date.now());
          });
        }
      }
    }, [
      scene,
      ambient,
      name,
      asset,
      isMainCharacter,
      onDefaultPosition,
      onAddMovement,
      onDefaultAnimation,
      isTouchDevice,
    ]);

    useEffect(() => {
      // add setInterval to update the isFalling to false each 100ms
      const interval = setInterval(() => {
        const lastCheck = stateStorage.get("last_check");

        if (scene == null) return;

        if (Date.now() - lastCheck > 500) {
          stateStorage.set("is_falling", true);
        }
      }, 100);

      return () => clearInterval(interval);
    }, [scene]);

    useEffect(() => {
      handleCharacter().catch((err) => console.log(err));
    }, [handleCharacter, ambient, create]);

    return null;
  }
);

Character.displayName = "Character";

export default Character;
