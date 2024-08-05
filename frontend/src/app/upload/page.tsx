"use client";
import { useState, ChangeEvent } from "react";
import Peer from "peerjs";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      const ws = new WebSocket("ws://localhost:8080");
      ws.onopen = () => {
        console.log("WebSocket connection opened");
        ws.send(JSON.stringify({ type: "upload" }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data.toString());
          console.log("Received WebSocket message:", data);

          if (data.type === "file-id") {
            const fileId = data.fileId;
            const peer = new Peer(fileId, {
              config: {
                iceServers: [
                  { url: "stun:stun.l.google.com:19302" },
                  { url: "stun:stun1.l.google.com:19302" },
                ],
              },
            });

            peer.on("open", (id) => {
              console.log("Peer connection opened with ID:", id);
              setLink(`http://localhost:3000/download/${fileId}`);
              ws.send(JSON.stringify({ type: "signal", peerId: id }));
            });

            peer.on("connection", (conn) => {
              conn.on("open", () => {
                console.log("Peer data channel opened");
                const reader = new FileReader();
                reader.onload = function (event) {
                  if (event.target) {
                    conn.send({
                      data: event.target.result,
                      type: file.type,
                      name: file.name,
                    });
                  }
                };
                reader.readAsArrayBuffer(file);
                conn.on("close", () => {
                  console.log("Peer data channel closed");
                  ws.close();
                });
              });
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer">
          Download Link
        </a>
      )}
    </div>
  );
}
