import { Request, Response } from "express";
import { addJob, listJobs, updateJob } from "../services/job.service";

export function jobHandler(req: Request, res: Response) {
    const status = req.query.status as string | undefined;
    const jobs = listJobs(status);
    res.status(200).json(jobs);
}

export function addJobHandler(req: Request, res: Response) {
    const job = req.body;
    addJob(job);
    res.status(201).json({ message: "Job added successfully" });
}

export function updateJobHandler(req: Request, res: Response) {
    const jobId = req.params.id as string;
    console.log("Updating job with ID:", jobId);
    const updatedJob = req.body;
    try {
        updateJob(jobId, updatedJob);
        res.status(200).json({ message: "Job updated successfully" });
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }
}
