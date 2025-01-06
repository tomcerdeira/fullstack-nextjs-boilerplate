import { exampleRouter } from "./features/example/routes/example_routes";
import { Route } from "./shared/abstract-classes/Route";

// Add all route instances here
export const routes: Route[] = [
    exampleRouter,
];