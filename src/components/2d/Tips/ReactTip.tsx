import { Space, Text } from "@geavila/gt-design";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTriggerState } from "react-trigger-state";

function ReactTip() {
  const { t } = useTranslation();
  const [targets] = useTriggerState({ name: "bullet_targets", initial: [] });
  const [revengeTargets] = useTriggerState({
    name: "revenge_targets",
    initial: [],
  });
  const [shots] = useTriggerState({ name: "targets_shots", initial: 0 });
  const [revengeShots] = useTriggerState({ name: "revenge_shots", initial: 0 });
  const [shotReact] = useTriggerState({ name: "shot_react", initial: false });

  const message = useMemo(() => {
    if (revengeShots && revengeShots === revengeTargets.length) {
      return t("REACT.OVERTROWN");
    }

    if (shotReact) return t("REACT.FINAL");

    if (shots === 0) return t("REACT.INITIAL");

    if (shots === 1) return t("REACT.FIRST_TARGET");

    if (shots === 3) return t("REACT.LOOK_AROUND");

    if (shots === 5) return t("REACT.FIFTH");

    if (shots === targets.length - 1) return t("REACT.LAST_TARGET");

    if (shots === targets.length) return t("REACT.ME_VS_YOU");

    return t("REACT.KEEP_GOING");
  }, [
    revengeShots,
    revengeTargets.length,
    shotReact,
    shots,
    t,
    targets.length,
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    // add listener to B or L key
    const listener = (e: any) => {
      if (
        e.key === "l" ||
        (e.key === "b" && t("REACT.OVERTROWN") === message)
      ) {
        // FIXME should find a way to remove the enable3d instead of reloading the page
        window.location.href = "/start";
      }
    };

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [message, navigate, shotReact, t]);

  return (
    <div className="fixed">
      <div className="flex">
        <Space.Modifiers gridGap="0.5rem" justifyContent="center" width="60%">
          <Space.Modifiers gridGap="0.5rem" alignItems="center">
            <Text.Strong color="blue">React:</Text.Strong>
            <Text.P textAlign="center">{message}</Text.P>
          </Space.Modifiers>
        </Space.Modifiers>

        {revengeTargets.length === 0 && shots < targets.length && (
          <Targets {...{ shots, targets }} />
        )}

        {revengeShots < revengeTargets.length && (
          <Targets shots={revengeShots} targets={revengeTargets} />
        )}
      </div>
    </div>
  );
}

export default ReactTip;

const Targets = ({ shots, targets }: { shots: any; targets: any }) => {
  const { t } = useTranslation();

  return (
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
  );
};
