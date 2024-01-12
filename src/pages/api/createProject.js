import { parse, format, differenceInDays } from "date-fns";
import formidable from "formidable";
import fs from "fs/promises";
import prisma from "prisma/client";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    
    // const session = getSession({ req });
    if (!session) {
      return res.status(401).json({ error: "Please sign to create project" });
    }
    console.log("session is " + session);
    const data = await new Promise((resolve, reject) => {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      const filename = (name, ext, path, form) => {
        return Date.now().toString() + "_" + path.originalFilename;
      }
      const form = formidable({ uploadDir, filename });
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    // console.log(data);
    // console.log(data.files.documentation);
    // console.log(data.files.documentation[0].originalFilename);
    // console.log(data.files.documentation[0].filepath);
    // console.log(data.fields.start_date);
    const duration = differenceInDays(
      data.fields.end_date[0],
      data.fields.start_date[0]
    );
    // const form = formidable();
    // form.parse(req, async (err, fields, files) => {
    //   if (err) {
    //     console.error("Error parsing data:", err);
    //     res.status(500).json({ error: "Internal Server Error" });
    //     return;
    //   }

    // const { project_name, description, start_date, end_date } = fields;
    const start_date = new Date(data.fields.start_date[0]);
    const end_date = new Date(data.fields.end_date[0]);
    // Handle file uploads
    const imagePath = data.files.image[0].newFilename;
    const documentationPath = data.files.documentation[0].newFilename;

    // Define upload directory
    // const uploadDir = path.join(process.cwd(), "public/uploads");
    // await fs.mkdir(uploadDir, { recursive: true });

    // Save file paths in the database
    // const imagePath = imageFile ? path.join("uploads", imageFile.name) : null;
    // const documentationPath = documentationFile
    //   ? path.join("uploads", documentationFile.name)
    //   : null;
    const user = await prisma.user.findUnique({
      where: { 
        username: session?.user?.username
       },
    });
    // Save project details with field paths
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

    res.status(200).json({
      success: true,
      message: "Project created successfully",
      createdProject,
    });
    // });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
