

export default function Login() {

    return (
        <div>
            <div className={"bg-blue-200 flex flex-wrap h-96 items-center justify-between"}>
                <form action="/" className={"mx-auto block inline-grid justify-center"}>
                    <input type="email" placeholder={"Email"} className={"mx-2 my-3 p-2 w-96"} name={"email"}/>
                    <input type="password" placeholder={"Password"} className={"mx-2 my-3 p-2 w-96"} name={"password"}/>
                    <button type={"submit"}
                            className={"border-2 rounded-lg border-indigo-300 bg-purple-400 mx-auto text-white hover:bg-indigo-400 hover:border-transparent h-12 w-2/3"}>
                        Sign In</button>
                </form>
            </div>
        </div>
    )
}