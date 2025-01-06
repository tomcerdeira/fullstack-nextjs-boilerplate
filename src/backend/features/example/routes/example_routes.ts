import { Route } from "../../../shared/abstract-classes/Route";
import { exampleController } from "../controllers/example_controller";

class ExampleRoutes extends Route {

    public getBasePath(): string {
        return '/example';
    }

    protected initializeRoutes(): void {
        this.get('/', exampleController.sampleMethod);
        this.get('/test', exampleController.sampleMethod2);
        this.post('/post', exampleController.sampleMethod);
    }
}

export const exampleRouter = new ExampleRoutes();
