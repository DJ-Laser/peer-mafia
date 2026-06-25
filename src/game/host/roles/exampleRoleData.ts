import { RolePack } from "./roles";

export const mafiaRoleData = {
  name: "Sam's Mafia Roles",

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

    cult: {
      name: "Cult",
      description: "Recruit members to the cult.",
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
    bomber: {
      name: "Bomber",
      description: "Explode upon death, elimanating nearby players,",
      teamId: "town",
      onDeathAction: ["bomber_explode"],
    },
    cult_leader: {
      name: "Cult Leader",
      description:
        "Secretly induct players into your cult. If every living player is in your cult, You win.",
      teamId: "cult",
    },
    ringleader: {
      name: "Ring leader",
      description: "Chose a player to join the Mafia team on the first night.",
      teamId: "mafia",
    },
    venator: {
      name: "Venator",
      description:
        "Hunt the Mafia. Once per game chose a player to kill.If you die without using this ability you may use it before you die.",
      teamId: "town",
    },
    doppelganger: {
      name: "Doppelganger",
      description:
        "Chose a player. When that player dies, absorb thier powers.",
      teamId: "town",
    },
    sleeper_agent: {
      name: "Sleeper Agent",
      description:
        "Play as a regular townsperson until you are target by mafia. At which point you will be converted.",
      teamId: "town",
    },
    doctor: {
      name: "Doctor",
      description:
        "Chose a player to keep safe at night. You may pick any player, any number of times, once per night.",
      teamId: "town",
    },
  },
  defaultRoles: ["townsperson", "mafia"],

  statuses: {
    cult_member: {
      name: "Cult Member",
      description: "You have been unknowingly inducted into the cult.",
      shownToPlayers: false,
    },
    mafia_convert: {
      name: "Mafia Convert",
      description:
        "Once a harmless townsperson, you are now part of the mafia.",
      effects: [{ type: "overrideTeam", team: "mafia" }],
      shownToPlayers: true,
    },
    doppelganger_target: {
      name: "Doppelganger Target",
      description: "You have been unknowingly targeted by the doppelganger.",
      shownToPlayers: false,
    },
  },

  actions: {
    mafia_kill: {
      name: "Kill Townspeople",
      description: "Choose a person to kill during the night.",

      applicablePlayers: {
        type: "hasTeam",
        team: "mafia",
      },
      targetPlayers: { type: "choosePlayers", count: 1 },
      effects: [{ type: "killPlayers" }],
    },
    detective_investigate: {
      name: "Investigate",
      description:
        "Choose a person to investigate. You will learn which team they are on.",
      applicablePlayers: {
        type: "hasRole",
        role: "detective",
      },
      targetPlayers: { type: "choosePlayers", count: 1 },
      effects: [{ type: "revealTeam" }],
    },
    bomber_explode: {
      name: "Explode",
      description:
        "Blow up the two players to your left and right when you die.",
      applicablePlayers: { type: "hasRole", role: "bomber" },
      targetPlayers: {
        type: "custom",
        description: "The two players to the bomber's left and right",
      },
      effects: [{ type: "killPlayers" }],
    },
    cult_leader_induct: {
      name: "Induct Members",
      description: "Choose a new member to induct into your cult.",
      applicablePlayers: { type: "hasRole", role: "cult_leader" },
      targetPlayers: { type: "choosePlayers", count: 1 },
      effects: [{ type: "applyStatus", status: "cult_member" }],
    },
    ringleader_recruit: {
      name: "Recruit Mafia",
      description: "Choose player to recruit into the mafia.",
      applicablePlayers: { type: "hasRole", role: "ringleader" },
      targetPlayers: { type: "choosePlayers", count: 1 },
      effects: [{ type: "applyStatus", status: "mafia_convert" }],
      maxUses: 1,
    },
    venator_kill: {
      name: "Kill Mafia",
      description: "Once per game, choose a person to kill.",
      applicablePlayers: { type: "hasRole", role: "venator" },
      targetPlayers: { type: "choosePlayers", count: 1 },
      effects: [{ type: "killPlayers" }],
      maxUses: 1,
    },
    doppelganger_target: {
      name: "Choose Target",
      description:
        "Choose a player. When they die, you will absorb their powers.",
      applicablePlayers: { type: "hasRole", role: "doppelganger" },
      targetPlayers: { type: "choosePlayers", count: 1 },
      effects: [{ type: "applyStatus", status: "doppelganger_target" }],
      maxUses: 1,
    },
    sleeper_agent_convert: {
      name: "Convert",
      description:
        "If targetted by the mafia in the night, convert to the mafia instad of dying.",
      applicablePlayers: { type: "hasRole", role: "sleeper_agent" },
      targetPlayers: { type: "self" },
      effects: [
        { type: "preventOnDeath" },
        { type: "applyStatus", status: "mafia_convert" },
      ],
    },
    doctor_save: {
      name: "Save Patient",
      description:
        "Choose a person to save. They will not be able to die in the night.",
      applicablePlayers: {
        type: "hasRole",
        role: "doctor",
      },
      targetPlayers: { type: "choosePlayers", count: 1 },
      effects: [
        {
          type: "custom",
          description: "Make the chosen person unable to die in the night",
        },
      ],
    },
  },
  nightActions: [
    "mafia_kill",
    "cult_leader_induct",
    "detective_investigate",
    "doctor_save",
  ],
} as const satisfies RolePack;

export const werewolfRoleData = {
  name: "Minimal Werewolf Roles",

  teams: {
    werewolves: {
      name: "Werevolves",
      description: "Kill the townspeople in the night.",
      textClass: "text-red-400",
      bgClass: "bg-red-500/10",
      borderClass: "border-red-500/30",
    },

    town: {
      name: "Town",
      description: "Survive and vote out the werewolves.",
      textClass: "text-blue-400",
      bgClass: "bg-blue-500/10",
      borderClass: "border-blue-500/30",
    },
  },

  roles: {
    werewolf: {
      name: "Werewolf",
      description: "Kill the townspeople in the night.",
      teamId: "werewolves",
    },
    townsperson: {
      name: "Townsperson",
      description:
        "You are an innocent townsperson. Survive and vote out the werewolves.",
      teamId: "town",
    },
    detective: {
      name: "Detective",
      description:
        "Search for clues in the night to uncover the identity of the werewolves.",
      teamId: "town",
    },
  },
  defaultRoles: ["town", "werewolf"],

  statuses: {},

  actions: {
    werewolves_kill: {
      name: "Kill Townspeople",
      description: "Choose a person to kill during the night.",

      applicablePlayers: {
        type: "hasTeam",
        team: "werewolves",
      },
      targetPlayers: { type: "choosePlayers", count: 1 },
      effects: [{ type: "killPlayers" }],
    },
    detective_investigate: {
      name: "Investigate",
      description:
        "Choose a person to investigate. You will learn which team they are on.",
      applicablePlayers: {
        type: "hasRole",
        role: "detective",
      },
      targetPlayers: { type: "choosePlayers", count: 1 },
      effects: [{ type: "revealTeam" }],
    },
  },

  nightActions: ["werewolves_kill", "detective_investigate"],
} as const satisfies RolePack;
