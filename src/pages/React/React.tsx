/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import Phaser from "phaser";

import {
  Canvas,
  ExtendedObject3D,
  FirstPersonControls,
  Scene3D,
  THREE,
  enable3d,
} from "@enable3d/phaser-extension";
import { memo, useEffect } from "react";
import { globalState } from "react-trigger-state";

class MainScene extends Scene3D {
  move: any;
  // @ts-expect-error - private property
  rifle: ExtendedObject3D;
  // @ts-expect-error - private property
  redDot: Phaser.GameObjects.Arc;
  // @ts-expect-error - private property
  player: ExtendedObject3D;
  // @ts-expect-error - private property
  firstPersonControls: FirstPersonControls;
  ambient: any;
  // @ts-expect-error - private property
  keys: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    q: Phaser.Input.Keyboard.Key;
    e: Phaser.Input.Keyboard.Key;
  };

  constructor() {
    super({ key: "MainScene" });
    this.move = { x: 0, y: 0, z: 0 };
    this.ambient = null;
  }

  postRender() {
    this.third.renderer.setViewport(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    this.third.renderer.render(this.third.scene, this.third.camera);

    this.third.renderer.clearDepth();

    this.third.renderer.setScissorTest(true);
    this.third.renderer.setScissor(50, 50, 150, 100);
    this.third.renderer.setViewport(50, 50, 150, 100);

    // @ts-expect-error - private property
    this.third.renderer.render(this.third.scene, this.secondCamera);

    this.third.renderer.setScissorTest(false);
  }

  secondCamera(_scene: THREE.Scene, _secondCamera: any) {
    throw new Error("Method not implemented.");
  }

  create() {
    this.accessThirdDimension({ maxSubSteps: 10, fixedTimeStep: 1 / 180 });

    void this.third.warpSpeed("-orbitControls", "-ground");
    // this.third.haveSomeFun(50);
    // @ts-expect-error do later
    this.third.renderer.gammaFactor = 1.5;
    this.third.camera.layers.enable(1); // enable layer 1

    // second camera
    // @ts-expect-error do later
    this.secondCamera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.third.add.existing(this.secondCamera);
    // @ts-expect-error do later
    this.third.camera.add(this.secondCamera);
    // this.secondCamera.layers.set(1)

    this.scene.scene.game.events.on(
      "postrender",
      (_renderer: any, _time: any, _delta: any) => {
        this.postRender();
      }
    );
    void this.third.load
      .gltf("/assets/glb/sands_location.glb")
      .then((object: any) => {
        const scene = object.scene;
        const book = new ExtendedObject3D();

        book.name = "scene";
        book.add(scene);
        this.third.add.existing(book);

        // add animations
        // sadly only the flags animations works
        object.animations.forEach((anim: any, i: any) => {
          // @ts-expect-error do later
          book.mixer = this.third.animationMixers.create(book);
          // overwrite the action to be an array of actions
          // @ts-expect-error do later
          book.action = [];
          // @ts-expect-error do later
          book.action[i] = book.mixer.clipAction(anim);
          // @ts-expect-error do later
          book.action[i].play();
        });

        book.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = child.receiveShadow = false;
            // @ts-expect-error do later
            child.material.metalness = 0;
            // @ts-expect-error do later
            child.material.roughness = 1;
            console.log(/react/i.test(child.name), child.name);

            if (/mesh/i.test(child.name)) {
              this.third.physics.add.existing(child, {
                shape: "concave",
                mass: 0,
                collisionFlags: 1,
                autoCenter: false,
              });
              child.body.setAngularFactor(0, 0, 0);
              child.body.setLinearFactor(0, 0, 0);
            } else if (/react/i.test(child.name)) {
              this.third.physics.add.existing(child, {
                shape: "sphere",
                mass: 1,
              });
              child.traverse((child) => {
                child.castShadow = true;
                child.receiveShadow = true;
              });

              child.body.setDamping(0.5, 0.5);
              child.body.setFriction(1);
              child.body.setAngularFactor(0, 0, 0);

              // https://docs.panda3d.org/1.10/python/programming/physics/bullet/ccd
              child.body.setCcdMotionThreshold(1e-7);
              child.body.setCcdSweptSphereRadius(0.25);
            }
          }
        });
      });

    /**
     * hashtag3d (https://www.cgtrader.com/hashtag3d)
     * https://www.cgtrader.com/free-3d-models/military/armor/m4a1-carbine-e81d81d5-cfdb-4c57-be71-5c1b8092f4ea
     * Editorial License (https://www.cgtrader.com/pages/terms-and-conditions#general-terms-of-licensing)
     */
    void this.third.load.gltf("/assets/glb/guns/M4A1.glb").then((object) => {
      const rifle = object.scene;

      this.rifle = new ExtendedObject3D();
      this.rifle.name = "rifle";
      this.rifle.add(rifle);

      this.third.add.existing(this.rifle);

      this.rifle.traverse((child) => {
        if (child.isMesh) {
          child.layers.set(1); // mesh is in layer 1
          child.castShadow = child.receiveShadow = true;
          // @ts-expect-error do later
          if (child.material) child.material.metalness = 0;
        }
      });
    });

    // add red dot
    this.redDot = this.add.circle(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      4,
      0xff0000
    );
    this.redDot.depth = 1;

    // add player
    this.player = new ExtendedObject3D();
    this.player.position.setY(2);

    // add first person controls
    this.firstPersonControls = new FirstPersonControls(
      this.third.camera,
      this.player,
      {}
    );

    // lock the pointer and update the first person control
    this.input.on("pointerdown", () => {
      this?.input?.mouse?.requestPointerLock();
    });
    this.input.on("pointermove", (pointer: any) => {
      if (this?.input?.mouse?.locked) {
        this.firstPersonControls.update(pointer.movementX, pointer.movementY);
      }
    });
    this.events.on("update", () => {
      this.firstPersonControls.update(0, 0);
    });

    // add keys
    this.keys = {
      // @ts-expect-error - do later
      w: this.input?.keyboard?.addKey("w"),
      // @ts-expect-error - do later
      a: this.input?.keyboard?.addKey("a"),
      // @ts-expect-error - do later
      s: this.input?.keyboard?.addKey("s"),
      // @ts-expect-error - do later
      d: this.input?.keyboard?.addKey("d"),
      // @ts-expect-error - do later
      q: this.input?.keyboard?.addKey("q"),
      // @ts-expect-error - do later
      e: this.input?.keyboard?.addKey("e"),
    };
  }

  update(time: any, _delta: any) {
    if (this.rifle && this.rifle) {
      // some variables
      const zoom = this.input.mousePointer.rightButtonDown();
      const speed = 0.1;
      const direction = new THREE.Vector3();
      const rotation = this.third.camera.getWorldDirection(direction);
      const theta = Math.atan2(rotation.x, rotation.z);

      // reset red dot
      this.redDot.alpha = 1;

      // the rifle movement
      if (zoom) {
        this.redDot.alpha = 0;
        this.move.x = THREE.MathUtils.lerp(this.move.x, 0.6, 0.2);
        this.move.y = THREE.MathUtils.lerp(this.move.y, -0.8 + 1.8, 0.2);
        this.move.z = THREE.MathUtils.lerp(this.move.z, -0.45, 0.2);
      } else if (this.keys.w.isDown) {
        this.move.x = Math.sin(time * -0.015) * 0.075;
        this.move.y = Math.sin(time * 0.015) * 0.075;
        this.move.z = Math.sin(time * 0.015) * 0.075;
      } else {
        this.move.x = Math.sin(time * -0.003) * 0.01;
        this.move.y = Math.sin(time * 0.003) * 0.01;
        this.move.z = Math.sin(time * 0.003) * 0.01;
      }

      // tilt
      if (this.keys.q.isDown) {
        this.third.camera.rotateZ(0.2);
        this.firstPersonControls.offset = new THREE.Vector3(
          Math.sin(theta + Math.PI * 0.5) * 0.4,
          0,
          Math.cos(theta + Math.PI * 0.5) * 0.4
        );
      } else if (this.keys.e.isDown) {
        this.third.camera.rotateZ(-0.2);
        this.firstPersonControls.offset = new THREE.Vector3(
          Math.sin(theta - Math.PI * 0.5) * 0.4,
          0,
          Math.cos(theta - Math.PI * 0.5) * 0.4
        );
      } else {
        this.third.camera.rotateZ(0);
        this.firstPersonControls.offset = new THREE.Vector3(0, 0, 0);
      }

      // adjust the position of the rifle to the camera
      const raycaster = new THREE.Raycaster();
      // x and y are normalized device coordinates from -1 to +1
      raycaster.setFromCamera(
        // @ts-expect-error - do later
        {
          x: 0.6 - this.move.x,
          y: -0.8 - this.move.y,
          width: 0,
          height: 0,
          isVector2: true,
        },
        this.third.camera
      );
      const pos = new THREE.Vector3();
      pos.copy(raycaster.ray.direction);
      pos.multiplyScalar(0.8 + this.move.z);
      pos.add(raycaster.ray.origin);

      this.rifle.position.copy(pos);

      this.rifle.rotation.copy(this.third.camera.rotation);

      // move forwards and backwards
      if (this.keys.w.isDown) {
        this.player.position.x += Math.sin(theta) * speed;
        this.player.position.z += Math.cos(theta) * speed;
      } else if (this.keys.s.isDown) {
        this.player.position.x -= Math.sin(theta) * speed;
        this.player.position.z -= Math.cos(theta) * speed;
      }

      // move sideways
      if (this.keys.a.isDown) {
        this.player.position.x += Math.sin(theta + Math.PI * 0.5) * speed;
        this.player.position.z += Math.cos(theta + Math.PI * 0.5) * speed;
      } else if (this.keys.d.isDown) {
        this.player.position.x += Math.sin(theta - Math.PI * 0.5) * speed;
        this.player.position.z += Math.cos(theta - Math.PI * 0.5) * speed;
      }

      // shoot
      const lastShoot = globalState.get("lastShoot");

      if (
        this.input.mousePointer.leftButtonDown() &&
        (lastShoot + 200 < Date.now() || lastShoot == null)
      ) {
        globalState.set("lastShoot", Date.now());
        const x = 0;
        const y = 0;
        const force = 10;
        const pos = new THREE.Vector3();

        raycaster.setFromCamera(
          // @ts-expect-error - do later
          {
            x,
            y,
            width: 0,
            height: 0,
            isVector2: true,
          },
          this.third.camera
        );

        pos.copy(raycaster.ray.direction);
        pos.add(raycaster.ray.origin);
        const sphere = this.third.physics.add.sphere(
          {
            radius: 0.05,
            x: pos.x,
            y: pos.y,
            z: pos.z,
            mass: 5,
            // @ts-expect-error do later
            bufferGeometry: true,
          },
          { phong: { color: 0x202020 } }
        );

        pos.copy(raycaster.ray.direction);
        pos.multiplyScalar(24);

        sphere.body.applyForce(pos.x * force, pos.y * force, pos.z * force);
      }
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  transparent: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [MainScene],
  ...Canvas({ antialias: true }),
};

const React = memo(() => {
  useEffect(() => {
    enable3d(() => new Phaser.Game(config)).withPhysics("./ammo/kripken/");
  }, []);

  return null;
});

React.displayName = "React";

export default React;
