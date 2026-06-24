import express  from "express"
import { addJobHandler, deleteJobHandler, getJobHandler, jobHandler, updateJobHandler } from "../controllers/job.controller";
const jobRouter = express.Router();

jobRouter.get("/", jobHandler);
jobRouter.post("/", addJobHandler);
jobRouter.get("/:id", getJobHandler);
jobRouter.delete("/:id", deleteJobHandler);
jobRouter.patch("/:id", updateJobHandler);


export default jobRouter;