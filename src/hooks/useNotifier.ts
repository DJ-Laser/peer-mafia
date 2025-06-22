import { Notifier } from "../components/notifications/notifier";
import {
  createRequiredContext,
  RequiredContext,
  useRequiredContext,
} from "../util/RequiredContext";

export const NotifierContext: RequiredContext<Notifier> =
  createRequiredContext();

export function useNotifier() {
  return useRequiredContext(NotifierContext);
}
