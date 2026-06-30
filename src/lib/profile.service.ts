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

export async function getProfile(userId: string): Promise<Profile | null> {
  const row = await prisma.profile.findUnique({ where: { userId } });
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

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  const row = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      email: updates.email ?? "",
      phone: updates.phone ?? null,
      role: updates.role ?? null,
      linkedin: updates.linkedin ?? null,
      github: updates.github ?? null,
      leetcode: updates.leetcode ?? null,
      neetcode: updates.neetcode ?? null,
      geeksforgeeks: updates.geeksforgeeks ?? null,
      salaryInr: updates.salaryInr ?? null,
      salaryUsd: updates.salaryUsd ?? null,
      coverLetter: updates.coverLetter ?? null,
    },
    update: {
      email: updates.email ?? undefined,
      phone: updates.phone ?? undefined,
      role: updates.role ?? undefined,
      linkedin: updates.linkedin ?? undefined,
      github: updates.github ?? undefined,
      leetcode: updates.leetcode ?? undefined,
      neetcode: updates.neetcode ?? undefined,
      geeksforgeeks: updates.geeksforgeeks ?? undefined,
      salaryInr: updates.salaryInr ?? undefined,
      salaryUsd: updates.salaryUsd ?? undefined,
      coverLetter: updates.coverLetter ?? undefined,
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
