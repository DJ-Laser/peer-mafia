import Peer, { DataConnection, PeerError } from "peerjs";
import { Notifier } from "../notifications/notifier";

export const ID_ALLOWED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const ID_NUM_CHARS = 5;

const UUID_STORAGE_KEY = "PEER-UNIQUEIDENTIFIER";

export type OnPeerError = PeerError<
  | "disconnected"
  | "browser-incompatible"
  | "invalid-id"
  | "invalid-key"
  | "network"
  | "peer-unavailable"
  | "ssl-unavailable"
  | "server-error"
  | "socket-error"
  | "socket-closed"
  | "unavailable-id"
  | "webrtc"
>;

export type Message = { type: "ConnectionAccepted" };

export abstract class Connection {
  protected notifier: Notifier;
  protected peer: Peer;
  protected readonly uuid: string;
  protected readonly peerId: string;

  constructor(peerIdFun: (uuid: string) => string, notifier: Notifier) {
    this.notifier = notifier;

    const uuid = localStorage.getItem(UUID_STORAGE_KEY);
    if (uuid !== null) {
      this.uuid = uuid;
    } else {
      const uuid = crypto.randomUUID();
      localStorage.setItem(UUID_STORAGE_KEY, uuid);
      this.uuid = uuid;
    }

    this.peerId = peerIdFun(this.uuid);
    this.peer = new Peer(this.peerId);

    this.peer.on("disconnected", () => {
      this.attemptReconnect();
    });

    this.peer.on("connection", this.handleConnection);
    this.peer.on("error", this.handleError);
  }

  protected attemptReconnect() {
    if (this.peer.disconnected && !this.peer.destroyed) {
      this.peer.reconnect();
    }
  }

  protected sendMessage(
    connection: DataConnection,
    message: Message,
  ): void | Promise<void> {
    return connection.send(message);
  }

  protected abstract handleConnection(connection: DataConnection): void;

  protected abstract handleError(error: OnPeerError): void;
}
