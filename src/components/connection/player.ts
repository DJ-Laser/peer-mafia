import { DataConnection } from "peerjs";
import { Notifier } from "../notifications/notifier";
import { Connection, Message, OnPeerError } from "./connection";
import { HostConnection } from "./host";

export class PlayerConnection extends Connection {
  readonly roomId: string;

  constructor(roomId: string, notifier: Notifier) {
    super((uuid) => `DJLASER-mafia-player-${uuid}`, notifier);

    this.roomId = roomId;
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
    } else {
      console.log("Unexpected error: " + error);
    }
  }

  public joinRoom(roomId: string) {
    const dataConnection = this.peer.connect(
      HostConnection.generatePeerId(roomId),
      { label: `player-${this.uuid}`, metadata: { playerUuid: this.uuid } },
    );

    dataConnection.on("data", (data: unknown) => {
      const message = data as Message;
      console.log(data);

      switch (message.type) {
        case "ConnectionAccepted":
          this.notifier.setNotification({
            color: "success",
            text: "Succesfully connected to: " + roomId,
          });

          break;
      }
    });
  }
}
