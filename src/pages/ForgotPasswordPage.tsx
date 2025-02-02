import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Link } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useRef } from "react";

const ForgotPasswordPage = () => {
  const toastRef = useRef<Toast>(null);

  return (
    <PageTemplate>
      <Toast
        ref={toastRef}
        pt={{ content: { className: "h-full backdrop-blur" } }}
      />
      <main className="grid h-full place-content-center">
        <form className="flex flex-col items-center gap-3 border rounded shadow-md p-9 border-slate-600 bg-slate-900/40 w-96 shadow-blue-500/30">
          <div className="grid border-2 shadow-xl w-14 h-14 border-slate-600 place-content-center rounded-2xl">
            <i
              className={`${PrimeIcons.QUESTION_CIRCLE} text-2xl text-slate-100`}
            />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Forgot Password</h3>

          <h4 className="text-center text-slate-400">
            Enter the required fields here to retrieve your account
          </h4>
          <div className="flex flex-col w-full gap-1">
            <div className="h-24">
              <label
                htmlFor="employeeIdInput"
                className="text-sm font-semibold text-blue-400"
              >
                Employee ID
              </label>
              <IconField id="employeeIdInput" iconPosition="left">
                <InputIcon className={`${PrimeIcons.ID_CARD}`}></InputIcon>
                <InputText
                  id="employeeIdInput"
                  placeholder="0000XXXX"
                  className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
                />
              </IconField>
              {true && (
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
                htmlFor="secretAnswerInput"
                className="text-sm font-semibold text-blue-400"
              >
                Your answer
              </label>
              <IconField id="secretAnswerInput" iconPosition="left">
                <InputIcon
                  id="secretAnswerInput"
                  className="pi pi-lock"
                ></InputIcon>
                <InputText
                  placeholder="Your answer"
                  className="w-full text-slate-100 bg-inherit border-slate-600 hover:border-blue-400"
                />
              </IconField>
              {true && (
                <small className="flex items-center gap-1 mt-1">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                  ></i>
                  <p className="font-medium text-red-400">Answer is required</p>
                </small>
              )}
            </div>
          </div>
          <Link
            to={"/login"}
            className="w-full text-sm text-blue-400 hover:text-blue-600 hover:underline"
          >
            <p className="text-end">Go back?</p>
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

export default ForgotPasswordPage;
