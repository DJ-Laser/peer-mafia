import { ArrowUpDownIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { RoleData, RoleId, TeamId } from "../../game/roles/roles";
import { useRequiredContext } from "../../util/RequiredContext";
import { Accordian } from "../generic/Accordion";
import { Card } from "../generic/Card";
import { HostDispatch } from "./hostAction";
import { RoleStateContext } from "./RoleStateContext";

interface TeamDropdownProps {
  teamId: TeamId;
  dispatch: HostDispatch;
  roles?: [RoleId, RoleData][];
}

function TeamDropdown({ teamId, roles, dispatch }: TeamDropdownProps) {
  const currentRoleState = useRequiredContext(RoleStateContext);
  const team = currentRoleState.getTeam(teamId);
  const bgClasses = [team.bgClass, team.borderClass];

  return (
    <Accordian secondary className={twMerge("p-4", bgClasses, team.textClass)}>
      <summary className="text-2xl font-bold text-white">{team.name}</summary>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {roles?.map(([roleId, role]) => {
          const enabled = currentRoleState.isRoleEnabled(roleId);

          return (
            <button
              key={roleId}
              onClick={() => {
                dispatch({
                  action: "setRoleEnabled",
                  roleId,
                  enabled: !enabled,
                });
              }}
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
  const currentRoleState = useRequiredContext(RoleStateContext);
  const currentRolePack = currentRoleState.rolePack;

  const rolesByTeamId = Object.groupBy(
    Object.entries(currentRolePack.roles),
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
          teamId={teamId}
          roles={roles}
          dispatch={dispatch}
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
