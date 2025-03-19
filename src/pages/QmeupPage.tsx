import { Button } from "primereact/button";
import PageTemplate from "../templates/PageTemplate";
import { useNavigate } from "react-router-dom";
import { PrimeIcons } from "primereact/api";

const QmeupPage = () => {
  const navigate = useNavigate();

  return (
    <PageTemplate>
      <div className="relative w-full h-screen">
        <Button
          className="absolute w-10 h-10 top-10 left-10"
          onClick={() => {
            navigate(-1);
          }}
          icon={`${PrimeIcons.BACKWARD}`}
        ></Button>
        <iframe
          className="w-full h-full"
          src="https://qmeup.westlakemed.com.ph:9096/signin"
          title="QMEUP"
        ></iframe>
      </div>
    </PageTemplate>
  );
};

export default QmeupPage;
