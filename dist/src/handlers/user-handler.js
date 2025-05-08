import { USER_CREATED, USER_NOT_FOUND } from "../constants copy/app-messages.js";
import { CREATED, NOT_FOUND } from "../constants/http-status-codes.js";
import factory from "../factory.js";
import { createUser } from "../service/user-service.js";
import { sendResponse } from "../utils/send-response.js";
import { vCreateUser } from "../validations/user-validations.js";
export const createUserHandlers = factory.createHandlers(async (c) => {
    console.log("inside save method");
    try {
        const reqBody = await c.req.json();
        console.log("Received body: ", reqBody);
        const validUserReq = vCreateUser.parse(reqBody);
        const now = new Date();
        const userData = {
            ...validUserReq,
            created_at: now,
            updated_at: now,
        };
        const user = await createUser(userData);
        return sendResponse(c, CREATED, USER_CREATED, user);
    }
    catch (error) {
        console.error("Create user error:", error);
        return c.json({ msg: error }, NOT_FOUND);
    }
});
