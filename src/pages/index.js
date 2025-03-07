// src/pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">YouTube Video Analysis</h1>
      <p className="mb-8 text-center max-w-md">
        To analyze a YouTube video, simply prepend our domain to the video URL.
        For example, try accessing:
      </p>
      <div className="p-4 bg-white shadow rounded">
        <code>https://analyseyoutube.onrender.com/watch?v=YOUR_VIDEO_ID</code>
      </div>
      <div className="mt-8">
        <Link legacyBehavior href="/results">
          <a className="text-blue-500 underline">View Results Page (Demo)</a>
        </Link>
      </div>
    </div>
  );
}
