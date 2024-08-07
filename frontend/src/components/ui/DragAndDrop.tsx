"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Peer from "peerjs";
import UploadCard from "./UploadCard";

export default function DragAndDrop() {
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const router = useRouter();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      uploadFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      uploadFile(e.target.files[0]);
    }
  };

  const websocket_server = process.env.NEXT_PUBLIC_WS_URL;

  const uploadFile = (file: File) => {
    if (file) {
      const ws = new WebSocket(websocket_server || "");
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
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      {link ? (
        <div className="flex flex-wrap w-full max-w-7xl p-4">
          <div className="w-full md:w-1/2">
            <UploadCard
              fileName={file?.name || "Unknown File"}
              fileLink={link}
            />
          </div>
          <div className="w-full md:w-1/2 text-white p-4">
            <h2 className="text-2xl font-bold mb-4">
              Now sharing your files directly from your device
            </h2>
            <p className="text-gray-400 mb-4">
              Closing this page means you stop sharing! Simply keep this page
              open in the background to keep sharing.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="relative border-2 border-gray-500 rounded-lg w-80 h-80 flex items-center justify-center"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className={`absolute inset-0 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed rounded-lg transition ${
              dragging
                ? "border-orange-500 bg-gray-800"
                : "border-gray-400 bg-gray-700"
            } hover:bg-gray-600`}
          >
            {file ? (
              <p>{file.name}</p>
            ) : (
              <>
                <div className="text-4xl text-orange-500 mb-2">+</div>
                <p className="text-center">
                  Click to browse or drag files here to start sharing
                </p>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
}
