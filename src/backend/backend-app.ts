import { NextRequest } from "next/server";
import { routes } from './routes';
import { Route } from "./shared/abstract-classes/Route";
import { NotFoundException } from "./shared/exceptions/NotFoundException";
import logger from "./shared/logger";
import { RequestContextMiddleware } from "./shared/middleware/RequestContextMiddleware";
import { ApiResponse } from "./shared/models/ApiResponse";

interface FeatureRouter {
    handleRequest(req: NextRequest): Promise<ApiResponse>;
}

class BackendApp {

    private backend_app_logger = logger.child({ label: 'backend-app.ts' });
    private routes: Map<string, FeatureRouter>;

    constructor() {
        this.routes = new Map();
        this.registerRoutes();
    }

    private registerRoute(instance: Route): void {
        this.routes.set(instance.getBasePath().replace('/', ''), instance);
    }

    private registerRoutes(): void {
        routes.forEach(route => this.registerRoute(route));
    }

    public async handleRequest(request: NextRequest) {
        return RequestContextMiddleware(request, async (req): Promise<ApiResponse> => {
            this.backend_app_logger.info(`New request received`);
            const path = req.nextUrl.pathname;
            const feature = path.split('/')[2];
            
            const router = this.routes.get(feature);
            if (!router) {
                throw new NotFoundException();
            }

            return router.handleRequest(req);
        });
    }
}

export const backendApp = new BackendApp();