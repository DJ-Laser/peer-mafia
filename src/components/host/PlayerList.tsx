import { ChevronDownIcon, GhostIcon, UserIcon, UserXIcon } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Player } from "../../game/host/host";
import { useRequiredContext } from "../../util/RequiredContext";
import { Card } from "../generic/Card";
import { Dialog } from "../generic/Dialog";
import { HostDispatch } from "./hostAction";
import { RoleStateContext } from "./RoleStateContext";

interface RoleSelectorProps {
  player: Player;
  dispatch: HostDispatch;
}

function RoleSelector({ player, dispatch }: RoleSelectorProps) {
  const enabledRoles = useRequiredContext(RoleStateContext).enabledRoles;

  return (
    <div className="relative w-min">
      <select
        value={player.roleId}
        onChange={(e) => {
          const selectedRoleId = e.target.value;

          dispatch({
            action: "changeRole",
            player,
            roleId: selectedRoleId,
          });
        }}
        className="appearance-none bg-slate-600 border border-slate-500 rounded-lg px-3 py-1 pr-8 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-slate-500"
      >
        {Object.entries(enabledRoles).map(([roleId, role]) => (
          <option key={roleId} value={roleId} className="bg-slate-600">
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [kickReason, setKickReason] = useState("");

  return (
    <>
      <Dialog
        className="min-w-1/3 top-1/8 text-center space-y-6"
        open={dialogOpen}
        onClose={() => {
          setKickReason("");
          setDialogOpen(false);
        }}
      >
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
            onClick={() => setDialogOpen(false)}
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
      </Dialog>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
        >
          <UserXIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Kick</span>
        </button>
      </div>
    </>
  );
}

interface PlayerInfoProps {
  player: Player;
  gameStarted: boolean;
  dispatch: HostDispatch;
}

function PlayerInfo({ player, gameStarted, dispatch }: PlayerInfoProps) {
  const roleState = useRequiredContext(RoleStateContext);
  const team = roleState.getTeamFor(player.roleId);
  const roleColors = `${team.bgClass} ${team.borderClass}`;

  const playerIcon = player.alive ? <UserIcon /> : <GhostIcon />;

  return (
    <Card
      secondary
      className={twMerge(player.alive ? roleColors : undefined, "p-4")}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-800/50 border border-slate-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">{playerIcon}</span>
            </div>
          </div>
          <div>
            <span className="flex gap-2 items-center">
              <h3 className="font-semibold text-white">{player.name}</h3>
              {!player.connected && (
                <p className="text-sm font-medium text-slate-300">
                  (Disconnected)
                </p>
              )}
            </span>
            {gameStarted ? (
              <div className="flex space-x-4 items-center">
                <p className={`font-semibold ${team.textClass}`}>
                  {roleState.getRole(player.roleId).name}
                </p>
                <AliveDeadSelector player={player} dispatch={dispatch} />
              </div>
            ) : (
              <RoleSelector player={player} dispatch={dispatch} />
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
  gameStarted: boolean;
  dispatch: HostDispatch;
}

export function PlayerList({
  players,
  gameStarted,
  dispatch,
}: PlayerListProps) {
  const playersList = players.map((player) => (
    <PlayerInfo
      key={player.uuid}
      player={player}
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
