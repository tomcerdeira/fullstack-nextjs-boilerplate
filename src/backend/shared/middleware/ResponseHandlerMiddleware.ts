import { NextRequest } from 'next/server';
import { ApiResponse, ApiResponseOptions } from '../models/ApiResponse';

export const ResponseHandlerMiddleware = (
    request: NextRequest,
    responseOptions: ApiResponseOptions
): Response => {
    const requestId = request.headers.get('X-Req-Id');
    return new ApiResponse(responseOptions).toResponse(requestId || undefined);
};
