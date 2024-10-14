import { z } from "zod";

const usernameValidation = z
	.string()
	.min(3, "Username must be at least 3 characters")
	.max(20, "Username must be at most 20 characters")
	.regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters")
	.toLowerCase()
	.trim();

const nameValidation = z
	.string()
	.min(3, "Name must be at least 3 characters")
	.max(20, "Name must be at most 20 characters")
	.trim();

const signupSchema = z.object({
	name: nameValidation,
	username: usernameValidation,
	email: z.string().email({ message: "Invalid email address." }),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const signinSchema = z.object({
	email: z.string().email({ message: "Invalid email address." }),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export { signupSchema, signinSchema };
