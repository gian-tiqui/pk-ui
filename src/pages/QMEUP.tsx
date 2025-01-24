import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";

const QMEUP = () => {
  const [idle, setIdle] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate(-1);
    }, 5000);
  }, [idle, navigate]);

  return (
    <PageTemplate>
      {" "}
      <iframe
        className="w-full h-screen"
        src="https://qmeup.westlakemed.com.ph:9096/signin"
        title="QMEUP"
      ></iframe>
    </PageTemplate>
  );
};

export default QMEUP;
