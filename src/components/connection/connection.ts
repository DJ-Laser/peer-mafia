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
  static generateId(numChars: number): string {
    let id = "";

    for (let i = 0; i < numChars; i++) {
      const charIdx = Math.floor(Math.random() * ID_ALLOWED_CHARS.length);
      id += ID_ALLOWED_CHARS.charAt(charIdx);
    }

    return id;
  }

  protected notifier: Notifier;
  protected peer: Peer;
  protected readonly uuid: string;
  protected readonly peerId: string;

  constructor(peerId: string, notifier: Notifier) {
    this.notifier = notifier;
    this.peerId = peerId;

    const uuid = localStorage.getItem(UUID_STORAGE_KEY);
    if (uuid !== null) {
      this.uuid = uuid;
    } else {
      const uuid = crypto.randomUUID();
      localStorage.setItem(UUID_STORAGE_KEY, uuid);
      this.uuid = uuid;
    }

    this.peer = new Peer(this.peerId);

    this.peer.on("disconnected", () => {
      this.attemptReconnect();
    });

    // These have to be lambdas or else `this` becomes the peer for some reason
    this.peer.on("connection", (conn) => this.handleConnection(conn));
    this.peer.on("error", (error) => this.handleError(error));
    this.peer.on("open", (id) => this.onReady(id));
  }

  private canReconnect(): boolean {
    return this.peer.disconnected && !this.peer.destroyed;
  }

  protected attemptReconnect() {
    console.log("Connection disconnected");
    if (this.canReconnect()) {
      setTimeout(() => {
        // Peer state may have changed between check and now
        if (this.canReconnect()) {
          console.log("Connection reconnecting");
          this.peer.reconnect();
        }
      }, 500);
    }
  }

  protected sendMessage(
    connection: DataConnection,
    message: Message,
  ): void | Promise<void> {
    return connection.send(message);
  }

  destroy() {
    this.peer.destroy();
    console.log("Connection manually destroyed");
  }

  protected abstract onReady(id: string): void;
  protected abstract handleConnection(connection: DataConnection): void;
  protected abstract handleError(error: OnPeerError): void;
}
