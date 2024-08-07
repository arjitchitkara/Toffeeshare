import Image from "next/image";
import DragAndDrop from "@/components/ui/DragAndDrop";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <div className="flex items-center">
          <Image
            src="/logo.42a58a0d.png"
            alt="logo"
            width={40}
            height={40}
            style={{ height: "auto" }}
          />
          <div className="ml-2">
            <span className="text-lg font-semibold">ToffeeShare</span>
            <span className="block text-sm text-gray-400">
              Making sharing sweet
            </span>
          </div>
        </div>
        <nav className="space-x-4">
          <Link href="/contact">Contact</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-wrap items-center justify-center w-full max-w-7xl">
          <div className="w-full md:w-1/2 p-4">
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
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="mr-2">
                  <Image
                    src="/Infinity.png"
                    alt="Infinity symbol"
                    width={23}
                    height={23}
                  />
                </span>
                No file size limit
              </li>
              <li className="flex items-center">
                <span className="mr-2">↔</span> Peer-to-peer
              </li>
              <li className="flex items-center">
                <span className="mr-2">⚡</span> Blazingly fast
              </li>
              <li className="flex items-center">
                <span className="mr-2">🔒</span> End-to-end encrypted
              </li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 bg-gray-800">
        <p className="text-sm text-gray-400">
          © 2024 ToffeeShare. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
