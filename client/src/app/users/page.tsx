"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string | null;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get<{ users: User[] }>("/api/users")
      .then((res) => setUsers(res.data.users))
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Users
        </h1>

        {loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Loading...
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {users.length} registered {users.length === 1 ? "user" : "users"}
            </p>

            {users.length === 0 ? (
              <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-lg p-8 text-center text-gray-500 dark:text-gray-400">
                No users yet.
              </div>
            ) : (
              <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                        Name
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                        Email
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <tr
                        key={user.id}
                        className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                          i % 2 === 0 ? "" : "bg-gray-50 dark:bg-gray-800/40"
                        }`}
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-500">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
