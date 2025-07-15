import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const MainMenuButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      className="absolute justify-center w-40 h-10 gap-4 top-10 left-10"
      onClick={() => {
        navigate("/");
      }}
      icon={`${PrimeIcons.HOME}`}
    >
      Main Menu
    </Button>
  );
};

export default MainMenuButton;
