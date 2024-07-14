import { useState, useRef } from "react";
import Board from "../../components/Canvas";

const RoomPage = ({ user,socket }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState([]);
  const [clearHistory, setClearHistory] = useState([]);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setClearHistory(elements);
    setElements([]);
    setHistory([...history, elements]);
  };

  const undo = () => {
    if (elements.length > 0) {
      const lastElement = elements[elements.length - 1];
      setHistory((prevHistory) => [...prevHistory, lastElement]);
      setElements((prevElements) => prevElements.slice(0, -1));
    } else if (clearHistory.length > 0) {
      setElements(clearHistory);
      setClearHistory([]);
    }
  };

  const redo = () => {
    if (history.length > 0) {
      const lastHistory = history[history.length - 1];
      setElements((prevElements) => [...prevElements, lastHistory]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  };

  return (
    <div className="text-center font-sans">
      <h1 className="text-6xl">
        Pictionary{" "}
        <span className="text-lg text-cyan-400">[Players Online: 0]</span>
      </h1>
      {user?.presenter && (
        <div className="flex flex-col md:flex-row justify-center items-center mt-4 mb-5 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="pencil"
              name="tool"
              value="pencil"
              checked={tool === "pencil"}
              onChange={(e) => setTool(e.target.value)}
              className="form-radio h-5 w-5"
            />
            <label htmlFor="pencil" className="ml-2 text-lg">
              Pencil
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="eraser"
              name="tool"
              value="eraser"
              checked={tool === "eraser"}
              onChange={(e) => setTool(e.target.value)}
              className="form-radio h-5 w-5"
            />
            <label htmlFor="eraser" className="ml-2 text-lg">
              Eraser
            </label>
          </div>
          <div className="flex items-center justify-center md:w-64 gap-2">
            <label htmlFor="color" className="text-lg">
              Select Color :
            </label>
            <input
              type="color"
              id="color"
              className="mt-1 w-20 h-10"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="flex gap-1 ">
            <button
              className={`px-4 py-2 bg-white text-cyan-500 rounded hover:bg-cyan-500 hover:text-white transform transition-transform duration-150 active:scale-95 ${
                elements.length === 0 && clearHistory.length === 0
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
              type="button"
              disabled={elements.length === 0 && clearHistory.length === 0}
              onClick={undo}
            >
              UNDO
            </button>
            <button
              className={`px-4 py-2 bg-white text-cyan-500 rounded hover:bg-cyan-500 hover:text-white transform transition-transform duration-150 active:scale-95 ${
                history.length === 0 ? "opacity-50 pointer-events-none" : ""
              }`}
              type="button"
              disabled={history.length === 0}
              onClick={redo}
            >
              REDO
            </button>
          </div>
          <div>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-300 transform transition-transform duration-150 active:scale-95"
              type="button"
              onClick={handleClearCanvas}
            >
              Clear Canvas
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <div className="flex justify-center items-center border-[0.2rem] border-black rounded-xl overflow-hidden h-[600px] w-[1000px] bg-white mt-5">
          <Board
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            elements={elements}
            setElements={setElements}
            tool={tool}
            color={color}
            user={user}
            socket = {socket}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
