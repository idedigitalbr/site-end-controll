import mysql from "mysql2/promise";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "node:crypto";

if (!process.env.CMS_ADMIN_EMAIL || !process.env.CMS_ADMIN_PASSWORD) throw new Error("Bootstrap credentials missing");
const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [users] = await connection.query("SELECT COUNT(*) AS total FROM user");
  if (Number(users[0].total) !== 0) throw new Error("Bootstrap requires an empty user table; existing accounts preserved");
  const id = randomUUID();
  const password = await hashPassword(process.env.CMS_ADMIN_PASSWORD);
  await connection.beginTransaction();
  await connection.execute("INSERT INTO user (id,name,email,email_verified,role,banned,created_at,updated_at) VALUES (?,?,?,true,'admin',false,NOW(3),NOW(3))", [id,"Administrador EndControl",process.env.CMS_ADMIN_EMAIL]);
  await connection.execute("INSERT INTO account (id,account_id,provider_id,user_id,password,created_at,updated_at) VALUES (?,?,'credential',?,?,NOW(3),NOW(3))", [randomUUID(),id,id,password]);
  await connection.commit();
  console.log("Initial administrator created");
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
