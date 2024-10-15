import { Request, Response } from "express";
import {
	createErrorResponse,
	createSuccessResponse,
} from "../utils/apiResponse";
import {
	createTaskSchema,
	updateStatusSchema,
	updateTaskSchema,
} from "../schemas/taskSchema";
import { prisma } from "../services/prismaClient";

const createTask = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = createTaskSchema.safeParse(req.body);
		if (!result.success) {
			res.status(400).json(
				createErrorResponse(
					"Create Task validation error",
					result.error.errors.map((err) => err.message)
				)
			);
			return;
		}

		const { title, description, status, dueDate, projectId, assignedTo } =
			result.data;
		const project = await prisma.project.findUnique({
			where: {
				id: projectId,
			},
		});
		if (!project) {
			res.status(404).json(createErrorResponse("Project not found"));
			return;
		}

		const user = await prisma.user.findUnique({
			where: {
				id: assignedTo,
			},
		});
		if (!user) {
			res.status(404).json(createErrorResponse("User not found"));
			return;
		}

		const task = await prisma.task.create({
			data: {
				title,
				description,
				status,
				dueDate,
				assignedTo,
				projectId,
			},
		});
		if (!task) {
			res.status(400).json(
				createErrorResponse("Error while creating task")
			);
			return;
		}

		res.status(201).json(
			createSuccessResponse("Task created successfully")
		);
	} catch (error) {
		console.log("Create task error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const getLoggedInUserTasks = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const id = req.user?.id;

		const tasks = await prisma.task.findMany({
			where: {
				assignedTo: id,
			},
		});

		if (tasks.length < 0) {
			res.status(404).json(createErrorResponse("Can't find any tasks"));
			return;
		}

		res.status(200).json(
			createSuccessResponse("Tasks fetched successfully", tasks)
		);
	} catch (error) {
		console.log("Get all tasks error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const getTask = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;

		const task = await prisma.task.findUnique({
			where: {
				id: Number(id),
				assignedTo: userId,
			},
		});
		if (!task) {
			res.status(404).json(createErrorResponse("Task not found"));
			return;
		}
	} catch (error) {
		console.log("Get task error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const updateTask = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;

		const task = await prisma.task.findUnique({
			where: {
				id: Number(id),
				assignedTo: userId,
			},
		});
		if (!task) {
			res.status(404).json(createErrorResponse("Task not found"));
			return;
		}

		const result = updateTaskSchema.safeParse(req.body);
		if (!result.success) {
			res.status(400).json(
				createErrorResponse(
					"Update Task validation error",
					result.error.errors.map((err) => err.message)
				)
			);
			return;
		}

		const { title, description, dueDate } = result.data;
		const updatedTask = await prisma.task.update({
			where: {
				id: Number(id),
			},
			data: {
				title,
				description,
				dueDate,
			},
		});
		if (!updatedTask) {
			res.status(400).json(
				createErrorResponse("Error while updating task")
			);
			return;
		}

		res.status(200).json(
			createSuccessResponse("Task updated successfully")
		);
	} catch (error) {
		console.log("Update task error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const updateTaskStatus = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;

		const task = await prisma.task.findUnique({
			where: {
				id: Number(id),
				assignedTo: userId,
			},
		});
		if (!task) {
			res.status(404).json(createErrorResponse("Task not found"));
			return;
		}

		const result = updateStatusSchema.safeParse(req.body);
		if (!result.success) {
			res.status(400).json(
				createErrorResponse("Update Task validation error", [
					result.error.format()._errors[0],
				])
			);
			return;
		}

		const { status } = result.data;
		const updatedTask = await prisma.task.update({
			where: {
				id: Number(id),
			},
			data: {
				status,
			},
		});
		if (!updatedTask) {
			res.status(400).json(
				createErrorResponse("Error while updating task")
			);
			return;
		}

		res.status(200).json(
			createSuccessResponse("Task updated successfully")
		);
	} catch (error) {
		console.log("Update task status error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const deleteTask = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;

		const task = await prisma.task.findUnique({
			where: {
				id: Number(id),
				assignedTo: userId,
			},
		});
		if (!task) {
			res.status(404).json(createErrorResponse("Task not found"));
			return;
		}

		await prisma.task.delete({
			where: {
				id: Number(id),
			},
		});
		res.status(201).json(
			createSuccessResponse("Task deleted successfully")
		);
	} catch (error) {
		console.log("Delete task errorp: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

export {
	getLoggedInUserTasks,
	getTask,
	createTask,
	updateTask,
	updateTaskStatus,
	deleteTask,
};
