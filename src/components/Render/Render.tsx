import { useCallback, useEffect } from "react";
import { useTriggerState, globalState } from "react-trigger-state";
import * as THREE from "three";
import useCamera from "../Camera/useCamera";

function Render() {
  const [canvas] = useTriggerState({
    initial: { current: null },
    name: "canvas",
  });

  useCamera({ name: "camera" });

  // start the render
  const starter = useCallback(() => {
    if (canvas.current == null) {
      console.error("canvas.current is null");
      return;
    }

    globalState.set(
      "threeRender",
      new THREE.WebGLRenderer({
        canvas: canvas.current,
      })
    );
  }, [canvas]);

  useEffect(() => {
    starter();
  }, [starter]);

  useEffect(() => {
    // gets when the window is resized and updates the camera
    const handleResize = () => {
      const camera = globalState.get("camera");
      const threeRender = globalState.get("threeRender");

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      threeRender.setSize(window.innerWidth, window.innerHeight);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // add mouse up event listener
    const handleMouseUp = () => {
      globalState.set("isDragging", false);
    };

    // add mouse down event listener
    const handleMouseDown = () => {
      globalState.set("isDragging", true);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const { x, y } = globalState.get("mousePreviousPosition") ?? {};

      const nextX = event.clientX;
      const nextY = event.clientY;

      const isGoingLeft = nextX < x ? -1 : 1;
      const isGoingUp = nextY < y ? -1 : 1;

      globalState.set("isGoingLeft", isGoingLeft);
      globalState.set("isGoingUp", isGoingUp);

      globalState.set("mousePreviousPosition", {
        x: event.clientX,
        y: event.clientY,
      });
    };

    // add mouse move event listener
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvas} />;
}

export default Render;
