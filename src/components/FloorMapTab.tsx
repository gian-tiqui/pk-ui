import { Image } from "primereact/image";
import { useParams } from "react-router-dom";
import { FloorParam } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getFloorById } from "../@utils/services/floorService";
import { ImageLocation } from "../@utils/enums/enum";
import { useEffect, useState } from "react";
import { FileUpload } from "primereact/fileupload";

const FloorMapTab = () => {
  const param = useParams() as FloorParam;
  const [imageLocation, setImageLocation] = useState<string>("");

  const { data: floor } = useQuery({
    queryKey: [`floor-${param.floorId}`],
    queryFn: () => getFloorById(+param.floorId),
  });

  useEffect(() => {
    if (floor && floor.imageLocation) {
      setImageLocation(
        `${ImageLocation.BASE}/${ImageLocation.UPLOADS}/${ImageLocation.FLOOR}/${floor?.imageLocation}`
      );
    }
  }, [floor, imageLocation]);

  if (!floor?.imageLocation) {
    return (
      <div className="text-slate-100">
        <p>No map yet.</p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-2 h-96">
      <div>
        <Image src={imageLocation} alt="Image" preview />
      </div>
      <div className="text-slate-100">
        <p>File Name: {imageLocation.split("-")[3]}</p>
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={10000}
          customUpload
          onSelect={(event) => console.log(event.files)}
        />
      </div>
    </div>
  );
};

export default FloorMapTab;
