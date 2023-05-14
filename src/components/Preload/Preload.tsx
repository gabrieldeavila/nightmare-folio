import { memo, useEffect } from "react";
import { stateStorage, useTriggerState } from "react-trigger-state";
import type { IPreload } from "./interface";

const Preload = memo(({ onPreload }: IPreload) => {
  const [scene] = useTriggerState({ name: "scene" });

  useEffect(() => {
    if (scene == null) return;
    const promise = onPreload()?.catch((err) => console.error(err));

    stateStorage.set("main_scene_pre_load", promise);
  }, [onPreload, scene]);

  return null;
});

Preload.displayName = "Preload";

export default Preload;
