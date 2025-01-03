import { NextRequest } from "next/server";
import { validate as uuidValidate } from 'uuid';
import { BaseHttpError } from "./shared/exceptions/BaseHttpError";
import { InvalidRequestIdException } from "./shared/exceptions/InvalidRequestIdException";
import logger from "./shared/logger";
import { ErrorHandlerMiddleware } from "./shared/middleware/ErrorHandlerMiddleware";

class BackendApp {

    /*
    TODO:
    - Create a Response wrapper
    - connection.ts --> handle multiple connections / dbs
    - Add a middleware to handle the request
    - ...
    */

    private backend_app_logger = logger.child({ label: 'backend-app.ts' });

    private validateRequestId(request: NextRequest): string | null {
        const requestId = request.headers.get('X-Req-Id');
        if (requestId && !uuidValidate(requestId)) {
            throw new InvalidRequestIdException(); 
        }
        return requestId;
    }

    public async handleRequest(request: NextRequest) {
        try {
            const requestId = this.validateRequestId(request);
            const headers = new Headers();
            if(requestId) {
                headers.set('X-Req-Id', requestId);
            }

            this.backend_app_logger.info(`Handling request: ${request.nextUrl.pathname}`, { requestId });
            const path = request.nextUrl.pathname;
            const feature = path.split('/')[2];
            
            let response;
            switch (feature) {
                case 'auth':
                    response = new Response('Hello World: auth', { headers });
                    break;
                case 'other':
                    response = new Response('Hello World: other', { headers });
                    break;
                default:
                    response = new Response('Not Found', { status: 404, headers });
            }
            
            return response;
        } catch (error) {
            return ErrorHandlerMiddleware(error as BaseHttpError, request);
        }
    }

}

export const backendApp = new BackendApp();