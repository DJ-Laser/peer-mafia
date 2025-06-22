import { useCallback } from "react";
import { PlayerConnection } from "../components/connection/player";
import { getNotifier } from "../components/notifications/notifier";
import { useConnection } from "../hooks/useConnection";
import { Route } from "./+types/play";

export default function Component({ params }: Route.ComponentProps) {
  const playerConnection = useConnection(
    useCallback(
      () => new PlayerConnection(params.roomId, getNotifier()),
      [params.roomId],
    ),
  );

  return (
    <div className="mx-auto my-0 max-w-320 w-fit p-8 text-center">
      <h1 className="text-2xl">Playing</h1>
      <h1 className="text-xl">Code: {playerConnection?.roomId ?? ""}</h1>
    </div>
  );
}
