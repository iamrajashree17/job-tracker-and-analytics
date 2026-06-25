import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const users = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/users.json"), "utf-8")
  );

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        createdAt: new Date(u.createdAt),
      },
    });
    console.log(`Seeded user: ${u.email}`);
  }

  const jobs = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/jobs.json"), "utf-8")
  );

  // Associate all jobs with the first user
  const firstUser = await prisma.user.findFirst();
  if (!firstUser) throw new Error("No users found — seed users first");

  for (const j of jobs) {
    await prisma.job.upsert({
      where: { id: j.id },
      update: {},
      create: {
        id: j.id,
        company: j.company,
        role: j.role,
        status: j.status,
        appliedAt: j.appliedAt ? new Date(j.appliedAt) : null,
        jobUrl: j.jobUrl || null,
        notes: j.notes || null,
        isDeleted: j.isDeleted ?? false,
        userId: firstUser.id,
      },
    });
    console.log(`Seeded job: ${j.company} — ${j.role}`);
  }

  await prisma.profile.upsert({
    where: { userId: firstUser.id },
    update: {},
    create: {
      userId: firstUser.id,
      email: process.env.NEXT_PUBLIC_PROFILE_EMAIL!,
      phone: process.env.NEXT_PUBLIC_PROFILE_PHONE || null,
      role: process.env.NEXT_PUBLIC_PROFILE_ROLE || null,
      linkedin: process.env.NEXT_PUBLIC_PROFILE_LINKEDIN || null,
      github: process.env.NEXT_PUBLIC_PROFILE_GITHUB || null,
      leetcode: process.env.NEXT_PUBLIC_PROFILE_LEETCODE || null,
      neetcode: process.env.NEXT_PUBLIC_PROFILE_NEETCODE || null,
      geeksforgeeks: process.env.NEXT_PUBLIC_PROFILE_GEEKSFORGEEKS || null,
      salaryInr: process.env.NEXT_PUBLIC_PROFILE_SALARY_INR || null,
      salaryUsd: process.env.NEXT_PUBLIC_PROFILE_SALARY_USD?.trim() || null,
      coverLetter: process.env.NEXT_PUBLIC_PROFILE_COVER_LETTER || null,
    },
  });
  console.log("Seeded profile");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
