import HomePage from './components/HomePage'
import Game from './components/Game'
import { useRecoilState, useRecoilValue } from 'recoil'
import { roomCreatedState, roomIdState, roomJoinedState, wsState } from '../recoil/atoms/atoms'
import { useEffect } from 'react'



function App() {

  const [ws,setWs] = useRecoilState(wsState);
  const roomId = useRecoilValue(roomIdState);
  const roomJoined = useRecoilValue(roomJoinedState);
  const roomCreated = useRecoilValue(roomCreatedState);

  useEffect(()=>{
    if(!ws){
      const websocket = new WebSocket("ws://localhost:8080");
      setWs(websocket)
      console.log("Connection done");
      
    }
    return()=>{
      if(ws) ws.close();
    }
  },[ws,setWs])

  return (
    <>
    {
      roomJoined||roomCreated?<Game />:<HomePage />
    }
    
  
    </>
  )
}

export default App
