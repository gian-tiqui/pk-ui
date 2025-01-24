import { Card } from "primereact/card";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import PageTemplate from "../templates/PageTemplate";
import { useState } from "react";
import SearchDialog from "../components/SearchDialog";
import { Link } from "react-router-dom";

/*
 *@TODO:
 * Add a listener for the new tab so if it is idle, it will close after 5 seconds.
 */

const MainPage = () => {
  const [visible, setVisible] = useState<boolean>(false);

  // const openAndCloseTab = () => {
  //   const newTab = window.open(
  //     "https://qmeup.westlakemed.com.ph:9096/signin",
  //     "_blank"
  //   );

  //   if (newTab) {
  //     setTimeout(() => {
  //       newTab.close();
  //       window.history.back();
  //     }, 5000);
  //   }
  // };

  return (
    <PageTemplate>
      <SearchDialog visible={visible} setVisible={setVisible} />
      <div className="flex flex-col items-center w-full h-full pt-5">
        <div className="w-[57%] h-10 ps-4 mb-14">
          <IconField iconPosition="left" className="w-full">
            <InputIcon className="pi pi-search text-slate-100"> </InputIcon>
            <InputText
              onClick={() => setVisible(true)}
              placeholder="Search"
              className="w-full bg-slate-700 text-slate-100 placeholder-slate-300"
            />
          </IconField>
        </div>
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
