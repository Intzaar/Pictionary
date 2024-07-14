import CreateRoomForm from "./CreateRoom";
import JoinRoomForm from "./JoinRoom";

const Forms = ({ uuid,socket,setUser }) => {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-grotesk mb-8 font-light text-">
        Welcome to{" "}
        <span className="text-8xl xs:text-7xl font-grotesk font-semibold text-cyan-500">
          Pictionary
        </span>
      </h1>
      <div className="row pt-5 flex flex-col md:flex-row justify-center gap-4 ">
        <div className="w-[500px] h-[400px] border rounded-2 mx-auto mt-5 flex flex-col items-center p-6">
          <h1 className="font-sans text-4xl">Create Room</h1>
          <CreateRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
        </div>
        <div className="w-[500px] h-[400px] border rounded-2 mx-auto mt-5 flex flex-col items-center p-6">
          <h1 className="font-sans text-4xl">Join Room</h1>
          <JoinRoomForm uuid={uuid} socket={socket} setUser={setUser}/>
        </div>
      </div>
    </div>
  );
};

export default Forms;
