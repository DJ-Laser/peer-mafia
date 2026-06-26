import { ArrowUpDownIcon } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  RoleData,
  RoleId,
  RolePack,
  TeamId,
} from "../../game/host/roles/roles";
import { RoleState } from "../../game/host/RoleState";
import { useRequiredContext } from "../../util/RequiredContext";
import { Accordian } from "../generic/Accordion";
import { Card } from "../generic/Card";
import { HostDispatch } from "./hostAction";
import { RoleStateContext } from "./RoleStateContext";

interface TeamDropdownProps {
  roleState: RoleState;
  teamId: TeamId;
  roles?: [RoleId, RoleData][];
  setRoleEnabled: (roleId: RoleId, enabled: boolean) => void;
}

function TeamDropdown({
  roleState,
  teamId,
  roles,
  setRoleEnabled,
}: TeamDropdownProps) {
  const team = roleState.getTeam(teamId);
  const bgClasses = [team.bgClass, team.borderClass];

  return (
    <Accordian secondary className={twMerge("p-4", bgClasses, team.textClass)}>
      <summary className="text-2xl font-bold text-white">{team.name}</summary>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {roles?.map(([roleId, role]) => {
          const enabled = roleState.isRoleEnabled(roleId);

          return (
            <button
              key={roleId}
              onClick={() => setRoleEnabled(roleId, !enabled)}
            >
              <Card
                secondary
                className={twMerge(
                  "rounded-lg p-2 text-xl font-semibold",
                  enabled ? bgClasses : "text-white",
                )}
              >
                {role.name}
              </Card>
            </button>
          );
        })}
      </div>
    </Accordian>
  );
}

export interface RoleManagerProps {
  dispatch: HostDispatch;
  onClose?: () => void;
}

export function RoleManager({ dispatch, onClose }: RoleManagerProps) {
  const gameRoleState = useRequiredContext(RoleStateContext);
  const [editingRoleState, setEditingRoleState] = useState(gameRoleState);

  const setRoleEnabled = (roleId: RoleId, enabled: boolean) =>
    setEditingRoleState(editingRoleState.withRoleEnabled(roleId, enabled));

  const setRolePack = (rolePack: RolePack) =>
    setEditingRoleState(new RoleState(rolePack));

  const rolesByTeamId = Object.groupBy(
    Object.entries(editingRoleState.rolePack.roles),
    ([, role]) => role.teamId,
  );

  return (
    <div className="space-y-6">
      <h3 className="text-3xl text-center font-bold text-white">
        Manage Roles
      </h3>

      {Object.entries(rolesByTeamId).map(([teamId, roles]) => (
        <TeamDropdown
          key={teamId}
          roleState={editingRoleState}
          teamId={teamId}
          roles={roles}
          setRoleEnabled={setRoleEnabled}
        />
      ))}

      <div className="flex flex-wrap gap-x-4 gap-y-8 justify-between">
        <button
          className="pl-3.5 pr-4 py-2 flex items-center gap-1 rounded-md hover:scale-105 bg-slate-50 font-semibold cursor-pointer transition-transform duration-200"
          onClick={() => {}}
        >
          <ArrowUpDownIcon className="size-5" absoluteStrokeWidth />
          <span className="leading-none">Switch Role Pack</span>
        </button>

        <div className="flex ml-auto">
          <button
            className="px-4 py-2 rounded-md hover:scale-105 bg-slate-50 font-semibold cursor-pointer transition-transform duration-200"
            onClick={() => {
              dispatch({
                action: "updateRoleState",
                roleState: editingRoleState,
              });
              onClose?.();
            }}
          >
            <span className="leading-none">Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
