import { memo, useEffect } from "react";
import { useTriggerState } from "react-trigger-state";

const Jump = memo(() => {
  const [scene] = useTriggerState({ name: "scene" });

  useEffect(() => {
    if (scene == null) return;
    const { character, canJump } = scene;

    if (character == null || canJump === false) return;

    scene.canJump = false;
    scene.character.animation.play("jump_running", 500, false);
    setTimeout(() => {
      scene.canJump = true;
      scene.character.animation.play("idle", 500);
    }, 500);

    scene.character.body.applyForceY(6);
  }, [scene]);

  return null;
});

Jump.displayName = "Jump";

export default Jump;
