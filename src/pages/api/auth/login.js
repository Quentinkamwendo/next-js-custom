import prisma from "prisma/client";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }
    // Generate JWT token
    const token = sign({ userId: user }, "my-secret-key", {
      expiresIn: "1d",
    });
    return res.status(200).json({ message: "Login successful.", user, token });
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
