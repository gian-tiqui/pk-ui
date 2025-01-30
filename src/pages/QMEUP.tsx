import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";

const QMEUP = () => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!isActive) navigate(-1);
  }, [isActive, navigate]);

  useEffect(() => {
    const resetTimer = () => {
      setIsActive(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsActive(false), 3000);
    };

    const checkIframeFocus = () => {
      if (document.activeElement === iframeRef.current) {
        resetTimer();
      }
    };

    const activityEvents = ["mousemove", "click", "keydown"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    window.addEventListener("focus", checkIframeFocus);

    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      window.removeEventListener("focus", checkIframeFocus);
    };
  }, []);

  return (
    <PageTemplate>
      <iframe
        ref={iframeRef}
        className="w-full h-screen"
        src="https://qmeup.westlakemed.com.ph:9096/signin"
        title="QMEUP"
      ></iframe>
    </PageTemplate>
  );
};

export default QMEUP;
