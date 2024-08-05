import WebSocket, { Server } from "ws";
import { v4 as uuidv4 } from "uuid";

const wss = new Server({ port: 8080 });

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case "upload":
        const fileId = uuidv4();
        ws.send(JSON.stringify({ type: "file-id", fileId }));
        break;
      case "signal":
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
        break;
    }
  });
});

console.log("Signaling server is running on ws://localhost:8080");
