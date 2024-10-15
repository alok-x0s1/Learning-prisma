import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth";
import {
	createTask,
	deleteTask,
	getLoggedInUserTasks,
	getTask,
	updateTask,
	updateTaskStatus,
} from "../controllers/taskController";

const router = Router();

router.route("/").get(isLoggedIn, getLoggedInUserTasks);
router.route("/create").post(isLoggedIn, createTask);
router
	.route("/:id")
	.get(isLoggedIn, getTask)
	.patch(isLoggedIn, updateTask)
	.delete(isLoggedIn, deleteTask);
router.route("/:id/status").patch(isLoggedIn, updateTaskStatus);

export default router;
