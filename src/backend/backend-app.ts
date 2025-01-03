import { NextRequest } from "next/server";
import { NotFoundException } from "./shared/exceptions/NotFoundException";
import logger from "./shared/logger";
import { HandlerResponse, RequestContextMiddleware } from "./shared/middleware/RequestContextMiddleware";

class BackendApp {

    /*
    TODO:
    - connection.ts --> handle multiple connections / dbs
    - ...
    */

    private backend_app_logger = logger.child({ label: 'backend-app.ts' });

    public async handleRequest(request: NextRequest) {
        return RequestContextMiddleware(request, async (req): Promise<HandlerResponse> => {
            this.backend_app_logger.info(`Handling request`);
            const path = req.nextUrl.pathname;
            const feature = path.split('/')[2];
            
            switch (feature) {
                case '1':
                    return { data: 'Hello World: auth', status: 200 };
                case '2':
                    return { data: {
                        message: 'Hello World: other'
                    }, status: 201 };
                case '3':
                    return { data: null, status: 204 };
                default:
                    throw new NotFoundException();
            }
        });
    }

}

export const backendApp = new BackendApp();