"use client";

import { useState } from "react";
import Image from "next/image";
export default function Signup() {
    const [data, setData] = useState({ username: "", email: "", password: "" });

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        console.log(await res.json());
    };

    return (
<div className="flex min-h-screen">
  {/* Left Side Form */}
  <div className="flex flex-col justify-center items-center w-1/4 px-10">
    <h2 className="text-3xl font-bold mb-6">Create an Account</h2>

    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <input
        className="w-full border border-gray-300 rounded-lg p-3"
        placeholder="Username"
        onChange={(e) => setData({ ...data, username: e.target.value })}
      />

      <input
        className="w-full border border-gray-300 rounded-lg p-3"
        placeholder="Email"
        onChange={(e) => setData({ ...data, email: e.target.value })}
      />

      <input
        type="password"
        className="w-full border border-gray-300 rounded-lg p-3"
        placeholder="Password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-lg font-semibold"
      >
        Sign Up
      </button>
    </form>
  </div>

  {/* Right Side Image Section */}
  <div className="w-3/4">
    <Image
      src="/images/02sikkim.webp"
      alt="Rumtek Monastery"
      width={2000}
      height={1000}
      className="w-full h-full object-cover"
    />
  </div>
</div>

    );
}
