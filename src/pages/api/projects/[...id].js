import prisma from "prisma/client";
import path from "path";
import fs from "fs/promises";
import { parse, format, differenceInDays } from "date-fns";
import formidable from "formidable";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const id = req.query.id ? req.query.id[0] : null;
  if (req.method === "GET") {
    try {
      if (id) {
        const existingProject = await prisma.project.findUnique({
          where: { id: id },
        });
        if (!existingProject) {
          return res.status(404).json({ error: "Project not found" });
        }
        return res.status(200).json(existingProject);
      }
      return res.status(200).json(null);
    } catch (error) {
      return res.status(500).json({ error: `Internal Server Error of ${error}` });
    }
  }

  if (req.method === "PATCH" || req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    try {
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
      if (id) {
        const existingProject = await prisma.project.findUnique({
          where: { id: id },
        });
        if (!existingProject) {
          return res.status(404).json({ error: "Project not found" });
        }
        const updatedProject = await prisma.project.update({
          where: { id: id },
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
          const oldPath = path.join(
            process.cwd(),
            "public/uploads",
            existingProject.image_path
          );
          // Remove old file
          await fs.unlink(oldPath);
        }
        if (documentationPath) {
          const oldPath = path.join(
            process.cwd(),
            "public/uploads",
            existingProject.documentation_path
          );
          // Remove old file
          await fs.unlink(oldPath);
        }

        return res
          .status(200)
          .json({ message: "Updated project successfully", updatedProject });
      } else {
        const user = await prisma.user.findUnique({
      where: { 
        username: session?.user?.username
       },
    });
        const createdProject = await prisma.project.create({
          data: {
            project_name: data.fields.project_name[0],
            description: data.fields.description[0],
            start_date: start_date,
            end_date: end_date,
            duration: duration,
            image_path: imagePath,
            documentation_path: documentationPath,
            userId: user.id,
          },
        });

        res.status(201).json({
          success: true,
          message: "Project created successfully",
          createdProject,
        });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: `Internal Server Error of ${error}` });
    }
  }
  // return res.status(405).json({ error: "Method Not Allowed" });

  if (req.method === "DELETE") {
    try {
      const project = await prisma.project.findUnique({
        where: { id: id },
      });
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      await prisma.project.delete({
        where: { id: id },
      });
      // Remove image in folder
      const oldPath = path.join(
        process.cwd(),
        "public/uploads",
        project.image_path
      );
      await fs.unlink(oldPath);

      const oldDocumentationPath = path.join(
        process.cwd(),
        "public/uploads",
        project.documentation_path
      );
      await fs.unlink(oldDocumentationPath);
      return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: `internal server error of ${error}` });
    }
  }
  return res.status(405).json({ error: "Method Not Allowed" });
}
