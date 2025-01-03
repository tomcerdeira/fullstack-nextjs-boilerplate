import { NextRequest } from 'next/server';

interface ResponseData {
    data?: unknown;
    message?: string;
}

export const ResponseHandlerMiddleware = (
    request: NextRequest,
    responseData: ResponseData,
    status: number = 200
): Response => {
    const requestId = request.headers.get('X-Req-Id');

    // Construct the standardized response body
    const responseBody = {
        // request_id: requestId,
        // status_code: status,
        ...responseData
    };

    // Return formatted response with standard headers
    return new Response(JSON.stringify(responseBody), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Adjust based on your CORS needs
            'Cache-Control': 'no-store',
            ...(requestId && { 'X-Req-Id': requestId })
        }
    });
};
