import { Text } from "@geavila/gt-design";
import React from "react";
import { useTranslation } from "react-i18next";

function StartTip() {
  const { t } = useTranslation();

  return (
    <div className="fixed">
      <div className="flex">
        <Text.Strong color="black">{t("START_TIP")}</Text.Strong>
      </div>
    </div>
  );
}

export default StartTip;
