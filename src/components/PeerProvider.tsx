import Peer from "peerjs";

function prefixPeerId(id: string) {
  return `DJLASER-mafia-${id}`;
}

const peer = new Peer(prefixPeerId("server"));

peer.on("open", (id) => {
  console.log("My peer ID is: " + id);
});

peer.on("close", () => {
  console.log("Connection closed");
});

peer.on("error", (error) => {
  console.log("Unexpected error: " + error);
});
