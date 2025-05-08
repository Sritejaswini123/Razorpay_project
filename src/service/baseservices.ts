import db from "../database/db.js"
import type { NewUser, User, UsersTable } from "../database/schemas/users.js";

type DBTable = UsersTable 
type NewDBRecord  = NewUser
type DBRecordRow = User

export const saverecord = async <DBRecordRow> (table : DBTable , record : NewDBRecord )=>{
    const result = await db.insert(table).values(record).returning() ;
    return result[0]  
}