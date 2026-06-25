import { prisma } from "./prisma";

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

export async function getProfile(): Promise<Profile | null> {
  const row = await prisma.profile.findFirst();
  if (!row) return null;
  return {
    email: row.email,
    phone: row.phone ?? "",
    role: row.role ?? "",
    linkedin: row.linkedin ?? "",
    github: row.github ?? "",
    leetcode: row.leetcode ?? "",
    neetcode: row.neetcode ?? "",
    geeksforgeeks: row.geeksforgeeks ?? "",
    salaryInr: row.salaryInr ?? "",
    salaryUsd: row.salaryUsd ?? "",
    coverLetter: row.coverLetter ?? "",
  };
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
  const existing = await prisma.profile.findFirst();
  if (!existing) return null;

  const row = await prisma.profile.update({
    where: { id: existing.id },
    data: {
      email: updates.email ?? existing.email,
      phone: updates.phone ?? existing.phone,
      role: updates.role ?? existing.role,
      linkedin: updates.linkedin ?? existing.linkedin,
      github: updates.github ?? existing.github,
      leetcode: updates.leetcode ?? existing.leetcode,
      neetcode: updates.neetcode ?? existing.neetcode,
      geeksforgeeks: updates.geeksforgeeks ?? existing.geeksforgeeks,
      salaryInr: updates.salaryInr ?? existing.salaryInr,
      salaryUsd: updates.salaryUsd ?? existing.salaryUsd,
      coverLetter: updates.coverLetter ?? existing.coverLetter,
    },
  });

  return {
    email: row.email,
    phone: row.phone ?? "",
    role: row.role ?? "",
    linkedin: row.linkedin ?? "",
    github: row.github ?? "",
    leetcode: row.leetcode ?? "",
    neetcode: row.neetcode ?? "",
    geeksforgeeks: row.geeksforgeeks ?? "",
    salaryInr: row.salaryInr ?? "",
    salaryUsd: row.salaryUsd ?? "",
    coverLetter: row.coverLetter ?? "",
  };
}
