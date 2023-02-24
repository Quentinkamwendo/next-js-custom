import {useState} from "react";
import {useRouter} from "next/router";

export default function Logout() {
    const [message , setMessage] = useState('');
    const router = useRouter();
    async function handleLogout() {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        const data = await response.json();
        await router.push('/')
        setMessage(data.message);
    }
    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            {message && <p className={"bg-green-300"}>{message}</p>}
        </div>
    )
}