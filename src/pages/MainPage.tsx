import { Card } from "primereact/card";
import PageTemplate from "../templates/PageTemplate";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <PageTemplate>
      <div className="flex flex-col items-center w-full h-full pt-20">
        <div className="w-[57%]">
          <h4 className="mb-6 text-4xl font-medium text-blue-400 ms-4">
            What would you like to do?
          </h4>

          <div className="flex flex-wrap gap-2 p-4 overflow-auto h-96">
            <Link to={"/find-amenity"}>
              <Card className="border w-44 h-44 bg-slate-900/40 border-slate-700 backdrop-blur-sm hover:shadow hover:shadow-blue-400">
                <p className="text-lg font-medium text-slate-100">
                  Find a destination
                </p>
              </Card>
            </Link>
            <Link to={"/qmeup"}>
              <Card className="border w-44 h-44 bg-slate-900/40 border-slate-700 backdrop-blur-sm hover:shadow hover:shadow-blue-400">
                <p className="text-lg font-medium text-slate-100">Open QMEUP</p>
              </Card>
            </Link>
            {/* <Card
              className="border cursor-pointer w-44 h-44 bg-slate-900/40 border-slate-700 backdrop-blur-sm hover:shadow hover:shadow-blue-400"
              onClick={openAndCloseTab}
            >
              <p className="text-lg font-medium text-slate-100">Open QMEUP</p>
            </Card> */}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default MainPage;
