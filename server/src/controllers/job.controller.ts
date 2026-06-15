import { addJob, listJobs } from "../services/job.service";


export function jobHandler(req: Request, res: any) {
    const jobs = listJobs();
    res.status(200).json(jobs);
}

export function addJobHandler(req: Request, res: any) {
    const job = req.body;
    addJob(job);
    res.status(201).json({ message: "Job added successfully" });
}