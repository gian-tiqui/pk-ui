import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";

const ITSidebarSection = () => {
  return (
    <section className="flex-1 px-5 pt-2 flow-hidden w-80">
      <div className="flex flex-col gap-2">
        <Button
          severity="contrast"
          className="w-full h-12 text-sm border-none bg-inherit hover:bg-gray-800"
          icon={`pi pi-gauge me-2 text-xl`}
        >
          Dashboard
        </Button>
        <Button
          severity="contrast"
          className="w-full h-12 text-sm border-none bg-inherit hover:bg-gray-800"
          icon={`${PrimeIcons.USERS} me-2 text-xl`}
        >
          Users
        </Button>
        <Button
          severity="contrast"
          className="w-full h-12 text-sm border-none bg-inherit hover:bg-gray-800"
          icon={`${PrimeIcons.BUILDING} me-2 text-xl`}
        >
          Floors
        </Button>
        <Button
          severity="contrast"
          className="w-full h-12 text-sm border-none bg-inherit hover:bg-gray-800"
          icon={`${PrimeIcons.HOME} me-2 text-xl`}
        >
          Rooms
        </Button>
      </div>
    </section>
  );
};

export default ITSidebarSection;
