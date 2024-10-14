import { z } from "zod";

export const createTaskSchema = z.object({
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters" })
		.max(50, { message: "Title must be at most 50 characters" }),
	description: z
		.string()
		.min(5, { message: "Description must be at least 5 characters" })
		.max(200, { message: "Description must be at most 200 characters" }),
	status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).default("TODO"),
	dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date format",
	}),
	projectId: z.number({ required_error: "Project ID is required" }),
	assignedTo: z.string().min(1, { message: "Assigned user ID is required" }),
});

export const updateTaskSchema = z.object({
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters" })
		.max(50, { message: "Title must be at most 50 characters" })
		.optional(),

	description: z
		.string()
		.min(5, { message: "Description must be at least 5 characters" })
		.max(200, { message: "Description must be at most 200 characters" })
		.optional(),

	dueDate: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)), {
			message: "Invalid date format",
		})
		.optional(),
});

export const updateStatusSchema = z.object({
	status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"], {
		required_error: "Status is required",
	}),
});
