/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useCallback, useEffect } from "react";
import { globalState } from "react-trigger-state";
import * as THREE from "three";

function useCamera({
  name,
  sceneName,
}: // initial,
{
  name: string;
  initial?: { x: number; y: number; z: number };
  sceneName: string;
}) {
  const setCamera = useCallback(() => {
    const canvas = globalState.get("canvas");

    if (canvas.current == null) return;

    // Create a camera and set its position
    globalState.set(
      name,
      new THREE.PerspectiveCamera(
        75,
        canvas.current.clientWidth / canvas.current.clientHeight,
        0.1,
        1000
      )
    );
  }, [name]);

  useEffect(() => {
    setCamera();

    const camera = globalState.get(name);
    camera.position.set(0, 0, 5);

    return () => {
      globalState.delete(name);
    };
  }, [name, setCamera]);
}

export default useCamera;
