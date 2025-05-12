import { eq,asc, sql } from "drizzle-orm";
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
    const result = await db.select().from(table).where(eq(table.id,id));
    
    return result[0];
};

//get all users 
export const getAllRecords = async <DBRecordRow>(curent_page: number,table: DBTable) => {
  const page_size = 10;
  const result = await db
    .select()
    .from(table)
    .orderBy(asc(table.id))
    .limit(page_size)
    .offset((curent_page - 1) * page_size);


  const [{ total_records }] = await db
    .select({ total_records: sql<number>`count(*)` })
    .from(table);

  const totalPages = Math.ceil(total_records / page_size);

  return {

    total_records,
    curent_page,
    page_size,
    totalPages,
    next_page: curent_page >= totalPages || totalPages === 0 ? null : curent_page + 1,
    prev_page: curent_page <= 1 ? null : curent_page - 1,
    data: result
  };
};

//delete 
export const deleteRecordById = async <DBRecordRow>(table: DBTable, id: number) => {
    const result = await db
    .delete(table)
    .where(eq(table.id, id))
    .returning();
    return result[0];
  };
  