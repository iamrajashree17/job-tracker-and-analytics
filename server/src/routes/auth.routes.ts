import express from "express";

const authRouter = express.Router();

// Import controllers
import {
  loginHandler,
  logoutHandler,
  refreshHandler,
  signupHandler,
} from "../controllers/auth.controller";

// Define routes
authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/refresh", refreshHandler);
authRouter.post("/logout", logoutHandler);

export default authRouter;
