import { useMemo, useState } from "react";
import { GameState, HostConnection, Player } from "../game/host";
import { useNotifier } from "../hooks/useNotifier";
import { Route } from "./+types/host";

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
  const connection = new HostConnection();

  const readyPromise = new Promise<void>((resolve) => {
    connection.on("ready", () => resolve());
  });

  await readyPromise;

  return {
    connection,
  };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const notifier = useNotifier();

  const [players, setPlayers] = useState<Player[]>([]);

  const hostConnection = useMemo(() => {
    const connection = loaderData.connection;

    connection.on("stateChange", (newState: GameState) => {
      setPlayers(newState.players);
    });

    connection.on("error", (error: string) =>
      notifier.setNotification({ color: "error", text: error }),
    );

    return connection;
  }, [loaderData.connection, notifier]);

  const playersList = players
    .filter((player) => player.connected && player.name !== null)
    .map((player) => <li key={player.uuid}>{player.name}</li>);

  return (
    <div>
      <div className="mx-auto my-0 max-w-320 w-fit p-8 text-center">
        <h1 className="text-2xl">Hosting</h1>
        <h1 className="text-xl">Code: {hostConnection?.roomId ?? ""}</h1>
      </div>
      <ul>{playersList}</ul>
    </div>
  );
}
