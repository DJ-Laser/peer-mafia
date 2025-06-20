import {
  createRequiredContext,
  RequiredContext,
} from "../../util/RequiredContext";
import { Notifier } from "./notifier";

export const NotifierContext: RequiredContext<Notifier> =
  createRequiredContext();
