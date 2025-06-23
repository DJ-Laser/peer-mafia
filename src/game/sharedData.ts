export type Message =
  | { type: "StateUpdate"; newState: SharedPlayerState }
  | { type: "NameChange"; name: string };

export interface PlayerConnectionMetadata {
  playerUuid: string;
}

export interface SharedPlayerState {
  playerName: string | null;
}
