import { DataConnection } from "peerjs";
import { Connection, ID_NUM_CHARS } from "./connection";
import { exampleRoles, Role } from "./role";
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
  role: Role;
}

export interface GameState {
  players: Player[];
  gameStarted: boolean;
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
  };

  private get players() {
    return this.state.players;
  }

  constructor() {
    const roomId = HostConnection.generateRoomId();
    super(HostConnection.generatePeerId(roomId));

    this.roomId = roomId;
  }

  private sendPlayerState(player: Player) {
    let stageDependentState: SharedPreGameState | SharedGameplayState;

    if (this.state.gameStarted) {
      stageDependentState = {
        gameStarted: true,
        role: player.role,
      };
    } else {
      stageDependentState = {
        gameStarted: false,
        role: null,
      };
    }

    const playerState: SharedPlayerState = {
      playerName: player.name,
      ...stageDependentState,
    };

    this.sendToPlayer(player, { type: "StateUpdate", newState: playerState });
    console.log("Players: ", this.players);
  }

  private emitStateEvent() {
    this.emit("stateChange", this.state);
  }

  private onPlayerData(player: Player, message: Message) {
    switch (message.type) {
      case "NameChange": {
        player.name = message.name;
        this.emitStateEvent();

        this.sendPlayerState(player);
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

    console.log(`New connection from: ${metadata.playerUuid}`);

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
      role: exampleRoles.townsperson,
    };

    newPlayer.connected = true;
    newPlayer.connection = connection;

    connection.on("open", () => {
      this.sendPlayerState(newPlayer);
    });

    connection.on("close", () => {
      newPlayer.connected = false;
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
}
