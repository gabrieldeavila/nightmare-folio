import { memo, useEffect } from "react";
import { useTriggerState } from "react-trigger-state";

const Camera = memo(() => {
  const [create] = useTriggerState({ name: "main_scene_create" });
  const [scene] = useTriggerState({ name: "scene" });

  useEffect(() => {
    if (scene == null) return;

    scene.camera.position.set(-60, 5, 3.75);
    scene.camera.lookAt(0, 0, 0);
  }, [scene, create]);

  return null;
});

Camera.displayName = "Camera";

export default Camera;
