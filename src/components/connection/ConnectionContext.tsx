import {
  createRequiredContext,
  RequiredContext,
} from "../../util/RequiredContext";
import { Connection } from "./connection";

export const ConnectionContext: RequiredContext<Connection> =
  createRequiredContext();
