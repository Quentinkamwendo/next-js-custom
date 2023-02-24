import {hash} from  "bcrypt";
import {NextApiRequest, NextApiResponse} from "next";
import {useMutation} from "@tanstack/react-query";
import {useSession} from "next-auth/react";
import toast from "react-hot-toast";
import connection from "@/components/connection";
import {promise} from "bcrypt/promises";

const registerMutation = async (formData) => {
    const hashedPassword = await  hash(formData.password, 10);
    return new promise((resolve, reject) => {
        connection.query(
            "INSERT INTO users (name, email, password) VALUE(?, ?, ?)",
            [formData.name, formData.email, hashedPassword],
            (error, results) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(results);
                }
            }
        )
    })
}

