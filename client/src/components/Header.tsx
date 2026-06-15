"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function Header() {
  const router = useRouter();

  async function handleLogout() {
    await axios.post("/api/logout");
    router.push("/login");
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold text-gray-900 dark:text-white hover:opacity-80 transition"
        >
          Job Tracker
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/users"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            Users
          </Link>
          <Link
            href="/jobs"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            Jobs
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition"
          >
            Logout
          </button>
          <Link
            href="/profile"
            aria-label="Profile"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12 2a5 5 0 100 10A5 5 0 0012 2zM4 20a8 8 0 1116 0H4z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}
