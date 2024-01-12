"use client";
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

export default function Register() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const toast = useToast();
  const { setAuthData } = useContext(StateContext);

  const registerMutation = useMutation(
    (data) => axios.post("api/auth/register", data),
    {
      onSuccess: (response) => {
        const token = response.data.token;
        const { username, password } = response.data.newUser;
        signIn("credentials", { username, password, callbackUrl: "/" });
        setAuthData(token, response.data.newUser);
        queryClient.invalidateQueries(["user"]);
        toast({
          title: "Account created",
          description: response.data.message,
          status: "success",
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
        // });
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
            width={"md"}
            {...register("username", { required: "Username is required" })}
          />
          <FormErrorMessage>
            {errors.username && errors.username?.message}
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
        <Button
          colorScheme="teal"
          variant={"solid"}
          my={4}
          type="submit"
          isLoading={registerMutation.isLoading}
        >
          Register
        </Button>
      </form>
    </VStack>
  );
}
