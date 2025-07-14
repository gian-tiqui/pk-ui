import { Image } from "primereact/image";
import { useParams } from "react-router-dom";
import { FloorParam } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getFloorById } from "../@utils/services/floorService";
import { ImageLocation, URI } from "../@utils/enums/enum";
import { ReactNode, useEffect, useRef, useState } from "react";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import apiClient from "../@utils/http-common/apiClient";
import { Toast } from "primereact/toast";
import CustomToast from "./CustomToast";
import handleErrors from "../@utils/functions/handleErrors";
import getImageFromServer from "../@utils/functions/getFloorMapImageLocation";
import { PrimeIcons } from "primereact/api";
import { confirmDialog } from "primereact/confirmdialog";
import useCrmSidebarSignalStore from "../@utils/store/crmSidebarSectionSignal";

const FloorMapTab = () => {
  const param = useParams() as FloorParam;
  const fileUploadRef = useRef<FileUpload>(null);
  const toastRef = useRef<Toast>(null);
  const [imageLocation, setImageLocation] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { setRefresh } = useCrmSidebarSignalStore();

  const { data: floor, refetch } = useQuery({
    queryKey: [`floor-${param.floorId}`],
    queryFn: () => getFloorById(+param.floorId),
  });

  const confirmUpload = (formData: FormData) => {
    setIsUploading(true);
    apiClient
      .post(`${URI.API_URI}/api/v1/floor/${floor?.id}/upload`, formData)
      .then((response) => {
        if (response.status === 201) {
          toastRef.current?.show({
            severity: "info",
            summary: "Success",
            detail: "File uploaded successfully",
          });
          fileUploadRef.current?.clear();
          setRefresh(true);
          refetch();
        }
      })
      .catch((error) => handleErrors(error, toastRef))
      .finally(() => setIsUploading(false));
  };

  const handleUpload = (event: FileUploadHandlerEvent) => {
    const formData = new FormData();
    const map = event.files[0];
    formData.append("file", map);

    const pElement: ReactNode = floor?.imageLocation ? (
      <div className="space-y-3">
        <p className="leading-relaxed text-slate-700">
          This is an{" "}
          <span className="font-semibold text-red-600">explosive action</span>,
          updating the floor map will{" "}
          <span className="font-semibold text-red-600">
            remove the directions
          </span>{" "}
          in the rooms of this floor.
        </p>
        <p className="text-sm text-slate-600">Do you want to continue?</p>
      </div>
    ) : (
      <p className="text-slate-700">Set this floor map?</p>
    );

    confirmDialog({
      message: pElement,
      header: "Update the floor map?",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept: () => confirmUpload(formData),
    });
  };

  useEffect(() => {
    if (floor && floor.imageLocation) {
      const uriPath = getImageFromServer(
        ImageLocation.FLOOR,
        floor.imageLocation
      );
      setImageLocation(uriPath);
    }
  }, [floor, imageLocation]);

  if (!floor)
    return <div className="animate-pulse bg-slate-100 h-96 rounded-xl"></div>;

  if (!floor?.imageLocation) {
    return (
      <div className="relative overflow-hidden">
        <CustomToast ref={toastRef} />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-slate-50 to-slate-100"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(148,163,184,0.1),transparent_50%)]"></div>

        <div className="relative flex items-center justify-center px-8 h-96">
          <div className="max-w-md space-y-6 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 mb-2 rounded-full bg-slate-100">
              <svg
                className="w-8 h-8 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-slate-800">
                No floor map uploaded yet
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                Upload a floor map image to visualize and manage room layouts
              </p>
            </div>

            {/* Upload Button */}
            <div className="pt-2">
              <FileUpload
                ref={fileUploadRef}
                mode="basic"
                accept="image/*"
                customUpload
                uploadHandler={handleUpload}
                disabled={isUploading}
                className="custom-file-upload"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border shadow-sm h-96 rounded-xl border-slate-200">
      <CustomToast ref={toastRef} />

      <div className="grid h-full grid-cols-1 lg:grid-cols-2">
        {/* Image Section */}
        <div className="relative border-b bg-slate-50 lg:border-b-0 lg:border-r border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 opacity-30"></div>
          <div className="relative flex items-center justify-center h-full p-6">
            <div className="flex items-center justify-center w-full h-full max-w-md max-h-64">
              <Image
                src={imageLocation}
                alt="Floor map"
                preview
                className="object-contain w-full h-full rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Overlay Info */}
          <div className="absolute px-3 py-1 rounded-full top-4 left-4 bg-white/90 backdrop-blur-sm">
            <span className="text-xs font-medium text-slate-600">
              Floor Map
            </span>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
          <div className="max-w-sm space-y-4 text-center">
            {/* File Info */}
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100">
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm font-medium tracking-wider uppercase text-slate-500">
                  Current File
                </p>
                <p className="mt-1 text-lg font-semibold truncate text-slate-800">
                  {imageLocation.split("-")[3] || "floor-map.jpg"}
                </p>
              </div>
            </div>

            {/* Upload Button */}
            <div className="pt-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Upload a new floor map</p>
                <FileUpload
                  ref={fileUploadRef}
                  mode="basic"
                  accept="image/*"
                  customUpload
                  uploadHandler={handleUpload}
                  disabled={isUploading}
                  className="custom-file-upload-secondary"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorMapTab;
