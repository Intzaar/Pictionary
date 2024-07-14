import { useState } from "react";
import { useNavigate } from "react-router-dom";
const CreateRoomForm = ({uuid,socket,setUser}) => {
  const [roomId,setRoomId] = useState(uuid())
  const [name,setName] = useState("")
  const navigate= useNavigate()
  const handleCreateRoom = (e)=>{
    e.preventDefault()

    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host:true,
      presenter:true
    }
    setUser(roomData)
    navigate(`/${roomId}`)
    console.log(roomData)
    socket.emit("userJoined",roomData)
  }

  return (
    <form className="w-full mt-5">
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded my-2"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <div className="flex gap-1">
          <input
            type="text"
            value={roomId}
            disabled
            className="flex-grow p-2 border border-gray-300 rounded"
            placeholder="Generate room Code"
          />
          <div className="flex gap-1 ">
            <button
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-400 transform transition-transform duration-150 active:scale-95"
              type="button"
              onClick={()=>setRoomId(uuid())}
            >
              Generate
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 transform transition-transform duration-150 active:scale-95"
              type="button"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
      <button
        className="w-full px-4 py-2 mt-10 bg-cyan-600 text-white rounded hover:bg-cyan-400 transform transition-transform duration-150 active:scale-95"
        type="button" onClick={handleCreateRoom}
      >
        Generate Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
