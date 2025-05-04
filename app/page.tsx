"use client";

import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await auth.signIn(username, password);
      router.push("/home");
    } catch (error) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  {/* Added dark mode */}
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen h-full w-full bg-white dark:bg-gray-900 bg-[radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#1f2937_40%,#1e40af_100%)] min-h-screen">
      <div className="mx-auto flex w-full flex-col justify-center px-5 pt-0 md:h-[unset] md:max-w-[50%] lg:h-screen lg:max-w-[50%] lg:px-6">
        <a className="mt-10 w-fit text-zinc-950 dark:text-white" href="/">
          <div className="flex w-fit items-center lg:pl-0 lg:pt-0 xl:pt-0">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 320 512"
              className="mr-3 h-[13px] w-[8px] text-zinc-950 dark:text-white"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            ></svg>
          </div>
        </a>

        <div className="my-auto mb-auto mt-8 flex flex-col w-[350px] max-w-[450px] mx-auto md:mt-[70px] lg:mt-[130px]">
          <div className="flex justify-center mb-6">
            <img
              src="/mascot/main.png"
              alt="CVSwitch Logo"
              className="w-32 h-32"
            />
          </div>

          <p className="text-[32px] font-bold text-zinc-950 dark:text-white text-center">
            CVSwitch
          </p>
          <p className="mb-6 mt-2 font-normal text-center text-zinc-700 dark:text-zinc-400">
            Build Your Dream Resume in Minutes
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-zinc-950 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="mt-1 block w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-950 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1 block w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            <p>Demo credentials:</p>
            <p>
              Username: <span className="font-medium">demo</span>
            </p>
            <p>
              Password: <span className="font-medium">demo123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
