import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Arrow } from "react-konva";
import { Stage as StageType } from "konva/lib/Stage";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";

interface ArrowType {
  points: number[];
}

const ARROW_DIMENSION = {
  pointerLength: 25,
  pointerWidth: 25,
  strokeWidth: 10,
  stroke: "white",
  fill: "white",
};

const RoomCanvas = () => {
  const stageRef = useRef<StageType | null>(null);
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.9,
  });
  const [arrows, setArrows] = useState<ArrowType[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentArrow, setCurrentArrow] = useState<ArrowType | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.6,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleSave = () => {
    console.log("Arrow Data:", arrows);
    setArrows([]);
  };

  const handleUndo = () => {
    setArrows((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setArrows([]);
  };

  return (
    <div className="flex flex-col items-center overflow-auto h-80">
      <div className="flex justify-end w-full gap-2 px-4 mb-6">
        <Button
          onClick={handleSave}
          icon={`${PrimeIcons.SAVE}`}
          className="h-10"
        ></Button>
        <Button
          onClick={handleUndo}
          icon={`${PrimeIcons.UNDO}`}
          className="h-10"
        ></Button>
        <Button
          onClick={handleClear}
          icon={`${PrimeIcons.TRASH}`}
          severity="danger"
          className="h-10"
        ></Button>
      </div>
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
          {arrows.map((arrow, index) => (
            <Arrow key={index} points={arrow.points} {...ARROW_DIMENSION} />
          ))}
          {currentArrow && (
            <Arrow points={currentArrow.points} {...ARROW_DIMENSION} />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default RoomCanvas;
