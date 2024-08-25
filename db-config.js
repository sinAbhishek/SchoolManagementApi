import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

const sql = postgres(connectionString, {
  ssl: {
    rejectUnauthorized: false,
  },
});

export const queryPromise = async (query, values) => {
  try {
    return await sql.unsafe(query, values);
  } catch (err) {
    throw new Error(`Database query failed: ${err.message}`);
  }
};
