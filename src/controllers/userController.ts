import { Request, Response } from "express";
import { signinSchema, signupSchema } from "../schemas/userSchema";
import {
	createErrorResponse,
	createSuccessResponse,
} from "../utils/apiResponse";
import { prisma } from "../services/prismaClient";
import { hashPassword, verifyPassword } from "../helpers/bcrypt";
import { generateToken } from "../helpers/jwt";

const signupUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = signupSchema.safeParse(req.body);
		if (!result.success) {
			res.status(400).json(
				createErrorResponse(
					"Signup validation error",
					result.error.errors.map((err) => err.message)
				)
			);
			return;
		}
		const { name, username, email, password } = result.data;

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{
						email,
					},
					{
						username,
					},
				],
			},
		});
		if (existingUser) {
			res.status(400).json(
				createErrorResponse(
					"User with this email or username already exists"
				)
			);
			return;
		}

		const hashedPassword = await hashPassword(password);
		const user = await prisma.user.create({
			data: {
				name,
				username,
				email,
				password: hashedPassword,
			},
		});

		const token = generateToken(user);
		res.status(201)
			.cookie("token", token)
			.json(createSuccessResponse("User created successfully"));
	} catch (error) {
		console.log("Sign-up user error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";
		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const signinUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const result = signinSchema.safeParse(req.body);
		if (!result.success) {
			res.status(400).json(
				createErrorResponse(
					"Signin validation error",
					result.error.errors.map((err) => err.message)
				)
			);
			return;
		}

		const { email, password } = result.data;
		const existingUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!existingUser) {
			res.status(404).json(createErrorResponse("User not found"));
			return;
		}

		const isPasswordCorrect = await verifyPassword(
			password,
			existingUser.password
		);
		if (!isPasswordCorrect) {
			res.status(400).json(
				createErrorResponse("Entered password is incorrect")
			);
			return;
		}

		const token = generateToken(existingUser);
		res.status(201)
			.cookie("token", token)
			.json(createSuccessResponse("Sign-in successfully"));
	} catch (error) {
		console.log("Sign-in user error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";

		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const signoutUser = async (req: Request, res: Response): Promise<void> => {
	try {
		res.status(200)
			.clearCookie("token")
			.json(createSuccessResponse("Sign-out successfully"));
	} catch (error) {
		console.log("Sign-out user error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";

		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const getLoggedInUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.user?.id;
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				name: true,
				username: true,
				email: true,

				projects: {
					include: {
						tasks: true,
					},
				},
				assignedTasks: true,
			},
		});

		res.status(200).json(
			createSuccessResponse("User info fetched successfully", user)
		);
	} catch (error) {
		console.log("Get user info error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";

		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

const getUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;

		const user = await prisma.user.findUnique({
			where: {
				id,
			},
			select: {
				name: true,
				username: true,
				email: true,

				_count: {
					select: {
						projects: true,
					},
				},
				assignedTasks: true,
			},
		});

		if (!user) {
			res.status(404).json(createErrorResponse("User not found"));
			return;
		}

		res.status(200).json(
			createSuccessResponse("User info fetched successfully", user)
		);
	} catch (error) {
		console.log("Get user error: ", error);
		const err =
			error instanceof Error ? error.message : "Something went wrong";

		res.status(500).json(
			createErrorResponse("Internal server error", [err])
		);
	}
};

export { signupUser, signinUser, signoutUser, getLoggedInUser, getUser };
