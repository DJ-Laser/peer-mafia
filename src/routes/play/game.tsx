import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../../components/generic/Card";
import { PlayerConnection } from "../../game/player";
import { SharedPlayerState } from "../../game/sharedData";
import { useNotifier } from "../../hooks/useNotifier";
import { Route } from "./+types/game";

export type PlayConnectionData = { roomCode: string } & (
  | {
      success: true;
      connection: PlayerConnection;
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
    connection.on("roomJoined", () =>
      resolve({
        success: true,
        connection: connection,
        roomCode,
      }),
    );

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

export default function Component({ loaderData }: Route.ComponentProps) {
  const notifier = useNotifier();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaderData.success) {
      notifier.setNotification({ color: "error", text: loaderData.error });
      navigate("/play");
    }
  }, [loaderData, navigate, notifier]);

  const [name, setName] = useState<string | null>(null);

  const playerConnection: PlayerConnection | null = useMemo(() => {
    if (!loaderData.success) {
      return null;
    }

    const connection = loaderData.connection;

    connection.on("error", (error: string) =>
      notifier.setNotification({ color: "error", text: error }),
    );

    connection.on("stateChange", (state: SharedPlayerState) => {
      setName(state.playerName);
    });

    return connection;
  }, [notifier, loaderData]);

  if (playerConnection === null) {
    // Were navigating back anyway
    return;
  }

  if (name === null) {
    return (
      <NameInputScren
        roomCode={loaderData.roomCode}
        onSubmit={(name) => playerConnection.sendNameChange(name)}
      />
    );
  }

  return (
    <div className="mx-auto my-0 max-w-320 w-fit p-8 text-center">
      <h1 className="text-2xl">Playing</h1>
      <h1 className="text-xl">Code: {playerConnection.roomId ?? ""}</h1>
    </div>
  );
}
