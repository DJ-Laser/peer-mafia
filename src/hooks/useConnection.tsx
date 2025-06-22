import { useEffect, useState } from "react";
import { Connection } from "../components/connection/connection";

export function useConnection<C extends Connection>(
  fn: () => C,
): C | undefined {
  const [connection, setConnection] = useState<C | undefined>(undefined);

  useEffect(() => {
    const innerConnection = fn();
    setConnection(innerConnection);

    return () => {
      innerConnection.destroy();
    };
  }, [fn]);

  return connection;
}
