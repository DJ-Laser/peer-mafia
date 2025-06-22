import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { PlayerConnection } from "../game/player";
import { useNotifier } from "../hooks/useNotifier";
import { Route } from "./+types/play";

export type PlayConnectionData =
  | {
      success: true;
      connection: PlayerConnection;
    }
  | { success: false; error: string };

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<PlayConnectionData> {
  const connection = new PlayerConnection(params.roomId);

  const readyPromise = new Promise<PlayConnectionData>((resolve) => {
    connection.on("roomJoined", () =>
      resolve({
        success: true,
        connection: connection,
      }),
    );

    connection.on("roomNotFound", (error: string) => {
      resolve({
        success: false,
        error,
      });
    });
  });

  return await readyPromise;
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

  const playerConnection: PlayerConnection | null = useMemo(() => {
    if (!loaderData.success) {
      return null;
    }

    const connection = loaderData.connection;

    connection.on("error", (error: string) =>
      notifier.setNotification({ color: "error", text: error }),
    );

    return connection;
  }, [notifier, loaderData]);

  if (playerConnection === null) {
    // Were navigating back anyway
    return;
  }

  return (
    <div className="mx-auto my-0 max-w-320 w-fit p-8 text-center">
      <h1 className="text-2xl">Playing</h1>
      <h1 className="text-xl">Code: {playerConnection.roomId ?? ""}</h1>
    </div>
  );
}
