// src/components/ui/DragAndDrop.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DragAndDrop() {
  const [file, setFile] = useState<File | null>(null);
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
      e.dataTransfer.clearData();
      router.push("/upload");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      router.push("/upload");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className={`border-2 border-dashed rounded-lg p-6 ${
          dragging
            ? "border-blue-500 bg-blue-100"
            : "border-gray-400 bg-gray-200"
        }`}
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
          className="flex flex-col items-center cursor-pointer"
        >
          {file ? (
            <p>{file.name}</p>
          ) : (
            <>
              <div className="text-4xl text-orange-500 mb-2">+</div>
              <p>Click to browse or drag files here to start sharing</p>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
