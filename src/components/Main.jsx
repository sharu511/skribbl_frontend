import React,{useEffect} from 'react'
import { useDraw } from '../hooks/useDraw'
import { toast, Toaster } from 'sonner';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { roomIdState, wsState } from '../../recoil/atoms/atoms';

const Main = () => {

  const roomid = useRecoilState(roomIdState);
  const currws = useRecoilState(wsState)
  console.log(roomid,currws)
  useEffect(() => {
    

    currws[0].onmessage = (e) => {
      const data = JSON.parse(e.data)
      console.log(data);
      if (data.type === 'notification') {
        toast.success(data.message)
      };
      switch (data.type) {
       
        
        case 'playerList':
          setPlayers(data.players)
          break;
        case 'notification':
          setMessages(prevMessages => [...prevMessages, data.message]);
          break;

        case "user_joined":
          setPlayers(data.players);
          toast.success(data.message)

        case 'chooseWord':
          setDrawer(true);
          setWords(data.words);
          break;

        case 'startDrawing':
          setDrawer(true);
          setCurrentWord(data.word);
          break;

        case 'draw':
          drawOnCanvas(data.x, data.y);
          break;
        case 'correctGuess':
          setMessages(prevMessages => [...prevMessages, `${data.user} guessed the word correctly`]);
          break;

        case 'chat':
          setMessages(prevMessages => [...prevMessages, data.message]);
          break;

        case 'timer':
          setTimeRemaining(data.timeRemaining);
          break;
        case 'timesUp':
          toast.warning("time over");
          break;

        case 'winner':
          toast.success(`${data.user} won with ${data.score} points`);
          break;

        case 'error':
          toast.error("Error occured", data.message);
          break;
      }

    }

    return (() => {
      currws[0].close()
    })
  }, [])

  const handleStartGame = () => {
    currws[0].send(JSON.stringify({ type: "start_game" }))
  };

  const handleSendMessage = (message) => {
    currws[0].send(JSON.stringify({ type: isDrawer ? 'chat' : 'guess', message }));
  }
  const { canvasRef,onMouseDown } = useDraw(drawLine);
  function drawLine({ ctx, previousPoint, currentPoint }) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = "#000";
    const lineWidth=4;

    let startPoint = previousPoint ?? currentPoint;

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x,startPoint.y);
    ctx.lineTo(currX,currY);
    ctx.stroke()
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x,startPoint.y,2,0,2*Math.PI)
    ctx.fill();

  }
  return (
    <div>
      <div id="header" className='w-full h-full flex justify-around mt-5'>
        {roomid}


        <div id="id_with_players w-1/3 h-full">
          <div id="clock" className='w-full h-full  text-white'>Clock</div>
        </div>


        <div id='word_with_canvas' className='w-1/3 h-full'>
          <div id='guessing_word' className='w-full bg-black text-white'>Guessing word</div>
          <div>
            <canvas onMouseDown={onMouseDown} ref={canvasRef} height={300} width={300} className='border border-black rounded-lg'></canvas>
          </div>

        </div>

        {/* <div id='players_chat' className='w-1/3 h-full'>
          <div className='w-full bg-black text-white'>Players chat</div>
          {users.map((user)=>(<li>{user}</li>))}
        </div> */}

      </div>
    </div>
  )
}

export default Main