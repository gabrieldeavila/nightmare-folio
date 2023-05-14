import { PhysicsLoader, Project } from "enable3d";
import React, { memo, useEffect, useRef } from "react";
import MainScene from "./MainScene/MainScene";
import type { IEnable } from "./interface";
import { stateStorage } from "react-trigger-state";

const Enable3d = memo(({ children }: IEnable) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const destination = ref.current!;

    stateStorage.set("is_touch_device", "ontouchstart" in window);

    PhysicsLoader("./ammo/kripken/", () => {
      const project = new Project({
        antialias: true,
        maxSubSteps: 10,
        fixedTimeStep: 1 / 120,
        scenes: [MainScene],
        anisotropy: 1,
      });

      destination.appendChild(project.canvas);
      project.canvas.style.marginTop = "0px !important";
      const HEIGHT = window.innerHeight;
      const WIDTH = window.innerWidth;

      const resize = () => {
        const newWidth = window.innerWidth;
        const newHeight = (HEIGHT / WIDTH) * newWidth;
        destination.style.width = `${newWidth}px`;
        destination.style.height = `${newHeight}px`;
        project.renderer.setSize(newWidth, newHeight);
        // @ts-expect-error - no types for this, should be fine though
        project.camera.aspect = newWidth / newHeight;
        project.camera.updateProjectionMatrix();
      };
      window.onresize = resize;
      resize();
    });

    return () => {
      window.onresize = null;
    };
  }, []);

  return <div ref={ref}>{children}</div>;
});

Enable3d.displayName = "Enable3d";

export default Enable3d;
