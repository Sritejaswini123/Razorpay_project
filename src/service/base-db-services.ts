// base-db services
import { asc, eq, getTableName, sql } from "drizzle-orm";

import type { NewUser, User, UsersTable } from "../database/schemas/users.js";

import db from "../database/db.js";

type DBTable = UsersTable;
type NewDBRecord = NewUser;
type DBRecordRow = User;

export async function createUser<DBRecordRow>(table: DBTable, record: NewDBRecord) {
  const result = await db.insert(table).values(record).returning();
  return result[0];
}
// getRecordById
export async function getRecordById<DBRecordRow>(table: DBTable, id: number) {
  const result = await db.select().from(table).where(eq(table.id, id));
  return result[0];
}
// get all users
export async function getAllRecords<DBRecordRow>(curent_page: number, table: DBTable) {
  const page_size = 10;

  const result = await db
    .select()
    .from(table)
    .orderBy(asc(table.id))
    .limit(page_size)
    .offset((curent_page - 1) * page_size);

  const [{ total_records }] = await db
    .select({ total_records: sql<string>`count(*)` }) // use string here explicitly
    .from(table);

  const totalRecordsNumber = Number(total_records); // convert to number
  const totalPages = Math.ceil(totalRecordsNumber / page_size);

  return {
    total_records: totalRecordsNumber,
    curent_page,
    page_size,
    totalPages,
    next_page: curent_page >= totalPages || totalPages === 0 ? null : curent_page + 1,
    prev_page: curent_page <= 1 ? null : curent_page - 1,
    data: result,
  };
}

// delete
export async function deleteRecordById<DBRecordRow>(table: DBTable, id: number) {
  const result = await db
    .delete(table)
    .where(eq(table.id, id))
    .returning();
  return result[0];
}

// update user
export async function updateRecordById<DBRecordRow>(table: DBTable, record: any, id: number) {
  const columnInfo = sql.raw(`${getTableName(table)}.id`);
  const updatedRecord = await db
    .update(table)
    .set({
      ...record,
      updated_at: new Date(),
    })
    .where(eq(columnInfo, id))
    .returning();
  return updatedRecord;
}
