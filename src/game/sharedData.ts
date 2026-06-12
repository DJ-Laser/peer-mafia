import { TeamData } from "./roles/roles";

export type Message =
  | { type: "Kicked"; reason: string | null }
  | { type: "StateUpdate"; newState: SharedPlayerState }
  | { type: "NameChange"; name: string }
  | { type: "LeaveRoom" };

export interface PlayerConnectionMetadata {
  playerUuid: string;
}

export interface SharedRoleState {
  roleName: string;
  roleDescription: string;
  primaryTeam: TeamData;
}

export interface SharedPreGameState {
  gameStarted: false;
  roleState: null;
}

export interface SharedGameplayState {
  gameStarted: true;
  roleState: SharedRoleState;
  alive: boolean;
}

export type SharedPlayerState = {
  playerName: string | null;
} & (SharedPreGameState | SharedGameplayState);
