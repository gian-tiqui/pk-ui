import { PrimeIcons } from "primereact/api";
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  search: { search: string; path: string };
  index: number;
}

const SearchResult: React.FC<Props> = ({ search, index }) => {
  return (
    <Link
      to={"/find-amenity"}
      className={`flex items-center w-full justify-between px-4 py-2 font-medium hover:bg-blue-400 hover:text-slate-900 text-slate-100 border rounded hover:cursor-pointer  border-slate-700 ${
        index == 0 ? "bg-blue-400 text-slate-900" : "bg-inherit"
      }`}
    >
      <div className="flex items-center gap-2">
        <i className={`${PrimeIcons.HISTORY}`}></i>
        <p>{search.search}</p>
      </div>
    </Link>
  );
};

export default SearchResult;
