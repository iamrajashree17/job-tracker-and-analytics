import { readJobs, writeJobs } from "../utils/fileDb.utils";

export function listJobs() {
    const jobs = readJobs();
    return jobs;
}

export function addJob(job: any) {
    const jobs = readJobs();
    job.id = crypto.randomUUID(),
    jobs.push(job);
    writeJobs(jobs);
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