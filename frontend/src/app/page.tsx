import Link from "next/link";
import DragAndDrop from "@/components/ui/DragAndDrop";

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-6">
        Welcome to Toffeeshare
      </h1>

      <DragAndDrop />
    </div>
  );
}
