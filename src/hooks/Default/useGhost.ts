/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useEffect } from "react";
import { globalState } from "react-trigger-state";
import * as THREE from "three";

function useGhost({ sceneName }: { sceneName: string; }) {
  useEffect(() => {
    // add mouse move event listener
    const handleMouseMove = (event: MouseEvent) => {
      const isDragging = globalState.get("isDragging");
      const threeRender = globalState.get("threeRender");
      const camera = globalState.get("camera");
      const canvas = globalState.get("canvas");

      const isGoingUp = globalState.get("isGoingUp");
      const isGoingLeft = globalState.get("isGoingLeft");
      const scene = globalState.get(sceneName);

      if (
        threeRender == null ||
        camera == null ||
        canvas == null ||
        isDragging !== true
      ) {
        return;
      }

      const isPressingShift = event.shiftKey;
      const isPressingCtrl = event.ctrlKey;
      const rotationSpeed = 0.00007;
      console.log(isGoingUp);
      // x and y coordinates of a mouse pointer
      const mouseX = event.clientX * rotationSpeed;
      const mouseY = event.clientY * rotationSpeed;

      // console.log(mouseX, mouseY);
      if (isPressingCtrl) {
        camera.rotation.z += mouseX * isGoingLeft;
      } else if (isPressingShift) {
        camera.rotation.x += mouseX * isGoingUp;
      } else {
        camera.position.x += mouseX * isGoingUp;
        camera.position.y += mouseY * isGoingLeft;
      }
      // camera.position.set(mouseX, mouseY, 5);
      camera.lookAt(mouseX, mouseY, 0);

      threeRender.render(scene, camera);
    };

    // add mouse move event listener
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [sceneName]);

  // add wheel event listener
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      const isDragging = globalState.get("isDragging");
      const threeRender = globalState.get("threeRender");
      const camera = globalState.get("camera");
      const canvas = globalState.get("canvas");
      const scene = globalState.get(sceneName);

      if (
        threeRender == null ||
        camera == null ||
        canvas == null ||
        scene == null ||
        isDragging !== false
      ) {
        console.log(
          threeRender == null,
          camera == null,
          canvas == null,
          scene == null,
          isDragging === false
        );

        return;
      }

      const isScrollingUp = event.deltaY < 0;
      const isScrollingDown = event.deltaY > 0;

      // zoom where the mouse is
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const vector = new THREE.Vector3(
        (mouseX / canvas.current.clientWidth) * 2 - 1,
        -(mouseY / canvas.current.clientHeight) * 2 + 1,
        0.5
      );

      vector.unproject(camera);

      if (isScrollingUp) {
        camera.position.z -= 0.1;
      } else if (isScrollingDown) {
        camera.position.z += 0.1;
      }

      threeRender.render(scene, camera);
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [sceneName]);
}

export default useGhost;
