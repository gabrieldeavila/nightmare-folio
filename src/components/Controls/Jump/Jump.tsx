import { memo, useCallback, useEffect } from "react";
import { stateStorage, useTriggerState } from "react-trigger-state";
import type { IControl } from "../interface";

const Jump = memo(({ onJump }: IControl) => {
  const [scene] = useTriggerState({ name: "scene" });

  const jump = useCallback(() => {
    const { canJump, isDoubleJumping } = scene;
    const character = stateStorage.get("main_character");

    if ((character == null || !canJump) && isDoubleJumping) return;

    scene.canJump = false;

    const isJumpingNow = stateStorage.get("is_jumping_now");

    // se a diferença for menor dq 200 ms, então não pula
    if (
      isJumpingNow != null &&
      new Date().getTime() - isJumpingNow?.getTime?.() < 200
    ) {
      return;
    }

    if (isJumpingNow) {
      scene.isDoubleJumping = true;
      scene.character.body.applyForceY(3.5);
      return;
    }

    void onJump?.();

    stateStorage.set("is_jumping_now", new Date());

    scene.isJumping = true;
    scene.character.body.applyForceY(5);
  }, [onJump, scene]);

  useEffect(() => {
    if (scene == null) return;

    scene.jump = jump;
  }, [jump, scene]);

  return null;
});

Jump.displayName = "Jump";

export default Jump;
