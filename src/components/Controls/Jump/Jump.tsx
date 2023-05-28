import { memo, useCallback, useEffect } from "react";
import { stateStorage, useTriggerState } from "react-trigger-state";

const Jump = memo(() => {
  const [scene] = useTriggerState({ name: "scene" });

  const jump = useCallback(() => {
    const { canJump } = scene;
    const character = stateStorage.get("main_character");

    if (character == null || !canJump) return;

    scene.canJump = false;
    // character.animation.play("jump", 200, false);

    scene.isJumping = true;
    scene.character.body.applyForceY(4);
  }, [scene]);

  useEffect(() => {
    if (scene == null) return;

    scene.jump = jump;
  }, [jump, scene]);

  return null;
});

Jump.displayName = "Jump";

export default Jump;
