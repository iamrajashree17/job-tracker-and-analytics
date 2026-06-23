"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

type FormData = {
  company: string;
  role: string;
  status: "applied" | "screening" | "interview" | "offer" | "rejected" | "not_moving_forward";
  appliedAt: string;
  jobUrl: string;
  notes: string;
};

export default function EditJob() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get<FormData>(`/api/jobs/${id}`)
      .then((res) => {
        const job = res.data;
        setForm({
          company: job.company ?? "",
          role: job.role ?? "",
          status: job.status ?? "applied",
          appliedAt: job.appliedAt ? String(job.appliedAt).split("T")[0] : "",
          jobUrl: (job as any).jobUrl ?? "",
          notes: (job as any).notes ?? "",
        });
      })
      .catch(() => setError("Failed to load job."))
      .finally(() => setLoading(false));
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => prev && { ...prev, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await axios.patch(`/api/jobs/${id}`, form);
      router.push("/jobs");
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-bg">
        <div className="max-w-xl mx-auto p-8">
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="page-bg">
        <div className="max-w-xl mx-auto p-8">
          <div className="alert-error">{error}</div>
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-700 mt-4 inline-block">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg">
      <div className="max-w-xl mx-auto p-8">
        <div className="mb-6">
          <Link
            href="/jobs"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
          >
            ← Back to Jobs
          </Link>
          <h1 className="page-title mt-2">Edit Job</h1>
        </div>

        <div className="card p-8">
          {error && <div className="alert-error mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="company" className="form-label">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                value={form!.company}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="role" className="form-label">
                Role / Position <span className="text-red-500">*</span>
              </label>
              <input
                id="role"
                name="role"
                type="text"
                required
                value={form!.role}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form!.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="not_moving_forward">Not Moving Forward</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label htmlFor="appliedAt" className="form-label">
                Date Applied
              </label>
              <input
                id="appliedAt"
                name="appliedAt"
                type="date"
                value={form!.appliedAt}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="jobUrl" className="form-label">
                Job URL <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="jobUrl"
                name="jobUrl"
                type="url"
                placeholder="https://..."
                value={form!.jobUrl}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="notes" className="form-label">
                Notes <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Recruiter name, salary range, next steps..."
                value={form!.notes}
                onChange={handleChange}
                className="input-field resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <Link
                href="/jobs"
                className="flex-1 py-2.5 px-4 text-center text-sm font-semibold rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
