"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

type Job = {
  id: string;
  company: string;
  role: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected" | "not_moving_forward";
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
  not_moving_forward: "bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 border border-gray-200 dark:border-gray-700",
};

const STATUS_LABELS: Record<Job["status"], string> = {
  applied:   "Applied",
  screening: "Screening",
  interview: "Interview",
  offer:     "Offer",
  rejected:  "Rejected",
  not_moving_forward: "Not Moving Forward",
};

const ALL_STATUSES = Object.keys(STATUS_LABELS) as Job["status"][];

type StatusFilter = Job["status"] | "all";

const FILTER_STYLES: Record<StatusFilter, { active: string; inactive: string }> = {
  all:       { active: "bg-gray-900 text-white dark:bg-white dark:text-gray-900", inactive: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800" },
  applied:   { active: "bg-blue-600 text-white", inactive: "text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30" },
  screening: { active: "bg-yellow-500 text-white", inactive: "text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30" },
  interview: { active: "bg-purple-600 text-white", inactive: "text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30" },
  offer:     { active: "bg-green-600 text-white", inactive: "text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30" },
  rejected:  { active: "bg-red-600 text-white", inactive: "text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" },
  not_moving_forward: { active: "bg-gray-600 text-white", inactive: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" },
};

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "not_moving_forward", label: "Not Moving Forward" },
  { value: "rejected", label: "Rejected" },
];

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [openStatusId, setOpenStatusId] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  function computeCounts(allJobs: Job[]) {
    const c: Record<string, number> = { all: allJobs.length };
    for (const job of allJobs) {
      c[job.status] = (c[job.status] ?? 0) + 1;
    }
    setCounts(c);
  }

  function fetchJobs(filter: StatusFilter) {
    setLoading(true);
    setError("");
    const url = filter === "all" ? "/api/jobs" : `/api/jobs?status=${filter}`;
    axios
      .get<{ jobs: Job[] }>(url)
      .then((res) => {
        setJobs(res.data.jobs);
        if (filter === "all") computeCounts(res.data.jobs);
      })
      .catch(() => setError("Failed to load jobs."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchJobs("all");
  }, []);

  function handleFilterChange(filter: StatusFilter) {
    setActiveFilter(filter);
    fetchJobs(filter);
  }

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
      if (prevStatus && prevStatus !== newStatus) {
        setCounts((prev) => ({
          ...prev,
          [prevStatus]: Math.max(0, (prev[prevStatus] ?? 0) - 1),
          [newStatus]: (prev[newStatus] ?? 0) + 1,
        }));
      }
      if (activeFilter !== "all" && newStatus !== activeFilter) {
        setJobs((curr) => curr.filter((j) => j.id !== jobId));
      }
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

  async function handleDelete(jobId: string) {
    setDeleting(jobId);
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs((curr) => curr.filter((j) => j.id !== jobId));
      setCounts((prev) => {
        const job = jobs.find((j) => j.id === jobId);
        if (!job) return prev;
        return {
          ...prev,
          all: Math.max(0, (prev.all ?? 0) - 1),
          [job.status]: Math.max(0, (prev[job.status] ?? 0) - 1),
        };
      });
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.response?.data?.message ?? "Failed to delete job.");
    } finally {
      setDeleting(null);
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

        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2 mt-4 mb-5">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilterChange(value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === value
                  ? FILTER_STYLES[value].active
                  : FILTER_STYLES[value].inactive
              }`}
            >
              {label}{counts[value] !== undefined ? ` (${counts[value]})` : ""}
            </button>
          ))}
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
            <p className="text-muted mb-4">
              {jobs.length} {jobs.length === 1 ? "application" : "applications"}
              {activeFilter !== "all" && ` · filtered by ${STATUS_LABELS[activeFilter]}`}
            </p>

            {jobs.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                  {activeFilter === "all" ? "No job applications yet." : `No jobs with status "${STATUS_LABELS[activeFilter]}".`}
                </p>
                {activeFilter === "all" && (
                  <Link href="/jobs/add" className="btn-add">
                    <span className="text-base leading-none">+</span>
                    Add your first job
                  </Link>
                )}
              </div>
            ) : (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800 text-left">
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Company</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                      {activeFilter !== "rejected" && activeFilter !== "not_moving_forward" && <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>}
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Applied</th>
                      <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">Notes</th>
                      <th className="px-6 py-4" />
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
                        {activeFilter !== "rejected" && activeFilter !== "not_moving_forward" && (
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
                        )}
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
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/jobs/${job.id}/edit`}
                              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition inline-block"
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                                <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.714 1.224l-.449 1.795a.75.75 0 0 0 .914.914l1.795-.45a2.75 2.75 0 0 0 1.224-.713l4.262-4.262a1.75 1.75 0 0 0 0-2.475ZM2.75 3.5a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5h-4Zm0 3a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5h-2Zm0 3a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5H2.75Z" />
                              </svg>
                            </Link>
                            {(job.status === "rejected" || job.status === "not_moving_forward") && (
                              <button
                                onClick={() => handleDelete(job.id)}
                                disabled={deleting === job.id}
                                title="Delete"
                                className="text-red-400 hover:text-red-600 dark:hover:text-red-400 transition disabled:opacity-40"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                                  <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5A.75.75 0 0 1 9.95 6Z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
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
