import { useEffect, useState, useLayoutEffect } from "react";
import rough from "roughjs";

const Board = ({ canvasRef, ctxRef, elements, setElements, tool, color, user, socket }) => {
  const [img, setImg] = useState(null);
  
  useEffect(() => {
    socket.on("BoardDataResponse", (data) => {
      setImg(data.imgURL);
    });
  }, []);
  
  if (!user?.presenter) {
    return (
      <div className="h-full overflow-hidden">
        {img ? (
          <img src={img} alt="presenter Screen" style={{
            maxWidth: "1000%",
            height: "auto",}}/>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    ctxRef.current = ctx;
  }, [canvasRef, ctxRef, color]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
    }
  }, [color]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    if (!canvas || !ctx) return;

    const roughCanvas = rough.canvas(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      if (element.type === "pencil") {
        roughCanvas.linearPath(element.path, {
          stroke: element.stroke,
          strokeWidth: 3,
          roughness: 0,
          bowing: 0,
        });
      } else if (element.type === "eraser") {
        element.path.forEach(([x, y]) => {
          ctx.clearRect(x - 25, y - 25, 50, 50);
        });
      }
    });

    const canvasImage = canvas.toDataURL();
    socket.emit("BoardData", canvasImage);
  }, [elements, canvasRef, ctxRef, socket]);

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e.nativeEvent;
    const { offsetLeft, offsetTop } = e.target;
    const x = clientX - offsetLeft;
    const y = clientY - offsetTop;

    const newElement = {
      type: tool === "pencil" ? "pencil" : "eraser",
      path: [[x, y]],
      stroke: tool === "pencil" ? color : "#ffffff",
      strokeWidth: 4,
      roughness: 0,
      bowing: 0,
    };

    setElements((prevElements) => [...prevElements, newElement]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { clientX, clientY } = e.nativeEvent;
    const { offsetLeft, offsetTop } = e.target;
    const x = clientX - offsetLeft;
    const y = clientY - offsetTop;

    setElements((prevElements) => {
      const newElements = [...prevElements];
      const lastIndex = newElements.length - 1;
      const newPath = [...newElements[lastIndex].path, [x, y]];
      newElements[lastIndex] = {
        ...newElements[lastIndex],
        path: newPath,
      };
      return newElements;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="w-full h-full overflow-hidden"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Board;
