import { useEffect, useState } from "react";
import PageTemplate from "../templates/PageTemplate";
import { Floor, Query, RoomImage } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getFloors } from "../@utils/services/floorService";
import filterCompleteCloor from "../@utils/functions/filterCompleteFloors";
import { Stage, Layer, Arrow, Image as KonvaImage, Text } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import useSelectedFloorStore from "../@utils/store/selectedFloor";
import getImageFromServer from "../@utils/functions/getFloorMapImageLocation";
import { ImageLocation, StartingPoint } from "../@utils/enums/enum";
import useSelectedRoom from "../@utils/store/selectedRoom";
import { ArrowDimension, ArrowType } from "../types/types";
import {
  getRoomDirectionPatternsById,
  getRoomPhotos,
} from "../@utils/services/roomService";
import useStartingPointStore from "../@utils/store/startingPoint";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { TabPanel, TabView } from "primereact/tabview";
import { Image } from "primereact/image";
import { Toast } from "primereact/toast";
import handleErrors from "../@utils/functions/handleErrors";
import {
  MapPin,
  Navigation,
  Building2,
  Info,
  Images,
  FileText,
  Expand,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Move,
  LogOut,
} from "lucide-react";
import { useRef } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ARROW_DIMENSION: ArrowDimension = {
  pointerLength: 19,
  pointerWidth: 15,
  strokeWidth: 10,
  stroke: "#3b82f6",
  fill: "#3b82f6",
};

const FindAmenityPage = () => {
  const [query] = useState<Query>({ search: "" });
  const [completeFloors, setCompleteFloors] = useState<Floor[]>();
  const [isNavCollapsed, setIsNavCollapsed] = useState<boolean>(false);
  const [isInfoDialogVisible, setIsInfoDialogVisible] =
    useState<boolean>(false);
  const [imageObjs, setImageObjs] = useState<RoomImage[]>([]);
  const navigate = useNavigate();

  // Floor map states
  const stageRef = useRef<StageType | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [delayedArrows, setDelayedArrows] = useState<ArrowType[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const toastRef = useRef<Toast>(null);

  // Store hooks
  const { selectedFloor, setSelectedFloor } = useSelectedFloorStore();
  const { selectedRoom, setSelectedRoom } = useSelectedRoom();
  const { startingPoint, setStartingPoint } = useStartingPointStore();

  // Queries
  const { data } = useQuery({
    queryKey: [`floors-${JSON.stringify(query)}`],
    queryFn: () => getFloors(query),
  });

  const { data: roomDirectionsData } = useQuery({
    queryKey: [`room-${selectedRoom?.id}-direction-patterns-${startingPoint}`],
    queryFn: () =>
      getRoomDirectionPatternsById(selectedRoom?.id, { startingPoint }),
    enabled: !!startingPoint && !!selectedRoom,
  });

  useEffect(() => {
    if (data) setCompleteFloors(filterCompleteCloor(data?.floors));
  }, [data]);

  // Load floor map image
  useEffect(() => {
    if (selectedFloor?.imageLocation) {
      const imgSrc = getImageFromServer(
        ImageLocation.FLOOR,
        selectedFloor.imageLocation
      );
      const img = new window.Image();
      img.src = imgSrc;
      img.onload = () => {
        setBgImage(img);
        setStageSize({ width: img.width, height: img.height });
      };
    }
  }, [selectedFloor]);

  // Handle arrow animations
  useEffect(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
    setDelayedArrows([]);

    if (
      roomDirectionsData?.data?.directionPatterns?.length > 0 &&
      roomDirectionsData?.data.directionPatterns[0]?.directionPattern?.arrows
    ) {
      const newTimeouts: number[] = [];

      roomDirectionsData.data.directionPatterns[0].directionPattern.arrows.forEach(
        (arrow: { points: number[] }, index: number) => {
          const timeoutId = window.setTimeout(() => {
            setDelayedArrows((prevArrows) => [...prevArrows, arrow]);
          }, index * 150);
          newTimeouts.push(timeoutId);
        }
      );

      timeoutsRef.current = newTimeouts;
    }

    return () => {
      timeoutsRef.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId)
      );
    };
  }, [roomDirectionsData]);

  // Load room photos
  useEffect(() => {
    const fetchPhotos = () => {
      if (!selectedRoom?.id) return;

      getRoomPhotos(selectedRoom.id, { limit: 10, offset: 0, isDeleted: false })
        .then((response) => {
          setImageObjs(response.data.images);
        })
        .catch((error) => handleErrors(error, toastRef));
    };

    fetchPhotos();
  }, [selectedRoom]);

  const getArrowMidpoint = (points: number[]) => {
    const midX = (points[0] + points[2]) / 2;
    const midY = (points[1] + points[3]) / 2;
    return { midX, midY };
  };

  const resetSelection = () => {
    setSelectedFloor(undefined);
    setSelectedRoom(undefined);
    setDelayedArrows([]);
  };

  const startingPointOptions = [
    {
      label: "Front Elevator",
      value: StartingPoint.FRONT_ELEVATOR,
      icon: ArrowUp,
    },
    {
      label: "Back Elevator",
      value: StartingPoint.BACK_ELEVATOR,
      icon: ArrowDown,
    },
    { label: "Front Stairs", value: StartingPoint.FRONT_STAIRS, icon: Move },
    { label: "Back Stairs", value: StartingPoint.BACK_STAIRS, icon: Move },
  ];

  return (
    <PageTemplate>
      <Toast ref={toastRef} />
      <main className="flex flex-col h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                WMC Hospital Directory
              </h1>
              <p className="text-gray-600">Navigate to your destination</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedRoom && (
              <Button
                className="px-4 py-2 text-blue-600 transition-all duration-300 border-none shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl hover:bg-white/80"
                onClick={() => setIsInfoDialogVisible(true)}
              >
                <Info className="w-4 h-4 mr-2" />
                Room Info
              </Button>
            )}
            <Button
              className="px-4 py-2 text-gray-600 transition-all duration-300 border-none shadow-lg bg-white/70 backdrop-blur-sm rounded-2xl hover:bg-white/80"
              onClick={resetSelection}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center w-10 h-10 transition-all duration-300 bg-gray-100 rounded-full shadow-lg hover:bg-gray-200 hover:shadow-xl"
            >
              <LogOut className="w-5 h-5 text-gray-600 rotate-180" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid flex-1 grid-cols-4 gap-4">
          {/* Navigation Panel */}
          <div
            className={`${
              isNavCollapsed ? "col-span-1" : "col-span-1"
            } transition-all duration-300`}
          >
            <div className="h-full p-6 border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center text-xl font-bold text-gray-800">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Navigation
                </h2>
                <Button
                  className="w-8 h-8 text-gray-600 border-none bg-gray-100/50 hover:bg-gray-200/50 rounded-xl"
                  onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                >
                  <Expand className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Floor Selection */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Select Floor
                  </label>
                  <Dropdown
                    filter
                    options={completeFloors || []}
                    optionLabel="name"
                    placeholder="Choose a floor"
                    className="w-full"
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.value)}
                    pt={{
                      root: {
                        className: "bg-white/50 border-white/20 rounded-xl",
                      },
                      input: { className: "text-gray-800" },
                      panel: {
                        className:
                          "bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border-white/20",
                      },
                    }}
                  />
                </div>

                {/* Room Selection */}
                {selectedFloor?.rooms && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Select Room
                    </label>
                    <Dropdown
                      filter
                      options={selectedFloor.rooms}
                      optionLabel="name"
                      placeholder="Choose a room"
                      className="w-full"
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.value)}
                      pt={{
                        root: {
                          className: "bg-white/50 border-white/20 rounded-xl",
                        },
                        input: { className: "text-gray-800" },
                        panel: {
                          className:
                            "bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border-white/20",
                        },
                      }}
                    />
                  </div>
                )}

                {/* Starting Point Selection */}
                {selectedRoom && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Starting Point
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {startingPointOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <Button
                            key={option.value}
                            className={`w-full py-3 text-left transition-all duration-300 border-none rounded-xl ${
                              startingPoint === option.value
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                                : "bg-white/50 text-gray-700 hover:bg-white/70"
                            }`}
                            onClick={() => setStartingPoint(option.value)}
                          >
                            <IconComponent className="w-4 h-4 mr-2" />
                            {option.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Floor Map */}
          <div className="col-span-3">
            <div className="h-full p-6 border shadow-xl bg-white/70 backdrop-blur-sm rounded-3xl border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center text-xl font-bold text-gray-800">
                  <Navigation className="w-5 h-5 mr-2 text-blue-600" />
                  Floor Map
                  {selectedFloor && (
                    <span className="ml-2 text-sm text-gray-600">
                      - {selectedFloor.name}
                    </span>
                  )}
                </h2>
                {selectedRoom && (
                  <div className="px-4 py-2 text-white border shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl border-white/20">
                    <span className="text-sm font-medium">
                      Destination: {selectedRoom.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center h-full overflow-hidden rounded-2xl bg-gray-50">
                {selectedFloor && bgImage ? (
                  <div className="relative max-w-full max-h-full">
                    <Stage
                      width={Math.min(stageSize.width, 800)}
                      height={Math.min(stageSize.height, 600)}
                      ref={stageRef}
                      scaleX={Math.min(
                        800 / stageSize.width,
                        600 / stageSize.height,
                        1
                      )}
                      scaleY={Math.min(
                        800 / stageSize.width,
                        600 / stageSize.height,
                        1
                      )}
                      className="border-2 border-gray-200 rounded-xl"
                    >
                      <Layer>
                        <KonvaImage
                          image={bgImage}
                          x={0}
                          y={0}
                          width={stageSize.width}
                          height={stageSize.height}
                        />
                        {delayedArrows.map((arrow, index) => {
                          const { midX, midY } = getArrowMidpoint(arrow.points);
                          return (
                            <React.Fragment key={index}>
                              <Arrow
                                points={arrow.points}
                                {...ARROW_DIMENSION}
                              />
                              <Text
                                x={midX + 15}
                                y={midY - 25}
                                text={`${index + 1}`}
                                fontSize={16}
                                fill="white"
                                fontStyle="bold"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                align="center"
                              />
                            </React.Fragment>
                          );
                        })}
                      </Layer>
                    </Stage>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <MapPin className="w-16 h-16 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      Select a floor to view the map
                    </p>
                    <p className="text-sm">Choose from the navigation panel</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Room Info Dialog */}
        <Dialog
          header={
            <div className="flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              {selectedRoom?.name}
            </div>
          }
          className="w-[90%] max-w-4xl"
          visible={isInfoDialogVisible}
          onHide={() => setIsInfoDialogVisible(false)}
          pt={{
            root: { className: "bg-white/95 backdrop-blur-sm" },
            header: {
              className:
                "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-none rounded-t-2xl",
            },
            content: {
              className: "bg-white/90 backdrop-blur-sm rounded-b-2xl",
            },
            closeButton: {
              className: "text-white hover:bg-white/20 rounded-full",
            },
          }}
        >
          <TabView
            pt={{
              panelContainer: { className: "min-h-[400px] bg-transparent" },
              nav: { className: "bg-transparent border-b border-gray-200" },
              navContent: { className: "bg-transparent" },
            }}
          >
            <TabPanel
              header={
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Details
                </div>
              }
              pt={{
                headerAction: {
                  className: "bg-transparent text-gray-700 hover:text-blue-600",
                },
              }}
            >
              <div className="p-4 bg-gray-50 rounded-xl">
                <pre className="font-sans text-gray-800 whitespace-pre-wrap">
                  {selectedRoom?.detail ||
                    "No details available for this room."}
                </pre>
              </div>
            </TabPanel>
            <TabPanel
              header={
                <div className="flex items-center">
                  <Images className="w-4 h-4 mr-2" />
                  Images ({imageObjs.length})
                </div>
              }
              pt={{
                headerAction: {
                  className: "bg-transparent text-gray-700 hover:text-blue-600",
                },
              }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {imageObjs.length > 0 ? (
                  imageObjs.map((img) => (
                    <div
                      key={img.id}
                      className="relative overflow-hidden bg-gray-100 rounded-xl aspect-square"
                    >
                      <Image
                        src={getImageFromServer(
                          ImageLocation.ROOM,
                          img.imageLocation
                        )}
                        alt={img.imageLocation}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        preview
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500 col-span-full">
                    <Images className="w-16 h-16 mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No images available</p>
                    <p className="text-sm">
                      Images for this room haven't been uploaded yet.
                    </p>
                  </div>
                )}
              </div>
            </TabPanel>
          </TabView>
        </Dialog>
      </main>
    </PageTemplate>
  );
};

export default FindAmenityPage;
