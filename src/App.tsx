import { Canvas } from "@react-three/fiber";
import Box from "./components/Box";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import "./global.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 5 });
  const [cameraPosition2, setCameraPosition2] = useState({ x: 0, y: 0, z: 5 });

  const threeRender = useMemo(() => {
    if (!canvasRef.current) return;

    return new THREE.WebGLRenderer({ canvas: canvasRef.current });
  }, []);

  const camera = useMemo(() => {
    if (!canvasRef.current) return;

    // Create a camera and set its position
    return new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
  }, []);

  const cube = useMemo(() => {
    if (!canvasRef.current) return;

    // Create a cube and add it to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    return new THREE.Mesh(geometry, material);
  }, []);

  useLayoutEffect(() => {
    console.log(threeRender, camera, cube);

    if (!threeRender || !camera || !cube) return;
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    // Create a new Three.js scene
    const scene = new THREE.Scene();

    if (!canvasRef.current) return;

    // Create a new Three.js renderer and set its size
    threeRender.setSize(window.innerWidth, window.innerHeight);

    scene.add(cube);

    // Render the scene
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      threeRender.render(scene, camera);
    };
    animate();

    // gets when the window is resized and updates the camera
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      threeRender.setSize(window.innerWidth, window.innerHeight);
    };
    console.log("aaa")
    window.addEventListener("resize", handleResize);
  }, [threeRender]);

  useEffect(() => {
    // add mouse move event listener
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current || !camera || !cube) return;

      const { clientX, clientY } = event;
      const { width, height } = canvasRef.current;
      const mousePosition = {
        x: (clientX / width) * 2 - 1,
        y: -(clientY / height) * 2 + 1,
      };
      const raycaster = new THREE.Raycaster();
      // @ts-expect-error
      raycaster.setFromCamera(mousePosition, camera);

      // Calculate the distance from the camera to the cube
      const intersects = raycaster.intersectObjects([cube]);
      const distance = intersects.length > 0 ? intersects[0].distance : null;

      // Update the camera position based on the distance from the cube
      if (distance !== null) {
        const cameraDistance = 5; // Distance from the camera to the cube
        let cameraZ = cameraDistance / Math.tan((Math.PI * camera.fov) / 360);
        let cameraX = distance * mousePosition.x * cameraZ;
        let cameraY = distance * mousePosition.y * cameraZ;

        if(cameraX < 0) cameraX = 75;
        if(cameraZ < 0) cameraZ = 500;
        if(cameraY < 0) cameraY = 0.1;

        camera.position.set(cameraX, cameraY, cameraX);
      }
    };

    // add mouse move event listener
    window.addEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <canvas
      style={{ display: "block", margin: 0, padding: 0 }}
      ref={canvasRef}
    />
  );
}

export default App;
