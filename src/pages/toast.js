import toast, { Toaster } from 'react-hot-toast';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const notify = () => toast('Here is your toast.');

const App = () => {
    return (
        <div>
            <button onClick={notify}>Make me a toast</button>
            <Toaster />
        </div>
    );
};

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/auth";
import { useToaster } from "react-hot-toast";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const {addToast} = useToaster();

    const mutation = useMutation(register, {
        onSuccess: (data) => {
            setIsLoading(false);
            addToast(data.message, {appearance: "success"});
        },
        onError: (error) => {
            setIsLoading(false);
            addToast(error.message, {appearance: "error"});
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        mutation.mutate({email, password});
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Register</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={isLoading}
                >
                    {isLoading ? "Signing up" : "Sign up"}
                </button>
            </form>
        </div>
    )
}


