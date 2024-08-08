// src/pages/download/[id]/page.tsx

"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Peer from "peerjs";
import Link from "next/link";
import Image from "next/image";

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
    <div className="bg-[#2d2d36] text-white min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-[#2d2d36]">
        <div className="flex items-center">
          <Image
            src="/logo.42a58a0d.png"
            alt="logo"
            width={100}
            height={100}
            style={{ height: "auto" }}
          />
          <div className="ml-2">
            <span className="text-lg font-bold" style={{ height: "100%" }}>
              ToffeeShare
            </span>
            <span className="block text-sm text-white-400 ">
              Making sharing sweet
            </span>
          </div>
        </div>
        <nav className="space-x-4 mr-20">
          <Link href="/contact">Contact</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-wrap items-center justify-between w-full max-w-7xl">
          <div className="relative flex justify-center items-center w-full md:w-1/3 p-4">
            <div
              className="relative w-full h-64 md:w-80 md:h-80 lg:w-[340px] lg:h-[20vh] border rounded-[32px] mx-auto flex flex-col items-center justify-center space-y-4 p-4"
              style={{
                boxShadow:
                  "0 0 12px 0 rgba(0, 0, 0, .1), 0 10px 30px 0 rgba(0, 0, 0, .2)",
                border: "2px solid #2d2d36",
                backgroundColor: "#42424a",
              }}
            >
              {fileUrl ? (
                <>
                  <p className="font-bold text-center">{fileName}</p>
                  <a
                    href={fileUrl}
                    download={fileName || "downloaded-file"}
                    className="bg-orange-500 text-white py-2 px-4 rounded-lg mt-4"
                  >
                    Download
                  </a>
                </>
              ) : (
                <p className="text-center">Waiting for file...</p>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 p-4 text-gray-200">
            <h1 className="text-4xl font-bold mb-4">
              Share files directly from your device to anywhere
            </h1>
            <p className="text-lg mb-4">
              Send files of any size directly from your device without ever
              storing anything online.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="mr-2">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      strokeWidth="32"
                      d="M256 256s-48-96-126-96c-54.12 0-98 43-98 96s43.88 96 98 96c37.51 0 71-22.41 94-48m32-48s48 96 126 96c54.12 0 98-43 98-96s-43.88-96-98-96c-37.51 0-71 22.41-94 48"
                    ></path>
                  </svg>
                </span>
                <span>No file size limit</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M320 120l48 48-48 48"
                    ></path>
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M352 168H144a80.24 80.24 0 00-80 80v16m128 128l-48-48 48-48"
                    ></path>
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M160 344h208a80.24 80.24 0 0080-80v-16"
                    ></path>
                  </svg>
                </span>{" "}
                Peer-to-peer
              </div>
              <div className="flex items-center">
                <span className="mr-2">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M432 208H288l32-192L80 304h144l-32 192z"></path>
                  </svg>
                </span>{" "}
                Blazingly fast
              </div>
              <div className="flex items-center">
                <span className="mr-2">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M288 304v-18c0-16.63-14.26-30-32-30s-32 13.37-32 30v18"
                    ></path>
                    <path d="M304 416h-96a32 32 0 01-32-32v-48a32 32 0 0132-32h96a32 32 0 0132 32v48a32 32 0 01-32 32z"></path>
                    <path
                      fill="none"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M416 221.25V416a48 48 0 01-48 48H144a48 48 0 01-48-48V96a48 48 0 0148-48h98.75a32 32 0 0122.62 9.37l141.26 141.26a32 32 0 019.37 22.62z"
                    ></path>
                    <path
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                      d="M256 50.88V176a32 32 0 0032 32h125.12"
                    ></path>
                  </svg>
                </span>{" "}
                End-to-end encrypted
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 bg-[#42424a]">
        <p className="text-sm text-gray-400">
          © 2024 ToffeeShare. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
