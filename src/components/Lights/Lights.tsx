import { memo, useEffect } from "react";
import { useTriggerState } from "react-trigger-state";

const Lights = memo(() => {
  const [create] = useTriggerState({ name: "main_scene_create" });
  const [scene] = useTriggerState({ name: "scene" });

  useEffect(() => {
    if (scene == null) return;

    async function handleCreate() {
      const { ws } = scene;
      const { lights } =
        (await ws.warpSpeed("-ground", "-orbitControls")) ?? {};

      const { hemisphereLight, ambientLight, directionalLight } = lights;
      const intensity = 0.5;
      hemisphereLight.intensity = intensity;
      ambientLight.intensity = intensity;
      directionalLight.intensity = intensity;

      hemisphereLight.receiveShadow = true;
      directionalLight.receiveShadow = true;

      if (lights != null) {
        scene.light = lights.directionalLight;
        const d = 40;
        scene.light.shadow.camera.top = d;
        scene.light.shadow.camera.bottom = -d;
        scene.light.shadow.camera.left = -d;
        scene.light.shadow.camera.right = d;

        scene.light.shadow.mapSize.set(2048, 2048);

        scene.light.shadow.camera.near = 200;
        scene.light.shadow.camera.far = 240;

        // https://stackoverflow.com/a/48939256
        scene.light.shadow.bias = -0.01;
      }
    }

    handleCreate().catch((err) => console.log(err));
  }, [create, scene]);

  return null;
});

Lights.displayName = "Lights";

export default Lights;
