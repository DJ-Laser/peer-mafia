import { DataConnection } from "peerjs";
import { Connection, Message, OnPeerError } from "./connection";
import { HostConnection } from "./host";

export interface PlayerEvents {
  roomNotFound: string;
  stateChange: unknown;
}

export class PlayerConnection extends Connection<PlayerEvents> {
  static generatePeerId() {
    return `DJLASER-mafia-player-${Connection.generateId(10)}`;
  }

  readonly roomId: string;

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
      metadata: { playerUuid: this.uuid },
      reliable: true,
    });

    console.log("Created connection: ", dataConnection);

    dataConnection.on("error", (error) => {
      console.log("Data channel error: ", error);
    });

    dataConnection.on("close", () => {
      console.log("Data channel closed");
    });

    dataConnection.on("open", () => {
      console.log("Data channel opened");
    });

    dataConnection.on("data", (data: unknown) => {
      const message = data as Message;
      console.log("Data channel data: ", data);

      switch (message.type) {
        case "ConnectionAccepted":
          console.log(`Succesfully connected to: ${this.roomId}`);
          break;
      }
    });
  }
}
