/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useEffect, useMemo } from "react";
import { globalState } from "react-trigger-state";
import useAtom from "../Atom/useAtom";
import useScene from "../Scene/useScene";

function useCube({ name, sceneName }: { name: string; sceneName: string }) {
  const cubeName = useMemo(() => name, [name]);

  useScene({ name: sceneName });
  useAtom({
    name: cubeName,
    sceneName,
  });

  useEffect(() => {
    // add mouse move event listener
    const handleMouseMove = (event: MouseEvent) => {
      const isDragging = globalState.get("isDragging");
      const threeRender = globalState.get("threeRender");
      const camera = globalState.get("camera");
      const cube = globalState.get(cubeName);
      const canvas = globalState.get("canvas");
      const scene = globalState.get(sceneName);
      const isGoingUp = globalState.get("isGoingUp");
      const isGoingLeft = globalState.get("isGoingLeft");

      if (
        threeRender == null ||
        camera == null ||
        cube == null ||
        canvas == null ||
        scene == null ||
        isDragging !== true
      ) {
        return;
      }

      const isPressingShift = event.shiftKey;
      const isPressingCtrl = event.ctrlKey;
      const rotationSpeed = 0.00007;

      // x and y coordinates of a mouse pointer
      const mouseX = event.clientX * rotationSpeed;
      const mouseY = event.clientY * rotationSpeed;

      // console.log(mouseX, mouseY);
      if (isPressingCtrl) {
        cube.rotation.z += mouseX * isGoingLeft;
      } else if (isPressingShift) {
        cube.rotation.x += mouseX * isGoingUp;
      } else {
        cube.rotation.x += mouseX * isGoingUp;
        cube.rotation.y += mouseY * isGoingLeft;
      }

      scene.add(cube);

      threeRender.render(scene, camera);
    };

    // add mouse move event listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cubeName, sceneName]);
}

export default useCube;
