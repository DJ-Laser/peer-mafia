import { useCallback, useState } from "react";
import {
  GameState,
  HostConnection,
  Player,
} from "../components/connection/host";
import { useConnection } from "../hooks/useConnection";
import { useNotifier } from "../hooks/useNotifier";

export default function Component() {
  const notifier = useNotifier();

  const [players, setPlayers] = useState<Player[]>([]);

  const hostConnection = useConnection(
    notifier,
    useCallback(() => {
      const connection = new HostConnection();

      connection?.on("stateChange", (newState: GameState) => {
        setPlayers(newState.players);
      });

      return connection;
    }, []),
  );

  const playersList = players.map((player) => (
    <li key={player.uuid}>{player.name}</li>
  ));

  console.log("Player Names: ", playersList);

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
