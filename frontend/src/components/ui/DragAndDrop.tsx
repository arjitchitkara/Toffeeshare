"use client";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Peer from "peerjs";
import UploadCard from "./UploadCard";
import QRCode from "qrcode.react";

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  return (
    <div
      className={`relative mx-auto border rounded-[32px] transition-all duration-300 ${
        link
          ? "w-full h-auto p-4"
          : "w-full h-64 md:w-80 md:h-80 lg:w-[330px] lg:h-[330px]"
      }`}
      style={{
        boxShadow:
          "0 0 12px 0 rgba(0, 0, 0, .1), 0 10px 30px 0 rgba(0, 0, 0, .2)",
        border: "2px solid #2d2d36",
      }}
    >
      {link ? (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4 bg-[#42424a] rounded-[32px] text-white">
          <p className="font-bold">{file?.name}</p>
          <p>0.25 MB</p>
          <div
            className="text-orange-500 cursor-pointer w-full py-1 px-3 bg-gray-800 rounded-lg border border-gray-600 break-words"
            onClick={() => copyToClipboard(link)}
          >
            {link}
          </div>
          <QRCode value={link} bgColor="#ffffff" fgColor="#000000" />
          <p className="text-center">
            Closing this page means you stop sharing!
            <br />
            Simply keep this page open in the background to keep sharing.
          </p>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-[32px] flex items-center justify-center transition-all bg-[#42424a]">
            <div
              className={`absolute inset-5 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed rounded-[17px] transition ${
                dragging
                  ? "border-orange-500 bg-gray-800"
                  : "border-gray-400 bg-[#42424a]"
              } hover:bg-gray-600`}
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
                className="flex flex-col items-center justify-center p-2"
              >
                {file ? (
                  <p>{file.name}</p>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-orange-500 mb-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-center">
                      Click to browse or drag files here to start sharing
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
