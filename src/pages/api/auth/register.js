import prisma from "prisma/client";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and Password are required." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    // Generate JWT token
    const token = jwt.sign({userId: newUser}, 'my-secret-key', {
        expiresIn: '1d',
    });
    // const token = await getToken({ req, secret });

    // Set the token as a cookie using nookies
    // const cookies = parseCookies({req});
    // setCookie({res}, 'token', token, {
    //     httpOnly: true,
    //     path: '/',
    //     maxAge: 60 * 60 * 24
    // });
    return res
      .status(200)
      .json({ message: "User registered successfully", newUser, token });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
