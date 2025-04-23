import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import MainMenuButton from "../components/MainMenuButton";

const QmeupPage = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState(50);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const resetTimer = () => {
      setTimeLeft(50);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => navigate("/main"), 50000);
    };

    const handleInteraction = () => resetTimer();

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("mousemove", handleInteraction);

    const handleMessage = (event: MessageEvent) => {
      if (event.data === "userActivity") {
        resetTimer();
      }
    };
    window.addEventListener("message", handleMessage);

    resetTimer();

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("message", handleMessage);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [navigate]);

  return (
    <PageTemplate>
      <div className="relative w-full h-screen">
        <div className="absolute z-50 p-2 text-white bg-black rounded top-4 left-4 bg-opacity-70">
          Returning in: {timeLeft}s
        </div>
        <MainMenuButton />
        <iframe
          className="w-full h-full"
          src="https://qmeup.westlakemed.com.ph:9096/kiosk/spQ5EvTbHXNgi74wv/Y43tBt8u9tfjfmNuW/services"
          title="QMEUP"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </PageTemplate>
  );
};

export default QmeupPage;
