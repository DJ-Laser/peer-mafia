import { Role } from "./role";

export type Message =
  | { type: "Kicked"; reason: string | null }
  | { type: "StateUpdate"; newState: SharedPlayerState }
  | { type: "NameChange"; name: string }
  | { type: "LeaveRoom" };

export interface PlayerConnectionMetadata {
  playerUuid: string;
}

export interface SharedPreGameState {
  gameStarted: false;
  role: null;
}

export interface SharedGameplayState {
  gameStarted: true;
  role: Role;
  alive: boolean;
}

export type SharedPlayerState = {
  playerName: string | null;
} & (SharedPreGameState | SharedGameplayState);
