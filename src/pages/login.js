"use client"

import {HiLockClosed} from "react-icons/hi";
import {useState} from "react";
import {useRouter} from "next/router";
import {Button, Input} from "@chakra-ui/react";
import NextAuth from "next-auth";
import toast, {Toaster} from "react-hot-toast";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });
        if (response.ok) {
            toast.success("successfully logged in")
            await router.push('/')
        } else {
            const data = await response.json();
            toast.error(data.message);
        }
    }

    return (
        <div>
            <Toaster />
            <div className={"bg-blue-200 flex flex-wrap h-96 items-center justify-between"}>
                <form action="/" className={"mx-auto block inline-grid justify-center"}>
                    <Input type="email" placeholder={"Email"}
                           className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                           leading-tight focus:outline-none focus:shadow-outline`} />
                    <Input type="password" placeholder={"Password"}
                           className={`my-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                           leading-tight focus:outline-none focus:shadow-outline`} />
                    <Button type={"submit"}
                            className={`border-2 rounded-lg border-indigo-300 bg-purple-400 mx-auto text-white 
                            hover:bg-indigo-400 hover:border-transparent h-12 w-2/3`}>
                        <span className={"float-left ml-2"}>
                            <HiLockClosed className={"h-5 w-5"} />
                        </span>
                        Sign In</Button>
                </form>
            </div>
        </div>
    )
}