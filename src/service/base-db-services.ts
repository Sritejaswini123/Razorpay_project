import { eq } from "drizzle-orm";
import db from "../database/db.js"
import { users, type NewUser, type User, type UsersTable } from "../database/schemas/users.js";
import { count } from "drizzle-orm";

type DBTable = UsersTable 
type NewDBRecord  = NewUser
type DBRecordRow = User

export const createUser = async<DBRecordRow>(table : DBTable , record : NewDBRecord )=>{
    const result = await db
    .insert(table)
    .values(record)
    .returning() ;
    return result[0]  
}

export const getRecordById = async <DBRecordRow>(table: DBTable,id: number) => {
    const result = await db.select().from(table).where(eq(users.id,id));
    return result[0];
};

//get all users 
export const getAllRecords = async <DBRecordRow>(table: DBTable) => {
    const result = await db.select().from(table);
    return result;
};
//delete 
export const deleteRecordById = async <DBRecordRow>(table: DBTable, id: number) => {
    const result = await db
    .delete(table)
    .where(eq(users.id, id))
    .returning();
    return result[0];
  };
  