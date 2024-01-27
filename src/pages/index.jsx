"use client";
import Head from "next/head";
import { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { signIn, useSession } from "next-auth/react";
import { IoKey } from "react-icons/io5";
import { Button } from "@chakra-ui/react";

export default function Home() {
  return (
    <div>
      <title>Create Projects</title>
      <main>
        <h2>welcome</h2>
        <Button colorScheme="teal" my={4} onClick={() => signIn()}>
          Sign In <IoKey />
        </Button>
      </main>
    </div>
  );
}
