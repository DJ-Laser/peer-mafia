import { DataConnection } from "peerjs";
import { Connection, ID_NUM_CHARS } from "./connection";

export interface HostEvents {
  stateChange: unknown;
}

export class HostConnection extends Connection<HostEvents> {
  static generateRoomId(): string {
    return Connection.generateId(ID_NUM_CHARS);
  }

  static generatePeerId(roomId: string) {
    return `DJLASER-mafia-room-${roomId}`;
  }

  readonly roomId: string;

  constructor() {
    const roomId = HostConnection.generateRoomId();
    super(HostConnection.generatePeerId(roomId));

    this.roomId = roomId;
  }

  protected onReady(id: string): void {
    console.log(`Hosting id: ${id}`);
  }

  protected handleConnection(connection: DataConnection): void {
    this.sendMessage(connection, { type: "ConnectionAccepted" });
    console.log("host got attempted player");
  }

  protected handleError(): boolean {
    return false;
  }
}
