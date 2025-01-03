import { StatusCodes } from "http-status-codes";
import { BaseHttpError } from "./BaseHttpError";

export class NotFoundException extends BaseHttpError {

    constructor(name = NotFoundException.name, status = StatusCodes.NOT_FOUND, internalStatus = "not_found", message = "Resource not found.", isOperational = true) {
        super(name, status, internalStatus, message, isOperational);
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }

    static createFromMessage(message: string): NotFoundException {
        return new NotFoundException(NotFoundException.name, StatusCodes.NOT_FOUND, "not_found", message, true);
      }

}