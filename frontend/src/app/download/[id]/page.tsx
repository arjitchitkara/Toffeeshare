"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Peer from "peerjs";

export default function Download() {
  const router = useRouter();
  const [file, setFile] = useState<string | null>(null);
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

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      ws.send(JSON.stringify({ type: "signal", peerId }));
    };

    peer.on("open", () => {
      console.log("Peer connection opened");
      const conn = peer.connect(peerId);

      conn.on("open", () => {
        console.log("Peer data channel opened");
        conn.on("data", (data) => {
          console.log("Received data:", data);
          if (data instanceof Uint8Array) {
            const blob = new Blob([data], { type: "application/octet-stream" });
            setFile(URL.createObjectURL(blob));
          } else if (data instanceof ArrayBuffer) {
            const blob = new Blob([data], { type: "application/octet-stream" });
            setFile(URL.createObjectURL(blob));
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
      {file ? (
        <a href={file} download="file">
          Download File
        </a>
      ) : (
        <p>Waiting for file...</p>
      )}
    </div>
  );
}
