import { NextRequest } from 'next/server';
import { BaseHttpError } from '../exceptions/BaseHttpError';
import HttpException from '../exceptions/http_exception';
import logger from "../logger";

const loggerInstance = logger.child({ label: 'ErrorHandlerMiddleware' });

export const ErrorHandlerMiddleware = (error: BaseHttpError, request: NextRequest): Response => {
    // Default values
    let status = 500;
    let internalStatus = 'INTERNAL_SERVER_ERROR';
    let message = 'Server failed to answer';
    
    // If it's our custom HttpException, use its values
    if (error instanceof HttpException || error instanceof BaseHttpError) {
        status = error.status;
        internalStatus = error.internalStatus;
        message = error.message;
    }

    loggerInstance.error(`Status: ${status} - InternalStatus: ${internalStatus} - Message: ${message}`);
    if (status === 500) {
        loggerInstance.error(error.stack);
    }

    const requestId = request.headers.get('X-Req-Id');
    
    return new Response(
        JSON.stringify({
            error: {
                request_id: requestId,
                status_code: status,
                internal_status: internalStatus,
                message
            }
        }), 
        {
            status,
            headers: {
                'Content-Type': 'application/json',
                ...(requestId && { 'X-Req-Id': requestId })
            }
        }
    );
}; 