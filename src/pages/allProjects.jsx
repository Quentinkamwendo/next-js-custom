import { Card, CardBody, CardHeader, CircularProgress, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function AllProject() {
  const projects = async () => {
    response = await axios.get("api/getProjects");
    return response.data;
  };
  const { data, isLoading } = useQuery({ queryFn: projects, queryKey: ["projects"] });
  if (isLoading) {
    <CircularProgress color="inherit" />
  }

  return (
    <VStack spacing={4} align={"center"}>
      {data.createdProject.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <Heading>{project.project_name}</Heading>
          </CardHeader>
          <CardBody>
            <Text>{project.start_date}</Text>
            <Image h={48} objectFit={"cover"} src={project.image_path} alt="" />
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
}
