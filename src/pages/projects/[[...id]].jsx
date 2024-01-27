"use client"

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext, useState } from "react";
import { StateContext } from "@/context/ContextProvider";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
// import toast from "react-hot-toast";
import {
  CircularProgress,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Textarea,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
// import { MuiFileInput } from "mui-file-input";

export default function ProjectForm() {
  const session = useSession();
  console.log(session);
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useToast();

  const [image, setImage] = useState(null);
  // const [video, setVideo] = useState(null);
  const [documentation, setDocumentation] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { id } = router.query;
  const { loading, setLoading } = useContext(StateContext);
  const handleImageChange = (e) => setImage(e.target.files[0]);
  // const handleVideoChange = (e) => setVideo(e.target.files[0]);
  const handleDocumentationChange = (e) => setDocumentation(e.target.files[0]);

  const singleProject = async (id) => {
    const response = await axios.get(`/api/projects/${id}`);
    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryFn: () => singleProject(id),
    queryKey: ["one-project", id],
    enabled: !!id,
  });

  const { mutate } = useMutation(
    async (data) => {
      //    Perform image processing logic here if needed
      const formData = new FormData();
      formData.append("project_name", data.project_name);
      formData.append("description", data.description);
      formData.append("start_date", data.start_date);
      formData.append("end_date", data.end_date);
      formData.append("image", image);
      formData.append("documentation", documentation);

      if (id) {
        const response = await axios.patch(`/api/projects/${id}/`, formData);
        return response.data;
      } else {
        const response = await axios.post("/api/projects", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return response.data;
      }
    },
    {
      onSuccess: (response) => {
        setLoading(false);
        //Invalidate and refetch the projects query after successful mutation
        queryClient.invalidateQueries(["projects"]);
        toast({
          title: 'Project created',
          description: response.data.message,
          status: 'success',
          duration: 7000,
          isClosable: true,
        });
        router.push('/dashboard');
      },
      onError: (error) => {
        setLoading(false);
        toast({
          title: 'Error creating project 😢',
          description: error.response.data.error,
          status: 'error',
          duration: 5000,
          isClosable: true,

        });
      },
    }
  );

  const onSubmit = (data) => {
    setLoading(true);
    mutate(data);
  };

  if (error) return error;
  if (id && isLoading)
    return (
      <CircularProgress
        isIndeterminate
        color="green.300"
      />
    );

  return (
    <VStack spacing={4} align={"center"}>
      <Heading className="text-center font-semibold">
        {id ? "Update Project" : "Create project"}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.project_name}>
          <FormLabel htmlFor="project_name">Project Name:</FormLabel>
          <Input
            {...register("project_name", {
              required: {
                value: true,
                message: "You must enter the project name",
              },
              minLength: {
                value: 4,
                message: "Your project name must be at least 4 characters",
              },
            })}
            type="text"
            defaultValue={data?.project_name || ""}
          />
          <FormErrorMessage>
            {errors.project_name && errors.project_name?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.description}>
          <FormLabel htmlFor="description">Description:</FormLabel>
          <Textarea
            {...register("description", {
              required: "Description is required",
            })}
            name="description"
            defaultValue={data?.description || ""}
            rows={2}
          ></Textarea>
          <FormErrorMessage>
            {errors.description && errors.description?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.start_date}>
          <FormLabel htmlFor="start_date">Start Date</FormLabel>
          <Input
            {...register("start_date", {
              required: {
                value: true,
                message: "Start Date is required",
              },
            })}
            type="date"
            defaultValue={data?.start_date || ""}
            id="start_date"
          />
          <FormErrorMessage>
            {errors.start_date && errors.start_date?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.end_date}>
          <FormLabel htmlFor="end_date">End Date</FormLabel>
          <Input
            {...register("end_date", {
              required: {
                value: true,
                message: "End Date is required",
              },
            })}
            type="date"
            name="end_date"
            defaultValue={data?.end_date || ""}
          />
          <FormErrorMessage>
            {errors.end_date && errors.end_date?.message}
          </FormErrorMessage>
        </FormControl>

        <input
          // {...register('images')}
          type="file"
          onChange={handleImageChange}
          accept=".png, .jpeg"
          name="image"
          id="image"
        />
        {/* <input
          // {...register('images')}
          type="file"
          onChange={handleVideoChange}
          accept="video/*, .mp4, .mkv"
          name="video"
          id="video"
        /> */}
        <input
          // {...register('images')}
          type="file"
          onChange={handleDocumentationChange}
          accept=".docx, .doc, .pdf"
          name="documentation"
          id="documentation"
        />

        <Button
          colorScheme="blue"
          isLoading={loading}
          variant={"solid"}
          my={4}
          type={"submit"}
        >
          Save
        </Button>
      </form>
    </VStack>
  );
};

ProjectForm.auth = true;
