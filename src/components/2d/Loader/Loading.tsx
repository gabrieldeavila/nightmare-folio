import { GTBasic, Space, Text } from "@geavila/gt-design";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Loader } from "react-feather";
import { useTranslation } from "react-i18next";
import { useTriggerState } from "react-trigger-state";
import "./style.css";

function Loading() {
  const [everyThingIsLoaded] = useTriggerState({
    initial: false,
    name: "every_thing_is_loaded",
  });
  const [hideAfterUnloaded, setHideAfterUnloaded] = useState(false);

  useEffect(() => {
    if (everyThingIsLoaded) {
      setTimeout(() => {
        setHideAfterUnloaded(true);
      }, 500);
    }
  }, [everyThingIsLoaded]);

  const { t } = useTranslation();

  if (hideAfterUnloaded) return null;

  return (
    <div className="loading-wrapper">
      <div
        className={clsx(
          "loading-content",
          everyThingIsLoaded && "loading-is-done"
        )}
      >
        <GTBasic noThemeChange>
          <Space.Modifiers
            position="absolute"
            top="0"
            bottom="0"
            left="0"
            right="0"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <div className="loader-anim">
              <Loader />
            </div>
            <Text.Subtitle>{t("LOADING")}</Text.Subtitle>
          </Space.Modifiers>
        </GTBasic>
      </div>
    </div>
  );
}

export default Loading;
