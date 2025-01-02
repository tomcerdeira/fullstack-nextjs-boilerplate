import { NextRequest } from "next/server";

class BackendApp {

    /*
    TODO:
    - Add a logger
    - Create a Response wrapper
    - connection.ts --> handle multiple connections / dbs
    - Add a middleware to handle the request
    - ErrorHandlerMiddleware
    - ...
    */

    public async handleRequest(request: NextRequest) {
        try{
            const path = request.nextUrl.pathname;
            const feature = path.split('/')[2];
            switch (feature) {
                case 'auth':
                    return new Response('Hello World: auth');
                case 'other':
                    return new Response('Hello World: other');
            }
        } catch (error) {
            console.error(error);
            return new Response('Hello World: error');
        }


    }

}

export const backendApp = new BackendApp();