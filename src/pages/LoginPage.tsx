import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Link, useNavigate } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Namespace, URI } from "../@utils/enums/enum";
import apiClient from "../@utils/http-common/apiClient";
import { Toast } from "primereact/toast";
import handleLoginError from "../@utils/functions/handleErrors";
import Cookies from "js-cookie";
import useLoggedInStore from "../@utils/store/loggedIn";
import isAuthenticated from "../@utils/functions/isAuthenticated";
import { jwtDecode } from "jwt-decode";
import useUserDataStore from "../@utils/store/userDataStore";
import extractUserData from "../@utils/functions/extractUserData";

interface FormFields {
  employeeId: string;
  password: string;
}

const LoginPage = () => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const { setIsLoggedIn } = useLoggedInStore();
  const { setUser } = useUserDataStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    if (isAuthenticated()) navigate("/amenity-management");
  }, [navigate]);

  const handleLogin = async ({ employeeId, password }: FormFields) => {
    try {
      const response = await apiClient.post(
        `${URI.API_URI}/api/v1/auth/login`,
        {
          employeeId,
          password,
        }
      );

      if (response.status === 201) {
        const { accessToken, refreshToken } = response.data.tokens;

        if (accessToken && refreshToken) {
          localStorage.setItem(Namespace.BASE, accessToken);

          const { exp } = jwtDecode(refreshToken);

          const currentTimestamp = Math.floor(Date.now() / 1000);

          if (!exp) return;

          const expires = Math.floor((exp - currentTimestamp) / (60 * 60 * 24));

          Cookies.set(Namespace.BASE, refreshToken, { expires });

          console.log(Cookies.get(Namespace.BASE));

          Cookies.set("meow", "meow");

          return;

          const userData = extractUserData();

          if (!userData) {
            toastRef.current?.show({
              severity: "error",
              summary: "There was a problem in ",
            });

            return;
          }

          setUser(userData);
          setIsLoggedIn(true);

          toastRef.current?.show({
            severity: "info",
            summary: "Login Successful",
          });

          navigate("/amenity-management");
        }
      }
    } catch (error) {
      const {
        status,
        response: {
          data: { message },
        },
      } = error as {
        response: { data: { message: string; error: string } };
        status: number;
      };

      if (status === 429) {
        toastRef.current?.show({
          severity: "error",
          summary: "Please wait",
          detail: message,
        });

        return;
      }

      handleLoginError(error, toastRef);
    }
  };

  useEffect(() => {
    if (isActive === false) navigate(-1);
  }, [isActive, navigate]);

  useEffect(() => {
    let timeout: number;

    const resetTimer = () => {
      setIsActive(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsActive(false), 5000000);
    };

    const activityEvents = ["mousemove", "click", "keydown"];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      clearTimeout(timeout);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  return (
    <PageTemplate>
      <Toast
        ref={toastRef}
        pt={{ content: { className: "h-full backdrop-blur" } }}
      />
      <main className="grid h-full place-content-center">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col items-center gap-3 border rounded shadow-md p-9 border-slate-600 bg-slate-900/40 w-96 shadow-blue-500/30"
        >
          <div className="grid border-2 shadow-xl w-14 h-14 border-slate-600 place-content-center rounded-2xl">
            <i className={`${PrimeIcons.SIGN_IN} text-2xl text-slate-100`} />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Welcome back</h3>

          <h4 className="text-center text-slate-400">
            Manage the room content and details by logging in
          </h4>
          <div className="flex flex-col w-full gap-1">
            <div className="h-24">
              <label
                htmlFor="emailInput"
                className="text-sm font-semibold text-blue-400"
              >
                Employee ID
              </label>
              <IconField id="emailInput" iconPosition="left">
                <InputIcon className={`${PrimeIcons.ID_CARD}`}></InputIcon>
                <InputText
                  {...register("employeeId", { required: true })}
                  id="emailInput"
                  placeholder="0000XXXX"
                  className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
                />
              </IconField>
              {errors.employeeId && (
                <small className="flex items-center gap-1 mt-1">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                  ></i>
                  <p className="font-medium text-red-400">
                    Employee id is required.
                  </p>
                </small>
              )}
            </div>

            <div className="h-24">
              <label
                htmlFor="passwordInput"
                className="text-sm font-semibold text-blue-400"
              >
                Password
              </label>
              <IconField id="passwordInput" iconPosition="left">
                <InputIcon
                  id="passwordInput"
                  className="pi pi-lock"
                ></InputIcon>
                <InputText
                  {...register("password", { required: true })}
                  placeholder="*********"
                  className="w-full text-slate-100 bg-inherit border-slate-600 hover:border-blue-400"
                  type="password"
                />
              </IconField>
              {errors.password && (
                <small className="flex items-center gap-1 mt-1">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                  ></i>
                  <p className="font-medium text-red-400">
                    Password is required
                  </p>
                </small>
              )}
            </div>
          </div>
          <Link
            to={"/forgot-password"}
            className="w-full text-sm text-blue-400 hover:text-blue-600 hover:underline"
          >
            <p className="text-end">Forgot password?</p>
          </Link>
          <Button
            className="flex justify-center w-full gap-3 font-bold"
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </main>
    </PageTemplate>
  );
};

export default LoginPage;
