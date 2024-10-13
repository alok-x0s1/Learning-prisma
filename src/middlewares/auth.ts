import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createErrorResponse } from "../utils/apiResponse";
import { prisma } from "../services/prismaClient";

interface UserPayload {
	id: string;
	username: string;
}

export const isLoggedIn = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token =
		req.cookies?.token || req.headers.authorization?.split(" ")[1];
	if (!token) {
		res.status(401).json(createErrorResponse("Unauthorized request"));
		return;
	}

	try {
		const decodedToken = jwt.verify(
			token,
			process.env.JWT_TOKEN_SECRET!
		) as UserPayload;
		const user = await prisma.user.findUnique({
			where: {
				username: decodedToken.username,
			},
			select: {
				id: true,
				name: true,
				email: true,
				username: true,
			},
		});

		if (!user) {
			res.status(400).json(
				createErrorResponse("Invalid token, Please sign-in")
			);
			return;
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(403).json(createErrorResponse("Forbidden"));
	}
};
