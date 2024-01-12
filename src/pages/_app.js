"use client";
import "@/styles/globals.css";
import Layout from "@/components/layout";
import { SessionProvider, useSession } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Layout>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </SessionProvider>
  );
}

function Auth({ children }) {
  const { status } = useSession({ required: true });
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  return children;
}
