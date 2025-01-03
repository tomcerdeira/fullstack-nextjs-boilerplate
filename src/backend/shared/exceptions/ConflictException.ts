import { StatusCodes } from "http-status-codes";
import { BaseHttpError } from "./BaseHttpError";

export class ConflictException extends BaseHttpError {

    constructor(name = ConflictException.name, status = StatusCodes.CONFLICT, internalStatus = "conflict", message = "A conflict occured.", isOperational = true) {
        super(name, status, internalStatus, message, isOperational);
        Object.setPrototypeOf(this, ConflictException.prototype);
    }

    static createFromMessage(message: string): ConflictException {
        return new ConflictException(ConflictException.name, StatusCodes.CONFLICT, "conflict", message, true);
      }

}