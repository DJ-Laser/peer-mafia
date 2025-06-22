import { DataConnection } from "peerjs";
import { Notifier } from "../notifications/notifier";
import { Connection, Message, OnPeerError } from "./connection";
import { HostConnection } from "./host";

export class PlayerConnection extends Connection {
  static generatePeerId() {
    return `DJLASER-mafia-player-${Connection.generateId(10)}`;
  }

  readonly roomId: string;

  constructor(roomId: string, notifier: Notifier) {
    super(PlayerConnection.generatePeerId(), notifier);

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

  protected handleError(error: OnPeerError): void {
    if (error.type == "peer-unavailable") {
      this.notifier.setNotification({
        color: "error",
        text: `Failed to connect: Room ${this.roomId} does not exist`,
      });

      this.destroy();
    } else {
      console.log("Unexpected error: " + error);
    }
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
          this.notifier.setNotification({
            color: "success",
            text: "Succesfully connected to: " + this.roomId,
          });

          break;
      }
    });
  }
}
