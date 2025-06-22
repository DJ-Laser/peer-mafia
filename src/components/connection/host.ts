import { DataConnection } from "peerjs";
import { Connection, ID_NUM_CHARS } from "./connection";
import {
  Message,
  PlayerConnectionMetadata,
  SharedPlayerState,
} from "./sharedData";

export interface HostEvents {
  stateChange: unknown;
}

interface Player {
  uuid: string;
  name: string;
  connection: DataConnection;
  connected: boolean;
}

export class HostConnection extends Connection<HostEvents> {
  static generateRoomId(): string {
    return Connection.generateId(ID_NUM_CHARS);
  }

  static generatePeerId(roomId: string) {
    return `DJLASER-mafia-room-${roomId}`;
  }

  readonly roomId: string;
  players: Player[] = [];

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
  }

  private onPlayerData(player: Player, message: Message) {
    switch (message.type) {
      case "NameChange": {
        player.name = message.name;

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

    console.log(`New connection from: ${metadata.playerUuid}`);

    for (const player of this.players) {
      if (player.uuid === metadata.playerUuid) {
        newPlayer = player;
        break;
      }
    }

    newPlayer ??= {
      uuid: metadata.playerUuid,
      name: `Anon-${this.players.length + 1}`,
      connected: false,
      connection: connection,
    };

    connection.on("open", () => {
      this.sendPlayerState(newPlayer);
    });

    connection.on("close", () => {
      newPlayer.connected = false;
    });

    connection.on("data", (message) => {
      this.onPlayerData(newPlayer, message as Message);
    });

    this.players.push(newPlayer);
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
