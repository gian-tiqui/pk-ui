import PageTemplate from "../templates/PageTemplate";
import FloorPageHeader from "../components/FloorPageHeader";
import FloorPageContent from "../components/FloorPageContent";

const FloorPage = () => {
  return (
    <PageTemplate>
      <main className="flex flex-col h-screen p-6 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <FloorPageHeader />
        <FloorPageContent />
      </main>
    </PageTemplate>
  );
};

export default FloorPage;
