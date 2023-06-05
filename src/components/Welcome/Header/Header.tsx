import { Button, GTBasic, Space, Text } from "@geavila/gt-design";
import "./style.css";

function Header({ onClick }: { onClick: () => void | Promise<void> }) {
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
            <Text.H2>Made by Gabriel Ávila</Text.H2>
          </Space.Center>

          <Space.Center mt="5">
            <Button.Normal fitContent onClick={onClick}>
              Click to play
            </Button.Normal>
          </Space.Center>
        </Space.Modifiers>
      </GTBasic>
    </div>
  );
}

export default Header;
