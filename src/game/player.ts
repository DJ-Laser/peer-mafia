import { DataConnection } from "peerjs";
import { Connection, OnPeerError } from "./connection";
import { HostConnection } from "./host";
import {
  Message,
  PlayerConnectionMetadata,
  SharedPlayerState,
} from "./sharedData";

export interface PlayerEvents {
  roomNotFound: string;
  roomJoined: void;
  stateChange: SharedPlayerState;
  connectionLost: void;
  kickedFromRoom: string | null;
}

export class PlayerConnection extends Connection<PlayerEvents> {
  static generatePeerId() {
    return `DJLASER-mafia-player-${Connection.generateId(10)}`;
  }

  readonly roomId: string;
  dataConnection: DataConnection | null = null;
  private kicked = false;

  constructor(roomId: string) {
    super(PlayerConnection.generatePeerId());

    this.roomId = roomId;
  }

  protected onReady(id: string): void {
    console.log(`Player id: ${id}`);
    this.joinRoom();
  }

  protected handleConnection(connection: DataConnection): void {
    // Players don't accept incoming connections
    connection.close();
  }

  protected handleError(error: OnPeerError): boolean {
    if (error.type == "peer-unavailable") {
      this.emit(
        "roomNotFound",
        `Failed to connect: Room ${this.roomId} does not exist`,
      );

      this.destroy();
      return true;
    }

    return false;
  }

  private joinRoom() {
    const hostId = HostConnection.generatePeerId(this.roomId);
    console.log(`Joining id: ${hostId}`);

    const dataConnection = this.peer.connect(hostId, {
      label: `player-${this.uuid}`,
      metadata: { playerUuid: this.uuid } as PlayerConnectionMetadata,
      reliable: true,
    });

    dataConnection.on("open", () => {
      this.emit("roomJoined");
      this.dataConnection = dataConnection;
    });

    dataConnection.on("error", (error) => {
      console.log("Data channel error: ", error);
      this.emit("error", error.message);
    });

    dataConnection.on("close", () => {
      this.dataConnection = null;

      if (!this.kicked) {
        this.emit("connectionLost");
      }
    });

    dataConnection.on("data", (data: unknown) => {
      const message = data as Message;

      switch (message.type) {
        case "StateUpdate": {
          this.emit("stateChange", message.newState);
          break;
        }

        case "Kicked": {
          this.emit("kickedFromRoom", message.reason);
          this.kicked = true;
          break;
        }

        default: {
          console.log(`Unexpexted message: ${message.type}`);
          this.emit("error", `Unexpexted message: ${message.type}`);
        }
      }
    });
  }

  sendNameChange(newName: string) {
    if (this.dataConnection !== null) {
      this.sendMessage(this.dataConnection, {
        type: "NameChange",
        name: newName,
      });
    }
  }

  leaveRoom() {
    if (this.dataConnection !== null) {
      this.sendMessage(this.dataConnection, {
        type: "LeaveRoom",
      });
    }
  }
}
