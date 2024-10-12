import { ErrorResponse, SuccessResponse } from "../types/apiResponse";

export function createSuccessResponse<T>(
	message: string,
	data?: T
): SuccessResponse<T> {
	return {
		success: true,
		message,
		data,
	};
}

export function createErrorResponse(
	message: string,
	errorDetails?: string[]
): ErrorResponse {
	return {
		success: false,
		message,
		errorDetails,
	};
}
