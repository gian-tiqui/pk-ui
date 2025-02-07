import React, {
  useRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Stage, Layer, Arrow, Image } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { addDirections, getRoomById } from "../@utils/services/roomService";
import { useQuery } from "@tanstack/react-query";
import { ImageLocation } from "../@utils/enums/enum";
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

const RoomCanvasDialog: React.FC<Props> = ({ roomId, visible, setVisible }) => {
  const toastRef = useRef<Toast>(null);
  const param = useParams() as FloorParam;
  const stageRef = useRef<StageType | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [arrows, setArrows] = useState<ArrowType[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentArrow, setCurrentArrow] = useState<ArrowType | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [arrowDimension] = useState<ArrowDimension>(ARROW_DIMENSION);

  // const [delayedArrows, setDelayedArrows] = useState<ArrowType[]>([]);

  // useEffect(() => {
  //   if (visible === false) return;
  //   setDelayedArrows([]);
  //   arrows.forEach((arrow, index) => {
  //     setTimeout(() => {
  //       setDelayedArrows((prevArrows) => [...prevArrows, arrow]);
  //     }, index * 500);
  //   });
  // }, [arrows, visible]);

  const { data: floor } = useQuery({
    queryKey: [`floor-${param.floorId}`],
    queryFn: () => getFloorById(+param.floorId),
  });

  const { data: room } = useQuery({
    queryKey: [`room-${roomId}`],
    queryFn: () => getRoomById(roomId),
    enabled: roomId !== -1,
  });

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
        setStageSize({ width: img.width, height: img.height });
      };
    }
  }, [floor]);

  const handleMouseDown = () => {
    setIsDrawing(true);
    const stage = stageRef.current;
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    setCurrentArrow({ points: [point.x, point.y, point.x, point.y] });
  };

  const handleMouseMove = () => {
    if (!isDrawing || !currentArrow) return;

    const stage = stageRef.current;
    if (!stage) return;

    const point = stage.getPointerPosition();
    if (!point) return;

    setCurrentArrow({
      points: [
        currentArrow.points[0],
        currentArrow.points[1],
        point.x,
        point.y,
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
    addDirections(roomId, { arrows })
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
      .catch((error) => console.error(error));
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
    >
      <CustomToast ref={toastRef} />
      <div className="flex justify-end w-full gap-2 mb-2 ">
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
      {bgImage && (
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

            {arrows.map((arrow, index) => (
              <Arrow points={arrow.points} {...arrowDimension} key={index} />
            ))}

            {currentArrow && (
              <Arrow points={currentArrow.points} {...arrowDimension} />
            )}
          </Layer>
        </Stage>
      )}
    </Dialog>
  );
};

export default RoomCanvasDialog;
