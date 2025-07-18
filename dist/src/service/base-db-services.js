// base-db services
import { asc, eq, getTableName, sql } from "drizzle-orm";
import db from "../database/db.js";
export async function createUser(table, record) {
    const result = await db.insert(table).values(record).returning();
    return result[0];
}
// getRecordById
export async function getRecordById(table, id) {
    const result = await db.select().from(table).where(eq(table.id, id));
    return result[0];
}
// get all users
export async function getAllRecords(curent_page, table) {
    const page_size = 10;
    const result = await db
        .select()
        .from(table)
        .orderBy(asc(table.id))
        .limit(page_size)
        .offset((curent_page - 1) * page_size);
    const [{ total_records }] = await db
        .select({ total_records: sql `count(*)` }) // use string here explicitly
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
export async function deleteRecordById(table, id) {
    const result = await db
        .delete(table)
        .where(eq(table.id, id))
        .returning();
    return result[0];
}
// update user
export async function updateRecordById(table, record, id) {
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
