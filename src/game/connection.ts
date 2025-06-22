import EventEmitter from "eventemitter3";
import Peer, { DataConnection, PeerError } from "peerjs";
import { Message } from "./sharedData";

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

export interface ConnectionEvents {
  error: string;
}

// Calling the REST API TO fetch the TURN Server Credentials
// PLEASE don't steal my api key :sob:
const response = await fetch(
  "https://djlaser-mafia.metered.live/api/v1/turn/credentials?apiKey=b84f9d5703e313de8a71a6a806a96716c3b6",
);

const iceServers = await response.json();
const peerRtcConnfig: RTCConfiguration = { iceServers };

export abstract class Connection<
  Events extends EventEmitter.ValidEventTypes,
> extends EventEmitter<ConnectionEvents | Events> {
  static generateId(numChars: number): string {
    let id = "";

    for (let i = 0; i < numChars; i++) {
      const charIdx = Math.floor(Math.random() * ID_ALLOWED_CHARS.length);
      id += ID_ALLOWED_CHARS.charAt(charIdx);
    }

    return id;
  }

  protected peer: Peer;
  protected readonly uuid: string;
  protected readonly peerId: string;

  constructor(peerId: string) {
    super();

    this.peerId = peerId;

    const uuid = localStorage.getItem(UUID_STORAGE_KEY);
    if (uuid !== null) {
      this.uuid = uuid;
    } else {
      const uuid = crypto.randomUUID();
      localStorage.setItem(UUID_STORAGE_KEY, uuid);
      this.uuid = uuid;
    }

    this.peer = new Peer(this.peerId, {
      config: peerRtcConnfig,
    });

    this.peer.on("disconnected", () => {
      this.attemptReconnect();
    });

    // These have to be lambdas or else `this` becomes the peer for some reason
    this.peer.on("connection", (conn) => this.handleConnection(conn));
    this.peer.on("error", (error) => this.onPeerError(error));
    this.peer.on("open", (id) => this.onReady(id));
  }

  private canReconnect(): boolean {
    return this.peer.disconnected && !this.peer.destroyed;
  }

  protected attemptReconnect() {
    if (this.canReconnect()) {
      setTimeout(() => {
        // Peer state may have changed between check and now
        if (this.canReconnect()) {
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
  }

  private onPeerError(error: OnPeerError) {
    if (!this.handleError(error)) {
      console.log("Unexpected error: " + error);

      this.emit("error", error.message);
    }
  }

  protected abstract onReady(id: string): void;
  protected abstract handleConnection(connection: DataConnection): void;
  protected abstract handleError(error: OnPeerError): boolean;
}
