"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

type Job = {
  id: string;
  company: string;
  role: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected";
  appliedAt: string | null;
  jobUrl?: string | null;
};

const STATUS_STYLES: Record<Job["status"], string> = {
  applied:   "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
  screening: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800",
  interview: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
  offer:     "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800",
  rejected:  "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800",
};

const STATUS_LABELS: Record<Job["status"], string> = {
  applied:   "Applied",
  screening: "Screening",
  interview: "Interview",
  offer:     "Offer",
  rejected:  "Rejected",
};

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get<{ jobs: Job[] }>("/api/jobs")
      .then((res) => setJobs(res.data.jobs))
      .catch(() => setError("Failed to load jobs."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-bg">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="page-title">
            Jobs
          </h1>
          <Link
            href="/jobs/add"
            className="btn-add"
          >
            <span className="text-base leading-none">+</span>
            Add New Job
          </Link>
        </div>

        {loading && (
          <p className="text-muted mt-4">
            Loading...
          </p>
        )}

        {error && (
          <div className="alert-error mt-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-muted mb-6">
              {jobs.length} {jobs.length === 1 ? "application" : "applications"}
            </p>

            {jobs.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                  No job applications yet.
                </p>
                <Link
                  href="/jobs/add"
                  className="btn-add"
                >
                  <span className="text-base leading-none">+</span>
                  Add your first job
                </Link>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                        Company
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                        Role
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                        Applied
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, i) => (
                      <tr
                        key={job.id}
                        className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${
                          i % 2 === 0 ? "" : "bg-gray-50 dark:bg-gray-800/40"
                        }`}
                      >
                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                          {job.jobUrl ? (
                            <a
                              href={job.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
                            >
                              {job.company}
                            </a>
                          ) : (
                            job.company
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {job.role}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_STYLES[job.status]
                            }`}
                          >
                            {STATUS_LABELS[job.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-500">
                          {job.appliedAt
                            ? new Date(job.appliedAt).toLocaleDateString("en-US", {
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
