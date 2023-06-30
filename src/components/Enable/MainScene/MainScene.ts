import { Scene3D } from "enable3d";
import { globalState, stateStorage } from "react-trigger-state";

class MainScene extends Scene3D {
  constructor() {
    const sceneName = globalState.get("scene-name") ?? "MainScene";

    stateStorage.set("main_scene_constructor", sceneName);

    super(sceneName);
  }

  init() {
    const keys = {
      w: { isDown: false },
      a: { isDown: false },
      s: { isDown: false },
      d: { isDown: false },
      shift: { isDown: false },
      space: { isDown: false },
    };

    // @ts-expect-error - should add a type for this
    this.lastAnimationEndsIn = 0;
    // @ts-expect-error - should add a type for this
    this.isJumping = false;
    // @ts-expect-error - should add a type for this
    this.isFalling = true;
    // @ts-expect-error - should add a type for this
    this.initialFall = true;

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
