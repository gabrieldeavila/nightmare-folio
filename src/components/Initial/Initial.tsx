import { memo, useEffect } from "react";
import { useTriggerState } from "react-trigger-state";
import type { IInitial } from "./interface";

const Initial = memo(({ onInit }: IInitial) => {
  const [scene] = useTriggerState({ name: "scene" });

  useEffect(() => {
    if (scene == null) return;

    if (onInit == null) {
      // default config
      scene.canJump = true;
      scene.move = false;
    } else {
      onInit()?.catch((err) => console.error(err));
    }

    scene.renderer.setPixelRatio(Math.max(1, window.devicePixelRatio / 2));
    scene.moveTop = 0;
    scene.moveRight = 0;
  }, [onInit, scene]);

  return null;
});

Initial.displayName = "Initial";

export default Initial;
