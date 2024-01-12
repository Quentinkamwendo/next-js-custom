
import { getSession } from 'next-auth/react';
import PrismaClient from "@prisma/client";
import multer from 'multer';
import mysql from 'mysql2';
import {useMutation} from "@tanstack/react-query";
import toast from 'react-hot-toast';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
});

const upload = multer({ storage });

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === "POST") {
        try {
            const upLoadFiles = upload.fields([
                {name: "images", maxCount: 10},
                {name: "documents", maxCount: 10},
                {name: "video", maxCount: 1}
            ]);
            upLoadFiles(req, res, async (err) => {
                if (err) {
                    console.log(err);
                    res.status(400).json({message: "Error uploading files"});
                    return;
                }
                const {name, description} = req.body;
                const images = req.files.images ? req.files.images.map((file) =>
                `/uploads/${file.filename}`) : [];

                const documents = req.files.documents ? req.files.documents.map((file) =>
                    `/uploads/${file.filename}`) : [];

                const video = req.files.video ? `/uploads/${req.files.video[0].filename}` : "";

                const newProject = await prisma.projects.create({
                    data: {
                        name,
                        description,
                        images: {set: images},
                        documents: {set: documents},
                        video,
                        user: {
                            connect: {id: session.user.id}
                        },
                    },
                });
                res.status(201).json(newProject);
            })
        } catch (error) {
            console.log(error);
            toast.error('Error creating project');
            res.status(500).json({message: "Error creating project"});
        }
    }

}

