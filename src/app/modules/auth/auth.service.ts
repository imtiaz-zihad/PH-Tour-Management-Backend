import  httpStatus  from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import bcryptjs from  "bcryptjs"

const credentialsLogin = async(payload: Partial<IUser>) =>{
    const {email, password} = payload;
    const isUserExits = await User.findOne({email});

    if(!isUserExits){
        throw new AppError(httpStatus.BAD_REQUEST, "Email not exits ")
    }


    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExits.password as string);

    console.log(password);
    

    if(!isPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST, "Password Is incorrect")
    }

    return {
        email: isUserExits.email
    }
}

export const AuthServices = {
    credentialsLogin
}