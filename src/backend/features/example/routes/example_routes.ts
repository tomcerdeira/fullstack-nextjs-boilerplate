import { Route } from "../../../shared/abstract-classes/Route";
import { exampleController } from "../controllers/example_controller";

class ExampleRoutes extends Route {

    public getBasePath(): string {
        return '/example';
    }

    protected initializeRoutes(): void {
        this.get('/', exampleController.getExample);
        this.post('/', exampleController.postExample);

        this.get('/query?[query!]', exampleController.sampleMethodWithPathOrQueryParam);

                    //TODO: podre tipar esto?
        this.get('/:id', exampleController.sampleMethodWithPathOrQueryParam);
    }
}

export const exampleRouter = new ExampleRoutes();
