import { readProfile, writeProfile } from "./fileDb";

export interface Profile {
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

function envDefaults(): Profile {
  return {
    email: process.env.NEXT_PUBLIC_PROFILE_EMAIL ?? "",
    phone: process.env.NEXT_PUBLIC_PROFILE_PHONE ?? "",
    role: process.env.NEXT_PUBLIC_PROFILE_ROLE ?? "",
    linkedin: process.env.NEXT_PUBLIC_PROFILE_LINKEDIN ?? "",
    github: process.env.NEXT_PUBLIC_PROFILE_GITHUB ?? "",
    leetcode: process.env.NEXT_PUBLIC_PROFILE_LEETCODE ?? "",
    neetcode: process.env.NEXT_PUBLIC_PROFILE_NEETCODE ?? "",
    geeksforgeeks: process.env.NEXT_PUBLIC_PROFILE_GEEKSFORGEEKS ?? "",
    salaryInr: process.env.NEXT_PUBLIC_PROFILE_SALARY_INR ?? "",
    salaryUsd: process.env.NEXT_PUBLIC_PROFILE_SALARY_USD ?? "",
    coverLetter: (process.env.NEXT_PUBLIC_PROFILE_COVER_LETTER ?? "").replace(/\\n/g, "\n"),
  };
}

export function getProfile(): Profile {
  const stored = readProfile();
  return { ...envDefaults(), ...stored };
}

export function updateProfile(updates: Partial<Profile>): Profile {
  const updated = { ...getProfile(), ...updates };
  writeProfile(updated as Record<string, string>);
  return updated;
}
