"use client"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { StateContext } from "@/context/ContextProvider";
import { useContext } from "react";
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const toast = useToast()
  const {setAuthData} = useContext(StateContext)

  const registerMutation = useMutation(
    (data) => axios.post("api/auth/login", data),
    {
      onSuccess: (response) => {
        const { username } = response.data.user;
        signIn("credentials", { username, callbackUrl: "http://localhost:3000/dashboard" });
        const token = response.data.token;
        setAuthData(token, response.data.user)
        queryClient.invalidateQueries(["user"]);
        toast({
          title: `${response.data.user.username} logged in`,
          description: response.data.message,
          status: 'success',
          duration: 7000,
          isClosable: true,
        });
        // toast.promise(response, {
        //   success: {
        //     title: 'Account created',
        //     description: response.data.message,
        //     status: 'success',
        //     duration: 7000,
        //     isClosable: true
        //   },
        //   loading: {
        //     title: 'Creating user',
        //     description: 'Please wait',
        //   }
        // })
        router.push("/dashboard");
      },
      onError: (error) => {
        if (error.response.data?.error) {
          setError("username", {
            type: "manual",
            message: error.response.data.error,
          });
        }
      },
    }
  );

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <VStack spacing={4} align={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.username}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            {...register("username", { required: "Username is required" })}
          />
          <FormErrorMessage>
            {errors.password && errors.username?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          <FormErrorMessage>
            {errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <Button colorScheme="teal" variant={"solid"} mt={4} type="submit" isLoading={registerMutation.isLoading}>
          Login
        </Button>
      </form>
    </VStack>
  );
}
