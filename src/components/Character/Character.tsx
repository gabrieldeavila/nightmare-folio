/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
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
    characterRotationPI,
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
      const newChar = new ExtendedObject3D();
      newChar.name = name;
      newChar.rotateY(Math.PI + 0.1); // a hack
      newChar.add(characterObj);

      newChar.rotation.set(0, Math.PI * characterRotationPI, 0);

      const position = onDefaultPosition?.(name) ?? [95, -4, 3.75];

      newChar.position.set(...position);

      /**
       * Animations
       */
      // add the box man's animation mixer to the animationMixers array (for auto updates)
      animationMixers.add(newChar.anims.mixer);

      object.animations.forEach((animation: any) => {
        if (animation.name != null) {
          newChar.anims.add(animation.name, animation);
        }
      });

      animations.forEach((animation: any) => {
        if (animation.name != null) {
          newChar.anims.add(animation.name, animation);
        }
      });

      newChar.anims.play(onDefaultAnimation?.() ?? "idle");

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
        scene.controls = new ThirdPersonControls(camera, newChar, {
          offset: new THREE.Vector3(0, 1, 0),
          targetRadius: 3,
          theta: 270,
          phi: 15,
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

        for (const child of ambient) {
          physics.add.collider(newChar, child, () => {
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
            stateStorage.set("is_jumping_now", false);

            scene.isJumping = false;
            scene.isDoubleJumping = false;
            stateStorage.set("last_check", Date.now());
          });
        }

        const surpiseBoxes = stateStorage.get("surprise_boxes");
        const coins = stateStorage.get("coins");

        for (const box of surpiseBoxes) {
          physics.add.collider(newChar, box, () => {
            const alreadyCollided = stateStorage.get(
              `already_collided_${box.name}`
            );

            if (alreadyCollided) return;
            const index = box.name.split("surprise_box")[1];

            const coinCollider = coins.find(
              (coin: any) => coin.name === `coin${index}`
            );

            stateStorage.set(
              "coins_collected",
              (stateStorage.get("coins_collected") || 0) + 1
            );
            // changes the coin's position to the box's position
            let yMagic = 0.5;

            const clearMagic = setInterval(() => {
              coinCollider.position.set(
                box.position.x,
                box.position.y + yMagic,
                box.position.z
              );

              // makes it flip
              coinCollider.rotation.z += 0.1;

              yMagic += 0.01;
            }, 10);

            let yMagic2 = 0;

            // after 1 second, clear the interval
            setTimeout(() => {
              clearInterval(clearMagic);

              // // now go down
              const clearMagic2 = setInterval(() => {
                coinCollider.position.set(
                  box.position.x,
                  box.position.y + yMagic - yMagic2,
                  box.position.z
                );

                // makes it flip
                coinCollider.rotation.z += 0.1;

                yMagic2 += 0.01;
              }, 10);

              // // after 1 second, clear the interval
              setTimeout(() => {
                clearInterval(clearMagic2);
                // changes the box metalness to 0
                box.material.metalness = 0.8;
              }, 2500);
            }, 2000);

            stateStorage.set(`already_collided_${box.name}`, true);
          });
        }

        const extraCoins = stateStorage.get("extra_coins");

        for (const coin of extraCoins) {
          physics.add.collider(newChar, coin, () => {
            const alreadyCollided = stateStorage.get(
              `already_collided_${coin.name}`
            );

            if (alreadyCollided) return;

            stateStorage.set(`already_collided_${coin.name}`, true);
            stateStorage.set(
              "coins_collected",
              (stateStorage.get("coins_collected") || 0) + 1
            );
            // changes its mass to 0
            coin.body.setCollisionFlags(2);

            // set the new position
            // coin.position.set(-60, 5, 3.75);
            coin.scale.set(0, 0, 0);
            coin.body.needUpdate = true;

            // this will run only on the next update if body.needUpdate = true
            coin.body.once.update(() => {
              // set body back to dynamic
              coin.body.setCollisionFlags(0);

              // if you do not reset the velocity and angularVelocity, the object will keep it
              coin.body.setVelocity(0, 0, 0);
              coin.body.setAngularVelocity(0, 0, 0);
            });
          });
        }
      }
    }, [
      scene,
      ambient,
      name,
      asset,
      isMainCharacter,
      characterRotationPI,
      onDefaultPosition,
      onDefaultAnimation,
      onAddMovement,
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
