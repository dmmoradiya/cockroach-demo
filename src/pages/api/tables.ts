import { NextApiRequest, NextApiResponse } from "next";
import { getClient } from "../../lib/db";
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
      const result = await client.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
      );
      res.status(200).json(result.rows);
    } catch (error: any) {
      if (error.name === "JsonWebTokenError") {
        res.status(401).json({ message: "Invalid token" });
      } else {
        console.error("Error retrieving tables:", error);
        res.status(500).send("Failed to retrieve tables");
      }
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
