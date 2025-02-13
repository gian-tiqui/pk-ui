import { Floor } from "../types/types";
import FloorNavItem from "./FloorNavItem";

interface Props {
  floors: Floor[] | undefined;
}

const FloorNav: React.FC<Props> = ({ floors }) => {
  return (
    <nav className="flex items-center h-20 px-10 mb-4 rounded-full w-96 bg-slate-900">
      {floors && floors.length < 1 && (
        <p className="text-slate-100">No available floors yet</p>
      )}

      {floors &&
        floors.length > 0 &&
        floors.map((floor) => <FloorNavItem floor={floor} key={floor.id} />)}
    </nav>
  );
};

export default FloorNav;
