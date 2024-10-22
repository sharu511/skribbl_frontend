import React from "react";
import { isDrawerState, playersState, roomCreatedState, roomIdState, roomJoinedState, usernameState, wsState } from "../../recoil/atoms/atoms";
import { toast, Toaster } from "sonner";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Router, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [roomId, setRoomId] = useRecoilState(roomIdState);
  const [username, setUsername] = useRecoilState(usernameState);
  const [roomJoined,setRoomJoined] = useRecoilState(roomJoinedState);
  const [roomCreated,setRoomCreated] = useRecoilState(roomCreatedState);
  const setDrawer = useSetRecoilState(isDrawerState);
  const setPlayers=useSetRecoilState(playersState)
  const ws = useRecoilValue(wsState)


  const handleCreateRoom = () => {

console.log(ws,username)

      ws.send(
        JSON.stringify({
          type: "create",
          username,
        })
      );

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.type === "roomCreated") {
          toast.success("Room created successfully")
          setRoomId(data.roomId);
          setRoomCreated(true)
          setPlayers([username])
          

        }
      };
   
  };

  const handleJoinRoom = () => {
   
    console.log("Joining room with ID and username",username,roomId);

      ws.send(
        JSON.stringify({
          type: 'join',
          roomId,username
        })
      );

      ws.onmessage=(e)=>{
        const data = JSON.parse(e.data);
        if(data.type==='joined'){
          toast.success("Room Joined successfully")
          setRoomId(roomId);
          setRoomJoined(true);
          setPlayers(data.players)
      
        }else if(data.type === 'error'){
          toast.error(data.message)
        }
   
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
    <Toaster richColors position="top-center" />
    <h1 className="text-center text-3xl font-bold mb-6">Scribble Clone</h1>
    <div className="flex flex-col md:flex-row items-center justify-around w-full max-w-4xl gap-6">
      <div className="flex flex-col items-center w-full md:w-1/2">
        <h3 className="font-semibold text-2xl mb-4">Connect with Friends</h3>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="p-2.5 border border-black rounded-lg mb-2 w-full md:w-3/4"
        />
        <input
          type="text"
          onChange={(e) => {
            console.log("Changing the values"), setRoomId(e.target.value);
          }}
          className="p-2.5 border border-black rounded-lg w-full md:w-3/4"
          placeholder="Enter the room ID to Join"
        />
        <button
          type="button"
          onClick={handleJoinRoom}
          className="p-2 border border-black rounded-lg mt-4 font-semibold px-4 w-full md:w-3/4"
        >
          Join Room
        </button>
      </div>
      <h1 className="text-center text-xl hidden md:block">or</h1>
      <div className="flex flex-col items-center w-full md:w-1/2">
        <h3 className="font-semibold text-2xl mb-4">Create a New Game</h3>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setUsername(e.target.value)}
          className="p-2.5 border border-black rounded-lg mb-2 w-full md:w-3/4"
        />
        <button
          type="button"
          className="p-2 border border-black rounded-lg mt-4 font-semibold px-4 w-full md:w-3/4"
          onClick={handleCreateRoom}
        >
          Create Room
        </button>
      </div>
    </div>
  </div>
  );

};

export default HomePage;
