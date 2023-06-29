import { Text } from "@geavila/gt-design";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTriggerState } from "react-trigger-state";

const TIPS = {
  react: "REACT_TIP",
  mistery_block: "MISTERY_BLOCK_TIP",
  start: "START_TIP",
};

function StartTip() {
  const { t } = useTranslation();
  const [startTip] = useTriggerState({ name: "start_tip" });
  const navigate = useNavigate();

  // @ts-expect-error - someday I'll fix this
  const currTip = useMemo(() => TIPS[startTip ?? "start"], [startTip]);

  useEffect(() => {
    // add listener to start tip
    const listener = (e: KeyboardEvent) => {
      if (e.key === "m" && startTip === "mistery_block") {
        navigate("/mario");
      } else if (e.key === "r" && startTip === "react") {
        navigate("/react");
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [navigate, startTip]);

  return (
    <div className="fixed">
      <div className="flex">
        <Text.Strong color="black">{t(currTip)}</Text.Strong>
      </div>
    </div>
  );
}

export default StartTip;
