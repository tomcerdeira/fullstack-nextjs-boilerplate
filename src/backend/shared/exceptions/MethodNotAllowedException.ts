import { StatusCodes } from "http-status-codes";
import { BaseHttpError } from "./BaseHttpError";


export class MethodNotAllowedException extends BaseHttpError {

    constructor(name = MethodNotAllowedException.name, status = StatusCodes.METHOD_NOT_ALLOWED, internalStatus = "method_not_allowed", message = "Method not allowed.", isOperational = true) {
        super(name, status, internalStatus, message, isOperational);
        Object.setPrototypeOf(this, MethodNotAllowedException.prototype);
    }

    static createFromMessage(message: string): MethodNotAllowedException {
        return new MethodNotAllowedException(MethodNotAllowedException.name, StatusCodes.METHOD_NOT_ALLOWED, "method_not_allowed", message, true);
    }

}