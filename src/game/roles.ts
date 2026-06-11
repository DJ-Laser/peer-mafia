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
}

export interface RoleCollection {
  teams: Record<TeamId, TeamData>;
  roles: Record<RoleId, RoleData>;
  defaultRoles: RoleId[];
}

export const exampleRoleData = {
  teams: {
    mafia: {
      name: "Mafia",
      description: "Eliminate the townspeople in the night.",
      textClass: "text-red-400",
      bgClass: "bg-red-500/10",
      borderClass: "border-red-500/30",
    },

    town: {
      name: "Town",
      description: "Survive and vote out the mafia.",
      textClass: "text-blue-400",
      bgClass: "bg-blue-500/10",
      borderClass: "border-blue-500/30",
    },

    Cult: {
      name: "Cult",
      description: "Cult members",
      textClass: "text-green-400",
      bgClass: "bg-green-500/10",
      borderClass: "border-green-500/30",
    },
  },
  roles: {
    mafia: {
      name: "Mafia",
      description:
        "Eliminate the townspeople in the night. Work with the rest of the mafia to shift the blame in the voting phase.",
      teamId: "mafia",
    },
    townsperson: {
      name: "Townsperson",
      description:
        "You are an innocent townsperson. Survive and vote out the mafia.",
      teamId: "town",
    },
    detective: {
      name: "Detective",
      description:
        "Search for clues in the night to uncover the identity of the mafia.",
      teamId: "town",
    },
    Bomber: {
      name: "Bomber",
      description: "Explode upon death, elimanating nearby players,",
      teamId: "town",
    },
    Cult_Leader: {
      name: "Cult Leader",
      description:
        "Secretly induct players into your cult. If every living player is in your cult, You win.",
      teamId: "Cult",
    },
  },
  defaultRoles: ["townsperson", "mafia"],
} as const satisfies RoleCollection;
