import { useCallback } from "react";
import { HostConnection } from "../components/connection/host";
import { getNotifier } from "../components/notifications/notifier";
import { useConnection } from "../hooks/useConnection";

export default function Component() {
  const hostConnection = useConnection(
    useCallback(() => new HostConnection(getNotifier()), []),
  );

  return (
    <div className="mx-auto my-0 max-w-320 w-fit p-8 text-center">
      <h1 className="text-2xl">Hosting</h1>
      <h1 className="text-xl">Code: {hostConnection?.roomId ?? ""}</h1>
    </div>
  );
}
