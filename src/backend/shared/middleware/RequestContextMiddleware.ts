import { NextRequest } from 'next/server';
import { validate as uuidValidate } from 'uuid';
import { BaseHttpError } from '../exceptions/BaseHttpError';
import { InvalidRequestIdException } from '../exceptions/InvalidRequestIdException';
import { requestContext, setRequestContext } from '../logger';
import { ErrorHandlerMiddleware } from './ErrorHandlerMiddleware';
import { ResponseHandlerMiddleware } from './ResponseHandlerMiddleware';

// Strict type definition for handler responses
export type HandlerResponse = {
    data?: unknown;
    status?: number;
} & Record<never, never>; // This ensures no other properties are allowed

export const RequestContextMiddleware = async (
    request: NextRequest,
    handler: (request: NextRequest) => Promise<HandlerResponse>
): Promise<Response> => {
    return requestContext.run({}, async () => {
        try {
            const requestId = request.headers.get('X-Req-Id');
            if (requestId && !uuidValidate(requestId)) {
                throw new InvalidRequestIdException();
            }
            setRequestContext({
                requestId: requestId || undefined,
                method: request.method,
                path: request.nextUrl.pathname
            });

            const result = await handler(request);
            const status = result.status || 200;
            if (status === 204) {
                return new Response(null, { status: 204 });
            }

            const responseData = typeof result.data === 'object' && result.data !== null
                ? { ...result.data }
                : { data: result.data };
            return ResponseHandlerMiddleware(
                request,
                responseData,
                status
            );
        } catch (error) {
            return ErrorHandlerMiddleware(error as BaseHttpError, request);
        }
    });
}; 