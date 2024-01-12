"use client"
import Head from 'next/head'
import {useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon, PencilIcon, PlusIcon} from '@heroicons/react/20/solid'
import {signIn, useSession} from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {useQuery} from "@tanstack/react-query";
import {BiPencil} from "react-icons/bi";
import {FaEdit, FaTrashAlt} from "react-icons/fa";



export default function Home() {

    return (
        <div>
            <title>Create Projects</title>
            <main>
                <h2>welcome</h2>
                <button onClick={() => signIn()}>Sign In</button>
            </main>
        </div>

        )
}
