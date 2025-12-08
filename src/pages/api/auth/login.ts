
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "AaoCab@2025";

  if (username === adminUsername && password === adminPassword) {
    const token = process.env.ADMIN_TOKEN || "aaocab-admin-token-2025";
    
    return res.status(200).json({
      success: true,
      token,
      user: { username: adminUsername, role: "admin" },
    });
  }

  return res.status(401).json({ error: "Invalid credentials" });
}
