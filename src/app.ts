import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Express = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/userRoute";
import projectRouter from "./routes/projectRoute";
import taskRouter from "./routes/taskRoute";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);

export { app };
