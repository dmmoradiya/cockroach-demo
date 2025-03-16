import { NextApiRequest, NextApiResponse } from "next";
import { getClient } from "../../lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY: any = process.env.SECRET_KEY;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { host, username, password, dbName } = req.body;
    const connectionString = `postgresql://${username}:${password}@${host}:26257/${dbName}?sslmode=verify-full`;

    process.env.DATABASE_URL = connectionString;

    const client = getClient();

    try {
      const result = await client.query(
        `SELECT datname FROM pg_database WHERE datname = $1`,
        [dbName]
      );

      if (result.rows.length === 0) {
        throw new Error("Database does not exist");
      }

      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
      res
        .status(200)
        .json({ message: "Connected to the database successfully", token });
    } catch (error: any) {
      console.error("Error connecting to the database:", error);
      res
        .status(500)
        .json({
          message: error.message || "Failed to connect to the database",
        });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
