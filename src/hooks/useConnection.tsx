import EventEmitter from "eventemitter3";
import { useEffect, useState } from "react";
import { Connection } from "../components/connection/connection";
import { Notifier } from "../components/notifications/notifier";

export function useConnection<
  E extends EventEmitter.ValidEventTypes,
  C extends Connection<E>,
>(notifier: Notifier, fn: () => C): C | undefined {
  const [connection, setConnection] = useState<C | undefined>(undefined);

  useEffect(() => {
    const innerConnection = fn();
    setConnection(innerConnection);

    innerConnection.on("error", (error: string) =>
      notifier.setNotification({ color: "error", text: error }),
    );

    return () => {
      innerConnection.destroy();
    };
  }, [fn, notifier]);

  return connection;
}
