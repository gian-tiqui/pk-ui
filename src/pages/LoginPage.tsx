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
import { Toast } from "primereact/toast";
import handleLoginError from "../@utils/functions/handleErrors";
import Cookies from "js-cookie";
import useLoggedInStore from "../@utils/store/loggedIn";
import isAuthenticated from "../@utils/functions/isAuthenticated";
import { jwtDecode } from "jwt-decode";
import useUserDataStore from "../@utils/store/userDataStore";
import extractUserData from "../@utils/functions/extractUserData";
import axios from "axios";
import navigateUserByDeptId from "../@utils/functions/userNavigator";
import CustomToast from "../components/CustomToast";

interface FormFields {
  employeeId: string;
  password: string;
}

const LoginPage = () => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const { setIsLoggedIn } = useLoggedInStore();
  const { user, setUser } = useUserDataStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    if (isAuthenticated()) navigateUserByDeptId(user, navigate);
  }, [navigate, user]);

  const handleLogin = async ({ employeeId, password }: FormFields) => {
    try {
      const response = await axios.post(`${URI.API_URI}/api/v1/auth/login`, {
        employeeId,
        password,
      });

      if (response.status === 201) {
        const { accessToken, refreshToken } = response.data.tokens;

        if (accessToken && refreshToken) {
          // Store access token in localStorage
          localStorage.setItem(Namespace.BASE, accessToken);

          // Debug the refresh token
          console.log("Refresh token received:", refreshToken);

          try {
            const decoded = jwtDecode(refreshToken);
            console.log("Decoded refresh token:", decoded);
            console.log("Token exp:", decoded.exp);
            console.log("Current time:", Math.floor(Date.now() / 1000));

            if (decoded.exp) {
              const currentTimestamp = Math.floor(Date.now() / 1000);
              const timeUntilExpiration = decoded.exp - currentTimestamp;

              console.log(
                "Time until expiration:",
                timeUntilExpiration,
                "seconds"
              );
              console.log(
                "Time until expiration:",
                Math.floor(timeUntilExpiration / 60),
                "minutes"
              );
              console.log(
                "Time until expiration:",
                Math.floor(timeUntilExpiration / (60 * 60)),
                "hours"
              );
              console.log(
                "Time until expiration:",
                Math.floor(timeUntilExpiration / (60 * 60 * 24)),
                "days"
              );

              if (timeUntilExpiration > 0) {
                // Convert to days, minimum 1 day
                const expiresInDays = Math.max(
                  1,
                  Math.floor(timeUntilExpiration / (60 * 60 * 24))
                );
                Cookies.set(Namespace.BASE, refreshToken, {
                  expires: expiresInDays,
                });
                console.log(
                  `Cookie set with expiration: ${expiresInDays} days`
                );
              } else {
                console.error(
                  "Token is already expired by",
                  Math.abs(timeUntilExpiration),
                  "seconds"
                );
                // Still set cookie but with default expiration
                Cookies.set(Namespace.BASE, refreshToken, { expires: 7 });
                console.log("Cookie set with default 7 days expiration");
              }
            } else {
              console.warn("No exp claim found in refresh token");
              Cookies.set(Namespace.BASE, refreshToken, { expires: 7 });
              console.log(
                "Cookie set with default 7 days expiration (no exp claim)"
              );
            }
          } catch (jwtError) {
            console.error("Error decoding JWT:", jwtError);
            // Still set the cookie even if JWT decoding fails
            Cookies.set(Namespace.BASE, refreshToken, { expires: 7 });
            console.log(
              "Cookie set with default 7 days expiration (JWT decode error)"
            );
          }

          // Extract user data
          const userData = extractUserData();

          if (!userData) {
            toastRef.current?.show({
              severity: "error",
              summary: "There was a problem extracting user data",
            });
            return;
          }

          // Update application state
          setUser(userData);
          setIsLoggedIn(true);

          // Show success toast
          toastRef.current?.show({
            severity: "info",
            summary: "Login Successful",
          });

          // Navigate user to appropriate page
          navigateUserByDeptId(userData, navigate);
        } else {
          console.error("Missing accessToken or refreshToken in response");
          toastRef.current?.show({
            severity: "error",
            summary: "Login Error",
            detail: "Invalid response from server",
          });
        }
      } else {
        console.error("Unexpected response status:", response.status);
        toastRef.current?.show({
          severity: "error",
          summary: "Login Error",
          detail: "Unexpected response from server",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error types
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: {
            data: { message: string; error: string };
            status: number;
          };
          status: number;
        };

        const status = axiosError.response?.status || axiosError.status;
        const message =
          axiosError.response?.data?.message || "An error occurred";

        if (status === 429) {
          toastRef.current?.show({
            severity: "error",
            summary: "Please wait",
            detail: message,
          });
          return;
        }

        handleLoginError(error, toastRef);
      } else {
        // Handle non-axios errors
        toastRef.current?.show({
          severity: "error",
          summary: "Login Error",
          detail: "An unexpected error occurred",
        });
      }
    }
  };

  useEffect(() => {
    if (isActive === false) navigate("/");
  }, [isActive, navigate]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      setIsActive(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsActive(false), 5000);
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
      <CustomToast ref={toastRef} />
      <main className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="w-full max-w-md">
          {/* Logo/Header Section */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600">
              <i className={`${PrimeIcons.SIGN_IN} text-3xl text-white`} />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="p-8 transition-all duration-300 transform border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20 hover:shadow-2xl"
          >
            <div className="space-y-6">
              {/* Employee ID Field */}
              <div className="space-y-2">
                <label
                  htmlFor="employeeIdInput"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Employee ID
                </label>
                <div className="relative">
                  <IconField iconPosition="left">
                    <InputIcon
                      className={`${PrimeIcons.ID_CARD} text-blue-500`}
                    ></InputIcon>
                    <InputText
                      {...register("employeeId", { required: true })}
                      id="employeeIdInput"
                      placeholder="0000XXXX"
                      className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 bg-white/80 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300"
                    />
                  </IconField>
                </div>
                {errors.employeeId && (
                  <div className="flex items-center gap-2 p-3 mt-2 border border-red-200 bg-red-50 rounded-xl">
                    <i
                      className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-red-500`}
                    ></i>
                    <p className="text-sm font-medium text-red-600">
                      Employee ID is required
                    </p>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="passwordInput"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <IconField iconPosition="left">
                    <InputIcon className="text-blue-500 pi pi-lock"></InputIcon>
                    <InputText
                      {...register("password", { required: true })}
                      id="passwordInput"
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 pl-12 text-gray-800 transition-all duration-300 border-2 border-gray-200 bg-white/80 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 hover:border-blue-300"
                      type="password"
                    />
                  </IconField>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 p-3 mt-2 border border-red-200 bg-red-50 rounded-xl">
                    <i
                      className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-red-500`}
                    ></i>
                    <p className="text-sm font-medium text-red-600">
                      Password is required
                    </p>
                  </div>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to={"/forgot-password"}
                  className="text-sm font-medium text-blue-600 transition-all duration-300 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full py-4 font-bold text-white transition-all duration-300 transform border-none shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl hover:from-blue-600 hover:to-indigo-700 hover:scale-105 focus:ring-4 focus:ring-blue-500/30"
                type="submit"
              >
                <i className={`${PrimeIcons.SIGN_IN} mr-2`}></i>
                Sign In
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Secure login • Protected by enterprise security
            </p>
          </div>
        </div>
      </main>
    </PageTemplate>
  );
};

export default LoginPage;
