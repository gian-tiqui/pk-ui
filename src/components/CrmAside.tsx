import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ScrollPanel } from "primereact/scrollpanel";
import CrmAsideButtonToggler from "./CrmAsideButtonToggler";
import { useState } from "react";
import AddFloorDialog from "./AddFloorDialog";
import Cookies from "js-cookie";
import { Namespace } from "../@utils/enums/enum";
import useUserDataStore from "../@utils/store/userDataStore";

const CrmAside = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const { user } = useUserDataStore();

  const handleLogoutClicked = async () => {
    try {
      const refreshToken = Cookies.get(Namespace.BASE);
      const accessToken = localStorage.getItem(Namespace.BASE);

      if (refreshToken === undefined || accessToken === undefined) {
        console.error("Tokens not found.");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAvatarLabel = () => {
    if (!user) {
      console.error("Info could not be extracted");
      return;
    }

    return (
      user?.firstName.charAt(0).toUpperCase() +
      user?.lastName.charAt(0).toLowerCase()
    );
  };

  return (
    <aside className="relative flex flex-col h-screen py-5 border-r rounded-e-3xl border-slate-700 w-80 bg-slate-900">
      <AddFloorDialog visible={visible} onHide={() => setVisible(false)} />
      <header className="flex justify-between mx-5 mb-4 cursor-default">
        <div className="flex gap-2">
          <Avatar
            label={getAvatarLabel()}
            className="w-12 h-12 font-extrabold bg-blue-500"
          />
          <div>
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm">{user?.deptName}</p>
          </div>
        </div>
        <CrmAsideButtonToggler />
      </header>
      <section className="flex-1 overflow-hidden">
        <IconField iconPosition="left" className="mx-5 mt-2 mb-5">
          <InputIcon className="pi pi-search"> </InputIcon>
          <InputText
            placeholder="Search"
            className="h-10 border-slate-700 bg-inherit "
          />
        </IconField>
        <div className="flex items-center justify-between h-10 mx-5">
          <small className="text-sm">Floors</small>
          <div
            onClick={() => setVisible(true)}
            className="flex items-center gap-2 hover:cursor-pointer hover:border-b"
          >
            <i className={`${PrimeIcons.PLUS} text-xs`}></i>
            <p className="text-sm">Add Floor</p>
          </div>
        </div>
        <ScrollPanel
          className="pb-36 ms-5 me-1"
          style={{ height: "calc(100vh - 200px)" }}
        >
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <Button
                key={index}
                className="flex w-full h-12 gap-2 mb-2 text-sm"
                severity="contrast"
              >
                <Avatar label="1F" className="font-bold bg-blue-500 w-7 h-7" />
                <p className="text-sm font-medium">First Floor</p>
              </Button>
            ))}
        </ScrollPanel>
      </section>
      <hr className="mx-5 mb-3 border-b border-slate-700" />
      <footer className="flex flex-col gap-2 mx-5">
        <Button
          className="w-full h-12 text-sm "
          severity="contrast"
          icon={`${PrimeIcons.COG} text-sm me-2`}
        >
          Settings
        </Button>
        <Button
          onClick={handleLogoutClicked}
          className="w-full h-12 text-sm"
          severity="contrast"
          icon={`${PrimeIcons.SIGN_OUT} text-sm me-2`}
        >
          Logout
        </Button>
      </footer>
    </aside>
  );
};

export default CrmAside;
