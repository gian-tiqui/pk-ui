import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";

const QmeupPage = () => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startInactivityTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, 60000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    startInactivityTimer();
  }, [startInactivityTimer]);

  const handleMouseEnter = useCallback(() => {
    setIsActive(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isActive) navigate(-1);
  }, [isActive, navigate]);

  return (
    <PageTemplate>
      <div
        ref={containerRef}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className="w-full h-screen"
      >
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
