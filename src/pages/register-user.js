import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/client';
import { Input, Button } from '@chakra-ui';

const prisma = new PrismaClient();

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const response = await axios.post('/api/auth/register', data);
            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                await prisma.user.create({
                    data: {
                        email: data.email,
                        username: data.username,
                        password: data.password,
                    },
                });
                toast.success('Registration successful!');
                await router.push('/login');
            }
        } catch (error) {
            toast.error(error.message);
        }

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <form className="max-w-md w-full px-4 py-8 bg-white rounded-lg shadow-lg" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-2xl text-center font-bold mb-4">Register</h2>
                <div className="mb-4">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        register={register({
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: 'Invalid email address',
                            },
                        })}
                        error={errors.email}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        label="Username"
                        name="username"
                        type="text"
                        register={register({
                            required: 'Username is required',
                        })}
                        error={errors.username}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        register={register({
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters long',
                            },
                        })}
                        error={errors.password}
                    />
                </div>
                <div className="mb-6">
                    <Button type="submit" isLoading={isLoading} fullWidth>
                        Register
                    </Button>
                </div>
            </form>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}
