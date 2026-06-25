import { RoleState } from "../../game/host/RoleState";
import {
  RequiredContext,
  createRequiredContext,
} from "../../util/RequiredContext";

export const RoleStateContext: RequiredContext<Readonly<RoleState>> =
  createRequiredContext();
