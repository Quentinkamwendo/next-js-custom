'use client'
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { ContextProvider } from "@/context/ContextProvider";

const queryClient = new QueryClient();
export default function Layout({ children }) {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ContextProvider>
          <ChakraProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
          </ChakraProvider>
        </ContextProvider>
      </QueryClientProvider>
    </div>
  );
}
