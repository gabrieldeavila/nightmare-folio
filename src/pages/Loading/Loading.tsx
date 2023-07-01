import Matter, {
  Bodies,
  Composite,
  Composites,
  Constraint,
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
} from "matter-js";
import { useEffect, useRef } from "react";

const Loading = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const loading = Matter.Engine.create();

    loading.wreckingBall = function () {
      const engine = Engine.create();
      const world = engine.world;

      const render = Render.create({
        element: canvasRef.current,
        engine,
        options: {
          width: window.innerWidth,
          height: window.innerHeight,
          showAngleIndicator: true,
        },
      });

      Render.run(render);

      const runner = Runner.create();
      Runner.run(runner, engine);

      const rows = 10;
      const yy = 600 - 25 - 40 * rows;

      const stack = Composites.stack(400, yy, 5, rows, 0, 0, function (x, y) {
        // add a text "loading" to the ball
        console.log(Bodies);
        return Bodies.rectangle(x, y, 40, 40);
      });

      Composite.add(world, [
        stack,
        Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
        Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
        Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
        Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
      ]);

      const ball = Bodies.circle(100, 400, 50, {
        density: 0.04,
        frictionAir: 0.005,
      });

      Composite.add(world, ball);
      Composite.add(
        world,
        Constraint.create({
          pointA: { x: 300, y: 100 },
          bodyB: ball,
        })
      );

      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

      Composite.add(world, mouseConstraint);
      render.mouse = mouse;

      Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 },
      });

      return {
        engine,
        runner,
        render,
        canvas: render.canvas,
        stop: function () {
          Render.stop(render);
          Runner.stop(runner);
        },
      };
    };

    loading.wreckingBall.title = "Wrecking Ball";
    loading.wreckingBall.for = ">=0.14.2";

    loading.wreckingBall();
  }, []);

  return <div ref={canvasRef} />;
};

export default Loading;
