import http from "http";
import WebSocket, { Server } from "ws";
import { v4 as uuidv4 } from "uuid";

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server running.\n");
});

// Create a WebSocket server
const wss = new Server({ noServer: true });

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message, isBinary) => {
    if (isBinary) {
      console.log("Received binary data, not processing as JSON.");
      return;
    }

    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (error) {
      console.error("Invalid JSON:", error);
      return;
    }

    switch (data.type) {
      case "upload":
        const fileId = uuidv4();
        ws.send(JSON.stringify({ type: "file-id", fileId }));
        break;
      case "signal":
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
          }
        });
        break;
      default:
        console.error("Unknown message type:", data.type);
    }
  });
});

// Handle the upgrade request from HTTP to WebSocket
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Start the server
const port = 8080;
server.listen(port, () => {
  console.log(`Signaling server is running on http://localhost:${port}`);
});
