import { prisma } from "./prisma";

export async function listJobs(status?: string, fromDate?: string, toDate?: string) {
  return prisma.job.findMany({
    where: {
      isDeleted: false,
      ...(status ? { status } : {}),
      ...(fromDate || toDate
        ? {
            appliedAt: {
              ...(fromDate ? { gte: new Date(fromDate) } : {}),
              ...(toDate ? { lte: new Date(new Date(toDate).getTime() + 86399999) } : {}),
            },
          }
        : {}),
    },
    orderBy: { appliedAt: "desc" },
  });
}

export async function addJob(userId: string, data: {
  company: string;
  role: string;
  status: string;
  appliedAt?: string;
  jobUrl?: string;
  notes?: string;
}) {
  return prisma.job.create({
    data: {
      company: data.company,
      role: data.role,
      status: data.status,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
      jobUrl: data.jobUrl || null,
      notes: data.notes || null,
      userId,
    },
  });
}

export async function getJob(jobId: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error(`Job with ID ${jobId} not found.`);
  return job;
}

export async function deleteJob(jobId: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error(`Job with ID ${jobId} not found.`);
  return prisma.job.update({ where: { id: jobId }, data: { isDeleted: true } });
}

export async function updateJob(jobId: string, updates: {
  company?: string;
  role?: string;
  status?: string;
  appliedAt?: string;
  jobUrl?: string;
  notes?: string;
}) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error(`Job with ID ${jobId} not found.`);
  return prisma.job.update({
    where: { id: jobId },
    data: {
      ...(updates.company !== undefined ? { company: updates.company } : {}),
      ...(updates.role !== undefined ? { role: updates.role } : {}),
      ...(updates.status !== undefined ? { status: updates.status } : {}),
      ...(updates.appliedAt !== undefined ? { appliedAt: updates.appliedAt ? new Date(updates.appliedAt) : null } : {}),
      ...(updates.jobUrl !== undefined ? { jobUrl: updates.jobUrl || null } : {}),
      ...(updates.notes !== undefined ? { notes: updates.notes || null } : {}),
    },
  });
}
