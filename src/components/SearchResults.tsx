import SearchResult from "./SearchResult";

const SearchResults = () => {
  const searches: { search: string; path: string }[] = [
    { search: "Find Amenity", path: "find-amenity" },
  ];

  return (
    <div className="flex flex-col">
      {searches.length > 0 ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-slate-100">Recent</p>
          {searches.map((search, index: number) => (
            <SearchResult search={search} key={index} index={index} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-center text-slate-100">No recent searches</p>
      )}
    </div>
  );
};

export default SearchResults;
