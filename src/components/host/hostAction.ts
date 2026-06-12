import { Player } from "../../game/host";
import { RoleId } from "../../game/roles/roles";

export type HostAction =
  | { action: "startGame" }
  | { action: "endGame" }
  | { action: "setRoleEnabled"; roleId: RoleId; enabled: boolean }
  | { action: "kickPlayer"; player: Player; reason?: string }
  | { action: "changeRole"; player: Player; roleId: RoleId }
  | { action: "setLiving"; player: Player; alive: boolean };

export type HostDispatch = (action: HostAction) => void;
