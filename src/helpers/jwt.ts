import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export function generateToken(user: User) {
	const token = jwt.sign(
		{
			id: user.id,
			username: user.username,
		},
		process.env.JWT_TOKEN_SECRET!,
		{
			expiresIn: process.env.JWT_TOKEN_EXPIRY,
		}
	);

	return token;
}
