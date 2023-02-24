"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {useMutation} from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Input, Button } from '@chakra-ui/react';

const Signup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const router = useRouter();

    const signupMutation = useMutation(async (userData) => {
        const { data } = await axios.post('/api/register', userData);
        return data;
    });

    const onSubmit = async (data) => {
       setIsLoading(true);
        try {
        const result = await signupMutation.mutateAsync(data);
           if (result.success) {
             await signIn('credentials',{
                 email: data.email,
                 password: data.password,
                 callbackUrl: `${window.location.origin}/`,
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message);
        }
    };


    return (
        <div className={"min-h-screen flex flex-col items-center justify-center bg-gray-200"}>
            <form onSubmit={handleSubmit(onSubmit)} className={"space-y-4"}>
                <Input id={"name"} name={"name"} type={"text"} autoComplete={"name"}
                       placeholder="Name"
                       required
                       className={`block w-full rounded-md bg-gray-100 border-transparent 
                       focus:border-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-400 
                       focus:shadow-lg focus:shadow-blue-300 focus:outline-none p-2`}
                />
                {errors.name && <span className={"text-red-500 mt-1"}>Name is required</span>}
                <Input type="email"
                       placeholder="Email" {...register('email', { required: true })}
                       className={`block w-full rounded-md bg-gray-100 border-transparent 
                       focus:border-gray-500 focus:bg-white focus:ring-0 p-2`}

                />
                {errors.email && <span className={"text-red-500 mt-1"}>Email is required</span>}
                <Input type="password" placeholder="Password"
                       {...register('password', { required: true })}
                       className={`block w-full rounded-md bg-gray-100 border-transparent 
                       focus:border-gray-500 focus:bg-white focus:ring-0 p-2`}
                />
                {errors.password && <span className={"text-red-500 mt-1"}>Password is required</span>}
                <Button type="submit"
                        className={`bg-blue-500 text-white font-bold py-2 px-4 
                        rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed': '' }`}
                        disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Sign up'}
                </Button>
            </form>
            <Toaster />
        </div>
    );
};

export default Signup;
