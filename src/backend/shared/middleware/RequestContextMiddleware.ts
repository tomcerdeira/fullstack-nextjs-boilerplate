import { NextRequest } from 'next/server';
import { validate as uuidValidate } from 'uuid';
import { BaseHttpError } from '../exceptions/BaseHttpError';
import { InvalidRequestIdException } from '../exceptions/InvalidRequestIdException';
import { requestContext, setRequestContext } from '../logger';
import { ApiResponse } from '../models/ApiResponse';
import { ErrorHandlerMiddleware } from './ErrorHandlerMiddleware';

export const RequestContextMiddleware = async (
    request: NextRequest,
    handler: (request: NextRequest) => Promise<ApiResponse>
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
            
            return result.toResponse(requestId || undefined);

        } catch (error) {
            return ErrorHandlerMiddleware(error as BaseHttpError, request);
        }
    });
}; 