import React, {
  useRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Stage, Layer, Arrow, Image, Text } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import {
  addDirections,
  getRoomById,
  getRoomDirectionPatternsById,
} from "../@utils/services/roomService";
import { useQuery } from "@tanstack/react-query";
import { ImageLocation, StartingPoint } from "../@utils/enums/enum";
import { getFloorById } from "../@utils/services/floorService";
import { useParams } from "react-router-dom";
import { ArrowDimension, ArrowType, FloorParam } from "../types/types";
import getImageFromServer from "../@utils/functions/getFloorMapImageLocation";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import CustomToast from "./CustomToast";

interface Props {
  roomId: number;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const ARROW_DIMENSION: ArrowDimension = {
  pointerLength: 19,
  pointerWidth: 15,
  strokeWidth: 10,
  stroke: "black",
  fill: "black",
};

// Maximum canvas dimensions
const MAX_CANVAS_WIDTH = 800;
const MAX_CANVAS_HEIGHT = 600;

const RoomCanvasDialog: React.FC<Props> = ({ roomId, visible, setVisible }) => {
  const toastRef = useRef<Toast>(null);
  const param = useParams() as FloorParam;
  const stageRef = useRef<StageType | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [arrows, setArrows] = useState<ArrowType[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentArrow, setCurrentArrow] = useState<ArrowType | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [arrowDimension] = useState<ArrowDimension>(ARROW_DIMENSION);
  const [startingPoint, setStartingPoint] = useState<number>(
    StartingPoint.FRONT_ELEVATOR
  );

  const { data: floor } = useQuery({
    queryKey: [`floor-${param.floorId}`],
    queryFn: () => getFloorById(+param.floorId),
  });

  const getArrowMidpoint = (points: number[]) => {
    const midX = (points[0] + points[2]) / 2;
    const midY = (points[1] + points[3]) / 2;
    return { midX, midY };
  };

  const { data: room } = useQuery({
    queryKey: [`room-${roomId}`],
    queryFn: () => getRoomById(roomId),
    enabled: roomId !== -1,
  });

  const {
    data: roomDirectionsData,
    refetch,
    error: roomDirectionsError,
  } = useQuery({
    queryKey: [`room-${roomId}-direction-patterns-${startingPoint}`],
    queryFn: () => getRoomDirectionPatternsById(roomId, { startingPoint }),
  });

  useEffect(() => {
    if (roomDirectionsError) {
      console.warn(roomDirectionsError);
    }
  }, [roomDirectionsError]);

  useEffect(() => {
    refetch();
  }, [startingPoint, refetch]);

  useEffect(() => {
    if (
      !roomDirectionsData?.data?.directionPatterns ||
      roomDirectionsData.data.directionPatterns.length === 0
    ) {
      setArrows([]);
      return;
    }

    const arrows =
      roomDirectionsData.data.directionPatterns[0]?.directionPattern?.arrows;

    if (arrows) setArrows(arrows);
    else setArrows([]);
  }, [roomDirectionsData]);

  useEffect(() => {
    const setDirections = () => {
      if (room?.directionPattern) setArrows(room.directionPattern.arrows);
    };
    setDirections();
  }, [room]);

  useEffect(() => {
    if (floor?.imageLocation) {
      const imgSrc = getImageFromServer(
        ImageLocation.FLOOR,
        floor.imageLocation
      );
      const img = new window.Image();
      img.src = imgSrc;
      img.onload = () => {
        setBgImage(img);
        setImageSize({ width: img.width, height: img.height });

        // Calculate scale to fit within max dimensions
        const scaleX = MAX_CANVAS_WIDTH / img.width;
        const scaleY = MAX_CANVAS_HEIGHT / img.height;
        const calculatedScale = Math.min(scaleX, scaleY, 1); // Don't scale up

        setScale(calculatedScale);
        setStageSize({
          width: img.width * calculatedScale,
          height: img.height * calculatedScale,
        });
      };
    }
  }, [floor]);

  // Convert screen coordinates to image coordinates
  const screenToImageCoords = (x: number, y: number) => ({
    x: x / scale,
    y: y / scale,
  });

  // Convert image coordinates to screen coordinates
  // const imageToScreenCoords = (x: number, y: number) => ({
  //   x: x * scale,
  //   y: y * scale,
  // });

  const handleMouseDown = () => {
    setIsDrawing(true);
    const stage = stageRef.current;
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    // Convert to image coordinates for storage
    const imagePoint = screenToImageCoords(point.x, point.y);
    setCurrentArrow({
      points: [imagePoint.x, imagePoint.y, imagePoint.x, imagePoint.y],
    });
  };

  const handleMouseMove = () => {
    if (!isDrawing || !currentArrow) return;

    const stage = stageRef.current;
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    // Convert to image coordinates for storage
    const imagePoint = screenToImageCoords(point.x, point.y);
    setCurrentArrow({
      points: [
        currentArrow.points[0],
        currentArrow.points[1],
        imagePoint.x,
        imagePoint.y,
      ],
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (currentArrow) {
      setArrows((prevArrows) => [...prevArrows, currentArrow]);
      setCurrentArrow(null);
    }
  };

  const accept = () => {
    if (arrows.length === 0) {
      toastRef.current?.show({
        severity: "warn",
        summary: "No arrows",
        detail: "Please set the directions.",
      });
      return;
    }
    addDirections(roomId, { directionPattern: arrows, startingPoint })
      .then((response) => {
        if (response.status === 201) {
          confirmDialog({
            message: "Directions updated successfully. Do you want to exit?",
            header: "Success",
            icon: PrimeIcons.QUESTION_CIRCLE,
            defaultFocus: "reject",
            accept: () => {
              if (visible === true) setVisible(false);
            },
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to save directions.",
        });
      });
  };

  const hasDirections = (point: number) => {
    if (!roomDirectionsData?.data?.directionPatterns) return false;
    return roomDirectionsData.data.directionPatterns.some(
      (pattern: { startingPoint: number }) => pattern.startingPoint === point
    );
  };

  const handleSave = () => {
    confirmDialog({
      message: "Do you want update the room's directions?",
      header: "Update Direction",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  const handleUndo = () => {
    if (arrows.length > 0) {
      toastRef.current?.show({
        severity: "info",
        summary: "Success",
        detail: "Undo successful.",
      });
      setArrows((prev) => prev.slice(0, -1));
    } else {
      toastRef.current?.show({
        severity: "warn",
        summary: "No arrows",
        detail: "There are no more arrows",
      });
      return;
    }
  };

  const handleClear = () => {
    if (arrows.length === 0) {
      toastRef.current?.show({
        severity: "warn",
        summary: "No arrows",
        detail: "There are no arrows",
      });
      return;
    }
    toastRef.current?.show({
      severity: "success",
      summary: "Success",
      detail: "Arrows has been cleared",
    });
    setArrows([]);
  };

  return (
    <Dialog
      visible={visible}
      pt={{
        header: { className: "bg-slate-900 text-slate-100" },
        content: { className: "bg-slate-900" },
      }}
      onHide={() => {
        if (visible === true) {
          setVisible(false);
        }
      }}
      header={`Directions Editor for ${room?.name}`}
      style={{ width: "auto" }}
      maximizable
    >
      <CustomToast ref={toastRef} />
      <div className="flex justify-between w-full gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setStartingPoint(StartingPoint.FRONT_ELEVATOR);
            }}
            className={`h-8 ${
              startingPoint === StartingPoint.FRONT_ELEVATOR
                ? "p-button-info"
                : hasDirections(StartingPoint.FRONT_ELEVATOR)
                ? ""
                : "bg-blue-700"
            }`}
            tooltipOptions={{ position: "bottom" }}
          >
            Front Elevator
          </Button>
          <Button
            onClick={() => {
              setStartingPoint(StartingPoint.BACK_ELEVATOR);
            }}
            className={`h-8 ${
              startingPoint === StartingPoint.BACK_ELEVATOR
                ? "p-button-info"
                : hasDirections(StartingPoint.BACK_ELEVATOR)
                ? ""
                : "bg-blue-700"
            }`}
            tooltipOptions={{ position: "bottom" }}
          >
            Back Elevator
          </Button>
          <Button
            onClick={() => {
              setStartingPoint(StartingPoint.FRONT_STAIRS);
            }}
            className={`h-8 ${
              startingPoint === StartingPoint.FRONT_STAIRS
                ? "p-button-info"
                : hasDirections(StartingPoint.FRONT_STAIRS)
                ? ""
                : "bg-blue-700"
            }`}
            tooltipOptions={{ position: "bottom" }}
          >
            Front Stairs
          </Button>
          <Button
            onClick={() => {
              setStartingPoint(StartingPoint.BACK_STAIRS);
            }}
            className={`h-8 ${
              startingPoint === StartingPoint.BACK_STAIRS
                ? "p-button-info"
                : hasDirections(StartingPoint.BACK_STAIRS)
                ? ""
                : "bg-blue-700"
            }`}
            tooltipOptions={{ position: "bottom" }}
          >
            Back Stairs
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            icon={PrimeIcons.SAVE}
            className="w-8 h-8"
            tooltip="Save"
            tooltipOptions={{ position: "bottom" }}
          />
          <Button
            onClick={handleUndo}
            icon={PrimeIcons.UNDO}
            className="w-8 h-8"
            tooltip="Undo"
            tooltipOptions={{ position: "bottom" }}
          />
          <Button
            onClick={handleClear}
            icon={PrimeIcons.TRASH}
            severity="danger"
            className="w-8 h-8"
            tooltip="Clear"
            tooltipOptions={{ position: "bottom" }}
          />
        </div>
      </div>
      <div className="mb-2 text-sm text-gray-400">
        Scale: {(scale * 100).toFixed(0)}% | Original: {imageSize.width}×
        {imageSize.height} | Display: {stageSize.width.toFixed(0)}×
        {stageSize.height.toFixed(0)}
      </div>
      {bgImage && (
        <div style={{ overflow: "auto", maxHeight: "70vh" }}>
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ border: "1px solid black" }}
          >
            <Layer>
              <Image
                image={bgImage}
                x={0}
                y={0}
                width={stageSize.width}
                height={stageSize.height}
              />

              {arrows.map((arrow, index) => {
                // Convert stored image coordinates to screen coordinates for display
                const screenPoints = [
                  arrow.points[0] * scale,
                  arrow.points[1] * scale,
                  arrow.points[2] * scale,
                  arrow.points[3] * scale,
                ];

                const { midX, midY } = getArrowMidpoint(screenPoints);

                return (
                  <React.Fragment key={index}>
                    <Arrow
                      points={screenPoints}
                      {...arrowDimension}
                      strokeWidth={arrowDimension.strokeWidth * scale}
                      pointerLength={arrowDimension.pointerLength * scale}
                      pointerWidth={arrowDimension.pointerWidth * scale}
                    />

                    <Text
                      x={midX + 10}
                      y={midY - 20}
                      text={`${index + 1}`}
                      fontSize={15 * scale}
                      fill="black"
                      align="center"
                    />
                  </React.Fragment>
                );
              })}

              {currentArrow && (
                <Arrow
                  points={[
                    currentArrow.points[0] * scale,
                    currentArrow.points[1] * scale,
                    currentArrow.points[2] * scale,
                    currentArrow.points[3] * scale,
                  ]}
                  {...arrowDimension}
                  strokeWidth={arrowDimension.strokeWidth * scale}
                  pointerLength={arrowDimension.pointerLength * scale}
                  pointerWidth={arrowDimension.pointerWidth * scale}
                />
              )}
            </Layer>
          </Stage>
        </div>
      )}
    </Dialog>
  );
};

export default RoomCanvasDialog;
