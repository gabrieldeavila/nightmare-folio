import { Canvas } from "@react-three/fiber";
import Box from "./components/Box";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import "./global.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 5 });
  const [cameraPosition2, setCameraPosition2] = useState({ x: 0, y: 0, z: 5 });

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
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
  }, []);

  const cube = useRef<THREE.Mesh | null>(null);

  const setCube = useCallback(() => {
    if (canvasRef.current == null) return;

    // Create a cube and add it to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube.current = new THREE.Mesh(geometry, material);
  }, []);

  useLayoutEffect(() => {
    setThreeRender();
    setCamera();
    setCube();

    if (
      threeRender.current == null ||
      camera.current == null ||
      cube.current == null
    ) {
      return;
    }

    camera.current.position.set(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z
    );

    // Create a new Three.js scene
    const scene = new THREE.Scene();

    // Create a new Three.js renderer and set its size
    threeRender.current.setSize(window.innerWidth, window.innerHeight);

    scene.add(cube.current);

    // Render the scene
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
      threeRender.current.render(scene, camera.current);
    };
    animate();

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
  }, [
    cameraPosition.x,
    cameraPosition.y,
    cameraPosition.z,
    setCamera,
    setCube,
    setThreeRender,
  ]);

  useEffect(() => {
    // add mouse move event listener
    const handleMouseMove = (event: MouseEvent) => {
      if (
        threeRender.current == null ||
        camera.current == null ||
        cube.current == null ||
        canvasRef.current == null
      ) {
        return;
      }

      const { clientX, clientY } = event;
      const { width, height } = canvasRef.current;
      const mousePosition = {
        x: (clientX / width) * 2 - 1,
        y: -(clientY / height) * 2 + 1,
      };
      const raycaster = new THREE.Raycaster();

      // @ts-expect-error - we don't need to pass a complete object
      raycaster.setFromCamera(mousePosition, camera.current);

      // Calculate the distance from the camera to the cube
      const intersects = raycaster.intersectObjects([cube.current]);
      const distance = intersects.length > 0 ? intersects[0].distance : null;

      // Update the camera position based on the distance from the cube
      if (distance !== null) {
        const cameraDistance = 5; // Distance from the camera to the cube
        let cameraZ =
          cameraDistance / Math.tan((Math.PI * camera.current.fov) / 360);
        let cameraX = distance * mousePosition.x * cameraZ;
        let cameraY = distance * mousePosition.y * cameraZ;

        if (cameraX < 0 || cameraX > 2) cameraX = 1;
        if (cameraZ < 0 || cameraZ > 2) cameraZ = 2;
        if (cameraY < 0 || cameraY > 2) cameraY = 0.1;
        console.log(cameraX, cameraY, cameraZ);
        camera.current.position.set(cameraX, cameraY, cameraX);
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
