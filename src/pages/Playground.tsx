import { useState, useEffect, useRef } from "react";
import { Stage, Layer, Image, Line, Circle, Rect } from "react-konva";
import useImage from "use-image";
import PF from "pathfinding";
import img from "../assets/Sample_Floorplan.jpg"; // Load uploaded image

const GRID_SIZE = 150; // Ultra-high resolution grid for precision
const CELL_SIZE = 4; // Smaller cells to align with thin walls
const EDGE_THRESHOLD = 25; // Lower value to detect only thin black lines

const MapNavigator = () => {
  const [map] = useImage(img);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [end, setEnd] = useState<{ x: number; y: number } | null>(null);
  const [path, setPath] = useState<number[][]>([]);
  const [wallPositions, setWallPositions] = useState<
    { x: number; y: number }[]
  >([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 🛠️ Improved Thin Wall Detection Using Contrast Filtering
  const detectWalls = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(map, 0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    const imageData = ctx.getImageData(
      0,
      0,
      GRID_SIZE * CELL_SIZE,
      GRID_SIZE * CELL_SIZE
    );

    let detectedWalls: { x: number; y: number }[] = [];

    for (let y = 1; y < GRID_SIZE - 1; y++) {
      for (let x = 1; x < GRID_SIZE - 1; x++) {
        const index = (y * CELL_SIZE * GRID_SIZE + x * CELL_SIZE) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];

        const brightness = (r + g + b) / 3;

        // Edge detection using Sobel-like contrast filtering
        const gx = Math.abs(
          imageData.data[index + 4] - imageData.data[index - 4]
        );
        const gy = Math.abs(
          imageData.data[index + 4 * GRID_SIZE] -
            imageData.data[index - 4 * GRID_SIZE]
        );
        const edgeValue = Math.sqrt(gx * gx + gy * gy);

        if (edgeValue > EDGE_THRESHOLD) {
          detectedWalls.push({ x, y });
        }
      }
    }

    setWallPositions(detectedWalls);
  };

  useEffect(() => {
    if (map) {
      detectWalls();
    }
  }, [map]);

  // 🛠️ Create a pathfinding grid and mark detected walls
  const createGrid = () => {
    let grid = new PF.Grid(GRID_SIZE, GRID_SIZE);
    wallPositions.forEach(({ x, y }) => grid.setWalkableAt(x, y, false));
    return grid;
  };

  const handleMapClick = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const gridX = Math.floor(x / CELL_SIZE);
    const gridY = Math.floor(y / CELL_SIZE);

    if (!start) setStart({ x: gridX, y: gridY });
    else if (!end) setEnd({ x: gridX, y: gridY });
  };

  useEffect(() => {
    if (start && end) {
      let grid = createGrid().clone();
      const finder = new PF.AStarFinder();
      const foundPath = finder.findPath(start.x, start.y, end.x, end.y, grid);
      setPath(foundPath);
    }
  }, [start, end, wallPositions]);

  return (
    <>
      {/* Hidden Canvas for Image Processing */}
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        style={{ display: "none" }}
      />

      <Stage
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        onClick={handleMapClick}
      >
        <Layer>
          {/* Render Floor Plan */}
          <Image
            image={map}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
          />

          {/* Render Detected Walls */}
          {wallPositions.map(({ x, y }, i) => (
            <Rect
              key={i}
              x={x * CELL_SIZE}
              y={y * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill="black"
              opacity={0.3}
            />
          ))}

          {/* Render Start & End Points */}
          {start && (
            <Circle
              x={start.x * CELL_SIZE + CELL_SIZE / 2}
              y={start.y * CELL_SIZE + CELL_SIZE / 2}
              radius={4}
              fill="blue"
            />
          )}
          {end && (
            <Circle
              x={end.x * CELL_SIZE + CELL_SIZE / 2}
              y={end.y * CELL_SIZE + CELL_SIZE / 2}
              radius={4}
              fill="red"
            />
          )}

          {/* Render Path */}
          {path.length > 0 && (
            <Line
              points={path.flatMap(([x, y]) => [
                x * CELL_SIZE + CELL_SIZE / 2,
                y * CELL_SIZE + CELL_SIZE / 2,
              ])}
              stroke="green"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </Layer>
      </Stage>
    </>
  );
};

export default MapNavigator;
