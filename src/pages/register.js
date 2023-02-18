import {useRef, useState} from "react";
import {useRouter} from "next/router";

export default function Register() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const inputName = useRef();
    const inputEmail = useRef();
    const inputPassword = useRef();
    const router = useRouter()
    const onSubmit = async (e) => {
        e.preventDefault()
        const nameValue = inputName.current.value;
        const emailValue = inputEmail.current.value;
        const passwordValue = inputPassword.current.value;
        const sessionId = router?.query
        
        try {
            const response = await fetch('/api/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({nameValue, emailValue, passwordValue})
            });
            if (!response.ok) throw new Error(`Error; ${response.status}`)
            const data = await response.json();
            setMessage(data.message)
            inputName.current.value = '';
            inputEmail.current.value = '';
            inputPassword.current.value = '';
            await router.push('/');
        }catch (e) {
            console.log('ERROR', e)
        }

    }
    return (
        <div className={"bg-blue-200 flex flex-wrap h-96 items-center justify-between"}>
            <form action="/" onSubmit={onSubmit}
                  className={"mx-auto block inline-grid justify-center"}>
                <p>{username}</p>
                <input
                    type="text"
                    ref={inputName}
                    onChange={(e)=> setUsername(e.target.value)}
                    placeholder={"Username"}
                    className={"mx-2 my-3 p-2 w-96"}
                />
                <input
                    type="email"
                    ref={inputEmail}
                    placeholder={"Email"}
                    className={"mx-2 my-3 p-2 w-96"}
                />
                <input
                    type="password"
                    ref={inputPassword}
                    placeholder={"Password"}
                    className={"mx-2 my-3 p-2 w-96"}
                />
                <button type={"submit"}
                        className={"border-2 rounded-lg border-indigo-300 bg-purple-400 mx-auto text-white hover:bg-indigo-400 hover:border-transparent h-12 w-2/3"}>
                    Sign Up</button>
                {onSubmit ?
                    "" :
                    <p className={"bg-violet-500 text-white border-violet-400 w-2/3 p-2 mt-2"}>{message}</p>
                }
            </form>
        </div>
    )
}