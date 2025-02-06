import { useRef, useState } from "react";
import { Stage, Layer, Arrow } from "react-konva";

const RoomCanvas = () => {
  const stageRef = useRef(null);
  const [arrows, setArrows] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentArrow, setCurrentArrow] = useState(null);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    setCurrentArrow({ points: [point.x, point.y, point.x, point.y] });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = stageRef.current;
    const point = stage.getPointerPosition();
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
      setArrows([...arrows, currentArrow]);
      setCurrentArrow(null);
    }
  };

  const handleSave = () => {
    console.log("Arrow Data:", arrows);
  };

  return (
    <div>
      <Stage
        width={1130}
        height={300}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid black" }} // Visual boundary for the Stage
      >
        <Layer>
          {arrows.map((arrow, index) => (
            <Arrow
              key={index}
              points={arrow.points}
              stroke="black"
              fill="black"
              pointerLength={10}
              pointerWidth={10}
            />
          ))}
          {currentArrow && ( // Render current arrow while drawing
            <Arrow
              points={currentArrow.points}
              stroke="black"
              fill="black"
              pointerLength={10}
              pointerWidth={10}
            />
          )}
        </Layer>
      </Stage>
      <button onClick={handleSave}>Save Arrows</button>
    </div>
  );
};

export default RoomCanvas;
