import { Player } from "../../game/host";
import { Role } from "../../game/role";

export type HostAction =
  | { action: "startGame" }
  | { action: "endGame" }
  | { action: "kickPlayer"; player: Player; reason?: string }
  | { action: "changeRole"; player: Player; role: Role }
  | { action: "setLiving"; player: Player; alive: boolean };

export type HostDispatch = (action: HostAction) => void;
