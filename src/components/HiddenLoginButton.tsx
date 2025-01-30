import { PrimeIcons } from "primereact/api";
import { Link } from "react-router-dom";

const HiddenLoginButton = () => {
  return (
    <Link
      to={"/login"}
      className="absolute grid w-10 h-10 transition-opacity duration-300 rounded-full opacity-0 top-4 right-4 place-content-center bg-slate-400 hover:opacity-100"
    >
      <i className={`${PrimeIcons.USER} text-xl text-slate-800`}></i>
    </Link>
  );
};

export default HiddenLoginButton;
