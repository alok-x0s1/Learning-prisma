export type SuccessResponse<T> = {
	success: true;
	message: string;
	data?: T;
};

export type ErrorResponse = {
	success: false;
	message: string;
	errorDetails?: string[];
};
