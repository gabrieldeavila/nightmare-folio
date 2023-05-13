import { Scene3D } from "enable3d";
import { globalState } from "react-trigger-state";

class MainScene extends Scene3D {
  constructor() {
    // @ts-expect-error - idk why this is an error 😖
    super("MainScene");
  }

  init() {
    // it calls the init method
    const initMethod = globalState.get("initMethod");

    initMethod?.();
  }

  async preload() {
    // it calls the preload method
    const preloadMethod = globalState.get("preloadMethod");

    preloadMethod?.();
  }

  async create() {
    // it calls the create method
    const createMethod = globalState.get("createMethod");

    createMethod?.();
  }

  jump() {
    // it calls the jump method
    const jumpMethod = globalState.get("jumpMethod");

    jumpMethod?.();
  }

  update(time: number, delta: number) {
    // it calls the update method
    const updateMethod = globalState.get("updateMethod");

    updateMethod?.(time, delta);
  }
}

export default MainScene;
