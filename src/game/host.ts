import { DataConnection } from "peerjs";
import { Connection, ID_NUM_CHARS } from "./connection";
import {
  Message,
  PlayerConnectionMetadata,
  SharedPlayerState,
} from "./sharedData";

export interface HostEvents {
  stateChange: GameState;
}

export interface Player {
  uuid: string;
  name: string | null;
  connection: DataConnection;
  connected: boolean;
}

export interface GameState {
  players: Player[];
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
    const playerState: SharedPlayerState = {
      playerName: player.name,
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
