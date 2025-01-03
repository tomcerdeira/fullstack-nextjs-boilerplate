import { StatusCodes } from "http-status-codes";
import { BaseHttpError } from "./BaseHttpError";


export class InvalidRequestIdException extends BaseHttpError {

    constructor(name = InvalidRequestIdException.name, status = StatusCodes.BAD_REQUEST, internalStatus = "bad_request", message = "Invalid Request ID. Only UUIDs are accepted.", isOperational = true) {
        super(name, status, internalStatus, message, isOperational);
        Object.setPrototypeOf(this, InvalidRequestIdException.prototype);
    }

}