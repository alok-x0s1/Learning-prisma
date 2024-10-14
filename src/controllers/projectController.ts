import { Request, Response } from "express";
import {
	createProjectSchema,
	updateProjectSchema,
} from "../schemas/projectSchema";
import {
	createErrorResponse,
	createSuccessResponse,
} from "../utils/apiResponse";
import { prisma } from "../services/prismaClient";

const createProject = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = createProjectSchema.safeParse(req.body);
		if (!result.success) {
			res.status(400).json(
				createErrorResponse(
					"Create Project validation error",
					result.error.errors.map((err) => err.message)
				)
			);
			return;
		}
		const { name } = result.data;
		const userId = req.user?.id;

		const project = await prisma.project.create({
			data: {
				name,
				ownerId: userId!,
			},
		});
		if (!project) {
			res.status(400).json(
				createErrorResponse("Error while creating project")
			);
			return;
		}

		res.status(201).json(
			createSuccessResponse("Project created successfully")
		);
	} catch (error) {
		console.log("Create project error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const getLoggedInUserProjects = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const id = req.user?.id;

		const projects = await prisma.project.findMany({
			where: {
				ownerId: id,
			},
			include: {
				tasks: true,
			},
		});

		if (projects.length < 0) {
			res.status(404).json(
				createErrorResponse("Can't find any projects")
			);
			return;
		}

		res.status(201).json(
			createSuccessResponse("Project fetched successfully", projects)
		);
	} catch (error) {
		console.log("Getting user's projects error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const getProject = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;

		const project = await prisma.project.findUnique({
			where: {
				id: Number(id),
				ownerId: userId,
			},
		});

		if (!project) {
			res.status(404).json(createErrorResponse("Project not found"));
			return;
		}

		res.status(201).json(
			createSuccessResponse("Project fetched successfully", project)
		);
	} catch (error) {
		console.log("Getting projects error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const updateProject = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = updateProjectSchema.safeParse(req.body);
		if (!result.success) {
			res.status(400).json(
				createErrorResponse(
					"Create Project validation error",
					result.error.errors.map((err) => err.message)
				)
			);
			return;
		}
		const { name, id } = result.data;
		const userId = req.user?.id;

		const project = await prisma.project.findFirst({
			where: {
				id,
				ownerId: userId,
			},
		});

		if (!project) {
			res.status(404).json(createErrorResponse("Project not found"));
			return;
		}

		const updatedProject = await prisma.project.update({
			where: {
				id: project.id,
			},
			data: {
				name,
			},
		});

		res.status(201).json(
			createSuccessResponse("Project updated successfully")
		);
	} catch (error) {
		console.log("Update project error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const deleteProject = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;

		const project = await prisma.project.findFirst({
			where: {
				id: Number(id),
				ownerId: userId,
			},
		});

		if (!project) {
			res.status(404).json(
				createErrorResponse("Project not found or not authorized")
			);
			return;
		}

		await prisma.project.delete({
			where: {
				id: project.id,
			},
		});

		res.status(201).json(
			createSuccessResponse("Project deleted successfully")
		);
	} catch (error) {
		console.log("Delete project error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const getAllTasks = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;

		const project = await prisma.project.findFirst({
			where: {
				id: Number(id),
				ownerId: userId,
			},
			include: {
				tasks: true,
			},
		});

		if (!project) {
			res.status(404).json(createErrorResponse("Project not found"));
			return;
		}

		res.status(201).json(
			createSuccessResponse("Tasks fetched successfully", project.tasks)
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

export {
	createProject,
	getLoggedInUserProjects,
	getProject,
	updateProject,
	deleteProject,
	getAllTasks,
};
