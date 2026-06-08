import { DataConnection } from "peerjs";
import { Connection, ID_NUM_CHARS } from "./connection";
import {
  exampleRoleData,
  RoleCollection,
  RoleData,
  RoleId,
  TeamData,
  TeamId,
} from "./roles";
import {
  Message,
  PlayerConnectionMetadata,
  SharedGameplayState,
  SharedPlayerState,
  SharedPreGameState,
} from "./sharedData";

export interface HostEvents {
  stateChange: GameState;
}

export interface Player {
  uuid: string;
  name: string | null;
  connection: DataConnection;
  connected: boolean;
  alive: boolean;
  roleId: RoleId;
}

export class RoleState {
  roleCollection: Readonly<RoleCollection>;
  roleEnableState: Record<RoleId, boolean>;

  constructor(roleCollection: RoleCollection, enabledRoleIds?: RoleId[]) {
    if (enabledRoleIds === undefined) {
      enabledRoleIds = roleCollection.defaultRoles;
    }

    this.roleCollection = roleCollection;
    this.roleEnableState = Object.keys(roleCollection.roles).reduce<
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
    return this.roleCollection.roles[roleId];
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
    return this.roleCollection.teams[teamId];
  }

  getTeamFor(role: RoleId | RoleData): TeamData {
    if (typeof role === "string") {
      role = this.getRole(role);
    }

    return this.getTeam(role.teamId);
  }
}

export interface GameState {
  players: Player[];
  gameStarted: boolean;
  roleState: RoleState;
}

export class HostConnection extends Connection<HostEvents> {
  static generateRoomId(): string {
    return Connection.generateId(ID_NUM_CHARS);
  }

  static generatePeerId(roomId: string) {
    return `DJLASER-mafia-room-${roomId}`;
  }

  readonly roomId: string;
  state: GameState = {
    players: [],
    gameStarted: false,
    roleState: new RoleState(exampleRoleData),
  };

  private get players() {
    return this.state.players;
  }

  private get roleState(): RoleState {
    return this.state.roleState;
  }

  constructor() {
    const roomId = HostConnection.generateRoomId();
    super(HostConnection.generatePeerId(roomId));

    this.roomId = roomId;
  }

  private sendPlayerState(player: Player) {
    let stageDependentState: SharedPreGameState | SharedGameplayState;

    if (this.state.gameStarted) {
      const playerRole = this.roleState.getRole(player.roleId);
      stageDependentState = {
        gameStarted: true,
        roleState: {
          roleName: playerRole.name,
          roleDescription: playerRole.description,
          primaryTeam: this.roleState.getTeamFor(playerRole),
        },
        alive: player.alive,
      };
    } else {
      stageDependentState = {
        gameStarted: false,
        roleState: null,
      };
    }

    const playerState: SharedPlayerState = {
      playerName: player.name,
      ...stageDependentState,
    };

    this.sendToPlayer(player, { type: "StateUpdate", newState: playerState });
  }

  private emitStateEvent() {
    this.emit("stateChange", this.state);
  }

  private updateAllPlayers() {
    for (const player of this.players) {
      this.sendPlayerState(player);
    }

    this.emitStateEvent();
  }

  private onPlayerData(player: Player, message: Message) {
    switch (message.type) {
      case "NameChange": {
        player.name = message.name;
        this.sendPlayerState(player);
        this.emitStateEvent();

        break;
      }

      case "LeaveRoom": {
        this.removePlayer(player);

        break;
      }

      default: {
        console.log(`Unexpexted message: ${message.type}`);
        this.emit("error", `Unexpexted message: ${message.type}`);
      }
    }
  }

  protected onReady(id: string): void {
    console.log(`Hosting id: ${id}`);
  }

  protected handleConnection(connection: DataConnection): void {
    const metadata: PlayerConnectionMetadata = connection.metadata;
    let newPlayer: Player;
    let updateExistingPlayer = false;

    for (const player of this.players) {
      if (player.uuid === metadata.playerUuid) {
        newPlayer = player;
        updateExistingPlayer = true;
        break;
      }
    }

    newPlayer ??= {
      uuid: metadata.playerUuid,
      name: null,
      connected: false,
      connection: connection,
      alive: true,
      roleId: this.roleState.defaultRoleId,
    };

    newPlayer.connected = true;
    newPlayer.connection = connection;

    connection.on("open", () => {
      this.sendPlayerState(newPlayer);
    });

    connection.on("close", () => {
      newPlayer.connected = false;
      this.emitStateEvent();
    });

    connection.on("data", (message) => {
      this.onPlayerData(newPlayer, message as Message);
    });

    if (!updateExistingPlayer) {
      this.players.push(newPlayer);
    }

    this.sendPlayerState(newPlayer);
    this.emitStateEvent();
  }

  protected handleError(): boolean {
    return false;
  }

  destroy(): void {
    for (const player of this.players) {
      player.connection.close();
    }

    super.destroy();
  }

  protected sendToPlayer(
    player: Player,
    message: Message,
  ): void | Promise<void> {
    return this.sendMessage(player.connection, message);
  }

  setRole(player: Player, roleId: RoleId) {
    player.roleId = roleId;

    this.sendPlayerState(player);
    this.emitStateEvent();
  }

  setLiving(player: Player, alive: boolean) {
    player.alive = alive;

    this.sendPlayerState(player);
    this.emitStateEvent();
  }

  setGameStarted(gameStarted: boolean) {
    this.state.gameStarted = gameStarted;
    for (const player of this.players) {
      player.alive = true;
    }

    this.updateAllPlayers();
  }

  private removePlayer(player: Player) {
    player.connected = false;
    this.players.splice(this.players.indexOf(player), 1);
    this.emitStateEvent();

    setTimeout(() => player.connection.close(), 500);
  }

  kickPlayer(player: Player, reason?: string) {
    this.sendToPlayer(player, { type: "Kicked", reason: reason ?? null });
    this.removePlayer(player);
  }

  setRoleEnabled(roleId: RoleId, enabled: boolean) {
    this.roleState.roleEnableState[roleId] = enabled;
    this.emitStateEvent();
  }
}
