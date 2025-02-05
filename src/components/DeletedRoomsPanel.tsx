import FloorRoomsTable from "./FloorRoomsTable";

const DeletedRoomsPanel = () => {
  return (
    <div className="text-slate-100">
      <FloorRoomsTable isDeleted={true} />
    </div>
  );
};

export default DeletedRoomsPanel;
