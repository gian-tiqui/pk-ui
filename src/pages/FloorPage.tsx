import PageTemplate from "../templates/PageTemplate";

import FloorPageHeader from "../components/FloorPageHeader";
import FloorPageContent from "../components/FloorPageContent";

const FloorPage = () => {
  return (
    <PageTemplate>
      <div className="h-full px-10 pt-16">
        <FloorPageHeader />
        <FloorPageContent />
      </div>
    </PageTemplate>
  );
};

export default FloorPage;
