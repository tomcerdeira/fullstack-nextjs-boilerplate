//TODO necesitamos esto para poder usar el error en el middleware?
class HttpException extends Error {
    status: number;
    internalStatus: string;
    message: string;

    constructor(status: number, internalStatus: string, message: string) {
        super(message);
        this.status = status;
        this.internalStatus = internalStatus;
        this.message = message;
    }
}

export default HttpException;