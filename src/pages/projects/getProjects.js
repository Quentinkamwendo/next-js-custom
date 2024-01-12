import client from "../../../../prisma/client";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const data = await client.project.findMany()
            res.status(200).json(data)
        } catch (error) {
            res.json.status(403).json({error: "Error occurred"})
        }
    }
}