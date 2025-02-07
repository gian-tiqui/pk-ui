import { Image } from "primereact/image";
import { useParams } from "react-router-dom";
import { FloorParam } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getFloorById } from "../@utils/services/floorService";
import { ImageLocation, URI } from "../@utils/enums/enum";
import { useEffect, useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import apiClient from "../@utils/http-common/apiClient";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import handleErrors from "../@utils/functions/handleErrors";
import getImageFromServer from "../@utils/functions/getFloorMapImageLocation";

const FloorMapTab = () => {
  const param = useParams() as FloorParam;
  const fileUploadRef = useRef<FileUpload>(null);
  const toastRef = useRef<Toast>(null);
  const [imageLocation, setImageLocation] = useState<string>("");

  const { data: floor, refetch } = useQuery({
    queryKey: [`floor-${param.floorId}`],
    queryFn: () => getFloorById(+param.floorId),
  });

  useEffect(() => {
    if (floor && floor.imageLocation) {
      const uriPath = getImageFromServer(
        ImageLocation.FLOOR,
        floor.imageLocation
      );

      setImageLocation(uriPath);
    }
  }, [floor, imageLocation]);

  if (!floor) return <p></p>;

  if (!floor?.imageLocation) {
    return (
      <div className="grid text-center text-slate-100 h-96 place-content-center">
        <div>
          <h4 className="mb-4 text-lg font-medium">
            No map image has been set yet.
          </h4>
          <FileUpload
            ref={fileUploadRef}
            mode="basic"
            accept="image/*"
            customUpload
            uploadHandler={(event) => {
              const formData = new FormData();

              const map = event.files[0];

              formData.append("file", map);

              apiClient
                .post(
                  `${URI.API_URI}/api/v1/floor/${floor?.id}/upload`,
                  formData
                )
                .then((response) => {
                  if (response.status === 201) {
                    toastRef.current?.show({
                      severity: "info",
                      summary: "Success",
                      detail: "File uploaded successfully",
                    });
                    fileUploadRef.current?.clear();

                    refetch();
                  }
                })
                .catch((error) => handleErrors(error, toastRef));
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-2 h-96">
      <CustomToast ref={toastRef} />
      <div>
        <Image src={imageLocation} alt="Image" preview />
      </div>
      <div className="text-slate-100">
        <p>File Name: {imageLocation.split("-")[3]}</p>
      </div>
    </div>
  );
};

export default FloorMapTab;
