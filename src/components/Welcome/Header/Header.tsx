import {
  Button,
  GTBasic,
  GTModal,
  Space,
  Text,
  EasyState,
  GTInput,
} from "@geavila/gt-design";
import { memo, useCallback } from "react";
import { Settings } from "react-feather";
import { I18nextProvider, useTranslation } from "react-i18next";
import { stateStorage, useTriggerState } from "react-trigger-state";
import i18n from "../../../Translate/Translate";
import "./style.css";

function Header({ onClick }: { onClick: () => void | Promise<void> }) {
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    stateStorage.set("header_modal_show", true);
  }, []);

  return (
    <div className="welcome-header">
      <GTBasic
        themeConfig={{
          global: {
            theme: {
              loginBackground1: "red",
              loginBackground2: "pink",
              loginBackground3: "red",
            },
            darkTheme: {
              primary: "#080808",
            },
          },
        }}
      >
        <Space.Modifiers
          height="100vh"
          justifyContent="center"
          flexDirection="column"
        >
          <Space.Center flexDirection="column">
            <Text.Title>MarioFolio</Text.Title>
            <Text.H2>{t("MADE_BY")}</Text.H2>
          </Space.Center>

          <I18nextProvider i18n={i18n} />

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
            <Settings size={30} onClick={handleClick} />
          </Space.Modifiers>
          <Modal />
        </Space.Modifiers>
      </GTBasic>
    </div>
  );
}

export default Header;

const Modal = memo(() => {
  const [showModalBasic, setShowModalBasic] = useTriggerState({
    name: "header_modal_show",
    initial: false,
  });

  const [modalData] = useTriggerState({
    name: "header_modal_data",
    initial: {
      title: "HEADER.TITLE",
      confirmText: "MODAL_CONFIRM",
    },
  });

  const handleLanguageChange = useCallback(() => {
    console.log(i18n.language);
    void i18n.changeLanguage(i18n.language.includes("en") ? "pt" : "en");
  }, []);

  return (
    <>
      <GTModal
        show={showModalBasic}
        setShow={setShowModalBasic}
        data={modalData}
      >
        <Space.Modifiers p="0.5rem" flexDirection="column" gridGap="1rem">
          <EasyState name="header-form" initial={{ switch: true }}>
            <GTInput.Switch
              onChange={handleLanguageChange}
              name="switch"
              label="CHANGE_LANGUAGE"
            />

            <GTInput.Switch name="switch" label="3D_VIEW" />
          </EasyState>
        </Space.Modifiers>
      </GTModal>
    </>
  );
});

Modal.displayName = "Modal";
