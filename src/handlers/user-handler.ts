
import { ZodError } from "zod";
import { USER_CREATED, USER_DELETEED, USER_FETCHED, USER_ID_REQUIRED, USER_NOT_FOUND, USERS_FETCHED } from "../constants/app-messages.js";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http-status-codes.js";
import { UNPROCESSABLE_ENTITY } from "../constants/http-status-phrases.js";
import { users, type NewUser, type User } from "../database/schemas/users.js";
import factory from "../factory.js";
import { createUser } from "../service/base-db-services.js";
import { deleteUserById, getAllUsers, getUserById } from "../service/user-service.js";
import { sendResponse } from "../utils/send-response.js";
import { vCreateUser } from "../validations/user-validations.js";

type updateRecords = NewUser

export const createUserHandlers = factory.createHandlers(async (c) => {
  try {
    const reqBody = await c.req.json();
    console.log(reqBody);
    
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
    return c.json({ c, UNPROCESSABLE_ENTITY });
  }
}
);

export const getUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param('user_id'));
    if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }
    const user = await getUserById(userId);
    return sendResponse(c, OK, USER_FETCHED, user);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});



//get all users
export const getAllUsersHandlers = factory.createHandlers(async (c) => {
  try {
    const page=Number(c.req.param('page_no'));
    const user = await getAllUsers(page);
    return sendResponse(c, OK, USERS_FETCHED, user);
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



// export const updateUserByIdHandlers = factory.createHandlers(async (c) => {
//   try {
//     const userId = Number(c.req.param('user_id'));
//     const reqBody = await c.req.json();

//     const validatedUserData = vUpdateUser.parse(reqBody);
//     console.log("hello")
    
//     const userData : any= {
//       ...validatedUserData
//     }
    
//     const updatedUser = await updateRecord<User>(userData,userId)
//     console.log("updated data ",updatedUser);

//     return sendResponse(c, OK, USER_CREATED, updatedUser);
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const errorMessage = error.errors?.[0]?.message || 'Validation error';
//       return c.json({ message: errorMessage }, NOT_FOUND);
//     }
//     return c.json({ UNPROCESSABLE_ENTITY });
//   }

// })