import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth";
import {
	createProject,
	deleteProject,
	getAllTasks,
	getLoggedInUserProjects,
	getProject,
	updateProject,
} from "../controllers/projectController";

const router = Router();

router.route("/").get(isLoggedIn, getLoggedInUserProjects);
router.route("/create").post(isLoggedIn, createProject);
router
	.route("/:id")
	.get(isLoggedIn, getProject)
	.patch(isLoggedIn, updateProject)
	.delete(isLoggedIn, deleteProject);
router.route("/:id/tasks").get(isLoggedIn, getAllTasks);

export default router;
