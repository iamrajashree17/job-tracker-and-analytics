import { readJobs, writeJobs } from "../utils/fileDb.utils";

export function listJobs() {
    const jobs = readJobs();
    return jobs;
}

export function addJob(job: any) {
    const jobs = readJobs();
    jobs.push(job);
    writeJobs(jobs);
}