
import { getSession } from 'next-auth/react';
import multer from 'multer';
import mysql from 'mysql2';
import toast from 'react-hot-toast';

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

    upload.any()(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error uploading files' });
        }

        const { name, description } = req.body;

        const project = {
            name,
            description,
            video: req.files.find((file) => file.fieldname === 'video')?.filename,
            images: req.files.filter((file) => file.fieldname === 'images').map((file) => file.filename),
            documents: req.files.filter((file) => file.fieldname === 'documents').map((file) => file.filename),
        };

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1999NO1q',
            database: 'projects',
        });

        const insertQuery = 'INSERT INTO project SET ?';

        connection.query(insertQuery, project, (err, result) => {
            if (err) {
                console.error(err);
                toast.error('Error creating project');
                return res.status(500).json({ message: 'Error creating project' });
            }
            console.log(result)
            toast.success('Project created successfully');
            res.status(200).json({ message: 'Project created successfully' });
        });
    });
}

