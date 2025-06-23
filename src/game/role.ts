export interface Team {
  textClass: string;
  bgClass: string;
  borderClass: string;
}

export interface Role {
  name: string;
  description: string;
  team: Team;
}

export const exampleTeams = {
  mafia: {
    textClass: "text-red-400",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
  },

  town: {
    textClass: "text-blue-400",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
  },
} as const;

export const exampleRoles = {
  mafia: {
    name: "Mafia",
    description:
      "Eliminate the townspeople in the night. Work with the rest of the mafia to shift the blame in the voting phase.",
    team: exampleTeams.mafia,
  },
  townsperson: {
    name: "Townsperson",
    description:
      "You are an innocent towwnsperson. Survive and vote out the mafia.",
    team: exampleTeams.town,
  },
  detective: {
    name: "Detective",
    description:
      "Search for clues in the night to uncover the identity of the mafia.",
    team: exampleTeams.town,
  },
} as const;
