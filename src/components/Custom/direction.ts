import { globalState } from "react-trigger-state";
import type { TypeDefaultPosition } from "./interface";

export const checkDirection = (
  char: string,
  defaultPosition: TypeDefaultPosition,
  newX: number,
  directionToCheck: "left" | "right"
) => {
  const dirKey = `${char}_direction`;
  const lastKey = `${char}_last_interaction`;

  const direction = globalState.get(dirKey);
  const lastInteration = globalState.get(lastKey);
  const charObj = globalState.get(char);
  if (charObj == null) return;

  const currPosition = charObj.position.clone();

  // if is right the comparison is inverted
  const isRight = directionToCheck === "right";
  const comparison = isRight ? currPosition.x < newX : currPosition.x > newX;
  const otherDirection = isRight ? "left" : "right";

  if (
    comparison &&
    (Date.now() - lastInteration > 1000 || lastInteration == null) &&
    direction === directionToCheck
  ) {
    globalState.set(dirKey, otherDirection);
    globalState.set(lastKey, Date.now());

    charObj.body.setCollisionFlags(2);
    // inverts Y rotation
    const yInverted = charObj.rotation.y * -1;
    const newPosition = defaultPosition;
    newPosition[0] = newX;

    // set the new position
    charObj.rotation.set(charObj.rotation.x, yInverted, charObj.rotation.z);
    charObj.position.set(...newPosition);
    charObj.body.needUpdate = true;

    // this will run only on the next update if body.needUpdate = true
    charObj.body.once.update(() => {
      // set body back to dynamic
      charObj.body.setCollisionFlags(0);

      // if you do not reset the velocity and angularVelocity, the object will keep it
      charObj.body.setVelocity(0, 0, 0);
      charObj.body.setAngularVelocity(0, 0, 0);
    });

    return true;
  }
};
