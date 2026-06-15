import express  from "express"
import { addJobHandler, jobHandler } from "../controllers/job.controller";
const jobRouter = express.Router();

jobRouter.get("/", jobHandler);
jobRouter.post("/", addJobHandler);


export default jobRouter;