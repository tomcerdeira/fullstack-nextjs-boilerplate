import { RouteParams } from "@/backend/shared/abstract-classes/Route";
import logger from "@/backend/shared/logger";
import { ApiResponse } from "@/backend/shared/models/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { exampleService } from "../service/example_service";

class ExampleController {

    private logger = logger.child({label: this.constructor.name});

    getExample = async (_req: Request) => {
        return new ApiResponse({
            status: StatusCodes.OK,
            data: "GET",
        })
    }

    postExample = async (_req: Request) => {
        return new ApiResponse({
            status: StatusCodes.OK,
            data: "POST",
        })
    }

    sampleMethod = async (_req: Request) => {
        const example = await exampleService.exampleMethod()
        this.logger.info(`Example method called successfully.`)

        return new ApiResponse({
            status: StatusCodes.OK,
            data: example,
            headers: {
                'Test': "hola"
            }
        })
    }

    sampleMethodWithPathOrQueryParam = async (_req: Request, params: RouteParams ) => {
        this.logger.info(`Params: ${JSON.stringify(params)}`)
        return new ApiResponse({
            status: StatusCodes.NO_CONTENT
        })
    }

}
export const exampleController = new ExampleController();
