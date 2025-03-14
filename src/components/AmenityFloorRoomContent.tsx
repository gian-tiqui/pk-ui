import React, { useEffect, useState, useRef } from "react";
import { Image } from "primereact/image";
import { Stage, Layer, Arrow, Image as KonvaImage, Text } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import useSelectedFloorStore from "../@utils/store/selectedFloor";
import AmenityRoomCard from "./AmenityRoomCard";
import SelectedRoomDialog from "./SelectedRoomDialog";
import getImageFromServer from "../@utils/functions/getFloorMapImageLocation";
import { ImageLocation } from "../@utils/enums/enum";
import { PrimeIcons } from "primereact/api";
import useSelectedRoom from "../@utils/store/selectedRoom";
import { ArrowDimension, ArrowType } from "../types/types";

const ARROW_DIMENSION: ArrowDimension = {
  pointerLength: 19,
  pointerWidth: 15,
  strokeWidth: 10,
  stroke: "black",
  fill: "black",
};

const AmenityFloorRoomContent = () => {
  const { selectedFloor } = useSelectedFloorStore();
  const { selectedRoom } = useSelectedRoom();

  const stageRef = useRef<StageType | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [arrowDimension] = useState<ArrowDimension>(ARROW_DIMENSION);
  const [_, setArrows] = useState<ArrowType[]>([]);
  const [delayedArrows, setDelayedArrows] = useState<ArrowType[]>([]);

  // Load floor image when selectedFloor changes
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

  useEffect(() => {
    if (selectedRoom?.directionPattern) {
      console.log(selectedRoom.directionPattern);
      setArrows(selectedRoom.directionPattern.arrows || []);

      // Reset and animate arrows with delay
      setDelayedArrows([]);
      if (selectedRoom.directionPattern.arrows) {
        selectedRoom.directionPattern.arrows.forEach((arrow, index) => {
          setTimeout(() => {
            setDelayedArrows((prevArrows) => [...prevArrows, arrow]);
          }, index * 500);
        });
      }
    } else {
      setArrows([]);
      setDelayedArrows([]);
    }
  }, [selectedRoom]);

  const getArrowMidpoint = (points: number[]) => {
    const midX = (points[0] + points[2]) / 2;
    const midY = (points[1] + points[3]) / 2;
    return { midX, midY };
  };

  return (
    <div
      className={`h-full gap-4 p-4 ${
        selectedFloor ? "flex flex-wrap" : "grid place-content-center"
      }`}
    >
      {selectedFloor && bgImage && (
        <div className="relative">
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            style={{ border: "1px solid black" }}
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
                    <Arrow points={arrow.points} {...arrowDimension} />
                    <Text
                      x={midX + 10}
                      y={midY - 20}
                      text={`${index + 1}`}
                      fontSize={15}
                      fill="black"
                      align="center"
                    />
                  </React.Fragment>
                );
              })}
            </Layer>
          </Stage>
        </div>
      )}
      {/* <SelectedRoomDialog /> */}
      {selectedFloor?.rooms && selectedFloor.rooms.length > 0 ? (
        selectedFloor.rooms
          .filter((room) => room.directionPattern)
          .map((room) => <AmenityRoomCard room={room} key={room.id} />)
      ) : (
        <p className="flex items-center text-lg font-medium text-blue-400">
          <i className={`${PrimeIcons.QUESTION_CIRCLE} me-2 text-xl`}></i>Select
          a floor
        </p>
      )}
    </div>
  );
};

export default AmenityFloorRoomContent;
