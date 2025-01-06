import logger from "@/backend/shared/logger";
import { ApiResponse } from "@/backend/shared/models/ApiResponse";
import { StatusCodes } from "http-status-codes";
import { exampleService } from "../service/example_service";

class ExampleController {

    private logger = logger.child({label: this.constructor.name});

    sampleMethod = async (req: Request ) => {
        const example = await exampleService.exampleMethod()
        this.logger.info(`Example method called successfully. ${req.headers.get('X-Req-Id')}`)

        return new ApiResponse({
            status: StatusCodes.OK,
            data: example,
            headers: {
                'Test': "hola"
            }
        })
    }

    sampleMethod2 = async (req: Request ) => {
        this.logger.info(`Example method called successfully. ${req.headers.get('X-Req-Id')}`)

        return new ApiResponse({
            status: StatusCodes.OK,
            data: "hola",
            headers: {
                'Test': "hola 2"
            }
        })
    }

}
export const exampleController = new ExampleController();
