/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { stateStorage } from "react-trigger-state";

export const handleAfterMainSetted = (newChar: any, physics: any) => {
  const surpiseBoxes = stateStorage.get("surprise_boxes");
  const coins = stateStorage.get("coins");

  for (const box of surpiseBoxes) {
    physics.add.collider(newChar, box, () => {
      const alreadyCollided = stateStorage.get(`already_collided_${box.name}`);

      if (alreadyCollided) return;
      const index = box.name.split("surprise_box")[1];

      const coinCollider = coins.find(
        (coin: any) => coin.name === `coin${index}`
      );

      stateStorage.set(
        "coins_collected",
        (stateStorage.get("coins_collected") || 0) + 1
      );
      // changes the coin's position to the box's position
      let yMagic = 0.5;

      const clearMagic = setInterval(() => {
        coinCollider.position.set(
          box.position.x,
          box.position.y + yMagic,
          box.position.z
        );

        // makes it flip
        coinCollider.rotation.z += 0.1;

        yMagic += 0.01;
      }, 10);

      let yMagic2 = 0;

      // after 1 second, clear the interval
      setTimeout(() => {
        clearInterval(clearMagic);

        // // now go down
        const clearMagic2 = setInterval(() => {
          coinCollider.position.set(
            box.position.x,
            box.position.y + yMagic - yMagic2,
            box.position.z
          );

          // makes it flip
          coinCollider.rotation.z += 0.1;

          yMagic2 += 0.01;
        }, 10);

        // // after 1 second, clear the interval
        setTimeout(() => {
          clearInterval(clearMagic2);
          // changes the box metalness to 0
          box.material.metalness = 0.8;
        }, 2500);
      }, 2000);

      stateStorage.set(`already_collided_${box.name}`, true);
    });
  }

  const extraCoins = stateStorage.get("extra_coins");

  for (const coin of extraCoins) {
    const fun = () => {
      const alreadyCollided = stateStorage.get(`already_collided_${coin.name}`);

      if (alreadyCollided) return;

      stateStorage.set(`already_collided_${coin.name}`, true);
      stateStorage.set(
        "coins_collected",
        (stateStorage.get("coins_collected") || 0) + 1
      );
      // changes its mass to 0
      coin.body.setCollisionFlags(2);

      // set the new position
      // coin.position.set(-60, 5, 3.75);
      coin.scale.set(0, 0, 0);
      coin.body.needUpdate = true;

      // this will run only on the next update if body.needUpdate = true
      coin.body.once.update(() => {
        // set body back to dynamic
        coin.body.setCollisionFlags(0);

        // if you do not reset the velocity and angularVelocity, the object will keep it
        coin.body.setVelocity(0, 0, 0);
        coin.body.setAngularVelocity(0, 0, 0);
      });
    };

    physics.add.collider(newChar, coin, fun);
    physics.add.collider(coin, newChar, fun);
  }

  const teleporters = stateStorage.get("teleporters");

  for (const teleporter of teleporters) {
    physics.add.collider(newChar, teleporter, () => {
      // changes its mass to 0
      newChar.body.setCollisionFlags(2);

      // set the new position
      newChar.position.set(105.28, 5, 3.75);
      newChar.body.needUpdate = true;

      // this will run only on the next update if body.needUpdate = true
      newChar.body.once.update(() => {
        // set body back to dynamic
        newChar.body.setCollisionFlags(0);

        // if you do not reset the velocity and angularVelocity, the object will keep it
        newChar.body.setVelocity(0, 0, 0);
        newChar.body.setAngularVelocity(0, 0, 0);
      });
    });
  }
};
