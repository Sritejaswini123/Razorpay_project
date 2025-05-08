import { USER_CREATED } from "../constants copy/app-messages.js";
import { CREATED, NOT_FOUND } from "../constants/http-status-codes.js";
import { type NewUser, type User, users } from "../database/schemas/users.js";
import factory from "../factory.js";
import { saverecord } from "../service/baseservices.js";
import { sendResponse } from "../utils/send-response.js";
import { vCreateUser } from "../validations/user-validations.js";
export const createUserHandlers = factory.createHandlers(async (c) => {
    try {
    const reqBody = await c.req.json();
    const validUserReq = vCreateUser.parse(reqBody);  
    console.log("validated data: ",validUserReq);
    const userData: NewUser = {
      ...validUserReq,
    }
    const user = await saverecord<User>(users , userData);
    return sendResponse(c, CREATED, USER_CREATED, user);
    } catch (error) {

      return c.json({msg:error},NOT_FOUND);
      
    }
  },
);



 
  