import prisma from "prisma/client";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const data = await prisma.project.findMany({take: 6});
            res.status(200).json(data);
        } catch (error) {
            res.status(403).json({error: `Error occurred of ${error}`})
        }
    }
}