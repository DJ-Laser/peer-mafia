export type PlayerCondition =
  | { type: "hasRole"; role: RoleId }
  | { type: "hasTeam"; team: TeamId }
  | { type: "hasStatus"; status: StatusId }
  | { type: "custom"; description: string };

export type PlayerTarget =
  | { type: "self" }
  | { type: "choosePlayers"; count: number }
  | { type: "custom"; description: string };

export type TeamId = string;
export interface TeamData {
  name: string;
  description: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

export type RoleId = string;
export interface RoleData {
  name: string;
  description: string;
  teamId: TeamId;
  onDeathAction?: ActionId[];
  relevantStatuses?: StatusId[];
}

export type StatusEffect = {
  type: "overrideTeam";
  team: TeamId;
};

export type StatusId = string;
export interface StatusData {
  name: string;
  description: string;
  effects?: StatusEffect[];
  shownToPlayers: boolean;
}

export type ActionEffect =
  | { type: "applyStatus"; status: StatusId }
  | { type: "removeStatus"; status: StatusId }
  | { type: "preventOnDeath" }
  | { type: "killPlayers" }
  | { type: "revealRole" }
  | { type: "revealTeam" }
  | { type: "custom"; description: string };

export type ActionId = string;
export interface ActionData {
  name: string;
  description: string;
  applicablePlayers: PlayerCondition;
  targetPlayers: PlayerTarget;
  effects: ActionEffect[];
  maxUses?: number;
}

export interface RoleCollection {
  teams: Record<TeamId, TeamData>;
  roles: Record<RoleId, RoleData>;
  defaultRoles: RoleId[];
  statuses: Record<StatusId, StatusData>;
  actions: Record<ActionId, ActionData>;
  nightActions: ActionId[];
}
