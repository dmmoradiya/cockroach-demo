import { Client } from "pg";

let client: Client | null = null;

export const getClient = () => {
  if (!client) {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    client.connect().catch((err) => {
      console.error("Failed to connect to the database:", err);
      client = null;
    });
  }
  return client;
};
