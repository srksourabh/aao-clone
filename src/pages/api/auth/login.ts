
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
    return res.status(200).json({
      success: true,
      token: env.ADMIN_TOKEN,
      user: { username: env.ADMIN_USERNAME, role: "admin" },
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
}
