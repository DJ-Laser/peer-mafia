import {
  ChevronDownIcon,
  GhostIcon,
  LinkIcon,
  PlayIcon,
  SquareIcon,
  UserIcon,
  UsersIcon,
  UserXIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useHref } from "react-router";
import { twMerge } from "tailwind-merge";
import { Card } from "../components/generic/Card";
import { GameState, HostConnection, Player } from "../game/host";
import { Role } from "../game/role";
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

interface HeaderProps {
  roomCode: string;
}

function Header({ roomCode }: HeaderProps) {
  const playUrl =
    window.location.host + useHref(`/play/${roomCode}`, { relative: "path" });

  return (
    <Card className="flex justify-between">
      <div className="flex">
        <div className="hidden lg:block py-1 space-y-1.5">
          <h1 className="text-3xl font-semibold">Host Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage your mafia game</p>
        </div>

        <div className="hidden lg:block ml-5 mr-2 border border-slate-400" />

        <div className="space-y-0.5">
          <button className="px-3 py-1 hover:bg-slate-700 rounded-lg transition-colors duration-200">
            <h1 className="text-3xl font-semibold">{roomCode}</h1>
          </button>
          <p className="px-3 text-slate-400 text-sm">Click to copy</p>
        </div>
      </div>
      <div className="space-y-0.5 shrink overflow-x-hidden">
        <button className="ml-auto px-3 py-1 h-11 flex items-center space-x-5 hover:bg-slate-700 rounded-lg transition-colors duration-200">
          <LinkIcon />
          <h3 className="font-semibold text-xl">Copy Link</h3>
        </button>
        <p className="text-slate-400 text-sm whitespace-nowrap overflow-x-hidden text-ellipsis">
          {playUrl}
        </p>
      </div>
    </Card>
  );
}

interface PlayerInfoProps {
  player: Player;
  availableRoles: Role[];
  dispatch: HostDispatch;
}

function PlayerInfo({ player, availableRoles, dispatch }: PlayerInfoProps) {
  const team = player.role.team;
  const roleColors = `${team.bgClass} ${team.borderClass}`;

  return (
    <Card
      secondary
      className={twMerge(player.alive ? roleColors : undefined, "p-4")}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-800/50 border border-slate-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {player.alive ? <UserIcon /> : <GhostIcon />}
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white">{player.name}</h3>
            <div className="relative">
              <select
                value={player.role.name}
                onChange={(e) => {
                  const selectedRoleName = e.target.value;
                  const selectedRole = availableRoles.find(
                    (role) => role.name === selectedRoleName,
                  );

                  if (selectedRole === undefined) {
                    return;
                  }

                  dispatch({
                    action: "changeRole",
                    player,
                    role: selectedRole,
                  });
                }}
                className="appearance-none bg-slate-600 border border-slate-500 rounded-lg px-3 py-1 pr-8 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-500"
              >
                {availableRoles.map((role) => (
                  <option
                    key={role.name}
                    value={role.name}
                    className="bg-slate-600"
                  >
                    {role.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch({ action: "kick", player })}
            className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <UserXIcon className="w-4 h-4" />
            <span>Kick</span>
          </button>
        </div>
      </div>
    </Card>
  );
}

interface PlayerListProps {
  players: Player[];
  availableRoles: Role[];
  dispatch: HostDispatch;
}

function PlayerList({ players, availableRoles, dispatch }: PlayerListProps) {
  const playersList = players
    .filter((player) => player.connected && player.name !== null)
    .map((player) => (
      <PlayerInfo
        key={player.uuid}
        player={player}
        availableRoles={availableRoles}
        dispatch={dispatch}
      />
    ));

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-semibold">Players</h1>
      {playersList}
    </Card>
  );
}

interface RoleInfoProps {
  role: Role;
  amount: number;
}

function RoleInfo({ role, amount }: RoleInfoProps) {
  const team = role.team;

  return (
    <Card secondary className={`p-4 ${team.bgClass} ${team.borderClass}`}>
      <h3 className="font-semibold">{role.name}</h3>
      <p className={twMerge("text-2xl font-bold", team.textClass)}>{amount}</p>
    </Card>
  );
}

interface RolesListProps {
  players: Player[];
  availableRoles: Role[];
}

function RolesList({ players, availableRoles }: RolesListProps) {
  const roleAmounts: Map<Role, number> = new Map();

  for (const role of availableRoles) {
    roleAmounts.set(role, 0);
  }

  for (const player of players) {
    const value = roleAmounts.get(player.role) ?? 0;
    roleAmounts.set(player.role, value + 1);
  }

  const rolesList = [];

  for (const [role, amount] of roleAmounts.entries()) {
    rolesList.push(<RoleInfo key={role.name} role={role} amount={amount} />);
  }

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-semibold">Roles</h1>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">{rolesList}</ul>
    </Card>
  );
}

interface GameStatusProps {
  players: Player[];
  gameStarted: boolean;
  dispatch: HostDispatch;
}

function GameStatus({ players, gameStarted, dispatch }: GameStatusProps) {
  return (
    <Card className="flex justify-between">
      <div className="flex items-center space-x-3">
        <UsersIcon className="w-8 h-8 text-orange-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">Players</h3>
          <p className="text-2xl font-bold text-orange-400">{players.length}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-slate-400">Game Status</p>
          <p className={`font-semibold text-orange-400"`}>
            {gameStarted ? "In Progress" : "Waiting for Players"}
          </p>
        </div>
        <button
          onClick={() =>
            dispatch({ action: gameStarted ? "endGame" : "startGame" })
          }
          className={
            "flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold bg-orange-500 transition-all duration-200 hover:scale-105"
          }
        >
          {gameStarted ? (
            <SquareIcon className="w-4 h-4" />
          ) : (
            <PlayIcon className="w-4 h-4" />
          )}
          <span>{gameStarted ? "Stop Game" : "Start Game"}</span>
        </button>
      </div>
    </Card>
  );
}

type HostAction =
  | { action: "startGame" }
  | { action: "endGame" }
  | { action: "kick"; player: Player }
  | { action: "changeRole"; player: Player; role: Role };

type HostDispatch = (action: HostAction) => void;

export default function Component({ loaderData }: Route.ComponentProps) {
  const notifier = useNotifier();

  const [gameState, setGameState] = useState<GameState>(
    loaderData.initialState,
  );

  const hostConnection = useMemo(() => {
    const connection = loaderData.connection;

    connection.on("stateChange", (state: GameState) => {
      setGameState({ ...state });
      console.log("New state", state);
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

        case "startGame": {
          hostConnection.setgameStarted(true);
          break;
        }

        case "endGame": {
          hostConnection.setgameStarted(false);
          break;
        }
      }

      // TODO: Implement actions
      console.log(action);
      console.log(hostConnection);
    },
    [hostConnection],
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Header roomCode={hostConnection.roomId} />
      <GameStatus
        players={gameState.players}
        gameStarted={gameState.gameStarted}
        dispatch={dispatch}
      />
      <RolesList
        players={gameState.players}
        availableRoles={gameState.availableRoles}
      />
      <PlayerList
        players={gameState.players}
        availableRoles={gameState.availableRoles}
        dispatch={dispatch}
      />
    </div>
  );
}
