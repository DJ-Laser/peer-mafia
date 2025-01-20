import { DataConnection, Peer, PeerError, PeerErrorType } from "peerjs";

const ID_ALLOWED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const UUID_STORAGE_KEY = "PEER-UNIQUEIDENTIFIER";
const ID_NUM_CHARS = 5;

export type Status = "idle" | "connecting" | "host" | "player";

export class Connection {
  peer: Peer;
  id: string;
  uuid: string;

  _status: Status;

  public get status(): Status {
    return this._status;
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

  constructor() {
    this._status = "idle";
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

    this.peer.on("error", this.handleError);

    this.peer.on("connection", this.handleConnection);
  }

  private handleError(error: PeerError<`${PeerErrorType}`>) {
    switch (error.type) {
      case "unavailable-id":
        if (this.status === "idle" || this.status == "connecting") {
          this.destroyConnection();
        }

        console.log("Disconnected during a game, thats not good");
        break;

      case "peer-unavailable":
        this.destroyConnection();

        break;

      default:
        console.log("Unexpected error: " + error);
    }
  }

  private handleConnection(connection: DataConnection) {
    console.log("Attampted connection from:" + connection.metadata);
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
    this._status = "idle";
  }

  /** Returns true if connection successful */
  public joinRoom(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      this._status = "connecting";

      const dataConnection = this.peer.connect(Connection.prefixPeerId(id), {
        label: `player-${this.uuid}`,
        metadata: {
          playerUuid: this.uuid,
        },
      });

      dataConnection.on("open", () => {
        resolve(true);
      });

      dataConnection.on("close", () => {
        resolve(false);
      });
    });
  }
}
