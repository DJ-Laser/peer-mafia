import { Eye as EyeIcon, EyeOff as EyeOffIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../components/generic/Card";
import { PlayerConnection } from "../../game/player";
import { Role } from "../../game/role";
import { SharedPlayerState } from "../../game/sharedData";
import { useNotifier } from "../../hooks/useNotifier";
import { Route } from "./+types/game";

export type PlayConnectionData = { roomCode: string } & (
  | {
      success: true;
      connection: PlayerConnection;
      initialState: SharedPlayerState;
    }
  | { success: false; error: string }
);

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<PlayConnectionData> {
  const roomCode = params.roomId;
  const connection = new PlayerConnection(roomCode);

  const readyPromise = new Promise<PlayConnectionData>((resolve) => {
    let joined = false;
    let initialState: SharedPlayerState | undefined;

    const tryResolve = () => {
      if (joined && initialState !== undefined) {
        resolve({
          success: true,
          connection: connection,
          initialState,
          roomCode,
        });
      }
    };

    connection.on("roomJoined", () => {
      joined = true;
      tryResolve();
    });

    connection.on("stateChange", (state: SharedPlayerState) => {
      initialState = state;
      tryResolve();
    });

    connection.on("roomNotFound", (error: string) => {
      resolve({
        success: false,
        error,
        roomCode,
      });
    });
  });

  return await readyPromise;
}

interface NameInputScrenProps {
  roomCode: string;
  onSubmit: (name: string) => void;
}

function NameInputScren({ roomCode, onSubmit }: NameInputScrenProps) {
  const [name, setName] = useState("");

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">
          Joining Room {roomCode}
        </h1>
      </div>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="playerName"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Enter Your Name
          </label>
          <input
            type="text"
            id="playerName"
            placeholder="Your display name..."
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all duration-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          disabled={name.length === 0}
          className="w-full py-3 rounded-md hover:scale-105 disabled:scale-none bg-sky-600 disabled:bg-slate-600 text-l font-semibold border border-transparent  cursor-pointer disabled:cursor-not-allowed transition-all duration-200"
          onClick={() => onSubmit(name)}
        >
          Join Game
        </button>
      </div>
    </Card>
  );
}

interface RoleCardProps {
  role: Role;
}

function RoleCard({ role }: RoleCardProps) {
  const [show, setShow] = useState(false);

  const team = role.team;
  const roleClasses = `${team.bgClass} ${team.textClass} ${team.borderClass}`;

  return (
    <Card secondary className={show ? roleClasses : ""}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Your Role</h3>
        <button
          onClick={() => setShow(!show)}
          className="flex items-center space-x-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
        >
          {show ? (
            <EyeOffIcon className="w-4 h-4 text-slate-300" />
          ) : (
            <EyeIcon className="w-4 h-4 text-slate-300" />
          )}
          <span className="text-slate-300 text-sm">
            {show ? "Hide" : "Reveal"}
          </span>
        </button>
      </div>
      {show ? (
        <div className="space-y-3">
          <h4 className={`text-2xl font-bold`}>{role.name}</h4>
          <p className="text-slate-300 leading-relaxed">{role.description}</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <EyeOffIcon className="w-8 h-8 text-slate-400" />
          </div>
        </div>
      )}
    </Card>
  );
}

export default function Component({ loaderData }: Route.ComponentProps) {
  const notifier = useNotifier();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<SharedPlayerState>(
    loaderData.success
      ? loaderData.initialState
      : {
          playerName: null,
          role: null,
          gameStarted: false,
        },
  );

  useEffect(() => {
    if (!loaderData.success) {
      notifier.setNotification({ color: "error", text: loaderData.error });
      navigate("/play");
    }
  }, [loaderData, navigate, notifier]);

  const playerConnection: PlayerConnection | null = useMemo(() => {
    if (!loaderData.success) {
      return null;
    }

    const connection = loaderData.connection;

    connection.on("error", (error: string) =>
      notifier.setNotification({ color: "error", text: error }),
    );

    connection.on("stateChange", (state: SharedPlayerState) =>
      setGameState(state),
    );

    connection.on("connectionLost", () => {
      notifier.setNotification({
        color: "error",
        text: "Lost connection to host, rejoining may be possible",
      });
      navigate("/play");
    });

    connection.on("kickedFromRoom", () => {
      notifier.setNotification({
        color: "warning",
        text: "You were kicked from the room",
      });
      navigate("/play");
    });

    return connection;
  }, [loaderData, navigate, notifier]);

  if (playerConnection === null) {
    // Were navigating back anyway
    return;
  }

  if (gameState.playerName === null) {
    return (
      <NameInputScren
        roomCode={loaderData.roomCode}
        onSubmit={(name) => playerConnection.sendNameChange(name)}
      />
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <h1 className="mb-8 text-3xl text-center font-bold">
        Room {loaderData.roomCode}
      </h1>
      {gameState.gameStarted ? (
        <RoleCard role={gameState.role} />
      ) : (
        <Card secondary className="text-center space-y-3">
          <h2 className="text-xl font-semibold">
            The game has not started yet
          </h2>
          <p className="text-slate-400">{`You'll receive your role once the game starts`}</p>
        </Card>
      )}
    </Card>
  );
}
