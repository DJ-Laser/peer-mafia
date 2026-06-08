import { twMerge } from "tailwind-merge";
import { useRequiredContext } from "../../util/RequiredContext";
import { Accordian } from "../generic/Accordion";
import { Card } from "../generic/Card";
import { HostDispatch } from "./hostAction";
import { RoleStateContext } from "./RoleStateContext";

export interface RoleManagerProps {
  dispatch: HostDispatch;
  onClose?: () => void;
}

export function RoleManager({ dispatch, onClose }: RoleManagerProps) {
  const currentRoleState = useRequiredContext(RoleStateContext);
  const currentRoleCollection = currentRoleState.roleCollection;

  const rolesByTeamId = Object.groupBy(
    Object.entries(currentRoleCollection.roles),
    ([, role]) => role.teamId,
  );

  return (
    <div className="space-y-6">
      <h3 className="text-3xl text-center font-bold text-white">
        Manage Roles
      </h3>

      {Object.entries(rolesByTeamId).map(([teamId, roles]) => {
        const team = currentRoleState.getTeam(teamId);
        const bgClasses = [team.bgClass, team.borderClass];

        return (
          <Accordian
            key={teamId}
            secondary
            className={twMerge("p-4", bgClasses, team.textClass)}
          >
            <summary className="text-2xl font-bold text-white">
              {team.name}
            </summary>
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
      })}

      <div className="flex justify-end gap-4">
        <button
          className="px-4 py-2 rounded-md hover:scale-105 disabled:scale-none bg-slate-50 text-l font-semibold border border-transparent cursor-pointer transition-all duration-200"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}
