"use client";

import { signInWithGoogle } from "./actions";

export default function SignupPage() {
  return (
    <div className=" text-white">
      <div className="grow flex items-start justify-center mt-[10vh]">
        <div className="bg-zinc-800/50 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Login
          </h1>
          <form className="flex flex-col gap-4 items-center justify-center">
            <button
              formAction={signInWithGoogle}
              type="submit"
              className="login-with-google-btn hover:cursor-pointer"
            >
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
