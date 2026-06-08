import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Player } from "../../game/host";
import { RoleData, RoleId } from "../../game/roles";
import { useRequiredContext } from "../../util/RequiredContext";
import { Card } from "../generic/Card";
import { Dialog } from "../generic/Dialog";
import { HostDispatch } from "./hostAction";
import { RoleManager } from "./RoleManager";
import { RoleStateContext } from "./RoleStateContext";

interface RoleAmount {
  total: number;
  alive: number;
}

interface RoleInfoProps {
  role: RoleData;
  amount: RoleAmount;
  showAliveVsDead: boolean;
}

function RoleInfo({ role, amount, showAliveVsDead }: RoleInfoProps) {
  const roleState = useRequiredContext(RoleStateContext);
  const team = roleState.getTeamFor(role);

  const showRoleColors = !showAliveVsDead || amount.alive > 0;
  const bgClasses = showRoleColors
    ? [team.bgClass, team.borderClass]
    : undefined;

  const amountText = showAliveVsDead
    ? `${amount.alive} / ${amount.total}`
    : `${amount.total}`;

  return (
    <Card secondary className={twMerge("p-4", bgClasses)}>
      <h3 className="font-semibold">{role.name}</h3>
      <p className={twMerge("text-2xl font-bold", team.textClass)}>
        {amountText}
      </p>
    </Card>
  );
}

interface ManageRolesButtonProps {
  dispatch: HostDispatch;
}

function ManageRolesButton({ dispatch }: ManageRolesButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        centerY
        className="w-full sm:w-2/3 h-2/3"
      >
        <RoleManager
          dispatch={dispatch}
          onClose={() => setDialogOpen(false)}
        ></RoleManager>
      </Dialog>
      <button
        onClick={() => setDialogOpen(true)}
        className="flex items-center p-2 bg-slate-800 border border-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200"
      >
        <SettingsIcon className="w-5 h-5" />
      </button>
    </>
  );
}

interface RolesListProps {
  dispatch: HostDispatch;
  players: Player[];
  showAliveVsDead: boolean;
}

export function RolesList({
  dispatch,
  players,
  showAliveVsDead,
}: RolesListProps) {
  const roleState = useRequiredContext(RoleStateContext);
  const roleAmounts: Map<RoleId, RoleAmount> = new Map();

  for (const [roleId] of Object.entries(roleState.enabledRoles)) {
    roleAmounts.set(roleId, {
      total: 0,
      alive: 0,
    });
  }

  for (const player of players) {
    const amounts = roleAmounts.get(player.roleId);
    if (amounts === undefined) continue;

    amounts.total += 1;
    amounts.alive += player.alive ? 1 : 0;
  }

  const rolesList = [];

  for (const [roleId, amount] of roleAmounts.entries()) {
    const role = roleState.getRole(roleId);
    rolesList.push(
      <RoleInfo
        key={role.name}
        role={role}
        amount={amount}
        showAliveVsDead={showAliveVsDead}
      />,
    );
  }

  return (
    <Card className="space-y-4">
      <span className="flex justify-between">
        <h1 className="text-3xl font-semibold">Roles</h1>
        <ManageRolesButton dispatch={dispatch} />
      </span>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">{rolesList}</ul>
    </Card>
  );
}
