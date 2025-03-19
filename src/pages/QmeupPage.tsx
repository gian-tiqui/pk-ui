import PageTemplate from "../templates/PageTemplate";

const QmeupPage = () => {
  return (
    <PageTemplate>
      <div className="w-full h-screen">
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
