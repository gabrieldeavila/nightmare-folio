import {
  ExtendedObject3D,
  PointerDrag,
  PointerLock,
  THREE,
  ThirdPersonControls,
} from "enable3d";
import { memo, useCallback, useEffect } from "react";
import { stateStorage, useTriggerState } from "react-trigger-state";

const Character = memo(() => {
  // TODO: add resize event to update the camera
  const [isTouchDevice] = useTriggerState({ name: "is_touch_device" });
  const [create] = useTriggerState({ name: "main_scene_create" });
  const [scene] = useTriggerState({ name: "scene" });

  const handleCharacter = useCallback(async () => {
    if (scene == null) return;

    const { load, add, camera, animationMixers, physics, canvas } = scene;

    const object = await load.gltf("character");
    const characterObj = object.scene.children[0];

    scene.character = new ExtendedObject3D();
    scene.character.name = "man";
    scene.character.rotateY(Math.PI + 0.1); // a hack
    scene.character.add(characterObj);

    scene.character.rotation.set(0, Math.PI * 1.5, 0);
    scene.character.position.set(35, 0, 0);
    // add shadow
    scene.character.traverse((child: any) => {
      if (child.isMesh != null) child.castShadow = child.receiveShadow = true;
    });

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

    scene.character.animation.play("idle");

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

    /**
     * Add 3rd Person Controls
     */
    scene.controls = new ThirdPersonControls(camera, scene.character, {
      offset: new THREE.Vector3(0, 1, 0),
      targetRadius: 3,
    });

    // set initial view to 90 deg theta
    scene.controls.theta = 180;

    /**
     * Add Pointer Lock and Pointer Drag
     */
    if (isTouchDevice === false) {
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
    stateStorage.set("character", scene.character);
  }, [scene, isTouchDevice]);

  useEffect(() => {
    handleCharacter().catch((err) => console.log(err));

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

    document.addEventListener("keydown", (e) => press(e, true));
    document.addEventListener("keyup", (e) => press(e, false));

    return () => {
      document.removeEventListener("keydown", (e) => press(e, true));
      document.removeEventListener("keyup", (e) => press(e, false));
    };
  }, [handleCharacter, create]);

  return null;
});

Character.displayName = "Character";

export default Character;
