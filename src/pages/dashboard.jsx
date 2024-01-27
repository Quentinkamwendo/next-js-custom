"use client";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CircularProgress,
  HStack,
  Heading,
  Image,
  Spacer,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const toast = useToast();
  console.log(session);
  const projects = async () => {
    const response = await axios.get("api/getProjects");
    return response.data;
  };
  const { data, isLoading } = useQuery({
    queryFn: projects,
    queryKey: ["projects"],
  });

  const { mutate } = useMutation(
    async (id) => await axios.delete(`api/projects/${id}/`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projects"]);
        toast.success("Project deleted 💪", { duration: 5000 });
      },
      onError: (error) => {
        toast({
          title: 'Error Deleting project 😢',
          description: error.response.data.error,
          status: 'error',
          duration: 7000,
          isClosable: true,

        });
      },
    }
  );
  const deleteProject = (id) => {
    mutate(id);
  };
  console.log(data);
  if (isLoading) {
    <CircularProgress mx={"auto"} isIndeterminate color="blue.400" />;
  }
  return (
    <div className="container">
      <h4>welcome to dashboard</h4>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 p-8">
        {data?.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <Heading>{project.project_name}</Heading>
            </CardHeader>
            <CardBody>
              <Text>Start Date is{project.start_date}</Text>
              <Text>End Date: {project.end_date}</Text>
              <Text>Duration: {project.duration}</Text>
              <Image
                h={48}
                objectFit={"cover"}
                src={`uploads/${project.image_path}`}
                alt=""
              />
            </CardBody>
            <CardFooter>
            <button
                  onClick={() => deleteProject(project.id)}
                  className="btn bg-red-400 text-white rounded-md hover:bg-red-600 p-2"
                >
                  Delete
                  <IoTrash />
                </button>
              <Link
                href={`/projects/${project.id}`}
                className="rounded-md bg-emerald-600 hover:bg-green-700 text-white p-2 m-2"
              >
                Update
                <FaEdit />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

Dashboard.auth = true;
