import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		return hash;
	} catch (err: any) {
		console.error(err.message);
		throw err;
	}
}

export async function verifyPassword(password: string, hash: string) {
	try {
		const result = await bcrypt.compare(password, hash);
		return result;
	} catch (err: any) {
		console.error(err.message);
		throw err;
	}
}
