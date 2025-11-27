// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link"; // Link component for navigation

// export default function Signup() {
//     // State management for form inputs
//     const [data, setData] = useState({ username: "", email: "", password: "" });

//     // Form submission handler
//     const handleSubmit = async (e: any) => {
//         e.preventDefault();

//         // **TODO: Backend API Call**
//         // const res = await fetch("/api/signup", {
//         //     method: "POST",
//         //     headers: { "Content-Type": "application/json" },
//         //     body: JSON.stringify(data),
//         // });

//         // console.log(await res.json());
//         console.log("Signing up with:", data);
//     };

//     return (
//         // Main Container: Screen height, Two-column flex layout (No background color needed here, defined inside columns)
//         <div className="flex h-screen bg-gray-50">

//             {/* 1. Left Column: Sign Up Form (1/4 width) */}
//             <div className="w-full lg:w-3/12 p-8 md:p-10 flex flex-col justify-center bg-white shadow-xl lg:shadow-none border-r border-gray-100">
//                 <div className="max-w-md mx-auto w-full">
//                     <h1 className="text-2xl font-semibold mb-2">Create a new account</h1>
//                     <p className="text-gray-500 mb-6 text-sm">
//                         Already have an account?
//                         <Link href="/login" className="text-[#00684A] font-semibold hover:underline ml-1">
//                             Log in
//                         </Link>
//                     </p>

//                     {/* Social Logins (Optional: You can add Google/GitHub buttons here too) */}

//                     {/* Sign Up Form */}
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <input
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
//                             placeholder="Username"
//                             value={data.username}
//                             onChange={(e) => setData({ ...data, username: e.target.value })}
//                             required
//                         />

//                         <input
//                             type="email"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
//                             placeholder="Email"
//                             value={data.email}
//                             onChange={(e) => setData({ ...data, email: e.target.value })}
//                             required
//                         />

//                         <input
//                             type="password"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
//                             placeholder="Password"
//                             value={data.password}
//                             onChange={(e) => setData({ ...data, password: e.target.value })}
//                             required
//                         />

//                         {/* Terms and Conditions Checkbox (Optional, but good practice) */}
//                         <div className="flex items-center text-xs text-gray-600 pt-2">
//                             <input type="checkbox" id="terms" required className="mr-2 accent-[#00684A]" />
//                             <label htmlFor="terms">
//                                 I agree to the <a href="#" className="underline text-blue-600">Terms of Service</a> and <a href="#" className="underline text-blue-600">Privacy Policy</a>.
//                             </label>
//                         </div>


//                         <button
//                             type="submit"
//                             className="w-full py-2 px-3 bg-[#00684A] text-white font-semibold rounded-md text-sm hover:bg-[#004D36] transition duration-200"
//                         >
//                             Create Account
//                         </button>
//                     </form>

//                 </div>
//             </div>

//             {/* 2. Right Column: Image Section (3/4 width) */}
//             {/* The image is contained, covers the whole section, and is hidden on small screens */}
//             <div className="hidden lg:block lg:w-9/12 relative">
//                 <Image
//                     // src="/images/03sikkim.webp"
//                     src = "/images/newImgSikkim.png"
//                     alt="Rumtek Monastery, Sikkim"
//                     // Next/Image best practices: use fill/layout="fill" for responsive full coverage
//                     fill
//                     className="object-cover"
//                 />
//             </div>
//         </div>
//     );
// }
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Signin() {
  const [data, setData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // TODO: API Call
    // const res = await fetch("/api/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });
    // console.log(await res.json());

    console.log("Logging in with:", data);
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Left Column */}
      <div className="w-full lg:w-3/12 p-8 md:p-10 flex flex-col justify-center bg-white shadow-xl lg:shadow-none border-r border-gray-100">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-2xl font-semibold mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-6 text-sm">
            Don’t have an account?
            <Link href="/signup" className="text-[#00684A] font-semibold hover:underline ml-1">
              Sign up
            </Link>
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={data.role}
              onChange={(e) => setData({ ...data, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="event-owner">Event Owner</option>
              <option value="hotel-owner">Hotel Owner</option>
            </select>

            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />

            <button
              type="submit"
              className="w-full py-2 px-3 bg-[#00684A] text-white font-semibold rounded-md text-sm hover:bg-[#004D36] transition duration-200"
            >
              Sign In
            </button>
          </form>

        </div>
      </div>

      {/* Right Column Image */}
      <div className="hidden lg:block lg:w-9/12 relative">
        <Image
          src="/images/sikkimCollage.png"
          alt="Monastery Image"
          fill
          className="object-cover"
        />
      </div>

    </div>
  );
}
