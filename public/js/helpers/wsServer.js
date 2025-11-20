import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { readFileSync } from "node:fs";

const server = createServer();
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🧪 Client connecté");
  ws.send("🧠 Connexion WebSocket établie");

  setInterval(() => {
    const data = readFileSync("./plateforme/dev/diagnostic.json", "utf-8");
    ws.send(data);
  }, 5000); // envoie toutes les 5s
});

server.listen(8080, () => {
  console.log("🚀 WebSocket Server sur ws://localhost:8080");
});
