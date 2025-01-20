import Peer, { DataConnection, PeerError, PeerErrorType } from "peerjs";
import { Notifier } from "../notifications/notifier";

const ID_ALLOWED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const UUID_STORAGE_KEY = "PEER-UNIQUEIDENTIFIER";
const ID_NUM_CHARS = 5;

interface ConnectingStatus {
  type: "connecting";
  roomId: string;
}

interface PlayerStatus {
  type: "player";
  roomId: string;
}

interface HostStatus {
  type: "host";
}

export type ConnectionStatus =
  | { type: "idle" }
  | ConnectingStatus
  | PlayerStatus
  | HostStatus;

export class Connection {
  notifier: Notifier;
  peer: Peer;
  id: string;
  uuid: string;

  _status: ConnectionStatus;

  public get status(): ConnectionStatus {
    return this._status;
  }

  private set status(status: ConnectionStatus) {
    this._status = status;
  }

  static generateId(): string {
    let id = "";

    for (let i = 0; i < ID_NUM_CHARS; i++) {
      const charIdx = Math.floor(Math.random() * ID_ALLOWED_CHARS.length);
      id += ID_ALLOWED_CHARS.charAt(charIdx);
    }

    return id;
  }

  static prefixPeerId(id: string) {
    return `DJLASER-mafia-${id}`;
  }

  constructor(notifier: Notifier) {
    this.notifier = notifier;
    this._status = { type: "idle" };
    this.id = Connection.generateId();
    this.peer = new Peer(Connection.prefixPeerId(this.id));

    const uuid = localStorage.getItem(UUID_STORAGE_KEY);

    if (uuid !== null) {
      this.uuid = uuid;
    } else {
      const uuid = crypto.randomUUID();
      localStorage.setItem(UUID_STORAGE_KEY, uuid);
      this.uuid = uuid;
    }

    this.addConnectionListeners();
    console.log(this);
  }

  private addConnectionListeners() {
    this.peer.on("disconnected", () => {
      this.attemptReconnect();
    });

    this.peer.on("error", (error) => this.handleError(error));

    this.peer.on("connection", (connection) =>
      this.handleConnection(connection),
    );
  }

  private handleError(error: PeerError<`${PeerErrorType}`>) {
    switch (error.type) {
      case "unavailable-id":
        if (this.status.type === "idle" || this.status.type == "connecting") {
          this.destroyConnection();
        }

        console.log("Disconnected during a game, thats not good");
        break;

      case "peer-unavailable":
        if (this.status.type === "connecting") {
          this.notifier.setNotification({
            color: "error",
            text: `Failed to connect: Room ${this.status.roomId} does not exist`,
          });
        }

        this.destroyConnection();

        break;

      default:
        console.log("Unexpected error: " + error);
    }
  }

  private handleConnection(connection: DataConnection) {
    this.notifier.setNotification({
      color: "info",
      text: "Attempted connection from:" + connection.label,
    });
  }

  private attemptReconnect() {
    if (this.peer.disconnected && !this.peer.destroyed) {
      this.peer.reconnect();
    }
  }

  private destroyConnection() {
    this.peer.destroy();

    this.id = Connection.generateId();
    this.peer = new Peer(Connection.prefixPeerId(this.id));
    this.status = { type: "idle" };
  }

  /** Returns true if connection successful */
  public joinRoom(roomId: string) {
    this.status = { type: "connecting", roomId };

    this.notifier.setNotification({
      color: "error",
      text: `Failed to connect: Room ${this.status.roomId} does not exist`,
    });

    const dataConnection = this.peer.connect(Connection.prefixPeerId(roomId), {
      label: `player-${this.uuid}`,
      metadata: {
        playerUuid: this.uuid,
      },
    });

    dataConnection.on("open", () => {
      this.notifier.setNotification({
        color: "success",
        text: "Succesfully connected to: " + roomId,
      });
    });
  }
}
