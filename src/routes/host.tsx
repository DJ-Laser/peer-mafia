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
import { useCallback, useMemo, useRef, useState } from "react";
import { useHref } from "react-router";
import { twMerge } from "tailwind-merge";
import { Card } from "../components/generic/Card";
import { GameState, HostConnection, Player } from "../game/host";
import { Role } from "../game/role";
import { useCopy } from "../hooks/useCopy";
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
  const playUrlPath = useHref(`/play/${roomCode}`, { relative: "path" });

  const playUrlDisplay = window.location.hostname + playUrlPath;
  const playUrl = window.location.origin + playUrlPath;

  const [copyRoomCode, roomCodeCopied] = useCopy(roomCode, 750);
  const [copyPlayUrl, playUrlCopied] = useCopy(playUrl, 750);

  return (
    <Card className="flex justify-between">
      <div className="flex">
        <div className="hidden lg:block py-1 space-y-1.5">
          <h1 className="text-3xl font-semibold">Host Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage your mafia game</p>
        </div>

        <div className="hidden lg:block ml-5 mr-2 border border-slate-400" />

        <div className="space-y-0.5">
          <button
            className="relative px-3 py-1 hover:bg-slate-700 rounded-lg transition-colors duration-200"
            onClick={copyRoomCode}
          >
            <h1
              className={`text-3xl font-semibold ${roomCodeCopied ? "invisible" : ""}`}
            >
              {roomCode}
            </h1>
            <p
              className={twMerge(
                "absolute top-1/2 left-1/2 -translate-1/2 text-xl font-semibold invisible",
                roomCodeCopied ? "visible" : "",
              )}
            >
              Copied!
            </p>
          </button>
          <p className="px-3 text-slate-400 text-sm">Click to copy</p>
        </div>
      </div>
      <div className="space-y-0.5 shrink overflow-x-hidden">
        <button
          className="ml-auto px-3 py-1 h-11 flex items-center space-x-3 hover:bg-slate-700 rounded-lg transition-colors duration-200"
          onClick={copyPlayUrl}
        >
          <LinkIcon />
          <div className="relative">
            <h3
              className={`font-semibold text-xl ${playUrlCopied ? "invisible" : ""}`}
            >
              Copy Link
            </h3>
            <p
              className={twMerge(
                "absolute top-1/2 left-1/2 -translate-1/2 text-xl font-semibold invisible",
                playUrlCopied ? "visible" : "",
              )}
            >
              Copied!
            </p>
          </div>
        </button>
        <p className="text-slate-400 text-sm whitespace-nowrap overflow-x-hidden text-ellipsis">
          {playUrlDisplay}
        </p>
      </div>
    </Card>
  );
}

interface RoleSelectorProps {
  player: Player;
  availableRoles: Role[];
  dispatch: HostDispatch;
}

function RoleSelector({ player, availableRoles, dispatch }: RoleSelectorProps) {
  return (
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
          <option key={role.name} value={role.name} className="bg-slate-600">
            {role.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

interface AliveDeadSelectorProps {
  player: Player;
  dispatch: HostDispatch;
}

function AliveDeadSelector({ player, dispatch }: AliveDeadSelectorProps) {
  return (
    <div className="relative">
      <select
        value={player.alive ? "alive" : "dead"}
        onChange={(e) => {
          const value = e.target.value;
          console.log(e.target.value);
          console.log(player.alive);

          dispatch({
            action: "setLiving",
            player,
            alive: value === "alive",
          });
        }}
        className="appearance-none bg-slate-600 border border-slate-500 rounded-lg px-3 py-1 pr-8 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-500"
      >
        <option value="alive" className="bg-slate-600">
          Alive
        </option>
        <option value="dead" className="bg-slate-600">
          Dead
        </option>
      </select>
      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

interface KickPlayerButtonProps {
  player: Player;
  onKick: (reason: string) => void;
}

function KickPlayerButton({ player, onKick }: KickPlayerButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [kickReason, setKickReason] = useState("");

  return (
    <>
      <dialog
        className="fixed min-w-1/3 min-h-3/4 top-1/2 left-1/2 -translate-1/2 bg-transparent"
        ref={dialogRef}
        onClose={() => setKickReason("")}
      >
        <Card className="text-center space-y-6">
          <h3 className="text-3xl font-bold text-white">Kick {player.name}</h3>
          <input
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200"
            placeholder="Reason for kicking..."
            value={kickReason}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                onKick(kickReason);
              }
            }}
            onChange={(e) => setKickReason(e.target.value)}
          />
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 rounded-md hover:scale-105 disabled:scale-none bg-slate-50 text-l font-semibold border border-transparent cursor-pointer transition-all duration-200"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-md hover:scale-105 disabled:scale-none bg-red-600 text-l font-semibold text-white border border-transparent cursor-pointer transition-all duration-200"
              onClick={() => onKick(kickReason)}
            >
              Kick
            </button>
          </div>
        </Card>
      </dialog>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => dialogRef.current?.showModal()}
          className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          <UserXIcon className="w-4 h-4" />
          <span>Kick</span>
        </button>
      </div>
    </>
  );
}

interface PlayerInfoProps {
  player: Player;
  availableRoles: Role[];
  gameStarted: boolean;
  dispatch: HostDispatch;
}

function PlayerInfo({
  player,
  availableRoles,
  gameStarted,
  dispatch,
}: PlayerInfoProps) {
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
            {gameStarted ? (
              <div className="flex space-x-4 items-center">
                <p className={`font-semibold ${team.textClass}`}>
                  {player.role.name}
                </p>
                <AliveDeadSelector player={player} dispatch={dispatch} />
              </div>
            ) : (
              <RoleSelector
                player={player}
                availableRoles={availableRoles}
                dispatch={dispatch}
              />
            )}
          </div>
        </div>

        <KickPlayerButton
          player={player}
          onKick={(reason) =>
            dispatch({
              action: "kickPlayer",
              player,
              reason: reason == "" ? undefined : reason,
            })
          }
        />
      </div>
    </Card>
  );
}

interface PlayerListProps {
  players: Player[];
  availableRoles: Role[];
  gameStarted: boolean;
  dispatch: HostDispatch;
}

function PlayerList({
  players,
  availableRoles,
  gameStarted,
  dispatch,
}: PlayerListProps) {
  const playersList = players
    .filter((player) => player.connected && player.name !== null)
    .map((player) => (
      <PlayerInfo
        key={player.uuid}
        player={player}
        availableRoles={availableRoles}
        gameStarted={gameStarted}
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
  | { action: "kickPlayer"; player: Player; reason?: string }
  | { action: "changeRole"; player: Player; role: Role }
  | { action: "setLiving"; player: Player; alive: boolean };

type HostDispatch = (action: HostAction) => void;

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
          hostConnection.setgameStarted(true);
          break;
        }

        case "endGame": {
          hostConnection.setgameStarted(false);
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
