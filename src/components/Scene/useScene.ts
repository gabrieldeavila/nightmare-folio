import { useCallback, useEffect } from "react";
import { globalState } from "react-trigger-state";
import * as THREE from "three";

function useScene({ name }: { name: string }) {
  const setScene = useCallback(() => {
    globalState.set(name, new THREE.Scene());
  }, [name]);

  useEffect(() => {
    setScene();

    return () => {
      globalState.delete(name);
    };
  }, [name, setScene]);
}

export default useScene;
