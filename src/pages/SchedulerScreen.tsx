import PageTemplate from "../templates/PageTemplate";
import MainMenuButton from "../components/MainMenuButton";

const SchedulerPage = () => {
  return (
    <PageTemplate>
      <div className="relative w-full h-screen">
        <MainMenuButton />

        <iframe
          className="w-full h-full"
          src="https://opd.westlakemed.com.ph:1980/#makeAppointment"
          title="QMEUP"
        ></iframe>
      </div>
    </PageTemplate>
  );
};

export default SchedulerPage;
