import { User } from "@prisma/client";

interface IUser {
	id: string;
	name: string;
	username: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}
