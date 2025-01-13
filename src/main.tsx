import Peer from "peerjs";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

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
