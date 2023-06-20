import { useCallback } from "react";
import Header from "../../components/Welcome/Header/Header";
import { useNavigate } from "react-router-dom";

function Beggining() {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate("/start");
  }, [navigate]);

  return <Header onClick={handleClick} />;
}

export default Beggining;
