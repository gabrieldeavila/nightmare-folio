import { useCallback, useEffect } from "react";
import { globalState, useTriggerState } from "react-trigger-state";
import * as THREE from "three";

function useAtom({ name, sceneName }: { name: string; sceneName: string }) {
  const [atom, setAtom] = useTriggerState({ name });

  const setCube = useCallback(() => {
    // Create a cube and add it to the scene
    const geometry = new THREE.BoxGeometry(2, 2, 1, 2, 5);
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Right face (red)
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Left face (green)
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Top face (blue)
      new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom face (yellow)
      new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Front face (magenta)
      new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Back face (cyan)
    ];

    globalState.set(name, new THREE.Mesh(geometry, materials));
  }, [name]);

  useEffect(() => {
    setCube();

    const scene = globalState.get(sceneName);
    const currAtom = globalState.get(name);
    const threeRender = globalState.get("threeRender");
    const camera = globalState.get("camera");

    scene.add(currAtom);

    threeRender.render(scene, camera);

    return () => {
      globalState.delete(name);
    };
  }, [name, sceneName, setCube]);

  return [atom, setAtom];
}

export default useAtom;
