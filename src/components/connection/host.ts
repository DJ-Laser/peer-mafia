import { DataConnection } from "peerjs";
import { Notifier } from "../notifications/notifier";
import {
  Connection,
  ID_NUM_CHARS,
  OnPeerError as PeerOnError,
} from "./connection";

export class HostConnection extends Connection {
  static generateRoomId(): string {
    return Connection.generateId(ID_NUM_CHARS);
  }

  static generatePeerId(roomId: string) {
    return `DJLASER-mafia-room-${roomId}`;
  }

  readonly roomId: string;

  constructor(notifier: Notifier) {
    const roomId = HostConnection.generateRoomId();
    super(HostConnection.generatePeerId(roomId), notifier);

    this.roomId = roomId;
  }

  protected onReady(id: string): void {
    console.log(`Hosting id: ${id}`);
  }

  protected handleConnection(connection: DataConnection): void {
    this.sendMessage(connection, { type: "ConnectionAccepted" });
    console.log("host got attempted player");

    this.notifier.setNotification({
      color: "info",
      text: "Attempted connection from:" + connection.label,
    });
  }

  protected handleError(error: PeerOnError): void {
    console.log("Unexpected error: " + error);
  }
}
