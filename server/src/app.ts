import express from "express";
import authRouter from "./routes/auth.routes";
import cors from "cors";
import userRouter from "./routes/user.routes";
import jobRouter from "./routes/job.routes";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/jobs", jobRouter);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
