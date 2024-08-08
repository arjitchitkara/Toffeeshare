"use client";
import Image from "next/image";
import DragAndDrop from "@/components/ui/DragAndDrop";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

export default function Home() {
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });

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
            <span className="block text-sm text-white-400">
              Making sharing sweet
            </span>
          </div>
        </div>
        <nav className={`space-x-4 ${isTabletOrMobile ? "text-sm" : "mr-20"}`}>
          <Link href="/contact">Contact</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </header>
      <main className="flex flex-1 items-center justify-center p-8 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between w-full max-w-7xl z-10">
          <div className="relative flex justify-center items-center w-full md:w-1/3 p-4">
            <DragAndDrop />
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
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-48"
            preserveAspectRatio="none"
          >
            <path
              fill="#2d2d36"
              d="M0,192L80,181.3C160,171,320,149,480,160C640,171,800,213,960,202.7C1120,192,1280,128,1360,96L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
      </main>
      <div className="relative z-10">
        <div className="text-center p-4 bg-[#2d2d36]">
          <p className="text-sm text-gray-400">
            © 2024 ToffeeShare. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
