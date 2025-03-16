import { NextApiRequest, NextApiResponse } from "next";
import { getClient } from "../../../lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY: any = process.env.SECRET_KEY;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = getClient();

  if (req.method === "GET") {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Authorization token is required" });
      return;
    }

    try {
      jwt.verify(token, SECRET_KEY);
      const table = req.query.table as string;

      if (!table) {
        res.status(400).send("Table name is required");
        return;
      }

      const result = await client.query(
        `SELECT column_name, data_type 
         FROM information_schema.columns 
         WHERE table_schema = current_schema() 
         AND table_name = $1`,
        [table]
      );

      res.status(200).json(result.rows);
    } catch (error: any) {
      if (error.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Invalid token" });
      } else {
        console.error("Error retrieving schema:", error);
        res.status(500).send("Failed to retrieve schema");
      }
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
