import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image, Line, Circle } from "react-konva";
import useImage from "use-image";
import PF from "pathfinding";
import img from "../assets/Sample_Floorplan.jpg";

const MapNavigator = () => {
  const [map] = useImage(img); // Load image
  const [grid] = useState(new PF.Grid(10, 10)); // Define 10x10 grid
  const finder = new PF.AStarFinder();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);

  // Handle user clicks to select start and end points
  const handleMapClick = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const gridX = Math.floor(x / 50); // Convert to grid scale
    const gridY = Math.floor(y / 50);

    if (!start) setStart({ x: gridX, y: gridY });
    else if (!end) setEnd({ x: gridX, y: gridY });
  };

  useEffect(() => {
    if (start && end) {
      let newGrid = grid.clone();
      let foundPath = finder.findPath(start.x, start.y, end.x, end.y, newGrid);
      setPath(foundPath);
    }
  }, [start, end]);

  return (
    <Stage width={500} height={500} onClick={handleMapClick}>
      <Layer>
        {/* Render Image Map */}
        <Image image={map} width={500} height={500} />

        {/* Render Start & End Points */}
        {start && (
          <Circle x={start.x * 50} y={start.y * 50} radius={10} fill="blue" />
        )}
        {end && <Circle x={end.x * 50} y={end.y * 50} radius={10} fill="red" />}

        {/* Render Path */}
        {path.length > 0 && (
          <Line
            points={path.flatMap(([x, y]) => [x * 50 + 25, y * 50 + 25])}
            stroke="green"
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </Layer>
    </Stage>
  );
};

export default MapNavigator;
