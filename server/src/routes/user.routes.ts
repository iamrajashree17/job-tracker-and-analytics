import app from "express";
import { userHandler } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const userRouter = app.Router();

userRouter.get("/", authenticate, userHandler);

export default userRouter;
