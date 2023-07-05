/* eslint-disable multiline-ternary */
import { Space, Text } from "@geavila/gt-design";
import { differenceInMinutes } from "date-fns";
import React, { memo, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  globalState,
  stateStorage,
  useTriggerState,
} from "react-trigger-state";

function MarioTip() {
  const navigate = useNavigate();
  const [coins] = useTriggerState({ name: "coins_collected", initial: 0 });
  const [timeSpent] = useTriggerState({
    name: "time_spent",
    initial: { start: new Date(), current: new Date() },
  });

  const [hasEnded] = useTriggerState({ name: "has_ended", initial: false });

  useEffect(() => {
    // add listener to start tip
    const listener = (e: KeyboardEvent) => {
      if (!hasEnded) return;

      if (e.key === "b") {
        stateStorage.set("every_thing_is_loaded", false);
        const deleteKeys = ["ambient_childs", "scene"];

        deleteKeys.forEach((key) => {
          globalState.delete(key);
        });

        // FIXME: find a way to navigate to start without window.location.href
        window.location.href = "/start";
        // navigate("/start");
      }
    };

    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [hasEnded, navigate]);

  useEffect(() => {
    async function doStuff() {
      if (hasEnded) {
        const audio = globalState.get("audio");
        const song = globalState.get("mario_song");
        const victory = await audio.add("victory");
        victory.play();
        song?.stop();
      }
    }

    void doStuff();
  }, [hasEnded]);

  const minutesAndSecondsSpent = useMemo(
    () =>
      `${differenceInMinutes(timeSpent.current, timeSpent.start)}:${(
        timeSpent.current.getSeconds() - timeSpent.start.getSeconds()
      )
        .toString()
        .padStart(2, "0")}`,
    [timeSpent]
  );

  const { t } = useTranslation();

  return (
    <div className="fixed">
      {hasEnded ? (
        <div className="flex">
          <Text.Strong textShadow="1px 0px 5px white" color="black">
            {t("END")}
          </Text.Strong>
        </div>
      ) : (
        <Space.Modifiers>
          <Info title="SCORE" value={coins * 100} />
          <Info title="COINS" value={coins} />
          <Info title="TIME" value={minutesAndSecondsSpent} />
          <Info title="LIVES" value="∞" />
        </Space.Modifiers>
      )}
    </div>
  );
}

export default MarioTip;

const Info = memo(
  ({ title, value }: { title: string; value: string | number }) => {
    const { t } = useTranslation();

    return (
      <Space.Modifiers
        flexGrow="1"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gridGap="0.1rem"
      >
        <Text.P
          m="0"
          textShadow="1px 0px 5px white"
          fontSize="1.5rem"
          color="black"
        >
          {t(title)}
        </Text.P>
        <Text.P
          textShadow="1px 0px 5px white"
          m="0"
          fontSize="1.25rem"
          color="black"
        >
          {value}
        </Text.P>
      </Space.Modifiers>
    );
  }
);

Info.displayName = "Info";
