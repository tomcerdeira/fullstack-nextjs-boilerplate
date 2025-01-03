import {StatusCodes} from "http-status-codes";
import {BaseHttpError} from "./BaseHttpError";

export class BadRequestException extends BaseHttpError {

    constructor(name = BadRequestException.name, status = StatusCodes.BAD_REQUEST, internalStatus = "bad_request", message = "Request incomplete or wrong/missing attributes in body object.", isOperational = true) {
        super(name, status, internalStatus, message, isOperational);
        Object.setPrototypeOf(this, BadRequestException.prototype);
    }

    static createFromMessage(message: string): BadRequestException {
        return new BadRequestException(BadRequestException.name, StatusCodes.BAD_REQUEST, "bad_request", message, true);
      }

}