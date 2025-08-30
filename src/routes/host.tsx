import { useCallback, useMemo, useState } from "react";
import { GameStatus } from "../components/host/GameStatus";
import { Header } from "../components/host/Header";
import { HostAction } from "../components/host/hostAction";
import { PlayerList } from "../components/host/PlayerList";
import { RolesList } from "../components/host/RolesList";
import { GameState, HostConnection } from "../game/host";
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
    initialState: connection.state,
  };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const notifier = useNotifier();

  const [gameState, setGameState] = useState<GameState>(
    loaderData.initialState,
  );

  const validPlayers = gameState.players.filter(
    (player) => player.name !== null,
  );

  const hostConnection = useMemo(() => {
    const connection = loaderData.connection;

    connection.on("stateChange", (state: GameState) => {
      setGameState({ ...state });
    });

    connection.on("error", (error: string) =>
      notifier.setNotification({ color: "error", text: error }),
    );

    return connection;
  }, [loaderData.connection, notifier]);

  const dispatch = useCallback(
    (action: HostAction) => {
      switch (action.action) {
        case "changeRole": {
          hostConnection.setRole(action.player, action.role);
          break;
        }

        case "setLiving": {
          hostConnection.setLiving(action.player, action.alive);
          break;
        }

        case "kickPlayer": {
          hostConnection.kickPlayer(action.player, action.reason);
          break;
        }

        case "startGame": {
          hostConnection.setGameStarted(true);
          break;
        }

        case "endGame": {
          hostConnection.setGameStarted(false);
          break;
        }
      }
    },
    [hostConnection],
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Header roomCode={hostConnection.roomId} />
      <GameStatus
        players={validPlayers}
        gameStarted={gameState.gameStarted}
        dispatch={dispatch}
      />
      <RolesList
        players={validPlayers}
        availableRoles={gameState.availableRoles}
        showAliveVsDead={gameState.gameStarted}
      />
      <PlayerList
        players={validPlayers}
        availableRoles={gameState.availableRoles}
        gameStarted={gameState.gameStarted}
        dispatch={dispatch}
      />
    </div>
  );
}
