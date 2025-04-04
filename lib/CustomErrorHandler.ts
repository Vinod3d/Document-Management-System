class CustomErrorHandler extends Error{
    status: number;
    constructor(status:number, msg: string){
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message: string){
        return new CustomErrorHandler(409, message);
    }

    static wrongCredentials(message = "Username or password is wrong!"){
        return new CustomErrorHandler(401, message);
    }

    static unAuthorized(message = "unAuthorized"){
        return new CustomErrorHandler(401, message);
    }

    static notFound(message = "404 Not Found"){
        return new CustomErrorHandler(404, message);
    }

    static badRequest(message = "Bad Request") {
        return new CustomErrorHandler(400, message);
    }
    static serverError(message = "Internal Server Error") {
        return new CustomErrorHandler(500, message);
    }
}

export default CustomErrorHandler;