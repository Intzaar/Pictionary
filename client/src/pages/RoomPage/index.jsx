import { useState, useRef, useEffect } from "react";
import Board from "../../components/Canvas";
import words from "../../components/words.json";

const RoomPage = ({ user, socket, users }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [history, setHistory] = useState([]);
  const [clearHistory, setClearHistory] = useState([]);
  const [guess, setGuess] = useState("");
  const [openedUserTab, setOpenedUserTab] = useState(false);
  const [secretWord, setSecretWord] = useState("");

  const getRandomWord = () => {
    return words[Math.floor(Math.random() * words.length)];
  };

  useEffect(() => {
    const newWord = getRandomWord();
    setSecretWord(newWord);

    socket.on("guessResponse", (data) => {
      const { name } = data;
      if (data.guess != secretWord) {
        return;
      }
      alert(`${name} guessed the word ${secretWord} correctly!`);
      const newWord = getRandomWord();
      setSecretWord(newWord);
    });

    return () => {
      socket.off("guessResponse");
    };
  }, [socket, secretWord]);

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

  const handleGuessSubmit = () => {
    if (guess.trim()) {
      socket.emit("guess", { guess });
      setGuess("");
    }
  };

  return (
    <div className="text-center font-sans">
      <button
        type="button"
        className="btn bg-cyan-700 text-white rounded hover:bg-cyan-500 active:scale-90"
        style={{
          display: "block",
          position: "absolute",
          top: "5%",
          left: "3%",
          height: "40px",
          width: "100px",
        }}
        onClick={() => setOpenedUserTab(true)}
      >
        Users
      </button>
      {openedUserTab && (
        <div
          className="fixed top-0 h-full text-white bg-black"
          style={{ width: "250px", left: "0%" }}
        >
          <button
            type="button"
            onClick={() => setOpenedUserTab(false)}
            className="btn bg-cyan-700 text-white hover:bg-cyan-500 active:scale-90 w-3/5 mt-5 rounded-lg"
          >
            Close
          </button>
          <div className="w-full mt-5 pt-5">
            {users.map((usr, index) => (
              <p key={index * 999} className="my-2 text-center w-full">
                {usr.name} {user && user.userId === usr.userId && "(You)"}
              </p>
            ))}
          </div>
        </div>
      )}
      <h1 className="text-6xl">
        Pictionary{" "}
        <span className="text-lg text-cyan-400">
          [Players Online: {users.length}]
        </span>
      </h1>
      {user?.presenter && (
        <h2 className="text-4xl mt-4">Your word: {secretWord}</h2>
      )}
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
            socket={socket}
          />
        </div>
      </div>

      {!user?.presenter && (
        <div className="mt-5">
          <div className="mt-3">
            <input
              type="text"
              placeholder="Type your guess here"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <button
              onClick={handleGuessSubmit}
              className="ml-2 px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-500 active:scale-90"
            >
              Submit Guess
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomPage;
