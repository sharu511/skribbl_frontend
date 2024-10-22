import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { AlarmClock, Eraser, LogOut, Rocket, Send, SendHorizonal } from "lucide-react";
import {
  currentWordState,
  isDrawerState,
  isGameStartedState,
  messagesState,
  playersState,
  roomCreatedState,
  roomIdState,
  roomJoinedState,
  timeRemainingState,
  usernameState,
  wordsState,
  wsState,
} from "../../recoil/atoms/atoms";
import { toast, Toaster } from "sonner";
import { useDraw } from "../hooks/useDraw";
import WordSelectionModal from "./WordSelectionModal";
import { generateUnderscores } from "../utility/utility";
import { resetAllState } from "../../recoil/selectors/selector";

const Game = () => {
  const ws = useRecoilValue(wsState);
  const roomId = useRecoilValue(roomIdState);
  const username = useRecoilValue(usernameState);

  const [playersList, setPlayersList] = useRecoilState(playersState);
  const [messages, setMessages] = useRecoilState(messagesState);
  const [isDrawer, setIsDrawer] = useRecoilState(isDrawerState);
  const [words,setWords] = useRecoilState(wordsState);
  const [currentWord,setCurrentWord] = useRecoilState(currentWordState);
  const [timeRemaining,setTimeRemaining] = useRecoilState(timeRemainingState);
  const [isGameStarted,setisGameStarted] = useRecoilState(isGameStartedState);
  const setroomJoined = useSetRecoilState(roomJoinedState)
  const setroomCreated = useSetRecoilState(roomCreatedState)
  const resetState = useResetRecoilState(resetAllState);

  const [iswordSelectionModalOpen,setisWordSelectionModalOpen] = useState(false);
  const [wordCount,setWordCount] = useState(0)

  const [sendMessage, setSendMessage] = useState("");
  const { canvasRef, onMouseDown } = useDraw(drawLine);

  function drawLine({ ctx, previousPoint, currentPoint }) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = "#000";
    const lineWidth = 4;

    let startPoint = previousPoint ?? currentPoint;

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();

    ws.send(
      JSON.stringify({
        type: "draw",
        x1: startPoint.x,
        y1: startPoint.y,
        x2: currX,
        y2: currY,
        color: lineColor,
        width: lineWidth,
      })
    );
  }

  useEffect(() => {
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (data.type === "notification") {
        toast.success(data.message,{duration:1000});
      }
      switch (data.type) {
        case "playerList":
          setPlayersList(data.players);
          break;

        case "notification":
          toast.success(data.message,{duration:1000})
          break;

        case "user_joined":
          setPlayersList(data.players);
          toast.success(data.message);
          break;

        case "choose_word":
          setWords(data.words)
          setisWordSelectionModalOpen(true);
          break;

        case "startDrawing": 
        toast.success("Start Drawing....",{duration:1000}) 
        setisGameStarted(true)
        setWordCount(data.wordCount)
          break;

        case "clear_canvas":
          clearCanvas();
          break;

        case "draw":
          drawOnCanvas(
            data.x1,
            data.y1,
            data.x2,
            data.y2,
            data.color,
            data.width
          );
          break;

        case "correctGuess":
          setMessages((prevMessages) => [
            ...prevMessages,
            {message:`${data.user} guessed the word correctly`,sender:"machine"},
          ]);
          break;

        case "chat":
          setMessages((prevMessages) => [
            ...prevMessages,
            { message: data.message, sender: data.sender },
          ]);
          console.log(messages);
          break;

        case "timer":
          setTimeRemaining(data.timeRemaining);
          break;

        case "timesUp":
          toast.warning("Time over",{duration:1000});
          setisGameStarted(false)
          setCurrentWord("")
          clearCanvas();
          ws.send(JSON.stringify({ type: "clear_canvas" }));
          break;

        case "winner":
          toast.success(`${data.user} won with ${data.score} points`,{duration:1000});
          setMessages((prevMessages) => [
            ...prevMessages,
            {message:`${data.user} won with ${data.score}`,sender:"machine"},
          ]);
          break;

        case "error":
          console.log("Error received", data);
          toast.error("Error occurred: " + data.message,{duration:3000});
          break;

        case "drawer":
          // Update drawer state for the current round
          setIsDrawer(data.drawer === username);
          break;

        case "next_drawer":
          // Update drawer state for next round
          setIsDrawer(data.newDrawer === username);
          break;

        
      }
    };

    // return (() => {
    //  ws.close()
    // })
  }, []);

  function drawOnCanvas(x1, y1, x2, y2, color, width) {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function handleClearCanvas() {
    clearCanvas();
    ws.send(JSON.stringify({ type: "clear_canvas" }));
  }

  const handleSendMessage = () => {
    ws.send(JSON.stringify({ type: "chat", message: sendMessage }));
    setSendMessage("");
  };

  const handleGuessSendMessage = () => {
    ws.send(JSON.stringify({ type: "guess", message: sendMessage }));
    setSendMessage("");
  };

  const handleStartGame = () => {
    if(playersList.length>1){
      ws.send(JSON.stringify({ type: "start_game" }));
    }
    else{
      toast.warning("please wait till another player joins",{duration:1000})
    }
   
  };

  const handleCloseModal = () => {
    setisWordSelectionModalOpen(false);
  };
  const handleSelectWord = (word) => {
    console.log('Selected word:', word);
    // Send the selected word to the server
    setCurrentWord(word);
    ws.send(JSON.stringify({ type: 'choose_word', word }));
  };
  const handleLogout = () => {
    console.log("Logging out");
    ws.send(JSON.stringify({type:"leave"}))
    resetState()
   

  };




  return (
    <>
     <Toaster richColors position="top-center" />
<div className="w-full flex flex-row h-auto items-center justify-between p-4 md:p-6 border-b border-black">
  <p className="font-bold">Username: {username}</p>
  <p className="flex items-center">
    <AlarmClock /> : {timeRemaining}
  </p>
  <p className="md:block">
    Word: {currentWord === "" ? `${generateUnderscores(wordCount)}` : `${currentWord}`}
  </p>
  <p className=" md:block">Room ID: {roomId}</p>
  <LogOut onClick={handleLogout} />
</div>

<div className="w-full flex flex-col md:flex-row h-full justify-evenly p-4">
  <div className="flex flex-col items-center w-full md:w-2/3">
    <canvas
      onMouseDown={isDrawer ? onMouseDown : undefined}
      ref={canvasRef}
     
      className="border border-black rounded-lg mb-4 w-full h-96 "
    ></canvas>
 
  
  </div>
  
  <div className="border border-1 w-full  md:w-1/3 flex flex-col">
    <div className="h-56 w-full flex items-center flex-col border-b border-black p-2">
      <p className="font-bold">Players List</p>
      <div className="overflow-y-auto h-full">
        {playersList.map(({ username, score }) => (
            <p key={username}>
                {username}: {score}
            </p>
        ))}
      </div>
    </div>
    <div className="flex flex-row">
    {isDrawer && (
      
      <Eraser onClick={handleClearCanvas} className="absolute top-24 right-96 hover:cursor-pointer"/>

  )}
    {isDrawer && (
      <button
        className="border border-1 px-6 py-2 rounded-md flex items-center justify-center m-2"
        onClick={handleStartGame}
      >
        Start Game <Rocket  size={20} />
      </button>
    )}
    </div>
    
    <div className="flex flex-col h-5/6">
      <p className="font-bold text-center">Chat</p>
      <div className="w-full border border-1 flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.message}
            className={`${
              username === message.sender ? "text-right" : "text-left"
            } m-2 my-4 `}
          >
            {message.sender}:{" "}
            <span
              className={`${
                username === message.sender ? "bg-green-400" : "bg-gray-500"
              } rounded-md px-4 py-2 my-3 text-xs md:text-sm`}
            >
              {message.message}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-between items-center mt-2">
        <input
          type="text"
          className="border-black border rounded-md p-2 w-5/6"
          placeholder="Enter your message"
          value={sendMessage}
          onChange={(e) => {
            setSendMessage(e.target.value);
          }}
        />
        {isGameStarted ? (
          <button
            className="border border-1 px-4 py-2 rounded-md flex items-center justify-center w-1/6"
            onClick={handleGuessSendMessage}
          >
         <SendHorizonal size={20} />
          </button>
        ) : (
          <button
            className="border border-1 px-4 py-2 rounded-md flex items-center justify-center w-1/6"
            onClick={handleSendMessage}
          >
       <SendHorizonal size={20} />
          </button>
        )}
      </div>
    </div>
  </div>
</div>

{iswordSelectionModalOpen && (
  <WordSelectionModal
    words={words}
    onClose={handleCloseModal}
    onSelect={handleSelectWord}
  />
)}

    </>
  );
};


export default Game;
