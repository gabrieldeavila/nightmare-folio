import { Space, Text } from "@geavila/gt-design";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useTriggerState } from "react-trigger-state";

function ReactTip() {
  const { t } = useTranslation();
  const [targets] = useTriggerState({ name: "bullet_targets", initial: [] });
  const [shots] = useTriggerState({ name: "targets_shots", initial: 0 });

  const message = useMemo(() => {
    if (shots === 0) return t("REACT.INITIAL");

    if (shots === 1) return t("REACT.FIRST_TARGET");

    if (shots === 3) return t("REACT.LOOK_AROUND");

    if (shots === targets.length - 1) return t("REACT.LAST_TARGET");

    if (shots === targets.length) return t("REACT.OVERTROWN");

    return t("REACT.KEEP_GOING");
  }, [shots, t, targets.length]);

  return (
    <div className="fixed">
      <div className="flex">
        <Space.Modifiers gridGap="0.5rem" alignItems="center">
          <Text.Strong color="blue">React:</Text.Strong>
          <Text.P>{message}</Text.P>
        </Space.Modifiers>

        <Space.Modifiers
          position="absolute"
          gridGap="0.5rem"
          alignItems="center"
          right="10px"
        >
          <Text.Strong color="red">{t("TARGETS")}:</Text.Strong>
          <Text.P>
            {shots}/{targets.length}
          </Text.P>
        </Space.Modifiers>
      </div>
    </div>
  );
}

export default ReactTip;
