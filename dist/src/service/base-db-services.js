import { eq, asc } from "drizzle-orm";
import db from "../database/db.js";
import { users } from "../database/schemas/users.js";
import { count } from "drizzle-orm";
export const createUser = async (table, record) => {
    const result = await db
        .insert(table)
        .values(record)
        .returning();
    return result[0];
};
export const getRecordById = async (table, id) => {
    const result = await db.select().from(table).where(eq(table.id, id));
    return result[0];
};
//get all users 
export const getAllRecords = async (page, table) => {
    const pageSize = 10;
    const result = await db
        .select()
        .from(table)
        .orderBy(asc(table.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);
    return result;
};
//delete 
export const deleteRecordById = async (table, id) => {
    const result = await db
        .delete(table)
        .where(eq(table.id, id))
        .returning();
    return result[0];
};
