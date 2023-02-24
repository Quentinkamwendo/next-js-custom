'use client'
import { useState } from 'react';
import axios from 'axios';
import {QueryClient,QueryClientProvider,useQuery} from "@tanstack/react-query";

import {useSession} from 'next-auth/react';
import { useForm } from 'react-hook-form';
import {useRouter} from "next/router";
import { useMutation } from '@tanstack/react-query';
import toast, {Toaster} from 'react-hot-toast';

const queryClient = new QueryClient()
export default function Project() {
    return (
        <QueryClientProvider client={queryClient}>
            <ProjectForm />
        </QueryClientProvider>
    )
}

const ProjectForm = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm();
    const {session, loading} = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [video, setVideo] = useState(null);
    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);

    const onSubmit = async (formData) => {

        const data = new FormData();

        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('video', video);

        images.forEach((image) => {
            formData.append('images', image);
        });

        documents.forEach((document) => {
            formData.append('documents', document);
        });
        setIsLoading(true);
        try {
            await axios.post('/api/add-projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            toast.success('Project created successfully');
            await router.push('/');
        } catch (error) {
            setIsLoading(false)
            console.error(error);
            toast.error('Error creating project');
        }
    };


    const { mutate } = useMutation(onSubmit);

    const handleVideoChange = (event) => {
        setVideo(event.target.files[0]);
    };

    const handleImagesChange = (event) => {
        setImages(Array.from(event.target.files));
    };

    const handleDocumentsChange = (event) => {
        setDocuments(Array.from(event.target.files));
    };
    if (loading) return <p>Loading...</p>;
    if (session) {
        router.push('/')
        return null


    }

    return (
        <>
            <form onSubmit={handleSubmit(mutate)} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-medium mb-6">Create a new project</h2>
                <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                        Name
                    </label>
                    <input type="text" id="name" {...register('name', {required: true})} name="name" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="mb-6">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                        Description
                    </label>
                    <textarea id="description" name="description"
                              {...register('description', {required: true})}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              rows={"3"}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="video"
                           className="block text-gray-700 font-medium mb-2">
                        Video
                    </label>
                    <input type="file" id="video" name="video" onChange={handleVideoChange}
                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-6">
                    <label htmlFor="images" className="block text-gray-700 font-medium mb-2">
                        Images
                    </label>
                    <input type="file" id="images" name="images" onChange={handleImagesChange} multiple className="border rounded-lg p-2" />
                </div>
                <div className="mb-6">
                    <label htmlFor="documents" className="block text-gray-700 font-medium mb-2">
                        Documents
                    </label>
                    <input {...register('documents')} id="documents" name="documents" type="file" multiple accept="application/pdf"
                           className="form-input" onChange={handleDocumentsChange}/>
                </div>
                <button type="submit" disabled={isLoading}
                        className={`bg-indigo-500 text-white hover:bg-indigo-700 p-2 rounded-lg`}>
                    {isLoading ? 'Creating...' : 'Create Project'}
                </button>
                <Toaster />
            </form>
        </>

        )
}

