/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useMemo } from "react";
import { useTriggerState } from "react-trigger-state";
import Message from "../../components/2d/Controls/Message";

const OPTIONS_3D = [
  {
    label: "MOVE",
    options: [
      {
        label: "W",
      },
      {
        label: "A",
      },
      {
        label: "S",
      },
      {
        label: "D",
      },
    ],
  },
  {
    label: "PERSPECTIVE",
    options: [
      {
        label: "F",
      },
    ],
  },
  {
    label: "SPRINT",
    options: [
      {
        label: "SHIFT",
      },
    ],
  },
  {
    label: "JUMP",

    options: [
      {
        label: "SPACE",
      },
    ],
  },
];

const OPTIONS_2D = [
  {
    label: "MOVE",
    options: [
      {
        label: "A",
      },
      {
        label: "D",
      },
    ],
  },
  {
    label: "PERSPECTIVE",
    options: [
      {
        label: "F",
      },
    ],
  },
  {
    label: "SPRINT",
    options: [
      {
        label: "SHIFT",
      },
    ],
  },
  {
    label: "JUMP",
    options: [
      {
        label: "SPACE",
      },
      {
        label: "W",
      },
    ],
  },
];

function ControlTip() {
  const [view3d] = useTriggerState({ name: "3d_view" });

  const options = useMemo(() => (view3d ? OPTIONS_3D : OPTIONS_2D), [view3d]);

  return <Message options={options} />;
}

export default ControlTip;
