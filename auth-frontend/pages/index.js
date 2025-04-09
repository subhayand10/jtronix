// pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth_token");

    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Auth System</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Redirecting...</p>
      </div>
    </>
  );
}
