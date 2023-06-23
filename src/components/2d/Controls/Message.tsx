import { Space, Text } from "@geavila/gt-design";
import clsx from "clsx";
import { memo, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTriggerState } from "react-trigger-state";
import "./style.css";

const OPTIONS = [
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

function Message() {
  const [lastDown] = useTriggerState({ name: "last_key_down" });
  const keysToClick = useRef(
    OPTIONS.reduce((curr, { options }) => {
      for (const { label } of options) {
        // @ts-expect-error do later
        curr[label] = false;
      }
      return curr;
    }, {})
  );

  const alreadyKnowTheGame = useMemo(
    () => !(localStorage.getItem("know_the_game") == null),
    []
  );

  const hasClickedEveryKey = useRef(alreadyKnowTheGame ?? false);

  useEffect(() => {
    if (hasClickedEveryKey.current) return;

    const upperCase = lastDown?.toUpperCase?.();
    // @ts-expect-error do later
    keysToClick.current[upperCase] = true;

    hasClickedEveryKey.current = Object.values(keysToClick.current).every(
      (value) => value
    );

    if (hasClickedEveryKey.current) {
      localStorage.setItem("know_the_game", "true");
    }
  }, [lastDown]);

  if (alreadyKnowTheGame) return null;

  return (
    <div className={clsx("message-wrapper")}>
      <div
        className={clsx(
          "message-content",
          hasClickedEveryKey.current && "hide-msg"
        )}
      >
        <Space.Modifiers flexDirection="column">
          <Text.H1
            textShadow="1px 0px 5px white"
            fontSize="20px"
            color="black"
            fontWeight="600"
          >
            Controls:
          </Text.H1>
          <Space.Modifiers flexDirection="column" gridGap="0.5rem">
            {OPTIONS.map((option, index) => (
              <Option {...option} key={index} />
            ))}
          </Space.Modifiers>
        </Space.Modifiers>
      </div>
    </div>
  );
}

export default Message;

const Option = memo(({ label, options }: (typeof OPTIONS)[0]) => {
  const { t } = useTranslation();

  return (
    <Space.Modifiers gridGap="0.5rem">
      <Space.Modifiers gridGap="0.25rem">
        {options.map((option, index) => (
          <Keys {...option} key={index} />
        ))}
      </Space.Modifiers>
      <Text.P fontWeight="500" textShadow="1px 0px 5px white">
        {t(label)}
      </Text.P>
    </Space.Modifiers>
  );
});

Option.displayName = "Option";

const Keys = memo(({ label }: (typeof OPTIONS)[0]["options"][0]) => {
  return (
    <Space.Modifiers
      p="0.5rem"
      borderRadius="5px"
      alignItems="center"
      justifyContent="center"
      minWidth="2rem"
      background="#f5f5f5"
      boxShadow="0 0 5px rgba(0,0,0,0.1)"
    >
      {label}
    </Space.Modifiers>
  );
});

Keys.displayName = "Keys";
