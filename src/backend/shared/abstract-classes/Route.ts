import { NextRequest } from "next/server";
import { BadRequestException } from "../exceptions/BadRequestException";
import { NotFoundException } from "../exceptions/NotFoundException";
import { ApiResponse } from "../models/ApiResponse";

export type RouteParams = {
    [key: string]: string | { [key: string]: string } | undefined;
    queryParams?: {
        [key: string]: string;
    };
};

type RouteHandler = (req: NextRequest, params: RouteParams) => Promise<ApiResponse>;

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

type RouteConfig = {
    method: HttpMethod;
    handler: RouteHandler;
    pattern: RegExp;
    paramNames: string[];
    queryParams?: {
        name: string;
        required: boolean;
    }[];
};

export abstract class Route {
    protected routes: Map<string, RouteConfig[]>;

    constructor() {
        this.routes = new Map();
        this.initializeRoutes();
    }

    private createMethodHandler(method: HttpMethod) {
        return (path: string, handler: RouteHandler): void => {
            const paramNames: string[] = [];
            let queryParams: { name: string; required: boolean; }[] = [];
            
            // Extract query params definition if exists
            const [routePath, queryParamsDef] = path.split('?');
            
            if (queryParamsDef) {
                const queryParamsMatch = queryParamsDef.match(/\[(.*?)\]/);
                if (queryParamsMatch) {
                    queryParams = queryParamsMatch[1].split(',').map(param => ({
                        name: param.replace('!', '').trim(),
                        required: param.includes('!'),
                    }));
                }
            }

            // Convert path params notation (:param) to regex pattern
            const pattern = routePath.replace(/:[a-zA-Z]+/g, (match) => {
                paramNames.push(match.slice(1));
                return '([^/]+)';
            });

            if (!this.routes.has(path)) {
                this.routes.set(path, []);
            }

            this.routes.get(path)!.push({
                method,
                handler,
                pattern: new RegExp(`^${pattern}$`),
                paramNames,
                queryParams
            });
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

        // Find matching route by testing patterns
        let matchedRoute: RouteConfig | undefined;
        let matchedParams: RegExpMatchArray | null = null;
        
        for (const [_, routes] of this.routes) {
            for (const route of routes) {
                const matches = path.match(route.pattern);
                if (matches && route.method === method) {
                    matchedRoute = route;
                    matchedParams = matches;
                    break;
                }
            }
            if (matchedRoute) break;
        }

        if (!matchedRoute) {
            throw new NotFoundException();
        }

        // Extract path parameters and query parameters
        const params: Record<string, any> = {};
        
        // Add path parameters
        if (matchedParams) {
            matchedRoute.paramNames.forEach((name, index) => {
                params[name] = matchedParams![index + 1];
            });
        }

        // Handle query parameters
        if (matchedRoute.queryParams && matchedRoute.queryParams.length > 0) {
            const queryParams: Record<string, string> = {};
            const searchParams = req.nextUrl.searchParams;

            // Validate required query parameters and collect values
            for (const { name, required } of matchedRoute.queryParams) {
                const value = searchParams.get(name);
                if (required && !value) {
                    throw BadRequestException.createFromMessage(`Required query parameter '${name}' is missing`);
                }
                if (value) {
                    queryParams[name] = value;
                }
            }

            if (Object.keys(queryParams).length > 0) {
                params.queryParams = queryParams;
            }
        }

        return matchedRoute.handler(req, params);
    }
}
