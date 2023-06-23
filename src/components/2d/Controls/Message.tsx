import { GTBasic, Space, Text } from "@geavila/gt-design";
import "./style.css";
import { memo } from "react";
import { useTranslation } from "react-i18next";

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
  return (
    <div className="message-wrapper">
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
