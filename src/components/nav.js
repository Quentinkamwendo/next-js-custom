import {
  Box,
  Collapse,
  Flex,
  IconButton,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { useContext } from "react";
import { StateContext } from "@/context/ContextProvider";
import { FaAlignJustify, FaBars, FaHamburger } from "react-icons/fa";
import { useRouter } from "next/router";
export default function Nav() {
  const { isOpen, onToggle } = useDisclosure();
  const { data: session } = useSession();
  const router = useRouter();
  const id = router.query.id ? router.query.id : '';
  const { token } = useContext(StateContext);

  const handleLogout = async () =>
    await signOut({ callbackUrl: "http://localhost:3000" });
  return (
    <Flex p={4} bg={"blue.500"}>
      {/* <Text fontSize={"xl"} fontWeight={"bold"} color={"white"}>
        My Logo
      </Text> */}
      {/* Menu icon */}
      <Box>
        <IconButton
          icon={isOpen ? <IoClose /> : <FaBars />}
          aria-label="Toggle menu"
          onClick={onToggle}
          display={{ base: "block", md: "none" }}
          size={"md"}
          pl={3}
        />
      </Box>

      <Spacer />

      <Box display={{ base: "none", md: "flex" }}>
        {session ? (
          <>
            <Link href={"/dashboard"}>
              <Text
                mr={4}
                cursor={"pointer"}
                onClick={() => console.log("Dashboard clicked")}
              >
                Dashboard
              </Text>
            </Link>
            <Link href={`/projects/${id}`}>
              <Text
                mr={4}
                cursor={"pointer"}
                onClick={() => console.log("Project clicked")}
              >
                Project
              </Text>
            </Link>
            <Text cursor={"pointer"} onClick={handleLogout}>
              Logout
            </Text>
          </>
        ) : (
          <>
            <Link href={"/login"}>
              <Text
                mr={4}
                cursor={"pointer"}
                onClick={() => console.log("Login clicked")}
              >
                Login
              </Text>
            </Link>
            <Link href={"/register"}>
              <Text
                mr={4}
                cursor={"pointer"}
                onClick={() => console.log("Register clicked")}
              >
                Register
              </Text>
            </Link>
          </>
        )}
      </Box>

      {/* Navigation Links */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          display={{ base: "block", md: "none" }}
          //   display={{ base: isOpen ? "block" : "none", md: "flex" }}
          mt={{ base: 4, md: 0 }}
          //   ml={{ md: "auto" }}
        >
          {session ? (
            <>
              <Link href={"/dashboard"}>
                <Text
                  mr={4}
                  cursor={"pointer"}
                  onClick={() => console.log("Dashboard clicked")}
                >
                  Dashboard
                </Text>
              </Link>
              <Link href={`/projects/${id}`}>
                <Text
                  mr={4}
                  cursor={"pointer"}
                  onClick={() => console.log("Project clicked")}
                >
                  Project
                </Text>
              </Link>
              <Text cursor={"pointer"} onClick={handleLogout}>
                Logout
              </Text>
            </>
          ) : (
            <>
              <Link href={"/login"}>
                <Text
                  mr={4}
                  cursor={"pointer"}
                  onClick={() => console.log("Login clicked")}
                >
                  Login
                </Text>
              </Link>
              <Link href={"/register"}>
                <Text
                  mr={4}
                  cursor={"pointer"}
                  onClick={() => console.log("Register clicked")}
                >
                  Register
                </Text>
              </Link>
            </>
          )}
        </Box>
      </Collapse>
    </Flex>
    // <div className={"flex flex-wrap bg-indigo-500"}>
    //     <nav className={"inline-flex justify-between items-center float-right gap-2 text-white"}>
    //         <Link href={"/"} className={`block inline-block hover:bg-purple-200
    //             hover:text-blue-700 p-2`}>
    //                 Home
    //             {/* <a href={"/"} className={`block inline-block hover:bg-purple-200
    //             hover:text-blue-700 p-2`}>Home</a> */}
    //         </Link>

    //         <Link href={"/logout"} className={`block inline-block hover:bg-purple-200
    //         hover:text-blue-700 p-2`}><Logout /></Link>

    //         <Link href={"/login"} className={`block inline-block hover:bg-purple-200
    //         hover:text-blue-700 p-2`}>Login</Link>
    //         {/* <a href={"/register-user"} className={`block inline-block hover:bg-purple-200
    //         hover:text-blue-700 p-2`}>Register</a> */}
    //         <Link href={"/signUp"} className={`block inline-block hover:bg-purple-200
    //         hover:text-blue-700 p-2`}>Register</Link>
    //     </nav>
    // </div>
  );
}
