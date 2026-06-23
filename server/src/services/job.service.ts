import { readJobs, writeJobs } from "../utils/fileDb.utils";

export function listJobs(status?: string) {
    const jobs = readJobs();
    if (status) {
        return jobs.filter((job: any) => job.status === status);
    }
    return jobs;
}

export function addJob(job: any) {
    const jobs = readJobs();
    job.id = crypto.randomUUID(),
    jobs.push(job);
    writeJobs(jobs);
}

export function getJob(jobId: string) {
    const jobs = readJobs();
    const job = jobs.find((j: any) => j.id === jobId);
    if (!job) throw new Error(`Job with ID ${jobId} not found.`);
    return job;
}

export function updateJob(jobId: string, updatedJob: any) {
    const jobs = readJobs();
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex !== -1) {
        jobs[jobIndex] = { ...jobs[jobIndex], ...updatedJob };
        writeJobs(jobs);
    } else {
        throw new Error(`Job with ID ${jobId} not found.`);
    }
}