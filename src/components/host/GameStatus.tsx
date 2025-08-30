import { PlayIcon, SquareIcon, UsersIcon } from "lucide-react";
import { Player } from "../../game/host";
import { HostDispatch } from "../host/hostAction";
import { Card } from "./Card";

interface GameStatusProps {
  players: Player[];
  gameStarted: boolean;
  dispatch: HostDispatch;
}

export function GameStatus({
  players,
  gameStarted,
  dispatch,
}: GameStatusProps) {
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
