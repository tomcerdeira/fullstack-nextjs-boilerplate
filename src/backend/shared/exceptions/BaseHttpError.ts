export class BaseHttpError extends Error {

    status;
    internalStatus;
    isOperational;

    constructor(name: string, status: number, internalStatus: string, message: string, isOperational: boolean) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
      this.name = name;
      this.status = status;
      this.internalStatus = internalStatus;
      this.isOperational = isOperational;
      Error.captureStackTrace(this);
    }

}