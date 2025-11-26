class AppError extends Error{
    public statusCode: number;

    constructor(statusCode : number, message: string, stack = ""){
        super(message);
        this.statusCode = statusCode;
        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
        
        this.name = "AppError";

        // Set the prototype explicitly
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
export default AppError;