import { readJobs, writeJobs } from "./fileDb";

export function listJobs(status?: string, fromDate?: string, toDate?: string) {
  const jobs = readJobs();
  let filtered = status ? jobs.filter((job: any) => job.status === status) : jobs;
  if (fromDate) {
    const from = new Date(fromDate).getTime();
    filtered = filtered.filter((job: any) => job.appliedAt && new Date(job.appliedAt).getTime() >= from);
  }
  if (toDate) {
    const to = new Date(toDate).getTime() + 86399999;
    filtered = filtered.filter((job: any) => job.appliedAt && new Date(job.appliedAt).getTime() <= to);
  }
  return filtered.sort((a: any, b: any) => {
    if (!a.appliedAt) return 1;
    if (!b.appliedAt) return -1;
    return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
  });
}

export function addJob(job: any) {
  const jobs = readJobs();
  job.id = crypto.randomUUID();
  job.isDeleted = false;
  jobs.push(job);
  writeJobs(jobs);
}

export function getJob(jobId: string) {
  const jobs = readJobs();
  const job = jobs.find((j: any) => j.id === jobId);
  if (!job) throw new Error(`Job with ID ${jobId} not found.`);
  return job;
}

export function deleteJob(jobId: string) {
  const jobs = readJobs();
  const idx = jobs.findIndex((j: any) => j.id === jobId);
  if (idx === -1) throw new Error(`Job with ID ${jobId} not found.`);
  jobs[idx].isDeleted = true;
  writeJobs(jobs);
}

export function updateJob(jobId: string, updates: any) {
  const jobs = readJobs();
  const idx = jobs.findIndex((j: any) => j.id === jobId);
  if (idx === -1) throw new Error(`Job with ID ${jobId} not found.`);
  jobs[idx] = { ...jobs[idx], ...updates };
  writeJobs(jobs);
}
