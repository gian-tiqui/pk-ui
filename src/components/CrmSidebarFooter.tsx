import { PrimeIcons } from "primereact/api";
import { Namespace, URI } from "../@utils/enums/enum";
import Cookies from "js-cookie";
import useUserDataStore from "../@utils/store/userDataStore";
import apiClient from "../@utils/http-common/apiClient";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";
import useLoggedInStore from "../@utils/store/loggedIn";
import { useEffect, useRef, useState } from "react";
import SettingsDialog from "./UserSettingsDialog";
import { getUserSecret } from "../@utils/services/userService";
import { Toast } from "primereact/toast";
import handleErrors from "../@utils/functions/handleErrors";
import { Dialog } from "primereact/dialog";
import useHasSecretStore from "../@utils/store/userHasSecret";
import CustomToast from "./CustomToast";
import { Settings, LogOut, Shield, AlertTriangle } from "lucide-react";

const CrmSidebarFooter = () => {
  const navigate = useNavigate();
  const [settingsDialogVisible, setSettingsDialogVisible] =
    useState<boolean>(false);
  const [noSecretDialogVisible, setNoSecretDialogVisible] =
    useState<boolean>(false);
  const { user, remove } = useUserDataStore();
  const { setIsLoggedIn } = useLoggedInStore();
  const { hasSecret, setHasSecret } = useHasSecretStore();
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    if (user) {
      getUserSecret(user?.sub)
        .then((res) => {
          if (res.data.secret === "none") {
            setNoSecretDialogVisible(true);
            setHasSecret(false);
          }
        })
        .catch((err) => handleErrors(err, toastRef));
    }
  }, [user, setHasSecret]);

  const accept = async () => {
    try {
      const refreshToken = Cookies.get(Namespace.BASE);
      const accessToken = localStorage.getItem(Namespace.BASE);

      if (refreshToken === undefined || accessToken === undefined) {
        console.error("Tokens not found.");
        return;
      }

      if (!user) {
        console.error("There was a problem in your user data.");
        return;
      }

      const response = await apiClient.patch(
        `${URI.API_URI}/api/v1/auth/logout?userId=${user.sub}`
      );

      if (response.status === 200) {
        setIsLoggedIn(false);
        remove();
        Cookies.remove(Namespace.BASE);
        localStorage.removeItem(Namespace.BASE);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogoutClicked = () => {
    confirmDialog({
      message: "Do you logout from the app?",
      header: "Logout",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  return (
    <>
      <CustomToast ref={toastRef} />

      {/* Recovery Method Dialog */}
      <Dialog
        pt={{
          header: {
            className:
              "bg-white/10 backdrop-blur-sm text-gray-800 border-t border-x border-white/20 rounded-t-2xl",
          },
          content: {
            className:
              "bg-white/10 backdrop-blur-sm text-gray-800 border-x border-b border-white/20 rounded-b-2xl",
          },
        }}
        visible={noSecretDialogVisible}
        onHide={() => {
          if (hasSecret === false) {
            toastRef.current?.show({
              severity: "error",
              summary: "No secret",
              detail: "Please set your secrets first",
            });
            return;
          }
          if (noSecretDialogVisible === true) setNoSecretDialogVisible(false);
        }}
        className="w-96"
        header={
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            <span>Recovery Method Not Set</span>
          </div>
        }
      >
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Looks like you have not set your secret question and answer for
              your account recovery.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setNoSecretDialogVisible(false);
                setSettingsDialogVisible(true);
              }}
              className="px-4 py-2 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl hover:from-blue-600 hover:to-indigo-700"
            >
              Set secrets
            </button>
          </div>
        </div>
      </Dialog>

      {/* Footer Buttons */}
      <div className="space-y-2">
        <ConfirmDialog
          pt={{
            header: {
              className:
                "bg-white/10 backdrop-blur-sm text-gray-800 border-t border-x border-white/20 rounded-t-2xl",
            },
            content: {
              className:
                "bg-white/10 backdrop-blur-sm text-gray-800 border-x border-white/20",
            },
            footer: {
              className:
                "bg-white/10 backdrop-blur-sm border-x border-b border-white/20 rounded-b-2xl",
            },
          }}
        />

        <SettingsDialog
          visible={settingsDialogVisible}
          setVisible={setSettingsDialogVisible}
        />

        <button
          onClick={() => setSettingsDialogVisible(true)}
          className="flex items-center w-full gap-3 px-4 py-3 text-gray-700 transition-all duration-300 hover:bg-white/20 rounded-xl hover:shadow-md"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Account Settings</span>
        </button>

        <button
          onClick={handleLogoutClicked}
          className="flex items-center w-full gap-3 px-4 py-3 text-red-600 transition-all duration-300 hover:bg-red-50/50 rounded-xl hover:shadow-md"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );
};

export default CrmSidebarFooter;
