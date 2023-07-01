/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import { GTBasic, Space, Text } from "@geavila/gt-design";
import "./style.css";
import { useTranslation } from "react-i18next";
import { Loader } from "react-feather";
import { useTriggerState } from "react-trigger-state";

const Loading = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current == null) return;

    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const Body = Matter.Body;
    const MouseConstraint = Matter.MouseConstraint;
    const Mouse = Matter.Mouse;
    const Composite = Matter.Composite;
    const Constraint = Matter.Constraint;
    const Bodies = Matter.Bodies;

    // create engine
    const engine = Engine.create();
    const world = engine.world;

    // create renderer
    const render = Render.create({
      element: canvasRef.current,
      engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        showVelocity: false,
        wireframes: false,
        showBounds: false,
      },
    });

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // see newtonsCradle function defined later in this file
    const createNewtonsCradle = (
      xx: number,
      yy: number,
      number: number,
      size: number,
      length: number
    ) => {
      const newtonsCradle = Composite.create({ label: "Newtons Cradle" });

      for (let i = 0; i < number; i++) {
        const separation = 1.9;
        const circle = Bodies.circle(
          xx + i * (size * separation),
          yy + length,
          size,
          {
            inertia: Infinity,
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            slop: size * 0.02,
          }
        );
        const constraint = Constraint.create({
          pointA: { x: xx + i * (size * separation), y: yy },
          bodyB: circle,
          render: {
            strokeStyle: "#f0e68c",
          },
        });

        // @ts-expect-error - MatterJS types are not up to date
        Composite.addBody(newtonsCradle, circle);
        // @ts-expect-error - MatterJS types are not up to date
        Composite.addConstraint(newtonsCradle, constraint);
      }

      return newtonsCradle;
    };

    const xx2 = 280;
    const yy2 = window.innerHeight / 3 - 100;
    const number2 = 7;
    const size2 = 20;
    const length2 = 140;
    const cradle2 = createNewtonsCradle(xx2, yy2, number2, size2, length2);
    Composite.add(world, cradle2);
    Body.translate(cradle2.bodies[0], { x: -140, y: -100 });

    // add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      // @ts-expect-error - MatterJS types are not up to date
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 50 },
      max: { x: 800, y: 600 },
    });

    // cleanup
    return () => {
      Render.stop(render);
      Runner.stop(runner);
    };
  }, []);

  const { t } = useTranslation();

  const [everyThingIsLoaded] = useTriggerState({
    initial: false,
    name: "every_thing_is_loaded",
  });

  // if (everyThingIsLoaded) return null;

  return (
    <GTBasic>
      <div className="loading-container">
        <Space.Modifiers
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          top="20%"
          left="0"
          right="0"
          position="fixed"
          zIndex="2"
        >
          <div className="loader-anim">
            <Loader />
          </div>
          <Text.P fontWeight="500" textAlign="center" fontSize="20px">
            {t("LOADING")}
          </Text.P>
        </Space.Modifiers>
        <div ref={canvasRef}></div>
      </div>
    </GTBasic>
  );
};

export default Loading;
