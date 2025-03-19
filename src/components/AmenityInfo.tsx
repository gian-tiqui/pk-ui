import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useState } from "react";
import AmenityInfoDialog from "./AmenityInfoDialog";

const AmenityInfo = () => {
  const [isShown, setIsShown] = useState<boolean>(false);

  return (
    <>
      <AmenityInfoDialog visible={isShown} setVisible={setIsShown} />
      <Button
        className="absolute w-8 h-8 top-10 right-10"
        icon={PrimeIcons.QUESTION_CIRCLE}
        onClick={() => {
          setIsShown((prev) => !prev);
        }}
      ></Button>
    </>
  );
};

export default AmenityInfo;
