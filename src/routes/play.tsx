import { useCallback } from "react";
import { useNavigate } from "react-router";
import { PlayerConnection } from "../game/player";
import { useConnection } from "../hooks/useConnection";
import { useNotifier } from "../hooks/useNotifier";
import { Route } from "./+types/play";

export default function Component({ params }: Route.ComponentProps) {
  const notifier = useNotifier();
  const navigate = useNavigate();

  const playerConnection = useConnection(
    notifier,
    useCallback(() => {
      const connection = new PlayerConnection(params.roomId);
      connection.on("roomNotFound", (error: string) => {
        notifier.setNotification({ color: "error", text: error });
        navigate("/");
      });

      return connection;
    }, [navigate, notifier, params.roomId]),
  );

  return (
    <div className="mx-auto my-0 max-w-320 w-fit p-8 text-center">
      <h1 className="text-2xl">Playing</h1>
      <h1 className="text-xl">Code: {playerConnection?.roomId ?? ""}</h1>
    </div>
  );
}
