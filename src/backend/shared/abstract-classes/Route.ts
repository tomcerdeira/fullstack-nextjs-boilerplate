import { NextRequest } from "next/server";
import { MethodNotAllowedException } from "../exceptions/MethodNotAllowedException";
import { NotFoundException } from "../exceptions/NotFoundException";
import { ApiResponse } from "../models/ApiResponse";

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

type RouteHandler = (req: NextRequest) => Promise<ApiResponse>;

export abstract class Route {

    protected routes: Map<string, {
        method: HttpMethod;
        handler: RouteHandler;
    }>;

    constructor() {
        this.routes = new Map();
        this.initializeRoutes();
    }

    private createMethodHandler(method: HttpMethod) {
        return (path: string, handler: RouteHandler): void => {
            this.routes.set(path, { method, handler });
        };
    }

    protected get = this.createMethodHandler(HttpMethod.GET);
    protected post = this.createMethodHandler(HttpMethod.POST);
    protected put = this.createMethodHandler(HttpMethod.PUT);
    protected patch = this.createMethodHandler(HttpMethod.PATCH);
    protected delete = this.createMethodHandler(HttpMethod.DELETE);

    protected abstract initializeRoutes(): void;

    public abstract getBasePath(): string;

    public async handleRequest(req: NextRequest): Promise<ApiResponse> {
        const basePath = this.getBasePath();
        const normalizedPath = req.nextUrl.pathname
            .replace(`/api${basePath}`, '')
            .replace(/^\/+/, '/')
            .replace(/\/+$/, '');
        
        const path = normalizedPath || '/';
        const method = req.method;

        const route = this.routes.get(path);
        if (!route) {
            throw new NotFoundException();
        }

        if (route.method !== method) {
            throw new MethodNotAllowedException();
        }

        return route.handler(req);
    }
}
