import { DataConnection } from "peerjs";
import { Notifier } from "../notifications/notifier";
import {
  Connection,
  ID_ALLOWED_CHARS,
  ID_NUM_CHARS,
  OnPeerError as PeerOnError,
} from "./connection";

export class HostConnection extends Connection {
  static generateRoomId(): string {
    let id = "";

    for (let i = 0; i < ID_NUM_CHARS; i++) {
      const charIdx = Math.floor(Math.random() * ID_ALLOWED_CHARS.length);
      id += ID_ALLOWED_CHARS.charAt(charIdx);
    }

    return id;
  }

  static generatePeerId(roomId: string) {
    return `DJLASER-mafia-room-${roomId}`;
  }

  readonly roomId: string;

  constructor(notifier: Notifier) {
    const roomId = HostConnection.generateRoomId();
    super(() => HostConnection.generatePeerId(roomId), notifier);

    this.roomId = roomId;

    this.peer.on("connection", (connection) =>
      this.handleConnection(connection),
    );
  }

  protected handleConnection(connection: DataConnection): void {
    this.sendMessage(connection, { type: "ConnectionAccepted" });

    this.notifier.setNotification({
      color: "info",
      text: "Attempted connection from:" + connection.label,
    });
  }

  protected handleError(error: PeerOnError): void {
    console.log("Unexpected error: " + error);
  }
}
