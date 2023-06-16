/* eslint-disable @typescript-eslint/no-floating-promises */
import { ExtendedObject3D } from "enable3d";
import { memo, useCallback, useEffect } from "react";
import { stateStorage, useTriggerState } from "react-trigger-state";
import type { IAmbient } from "./interface";

const Ambient = memo(({ onTraverse, onStart }: IAmbient) => {
  const [trigger] = useTriggerState({ name: "scene" });

  const addAmbient = useCallback(async () => {
    const { load, add, animationMixers, physics } = stateStorage.get("scene");

    if (load == null) return;

    const object = await load.gltf("ambient");
    const scene = object.scenes[0];

    stateStorage.set("ambient", scene);

    const ambient = new ExtendedObject3D();
    ambient.name = "scene";
    ambient.add(scene);
    add.existing(ambient);

    // add animations
    // sadly only the flags animations works
    object.animations.forEach((anim: any, i: any) => {
      // @ts-expect-error should be fixed in enable3d
      ambient.mixer = animationMixers.create(ambient);
      // overwrite the action to be an array of actions
      // @ts-expect-error should be fixed in enable3d
      ambient.action = [];
      // @ts-expect-error should be fixed in enable3d
      ambient.action[i] = ambient.mixer.clipAction(anim);
      // @ts-expect-error should be fixed in enable3d
      ambient.action[i].play();
    });

    const childs: any[] = [];
    const limits: any[] = [];
    console.log(ambient);

    ambient.traverse(
      // @ts-expect-error should be fixed in enable3d
      (child: {
        isMesh: any;
        castShadow: boolean;
        receiveShadow: boolean;
        material: { metalness: number; roughness: number };
        name: string;
        body: {
          setAngularFactor: (arg0: number, arg1: number, arg2: number) => void;
          setLinearFactor: (arg0: number, arg1: number, arg2: number) => void;
        };
      }) => {
        if (child.isMesh != null) {
          if (child.name === "surprise_box") {
            child.material.metalness = 0.5;
          } else {
            child.material.metalness = 0;
            child.material.roughness = 1;
          }

          child.castShadow = child.receiveShadow = true;

          onTraverse?.(child);

          if (child.name.includes("limit")) {
            limits.push(child);
          }

          childs.push(child);

          physics.add.existing(child, {
            shape: "concave",
            mass: 0,
            collisionFlags: 1,
            autoCenter: false,
          });

          child.body.setAngularFactor(0, 0, 0);
          child.body.setLinearFactor(0, 0, 0);
        }
      }
    );

    stateStorage.set("ambient_childs", childs);
    stateStorage.set("limits", limits);
    onStart?.(childs);
  }, [onStart, onTraverse]);

  useEffect(() => {
    addAmbient().catch((err) => console.error(err));
  }, [addAmbient, trigger]);

  return null;
});

Ambient.displayName = "Ambient";

export default Ambient;
