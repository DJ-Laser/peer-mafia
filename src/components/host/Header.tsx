import { LinkIcon } from "lucide-react";
import { useHref } from "react-router";
import { twMerge } from "tailwind-merge";
import { useCopy } from "../../hooks/useCopy";
import { Card } from "../generic/Card";

interface HeaderProps {
  roomCode: string;
}

export function Header({ roomCode }: HeaderProps) {
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
