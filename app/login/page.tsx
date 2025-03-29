"use client";

import Navbar from "../components/Navbar";
import { signInWithGoogle } from "./actions";

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-900 via-purple-900/20 to-black text-white">
      <Navbar />

      <div className="grow flex items-start justify-center mt-[10vh]">
        <div className="bg-zinc-800/50 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Login
          </h1>
          <form className="flex flex-col gap-4 items-center justify-center">
            <button
              formAction={signInWithGoogle}
              type="submit"
              className="login-with-google-btn"
            >
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
