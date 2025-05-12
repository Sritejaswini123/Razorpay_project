import db from "../database/db.js";
import { users } from "../database/schemas/users.js";
import { getRecordById, getAllRecords, deleteRecordById } from "./base-db-services.js";
//save user 
export const createUser = async (userData) => {
    const user = await db.insert(users).values(userData).returning();
    return user[0];
};
//get user by id
export const getUserById = (userId) => {
    return getRecordById(users, userId);
};
//get all users 
export const getAllUsers = async (page_no) => {
    return await getAllRecords(page_no, users);
};
//delete user by id
export const deleteUserById = async (userId) => {
    return await deleteRecordById(users, userId);
};
// export const updateUser=async(userData: UsersTable,userId: number)=>{
//   return await updateRecord<User>(userData,userId);
// }
