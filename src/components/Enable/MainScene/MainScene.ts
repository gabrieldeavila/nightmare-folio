import { Scene3D } from "enable3d";
import { stateStorage } from "react-trigger-state";

class MainScene extends Scene3D {
  constructor() {
    // @ts-expect-error - idk why this is an error 😖
    super("MainScene");
  }

  init() {
    const keys = {
      w: { isDown: false },
      a: { isDown: false },
      s: { isDown: false },
      d: { isDown: false },
      space: { isDown: false },
    };
    stateStorage.set("keys", keys);

    stateStorage.set("scene", this);

    stateStorage.set("main_scene_init", new Date());
  }

  async preload() {
    // it calls the preload method
    return stateStorage.get("main_scene_pre_load");
  }

  async create() {
    // it calls the create method
    stateStorage.set("main_scene_create", new Date());
  }

  jump() {}

  update(time: number, delta: number) {
    // it calls the update method
    stateStorage.set("main_scene_update", [time, delta, new Date()]);
  }
}

export default MainScene;
