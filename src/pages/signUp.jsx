"use client"
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
// import { CredentialsProvider } from "next-auth/providers";
import { useForm } from "react-hook-form";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
const queryClient = new QueryClient()
export default function RegisterForm() {
    return (
        <QueryClientProvider client={queryClient}>
            <RegisterUser />
        </QueryClientProvider>
    )
}

const RegisterUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    let toastProjectId;

    // const onSubmit = async (data) => {
    //   const {username, email, password} = data;
    //
    //   try {
    //       const response = await axios.post('/api/auth/register', {username, email, password});
    //       if (response.status === 201) {
    //           await signIn('Credentials', {
    //               email,
    //               password,
    //               callbackUrl: `${window.location.origin}/Home`
    //           });
    //           toast.success("Successfully registered")
    //       }
    //   } catch (error) {
    //       toast.error('Something went wrong. Please try again');
    //   }
    // };
    //
    // const registerUser = useMutation(onSubmit);
    const { mutate } = useMutation(async (userData) => {
        const { data } = await axios.post('/api/auth/register', userData);
        return data;
    }, {
        onSuccess: (data) => {
            toast.success(`User ${data.username} created successfully`, { id: toastProjectId })
        },
        onError: (error) => {
            toast.error(error.message, { id: toastProjectId, duration: 20000 })
        }
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        toastProjectId = toast.loading("Creating your project", { id: toastProjectId })
        try {
            const result = await mutate(data);
            if (result.status === 201) {
                await signIn('Credentials', {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    callbackUrl: `$/Home`,
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message);
        }
    };

    const handlePasswordVisibility = () => setShowPassword(!showPassword);


    const handleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <div className={"flex flex-col items-center justify-center h-screen"}>
            <Toaster position={"top-right"} reverseOrder={false} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={"mb-4"}>
                    <label htmlFor="username" className={"block text-gray-700 font-bold mb-2"}>
                        Name
                    </label>
                    <input type="text" id={"name"}
                        name={"username"}
                        {...register('username', { required: "Please enter your name" })}
                        className={"border border-gray-400 p-2 rounded w-full"}
                    />
                    {errors.username && <p className={"text-red-500 mt-1"}>{errors.username.message}</p>}
                </div>
                <div className={"mb-4"}>
                    <label htmlFor="email" className={"block text-gray-700 font-bold mb-2"}>
                        Email
                    </label>
                    <input type="email" id={"email"}
                        name={"email"}
                        {...register('email', {
                            required: 'Please enter your email address',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Please enter a valid email address'
                            }
                        })}
                        className={"border border-gray-400 p-2 rounded w-full"}
                    />
                    {errors.email && <p className={"text-red-500 mt-1"}>{errors.email.message}</p>}
                </div>
                <div className={"mb-4"}>
                    <label htmlFor="password" className={"block text-gray-700 font-bold mb-2"}>
                        Password
                    </label>
                    <div className={"relative"}>
                        <input type={showPassword ? 'text' : 'password'}
                            name={"password"}
                            {...register('password', {
                                required: 'Please enter your password',
                                minLength: {
                                    value: 8,
                                    message: 'Your password must be at least 8 characters long'
                                }
                            })}
                            className={"border border-gray-400 p-2 rounded w-full"}
                        />
                        <button onClick={handlePasswordVisibility}
                            className={"absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"}
                        >
                            {showPassword ? (<EyeSlashIcon className={"h-5 w-5 text-gray-500"} />) :
                                (<EyeIcon className={"h-5 w-5 text-gray-500"} />)}
                        </button>
                    </div>
                    {errors.password && <p className={"text-red-500 mt-1"}>{errors.password.message}</p>}
                </div>
                <div className={"mb-4"}>
                    <label htmlFor="confirmPassword" className={"block text-gray-700 font-bold mb-2"}>
                        Confirm Password</label>
                    <div className={"relative"}>
                        <input type={showConfirmPassword ? 'text' : 'password'}
                            id={"confirmPassword"}
                            name={"confirmPassword"}
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) => value === watch('password') || 'Passwords do not match'
                            })}
                            className={"border border-gray-400 p-2 rounded w-full"}
                        />
                        <button onClick={handleConfirmPasswordVisibility}
                            className={"absolute top-1/2 right-3 transform -translate-y-1/2 focus:outline-none"}
                        >
                            {showConfirmPassword ? (<EyeSlashIcon className={"h-5 w-5 text-gray-500"} />) :
                                (<EyeIcon className={"h-5 w-5 text-gray-500"} />)}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className={"text-red-500 mt-1"}>{errors.confirmPassword.message}</p>}
                </div>
                <button type="submit"
                    className={"bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-400"}
                >
                    {isLoading && <LoaderIcon />}
                    Register
                </button>
            </form>
        </div>
    )
}
