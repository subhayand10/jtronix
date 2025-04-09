// pages/dashboard.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          // Redirect to login if not authenticated
          router.push("/signin");
          return;
        }

        setUser(JSON.parse(userData));
        setLoading(false);

        // Optional: Validate token with backend
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Invalid token");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Auth System</title>
      </Head>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Auth System</h1>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard</h2>

              {user && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium">Your Profile:</h3>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {user.firstName} {user.lastName}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <p className="text-gray-600">
                  You have successfully signed in to the application. This is a
                  protected dashboard page that only authenticated users can
                  access.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
