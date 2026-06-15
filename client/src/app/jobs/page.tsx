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
  notes?: string | null;
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

const ALL_STATUSES = Object.keys(STATUS_LABELS) as Job["status"][];

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<{ jobs: Job[] }>("/api/jobs")
      .then((res) => setJobs(res.data.jobs))
      .catch(() => setError("Failed to load jobs."))
      .finally(() => setLoading(false));
  }, []);

  function openDropdown(e: React.MouseEvent<HTMLButtonElement>, jobId: string) {
    if (openStatusId === jobId) {
      setOpenStatusId(null);
      setDropdownPos(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, left: rect.left });
    setOpenStatusId(jobId);
  }

  function closeDropdown() {
    setOpenStatusId(null);
    setDropdownPos(null);
  }

  async function handleStatusChange(jobId: string, newStatus: Job["status"]) {
    const prevStatus = jobs.find((j) => j.id === jobId)?.status;
    closeDropdown();
    setJobs((curr) =>
      curr.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );
    setUpdating(jobId);
    try {
      await axios.patch(`/api/jobs/${jobId}`, { status: newStatus });
    } catch (err: any) {
      console.error("Status update failed:", err?.response?.data ?? err?.message ?? err);
      setError(err?.response?.data?.error ?? err?.response?.data?.message ?? "Failed to update status.");
      if (prevStatus) {
        setJobs((curr) =>
          curr.map((j) => (j.id === jobId ? { ...j, status: prevStatus } : j))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  const openJob = jobs.find((j) => j.id === openStatusId);

  return (
    <div className="page-bg">
      {/* Overlay + dropdown rendered at root level to escape table stacking context */}
      {openStatusId && (
        <div className="fixed inset-0 z-40" onClick={closeDropdown} />
      )}
      {openStatusId && dropdownPos && openJob && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-40"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {ALL_STATUSES.filter((s) => s !== openJob.status).map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(openJob.id, s)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center transition-colors"
            >
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[s]}`}>
                {STATUS_LABELS[s]}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="page-title">Jobs</h1>
          <Link href="/jobs/add" className="btn-add">
            <span className="text-base leading-none">+</span>
            Add New Job
          </Link>
        </div>

        {loading && <p className="text-muted mt-4">Loading...</p>}

        {error && (
          <div className="alert-error mt-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-4 text-red-400 hover:text-red-600 text-lg leading-none">×</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-muted mb-6">
              {jobs.length} {jobs.length === 1 ? "application" : "applications"}
            </p>

            {jobs.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">No job applications yet.</p>
                <Link href="/jobs/add" className="btn-add">
                  <span className="text-base leading-none">+</span>
                  Add your first job
                </Link>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Company</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Applied</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Notes</th>
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
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{job.role}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={(e) => openDropdown(e, job.id)}
                            disabled={updating === job.id}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition ${
                              STATUS_STYLES[job.status]
                            } ${updating === job.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            {STATUS_LABELS[job.status]}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 12 12"
                              className="w-3 h-3 opacity-60"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path d="M2.5 4.5l3.5 3 3.5-3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
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
                        <td className="px-6 py-4 relative group">
                          {job.notes ? (
                            <>
                              <span className="block max-w-36 truncate text-gray-500 dark:text-gray-400 cursor-default text-xs">
                                {job.notes}
                              </span>
                              <div className="absolute z-30 bottom-full left-0 mb-2 w-64 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                                <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg leading-relaxed whitespace-pre-wrap break-words">
                                  {job.notes}
                                </div>
                                <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900 dark:border-t-gray-700 ml-4" />
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>
                          )}
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
