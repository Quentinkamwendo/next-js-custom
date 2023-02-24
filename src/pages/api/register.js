import {PrismaClient} from "@prisma/client";
import { hash } from "bcrypt";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();


const prisma = new PrismaClient();
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

export default async function register(req, res) {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    if (req.method !== "POST") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }

    try {
        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        await connection.execute("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);

        res.status(201).json({ user });
        toast.success("User created!");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
        toast.error("Something went wrong");
    } finally {
        await prisma.$disconnect();
    }
}
