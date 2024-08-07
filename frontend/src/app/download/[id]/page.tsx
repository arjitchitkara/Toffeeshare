// src/pages/download/[id]/page.tsx

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Peer from "peerjs";

interface FileMessage {
  data: ArrayBuffer | Uint8Array;
  type: string;
  name: string;
}

export default function Download() {
  const router = useRouter();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure the code is running on the client-side

    // Parse the id from the URL
    const url = new URL(window.location.href);
    const id = url.pathname.split("/").pop();

    if (id) {
      setPeerId(id);
    }
  }, []);

  useEffect(() => {
    if (!peerId) return; // Ensure peerId is available

    const peer = new Peer("", {
      config: {
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          { url: "stun:stun1.l.google.com:19302" },
        ],
      },
    });
    const websocket_server = process.env.NEXT_PUBLIC_WS_URL;

    const ws = new WebSocket(websocket_server || "");

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      ws.send(JSON.stringify({ type: "signal", peerId }));
    };

    peer.on("open", () => {
      console.log("Peer connection opened");
      const conn = peer.connect(peerId);

      conn.on("open", () => {
        console.log("Peer data channel opened");
        conn.on("data", (data: unknown) => {
          console.log("Received data:", data);
          // Ensure the data matches the expected structure
          if (
            typeof data === "object" &&
            data !== null &&
            "data" in data &&
            "type" in data &&
            "name" in data
          ) {
            const message = data as FileMessage;
            if (
              message.data instanceof Uint8Array ||
              message.data instanceof ArrayBuffer
            ) {
              const blob = new Blob([message.data], { type: message.type });
              const url = URL.createObjectURL(blob);
              setFileUrl(url);
              setFileName(message.name);
            }
          } else {
            console.error(
              "Received data does not match expected structure",
              data
            );
          }
          conn.close();
          ws.close();
        });
      });
    });

    return () => {
      peer.destroy();
      ws.close();
    };
  }, [peerId]);

  return (
    <div>
      {fileUrl ? (
        <div>
          <p>File ready for download:</p>
          <a href={fileUrl} download={fileName || "downloaded-file"}>
            {fileName || "Download File"}
          </a>
        </div>
      ) : (
        <p>Waiting for file...</p>
      )}
    </div>
  );
}
