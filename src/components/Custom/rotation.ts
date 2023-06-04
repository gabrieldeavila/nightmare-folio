import { THREE } from "enable3d";
import { globalState } from "react-trigger-state";

export const changeRotation = (char: string, customSpeed?: number) => {
  const speed = customSpeed ?? 4;
  const charObj = globalState.get(char);

  if (charObj == null) return;

  const rotation = charObj.getWorldDirection(
    new THREE.Vector3()?.setFromEuler?.(charObj.rotation)
  );

  const theta = Math.atan2(rotation.x, rotation.z);

  const x = Math.sin(theta) * speed;
  const y = charObj.body.velocity.y;
  const z = Math.cos(theta) * speed;
  charObj.body.setVelocity(x, y, z);
};
