import { atom } from "recoil";


export const roomIdState = atom({
    key:"roomIdState",
    default:""
})

export const roomCreatedState = atom({
    key:'roomCreatedState',
    default:false
})

export const roomJoinedState = atom({
    key:"roomJoinedState",
    default:false
})

export const wsState = atom({
    key:"wsState",
    default:null
})
export const playersState = atom({
    key:"playersState",
    default:[]
})

export const usernameState = atom({
    key:"usernameState",
    default:""
})

export const isGameStartedState = atom({
    key:"isGameStartedState",
    default:false
})

export const timeRemainingState = atom({
    key:"timeRemainingState",
    default:""
})

export const messagesState =atom({
    key:'messagesState',
    default:[]
})

export const currentWordState = atom({
    key:"currentWordState",
    default:""
})

export const scoresState = atom({
    key:"scoresState",
    default:""
})

export const isDrawerState = atom({
    key:"isDrawerState",
    default:false
})

export const wordsState = atom({
    key:"wordsState",
    default:[]
})