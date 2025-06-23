import { Role } from "./role";

export type Message =
  | { type: "StateUpdate"; newState: SharedPlayerState }
  | { type: "NameChange"; name: string };

export interface PlayerConnectionMetadata {
  playerUuid: string;
}

export interface SharedPreGameState {
  role: null;
  gameStarted: false;
}

export interface SharedGameplayState {
  role: Role;
  gameStarted: true;
}

export type SharedPlayerState = {
  playerName: string | null;
} & (SharedPreGameState | SharedGameplayState);
