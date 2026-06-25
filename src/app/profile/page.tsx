"use client";

import { useState } from "react";

const EMAIL = process.env.NEXT_PUBLIC_PROFILE_EMAIL ?? "";
const PHONE = process.env.NEXT_PUBLIC_PROFILE_PHONE ?? "";
const ROLE = process.env.NEXT_PUBLIC_PROFILE_ROLE ?? "";
const LINKEDIN = process.env.NEXT_PUBLIC_PROFILE_LINKEDIN ?? "";
const GITHUB = process.env.NEXT_PUBLIC_PROFILE_GITHUB ?? "";
const LEETCODE = process.env.NEXT_PUBLIC_PROFILE_LEETCODE ?? "";
const NEETCODE = process.env.NEXT_PUBLIC_PROFILE_NEETCODE ?? "";
const SALARY_INR = process.env.NEXT_PUBLIC_PROFILE_SALARY_INR ?? "";
const SALARY_USD = process.env.NEXT_PUBLIC_PROFILE_SALARY_USD ?? "";
const COVER_LETTER = (process.env.NEXT_PUBLIC_PROFILE_COVER_LETTER ?? "").replace(/\\n/g, "\n");

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

const LINKS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    value: LINKEDIN,
    icon: (
      <svg className="w-5 h-5 text-blue-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    value: GITHUB,
    icon: (
      <svg className="w-5 h-5 text-gray-800 dark:text-gray-200 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    id: "leetcode",
    label: "LeetCode",
    value: LEETCODE,
    icon: (
      <svg className="w-5 h-5 text-yellow-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 00-1.209 2.104 5.35 5.35 0 00-.125 2.236 5.378 5.378 0 00.857 2.08l.074.103a5.31 5.31 0 001.499 1.52l.102.07a5.333 5.333 0 002.104.849 5.404 5.404 0 002.262-.026l3.865 4.14a1.374 1.374 0 001.943.021l5.453-5.453a1.374 1.374 0 00.021-1.942l-4.14-3.866a5.404 5.404 0 00.026-2.262 5.332 5.332 0 00-.849-2.103l-.07-.102a5.31 5.31 0 00-1.52-1.5l-.103-.073a5.378 5.378 0 00-2.08-.857 5.35 5.35 0 00-2.236.125 5.266 5.266 0 00-2.104 1.209L6.226 7.116.438 12.522A1.374 1.374 0 000 13.483a1.374 1.374 0 00.438.961l5.406 5.788a1.374 1.374 0 001.942.021z" />
      </svg>
    ),
  },
  {
    id: "neetcode",
    label: "NeetCode",
    value: NEETCODE,
    icon: (
      <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ProfilePage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function handleCopy(id: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  return (
    <div className="page-bg">
      <div className="max-w-2xl mx-auto p-8 space-y-6">
        <h1 className="page-title">Profile</h1>

        {/* Contact & Role */}
        {(EMAIL || PHONE || ROLE) && (
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Contact & Role</h2>

            {ROLE && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-purple-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Role</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{ROLE}</p>
                </div>
                <CopyButton id="role" value={ROLE} copiedKey={copiedKey} onCopy={handleCopy} />
              </div>
            )}

            {EMAIL && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" strokeLinecap="round" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Email</p>
                  <a href={`mailto:${EMAIL}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all">
                    {EMAIL}
                  </a>
                </div>
                <CopyButton id="email" value={EMAIL} copiedKey={copiedKey} onCopy={handleCopy} />
              </div>
            )}

            {PHONE && (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6.6 10.8a15.3 15.3 0 006.6 6.6l2.2-2.2a1 1 0 011.05-.24 11.5 11.5 0 003.6.72A1 1 0 0121 17v3.5A1 1 0 0120 21.5C10.3 21.5 2.5 13.7 2.5 4a1 1 0 011-1H7a1 1 0 011 .95 11.5 11.5 0 00.72 3.6 1 1 0 01-.24 1.05L6.6 10.8z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Phone</p>
                  <a href={`tel:${PHONE}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    {PHONE}
                  </a>
                </div>
                <CopyButton id="phone" value={PHONE} copiedKey={copiedKey} onCopy={handleCopy} />
              </div>
            )}
          </div>
        )}

        {/* Links */}
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Links</h2>

          {LINKS.filter((l) => l.value).map((link) => (
            <div key={link.id} className="flex items-center gap-3">
              {link.icon}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">{link.label}</p>
                <a
                  href={link.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
                >
                  {link.value}
                </a>
              </div>
              <CopyButton id={link.id} value={link.value} copiedKey={copiedKey} onCopy={handleCopy} />
            </div>
          ))}
        </div>

        {/* Expected Salary */}
        <div className="card p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Expected Salary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">INR</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{SALARY_INR || "—"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">USD</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ${SALARY_USD || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Cover Letter</h2>
            <CopyButton id="cover-letter" value={COVER_LETTER} copiedKey={copiedKey} onCopy={handleCopy} />
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 font-sans">
            {COVER_LETTER || "Cover letter not set."}
          </pre>
        </div>
      </div>
    </div>
  );
}
