import { RoleData, RoleId, RolePack, TeamData, TeamId } from "./roles/roles";

export class RoleState {
  rolePack: Readonly<RolePack>;
  roleEnableState: Record<RoleId, boolean>;

  constructor(rolePack: RolePack, enabledRoleIds?: RoleId[]) {
    if (enabledRoleIds === undefined) {
      enabledRoleIds = rolePack.defaultRoles;
    }

    this.rolePack = rolePack;
    this.roleEnableState = Object.keys(rolePack.roles).reduce<
      Record<string, boolean>
    >((record, roleId) => {
      record[roleId] = enabledRoleIds.includes(roleId);
      return record;
    }, {});
  }

  isRoleEnabled(roleId: RoleId): boolean {
    return this.roleEnableState[roleId];
  }

  getRole(roleId: RoleId): RoleData {
    return this.rolePack.roles[roleId];
  }

  private get enabledRoleIds(): RoleId[] {
    return Object.entries(this.roleEnableState)
      .filter(([, enabled]) => enabled)
      .map(([roleId]) => roleId);
  }

  get enabledRoles(): Record<string, RoleData> {
    return this.enabledRoleIds.reduce<Record<string, RoleData>>(
      (record, roleId) => {
        record[roleId] = this.getRole(roleId);
        return record;
      },
      {},
    );
  }

  get defaultRoleId(): RoleId {
    return this.enabledRoleIds[0];
  }

  getTeam(teamId: TeamId): TeamData {
    return this.rolePack.teams[teamId];
  }

  getTeamFor(role: RoleId | RoleData): TeamData {
    if (typeof role === "string") {
      role = this.getRole(role);
    }

    return this.getTeam(role.teamId);
  }
}
