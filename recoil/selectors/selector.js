import { selector } from "recoil";
import {
  roomIdState,
  roomCreatedState,
  roomJoinedState,
  wsState,
  playersState,
  usernameState,
  isGameStartedState,
  timeRemainingState,
  messagesState,
  currentWordState,
  scoresState,
  isDrawerState,
  wordsState,
} from "../atoms/atoms"; // Adjust the import path accordingly

export const resetAllState = selector({
  key: 'resetAllState',
  get: () => {}, // Required, can return undefined
  set: ({ set }) => {
    set(roomIdState, "");
    set(roomCreatedState, false);
    set(roomJoinedState, false);
    set(wsState, null);
    set(playersState, []);
    set(usernameState, "");
    set(isGameStartedState, false);
    set(timeRemainingState, "");
    set(messagesState, []);
    set(currentWordState, "");
    set(scoresState, "");
    set(isDrawerState, false);
    set(wordsState, []);
  },
});
