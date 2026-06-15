import express  from "express"
import { addJobHandler, jobHandler, updateJobHandler } from "../controllers/job.controller";
const jobRouter = express.Router();

jobRouter.get("/", jobHandler);
jobRouter.post("/", addJobHandler);
jobRouter.patch("/:id", updateJobHandler);


export default jobRouter;