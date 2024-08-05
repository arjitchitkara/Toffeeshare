import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Toffeeshare</h1>
      <ul>
        <li>
          <Link href="/upload">Upload a File</Link>
        </li>
      </ul>
    </div>
  );
}
