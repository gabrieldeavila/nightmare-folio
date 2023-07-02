import {
  Button,
  EasyState,
  GTBasic,
  GTTranslate,
  Space,
  Text
} from "@geavila/gt-design";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./style.css";

function Header({ onClick }: { onClick: () => void | Promise<void> }) {
  const { t } = useTranslation();

  const options = useMemo(
    () => [
      { value: "en", label: "🇺🇸 English" },
      { value: "pt", label: "🇧🇷 Português" },
    ],
    []
  );

  return (
    <div className="welcome-header">
      <GTBasic>
        <Space.Modifiers
          height="100vh"
          justifyContent="center"
          flexDirection="column"
        >
          <Space.Center flexDirection="column">
            <Text.Title>NightmareFolio</Text.Title>
            <Text.H2>{t("MADE_BY")}</Text.H2>
          </Space.Center>

          <Space.Center mt="5">
            <Button.Normal fitContent onClick={onClick}>
              {t("PLAY")}
            </Button.Normal>
          </Space.Center>

          <Space.Modifiers
            gridGap="1rem"
            position="fixed"
            bottom="20px"
            left="10px"
          >
            <EasyState name="header-form" initial={{ switch: true }}>
              <GTTranslate options={options} />
            </EasyState>
          </Space.Modifiers>
        </Space.Modifiers>
      </GTBasic>
    </div>
  );
}

export default Header;
