import { z } from "zod";

export const createProjectSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters")
		.max(20, "Name must be at most 20 characters")
		.regex(/^[a-zA-Z0-9_]+$/, "Name must not contain special characters")
		.trim(),
});

export const updateProjectSchema = z.object({
	id: z
		.string()
		.refine((val) => !isNaN(Number(val)), {
			message: "ID must be a number",
		})
		.transform((val) => Number(val)),
	name: z
		.string()
		.min(3, { message: "Name must be at least 3 characters" })
		.max(20, { message: "Name must be at most 20 characters" })
		.regex(/^[a-zA-Z0-9_]+$/, {
			message: "Name must not contain special characters",
		})
		.trim(),
});
