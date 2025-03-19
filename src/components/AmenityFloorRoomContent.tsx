import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Arrow, Image as KonvaImage, Text } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import useSelectedFloorStore from "../@utils/store/selectedFloor";
import getImageFromServer from "../@utils/functions/getFloorMapImageLocation";
import { ImageLocation } from "../@utils/enums/enum";
import useSelectedRoom from "../@utils/store/selectedRoom";
import { ArrowDimension, ArrowType } from "../types/types";
import { useQuery } from "@tanstack/react-query";
import { getRoomDirectionPatternsById } from "../@utils/services/roomService";
import useStartingPointStore from "../@utils/store/startingPoint";

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
  const [delayedArrows, setDelayedArrows] = useState<ArrowType[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const { startingPoint } = useStartingPointStore();

  const { data: roomDirectionsData } = useQuery({
    queryKey: [`room-${selectedRoom?.id}-direction-patterns-${startingPoint}`],
    queryFn: () =>
      getRoomDirectionPatternsById(selectedRoom?.id, { startingPoint }),
    enabled: !!startingPoint && !!selectedRoom,
  });

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
          }, index * 100);

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

  const getArrowMidpoint = (points: number[]) => {
    const midX = (points[0] + points[2]) / 2;
    const midY = (points[1] + points[3]) / 2;
    return { midX, midY };
  };

  return (
    <div
      className={`h-full p-4 ${
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
    </div>
  );
};

export default AmenityFloorRoomContent;
