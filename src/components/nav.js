import Link from "next/link";
import Logout from "@/pages/logout";


export default function Nav() {
    return (
        <div className={"flex flex-wrap bg-indigo-500"}>
            <nav className={"inline-flex justify-between items-center float-right gap-2 text-white"}>
                <a href={"/"} className={"block inline-block hover:bg-purple-200 hover:text-blue-700 p-2"}>Home</a>
                <a href={"/logout"} className={"block inline-block hover:bg-purple-200 hover:text-blue-700 p-2"}><Logout /></a>
                <a href={"/login"} className={"block inline-block hover:bg-purple-200 hover:text-blue-700 p-2"}>Login</a>
                <a href={"/register-user"} className={"block inline-block hover:bg-purple-200 hover:text-blue-700 p-2"}>Register</a>
            </nav>
        </div>
    )
}