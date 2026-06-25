"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Profile {
  email: string;
  phone: string;
  role: string;
  linkedin: string;
  github: string;
  leetcode: string;
  neetcode: string;
  geeksforgeeks: string;
  salaryInr: string;
  salaryUsd: string;
  coverLetter: string;
}

const EMPTY: Profile = {
  email: "", phone: "", role: "",
  linkedin: "", github: "", leetcode: "",
  neetcode: "", geeksforgeeks: "",
  salaryInr: "", salaryUsd: "", coverLetter: "",
};

function CopyButton({ value, id, copiedKey, onCopy }: {
  value: string;
  id: string;
  copiedKey: string | null;
  onCopy: (id: string, value: string) => void;
}) {
  const isCopied = copiedKey === id;
  return (
    <button
      onClick={() => onCopy(id, value)}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition shrink-0 ${
        isCopied
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      }`}
    >
      {isCopied ? (
        <>
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 8l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="5" width="9" height="9" rx="1.5" />
            <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" strokeLinecap="round" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(EMPTY);
  const [draft, setDraft] = useState<Profile>(EMPTY);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    axios.get<{ profile: Profile }>("/api/profile")
      .then((res) => {
        setProfile(res.data.profile);
        setDraft(res.data.profile);
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  function handleEdit() {
    setDraft(profile);
    setError("");
    setEditing(true);
  }

  function handleCancel() {
    setDraft(profile);
    setError("");
    setEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await axios.put<{ profile: Profile }>("/api/profile", draft);
      setProfile(res.data.profile);
      setEditing(false);
    } catch {
      setError("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  function set(field: keyof Profile) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleCopy(id: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const links = [
    {
      id: "linkedin", label: "LinkedIn", value: profile.linkedin,
      icon: (
        <svg className="w-5 h-5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      id: "github", label: "GitHub", value: profile.github,
      icon: (
        <svg className="w-5 h-5 text-gray-800 dark:text-gray-200 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      id: "leetcode", label: "LeetCode", value: profile.leetcode,
      icon: (
        <svg className="w-5 h-5 text-yellow-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 00-1.209 2.104 5.35 5.35 0 00-.125 2.236 5.378 5.378 0 00.857 2.08l.074.103a5.31 5.31 0 001.499 1.52l.102.07a5.333 5.333 0 002.104.849 5.404 5.404 0 002.262-.026l3.865 4.14a1.374 1.374 0 001.943.021l5.453-5.453a1.374 1.374 0 00.021-1.942l-4.14-3.866a5.404 5.404 0 00.026-2.262 5.332 5.332 0 00-.849-2.103l-.07-.102a5.31 5.31 0 00-1.52-1.5l-.103-.073a5.378 5.378 0 00-2.08-.857 5.35 5.35 0 00-2.236.125 5.266 5.266 0 00-2.104 1.209L6.226 7.116.438 12.522A1.374 1.374 0 000 13.483a1.374 1.374 0 00.438.961l5.406 5.788a1.374 1.374 0 001.942.021z" />
        </svg>
      ),
    },
    {
      id: "neetcode", label: "NeetCode", value: profile.neetcode,
      icon: (
        <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "geeksforgeeks", label: "GeeksForGeeks", value: profile.geeksforgeeks,
      icon: (
        <svg className="w-5 h-5 text-green-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 01-1.104.695 4.51 4.51 0 01-3.116-.016 3.79 3.79 0 01-1.mp.695c0-.001 0-.001 0 0l-.022-.013a4.978 4.978 0 01-.663-.51 3.646 3.646 0 01-.567-.747h-.004a3.965 3.965 0 01-.438-1.673H12v-.003c-.028-.623.087-1.24.34-1.8l.004.002c.136-.31.316-.6.535-.86.21-.25.454-.476.726-.667A3.875 3.875 0 0115 9.5c.74 0 1.43.196 2.02.54a3.81 3.81 0 011.4 1.44c.332.6.5 1.27.5 1.99v.015c0 .283-.03.567-.09.845h-5.72v.004c.045.28.14.55.28.8zm-2.45-2.015h-3.6c.04-.22.12-.43.24-.62.12-.19.28-.36.47-.49.36-.24.79-.37 1.24-.37.45 0 .88.13 1.23.37.19.13.35.3.47.49.12.19.2.4.24.62h-.29zM12 14.32v.004h1.01c.1.33.26.64.47.91.22.27.5.5.82.66.64.32 1.38.41 2.08.26.35-.08.67-.22.95-.43.28-.21.51-.47.68-.77.17-.3.27-.63.3-.97h.96c-.04.56-.2 1.1-.47 1.59-.27.49-.65.92-1.1 1.24-.45.32-.96.54-1.5.64-.54.1-1.1.08-1.63-.06-.53-.14-1.02-.4-1.44-.76a3.922 3.922 0 01-.95-1.27 3.916 3.916 0 01-.17-1.04zm-9.45 0c.143.28.334.532.565.745.31.278.663.5 1.044.654a4.51 4.51 0 003.116-.016 3.79 3.79 0 001.04-.654c.23-.213.42-.465.566-.745h.004c.28-.52.43-1.09.438-1.67H9.97v-.003c.028-.623-.087-1.24-.34-1.8l-.004.002a3.91 3.91 0 00-.535-.86 3.754 3.754 0 00-.726-.667A3.875 3.875 0 006.94 8.5c-.74 0-1.43.196-2.02.54a3.81 3.81 0 00-1.4 1.44C3.188 11.08 3.02 11.75 3.02 12.47v.015c0 .283.03.567.09.845h5.72v.004c-.045.28-.14.55-.28.8zm2.45-2.015h3.6c-.04-.22-.12-.43-.24-.62-.12-.19-.28-.36-.47-.49A2.344 2.344 0 006.76 11c-.45 0-.88.13-1.23.37-.19.13-.35.3-.47.49-.12.19-.2.4-.24.62h.29zM12 14.32v.004H10.99c-.1.33-.26.64-.47.91-.22.27-.5.5-.82.66-.64.32-1.38.41-2.08.26a2.758 2.758 0 01-.95-.43c-.28-.21-.51-.47-.68-.77-.17-.3-.27-.63-.3-.97h-.96c.04.56.2 1.1.47 1.59.27.49.65.92 1.1 1.24.45.32.96.54 1.5.64.54.1 1.1.08 1.63-.06.53-.14 1.02-.4 1.44-.76.42-.36.73-.82.95-1.27.12-.33.18-.68.17-1.04z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="page-bg">
        <div className="max-w-2xl mx-auto p-8">
          <p className="text-sm text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="page-bg">
        <div className="max-w-2xl mx-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="page-title">Edit Profile</h1>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {/* Contact & Role */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Contact & Role</h2>
            <Field label="Role / Title">
              <input className={inputCls} value={draft.role} onChange={set("role")} placeholder="e.g. Senior Full Stack Engineer" />
            </Field>
            <Field label="Email">
              <input className={inputCls} type="email" value={draft.email} onChange={set("email")} placeholder="you@example.com" />
            </Field>
            <Field label="Phone">
              <input className={inputCls} value={draft.phone} onChange={set("phone")} placeholder="+91 9876543210" />
            </Field>
          </div>

          {/* Links */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Links</h2>
            <Field label="LinkedIn">
              <input className={inputCls} type="url" value={draft.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/..." />
            </Field>
            <Field label="GitHub">
              <input className={inputCls} type="url" value={draft.github} onChange={set("github")} placeholder="https://github.com/..." />
            </Field>
            <Field label="LeetCode">
              <input className={inputCls} type="url" value={draft.leetcode} onChange={set("leetcode")} placeholder="https://leetcode.com/u/..." />
            </Field>
            <Field label="NeetCode">
              <input className={inputCls} type="url" value={draft.neetcode} onChange={set("neetcode")} placeholder="https://neetcode.io/profile/..." />
            </Field>
            <Field label="GeeksForGeeks">
              <input className={inputCls} type="url" value={draft.geeksforgeeks} onChange={set("geeksforgeeks")} placeholder="https://geeksforgeeks.org/profile/..." />
            </Field>
          </div>

          {/* Salary */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Expected Salary</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="INR (e.g. 35–50 LPA)">
                <input className={inputCls} value={draft.salaryInr} onChange={set("salaryInr")} placeholder="35–50 LPA" />
              </Field>
              <Field label="USD (e.g. 36500–52500)">
                <input className={inputCls} value={draft.salaryUsd} onChange={set("salaryUsd")} placeholder="36500–52500" />
              </Field>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Cover Letter</h2>
            <textarea
              className={`${inputCls} min-h-64 resize-y font-sans leading-relaxed`}
              value={draft.coverLetter}
              onChange={set("coverLetter")}
              placeholder="Write your cover letter here..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg">
      <div className="max-w-2xl mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="page-title">Profile</h1>
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Edit Profile
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Contact & Role */}
        {(profile.email || profile.phone || profile.role) && (
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Contact & Role</h2>

            {profile.role && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-purple-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Role</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{profile.role}</p>
                </div>
                <CopyButton id="role" value={profile.role} copiedKey={copiedKey} onCopy={handleCopy} />
              </div>
            )}

            {profile.email && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" strokeLinecap="round" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Email</p>
                  <a href={`mailto:${profile.email}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all">
                    {profile.email}
                  </a>
                </div>
                <CopyButton id="email" value={profile.email} copiedKey={copiedKey} onCopy={handleCopy} />
              </div>
            )}

            {profile.phone && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6.6 10.8a15.3 15.3 0 006.6 6.6l2.2-2.2a1 1 0 011.05-.24 11.5 11.5 0 003.6.72A1 1 0 0121 17v3.5A1 1 0 0120 21.5C10.3 21.5 2.5 13.7 2.5 4a1 1 0 011-1H7a1 1 0 011 .95 11.5 11.5 0 00.72 3.6 1 1 0 01-.24 1.05L6.6 10.8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Phone</p>
                  <a href={`tel:${profile.phone}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {profile.phone}
                  </a>
                </div>
                <CopyButton id="phone" value={profile.phone} copiedKey={copiedKey} onCopy={handleCopy} />
              </div>
            )}
          </div>
        )}

        {/* Links */}
        {links.some((l) => l.value) && (
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Links</h2>
            {links.filter((l) => l.value).map((link) => (
              <div key={link.id} className="flex items-center gap-3">
                {link.icon}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{link.label}</p>
                  <a href={link.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all">
                    {link.value}
                  </a>
                </div>
                <CopyButton id={link.id} value={link.value} copiedKey={copiedKey} onCopy={handleCopy} />
              </div>
            ))}
          </div>
        )}

        {/* Expected Salary */}
        {(profile.salaryInr || profile.salaryUsd) && (
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Expected Salary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">INR</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">₹{profile.salaryInr || "—"}</p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">USD</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">${profile.salaryUsd || "—"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cover Letter */}
        {profile.coverLetter && (
          <div className="card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Cover Letter</h2>
              <CopyButton id="cover-letter" value={profile.coverLetter} copiedKey={copiedKey} onCopy={handleCopy} />
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 font-sans">
              {profile.coverLetter}
            </pre>
          </div>
        )}

        {!profile.email && !profile.role && !profile.phone && !links.some((l) => l.value) && !profile.coverLetter && (
          <div className="card p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
            No profile details yet. Click <strong>Edit Profile</strong> to add your information.
          </div>
        )}
      </div>
    </div>
  );
}
