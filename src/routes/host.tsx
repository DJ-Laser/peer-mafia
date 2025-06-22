import { useCallback } from "react";
import { HostConnection } from "../components/connection/host";
import { useConnection } from "../hooks/useConnection";
import { useNotifier } from "../hooks/useNotifier";

export default function Component() {
  const notifier = useNotifier();

  const hostConnection = useConnection(
    notifier,
    useCallback(() => {
      const connection = new HostConnection();

      return connection;
    }, []),
  );

  return (
    <div className="mx-auto my-0 max-w-320 w-fit p-8 text-center">
      <h1 className="text-2xl">Hosting</h1>
      <h1 className="text-xl">Code: {hostConnection?.roomId ?? ""}</h1>
    </div>
  );
}
