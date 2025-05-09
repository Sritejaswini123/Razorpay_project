
import { ZodError } from "zod";
import { USER_CREATED, USER_FOUND, USER_ID_REQUIRED, USER_NOT_FOUND, USER_DELETEED } from "../constants/app-messages.js";
import { INTERNAL_SERVER_ERROR } from "../constants/http-status-codes.js";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constants/http-status-codes.js";
import { UNPROCESSABLE_ENTITY } from "../constants/http-status-phrases.js";
import { type NewUser, type User, users } from "../database/schemas/users.js";
import factory from "../factory.js";
import { createUser } from "../service/base-db-services.js";
import { getUserById } from "../service/user-service.js";
import { getAllUsers } from "../service/user-service.js";
import { deleteUserById } from "../service/user-service.js";
import { sendResponse } from "../utils/send-response.js";
import { vCreateUser } from "../validations/user-validations.js";



export const createUserHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();
    const validUserReq = vCreateUser.parse(reqBody);
    const userData: NewUser = {
      ...validUserReq
    }

    const user = await createUser<User>(users, userData);
    return sendResponse(c, CREATED, USER_CREATED, user);
  } catch (error) {

    if (error instanceof ZodError) {
    const errorMessage = error.errors?.[0]?.message || 'Validation error';
    return c.json({ message: errorMessage }, NOT_FOUND);
    }
    return c.json({c, UNPROCESSABLE_ENTITY});
  }}
);





export const getUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param('user_id'));
    if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }
    const user = await getUserById(userId);
    return sendResponse(c, OK, USER_FOUND, user);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});



//get all users
export const getAllUsersHandlers = factory.createHandlers(async (c) => {
  try {
    const user = await getAllUsers();
    return sendResponse(c, OK, USER_FOUND, user);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});




//delete user by id
export const deleteUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param('user_id'));
    const deletedUser = await deleteUserById(userId);
    return sendResponse(c, OK, USER_DELETEED, deletedUser);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }

});



export const updateUserByIdHandlers =factory.createHandlers(async(c)=>{
  
})