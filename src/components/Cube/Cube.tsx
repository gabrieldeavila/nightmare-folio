import React from "react";
import useCube from "./useCube";

function Cube({
  name,
  sceneName,
  position,
}: {
  name: string;
  sceneName: string;
  position: [number, number, number, number?, number?, number?];
}) {
  useCube({
    name,
    sceneName,
    position,
  });

  return null;
}

export default Cube;
