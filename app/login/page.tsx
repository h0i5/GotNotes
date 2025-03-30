"use client";

import { signInWithGoogle } from "./actions";
import GoogleButton from "react-google-button";

export default function SignupPage() {
  return (
    <div className="text-white">
      <div className="grow flex items-start justify-center mt-[10vh]">
        <div className="mx-8 mt-12 bg-zinc-800/50 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              Login
            </span>
          </h1>
          <form className="flex flex-col gap-4 items-center justify-center">
            <GoogleButton
              onClick={signInWithGoogle}
              type="dark"
              className="w-full rounded-xl"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
