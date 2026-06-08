import { RoleState } from "../../game/host";
import {
  RequiredContext,
  createRequiredContext,
} from "../../util/RequiredContext";

export const RoleStateContext: RequiredContext<Readonly<RoleState>> =
  createRequiredContext();
