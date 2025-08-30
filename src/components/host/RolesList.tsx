import { twMerge } from "tailwind-merge";
import { Player } from "../../game/host";
import { Role } from "../../game/role";
import { Card } from "../generic/Card";

interface RoleAmount {
  total: number;
  alive: number;
}

interface RoleInfoProps {
  role: Role;
  amount: RoleAmount;
  showAliveVsDead: boolean;
}

function RoleInfo({ role, amount, showAliveVsDead }: RoleInfoProps) {
  const team = role.team;

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

interface RolesListProps {
  players: Player[];
  availableRoles: Role[];
  showAliveVsDead: boolean;
}

export function RolesList({
  players,
  availableRoles,
  showAliveVsDead,
}: RolesListProps) {
  const roleAmounts: Map<Role, RoleAmount> = new Map();

  for (const role of availableRoles) {
    roleAmounts.set(role, {
      total: 0,
      alive: 0,
    });
  }

  for (const player of players) {
    const amounts = roleAmounts.get(player.role);
    if (amounts === undefined) continue;

    amounts.total += 1;
    amounts.alive += player.alive ? 1 : 0;
  }

  const rolesList = [];

  for (const [role, amount] of roleAmounts.entries()) {
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
      <h1 className="text-3xl font-semibold">Roles</h1>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">{rolesList}</ul>
    </Card>
  );
}
