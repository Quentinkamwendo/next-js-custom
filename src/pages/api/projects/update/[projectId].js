import prisma from "prisma/client";
import path from 'path';
import fs from 'fs/promises';
import { parse, format, differenceInDays } from "date-fns";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { projectId } = req.query;
  if (req.method === "PUT") {
    try {
      const existingProject = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!existingProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      const data = await new Promise((resolve, reject) => {
        const uploadDir = path.join(process.cwd(), "public/uploads");
        const filename = (name, ext, path, form) => {
          return Date.now().toString() + "_" + path.originalFilename;
        };
        const form = formidable({ uploadDir, filename });
        form.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
      });

      const duration = differenceInDays(
        data.fields.end_date[0],
        data.fields.start_date[0]
      );

      const start_date = new Date(data.fields.start_date[0]);
      const end_date = new Date(data.fields.end_date[0]);
      // Handle file uploads
      const imagePath = data.files.image[0].newFilename;
      const documentationPath = data.files.documentation[0].newFilename;

      const updatedProject = await prisma.project.update({
        where: {id: projectId},
        data: {
            project_name: data.fields.project_name[0],
            description: data.fields.description[0],
            start_date: start_date,
            end_date: end_date,
            duration: duration,
            image_path: imagePath,
            documentation_path: documentationPath,
          },
      });

      if (imagePath) {
        const oldPath = path.join(process.cwd(), "public/uploads", existingProject.image_path);
        const newPath = path.join(process.cwd(), "public/uploads", updatedProject.image_path);
        // Remove old file
        await fs.unlink(oldPath);
        
        // Move uploaded image to the project folder
        await fs.rename(imagePath, newPath)
      }
      return res.status(200).json({message: 'Updated project successfully', updatedProject})
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
  }
  return res.status(405).json({error: 'Method Not Allowed'});
}
