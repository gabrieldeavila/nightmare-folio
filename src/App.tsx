import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./global.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 5 });

  const threeRender = useRef<THREE.WebGLRenderer | null>(null);

  const setThreeRender = useCallback(() => {
    if (canvasRef.current == null) {
      console.error("canvasRef.current is null");
      return;
    }

    threeRender.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });
  }, []);

  const camera = useRef<THREE.PerspectiveCamera | null>(null);

  const setCamera = useCallback(() => {
    if (canvasRef.current == null) {
      console.error("canvasRef.current is null");
      return;
    }

    // Create a camera and set its position
    camera.current = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );

    const cameraTarget = new THREE.Object3D();
    cameraTarget.position.set(0, 0, 0); // Set the initial position of the camera target
    camera.current.position.set(0, 10, -20); // Set the initial position of the camera
    camera.current.lookAt(cameraTarget.position);
  }, []);

  const cube = useRef<THREE.Mesh | null>(null);

  const setCube = useCallback(() => {
    if (canvasRef.current == null) return;

    // Create a cube and add it to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Right face (red)
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Left face (green)
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Top face (blue)
      new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom face (yellow)
      new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Front face (magenta)
      new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Back face (cyan)
    ];

    cube.current = new THREE.Mesh(geometry, materials);
  }, []);

  const scene = useRef<THREE.Scene | null>(null);

  const setScene = useCallback(() => {
    scene.current = new THREE.Scene();
  }, []);

  useEffect(() => {
    setThreeRender();
    setCamera();
    setCube();
    setScene();

    if (
      threeRender.current == null ||
      camera.current == null ||
      cube.current == null ||
      scene.current == null
    ) {
      return;
    }

    camera.current.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z
    );

    // Create a new Three.js renderer and set its size
    threeRender.current.setSize(window.innerWidth, window.innerHeight);

    scene.current.add(cube.current);

    // // Render the scene
    const animate = () => {
      if (
        threeRender.current == null ||
        camera.current == null ||
        cube.current == null
      ) {
        return;
      }

      requestAnimationFrame(animate);
      cube.current.rotation.x += 0.01;
      cube.current.rotation.y += 0.01;

      if (scene.current == null) return;

      threeRender.current.render(scene.current, camera.current);
    };
    animate();
    threeRender.current.render(scene.current, camera.current);

    // gets when the window is resized and updates the camera
    const handleResize = () => {
      if (
        threeRender.current == null ||
        camera.current == null ||
        cube.current == null
      ) {
        return;
      }

      camera.current.aspect = window.innerWidth / window.innerHeight;
      camera.current.updateProjectionMatrix();
      threeRender.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
  }, [cameraPosition.x, cameraPosition.y, cameraPosition.z, setCamera, setCube, setScene, setThreeRender]);

  const mousePreviousPosition = useRef({ x: 0, y: 0 });

  const isDragging = useRef(false);

  useEffect(() => {
    // add mouse move event listener
    const handleMouseMove = (event: MouseEvent) => {
      if (
        threeRender.current == null ||
        camera.current == null ||
        cube.current == null ||
        canvasRef.current == null ||
        scene.current == null ||
        !isDragging.current
      ) {
        mousePreviousPosition.current = { x: event.clientX, y: event.clientY };
        return;
      }
      const isGoingLeft =
        event.clientX < mousePreviousPosition.current.x ? -1 : 1;
      const isGoingUp =
        event.clientY < mousePreviousPosition.current.y ? 1 : -1;

      const isPressingShift = event.shiftKey;
      const isPressingCtrl = event.ctrlKey;
      const rotationSpeed = 0.00002;

      // x and y coordinates of a mouse pointer
      const mouseX = event.clientX * rotationSpeed;
      const mouseY = event.clientY * rotationSpeed;

      // console.log(mouseX, mouseY);
      if (isPressingCtrl) {
        cube.current.rotation.z += mouseX * isGoingLeft;
      } else if (isPressingShift) {
        cube.current.rotation.x += mouseX * isGoingUp;
      } else {
        cube.current.rotation.x += mouseX * isGoingUp;
        cube.current.rotation.y += mouseY * isGoingLeft;
      }

      scene.current.add(cube.current);

      threeRender.current.render(scene.current, camera.current);

      mousePreviousPosition.current = { x: event.clientX, y: event.clientY };
    };

    // add mouse up event listener
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // add mouse down event listener
    const handleMouseDown = () => {
      isDragging.current = true;
    };

    // add mouse move event listener
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (
      cube.current == null ||
      scene.current == null ||
      threeRender.current == null ||
      camera.current == null
    ) {
      return;
    }

    cube.current.rotation.z += cameraPosition.z;
    cube.current.rotation.y += cameraPosition.y;
    cube.current.rotation.x += cameraPosition.x;

    scene.current.add(cube.current);

    threeRender.current.render(scene.current, camera.current);
  }, [cameraPosition]);

  useEffect(() => {
    // when the user is scrolling, the camera will move forward or backward
    const handleScroll = (event: WheelEvent) => {
      if (
        threeRender.current == null ||
        camera.current == null ||
        cube.current == null ||
        canvasRef.current == null ||
        scene.current == null
      ) {
        return;
      }

      const isScrollingUp = event.deltaY < 0;
      const scrollDirection = isScrollingUp ? 1 : -1;
      const scrollSpeed = 0.2;

      // // x and y coordinates of a mouse pointer
      // const mouseX = event.clientX * scrollSpeed;
      // const mouseY = event.clientY * scrollSpeed;

      // console.log(mouseX, mouseY);

      camera.current.position.z += scrollDirection * scrollSpeed;

      scene.current.add(cube.current);

      threeRender.current.render(scene.current, camera.current);
    };

    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <>
      <label>Camera X</label>
      <input
        step="0.01"
        type="range"
        onChange={(e) =>
          setCameraPosition((prev: any) => ({
            ...prev,
            x: parseFloat(e.target.value),
          }))
        }
      />

      <label>Camera Y</label>
      <input
        step="0.01"
        type="range"
        onChange={(e) =>
          setCameraPosition((prev: any) => ({
            ...prev,
            y: parseFloat(e.target.value),
          }))
        }
      />

      <label>Camera Z</label>
      <input
        step="0.01"
        type="range"
        onChange={(e) =>
          setCameraPosition((prev: any) => ({
            ...prev,
            z: parseFloat(e.target.value),
          }))
        }
      />
      <canvas
        style={{ display: "block", margin: 0, padding: 0 }}
        ref={canvasRef}
      />
    </>
  );
}

export default App;
