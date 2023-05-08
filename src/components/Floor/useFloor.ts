import { useCallback, useEffect } from "react";
import { globalState } from "react-trigger-state";
import * as THREE from "three";

function useFloor({ name, sceneName }: { name: string; sceneName: string }) {
  const setFloor = useCallback(() => {
    // Create a new Three.js floor geometry
    const floorGeometry = new THREE.PlaneGeometry(10, 10);

    // Create a new Three.js floor material
    const floorMaterial = new THREE.MeshBasicMaterial({
      color: 0x808080,
      side: THREE.DoubleSide,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;

    // Create a new Three.js floor mesh and add it to the scene
    // globalState.set(name, new THREE.Mesh(geometry, material));

    const scene = globalState.get(sceneName);
    const threeRender = globalState.get("threeRender");
    const camera = globalState.get("camera");
    floor.material.side = THREE.DoubleSide;
    floor.rotation.x = 90;

    scene.add(floor);
    threeRender.render(scene, camera);
  }, [sceneName]);

  useEffect(() => {
    setFloor();
  }, [name, sceneName, setFloor]);
}

export default useFloor;
