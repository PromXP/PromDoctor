"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";

import { Poppins } from "next/font/google";

import Doc from "@/app/assets/logincover.png";
import Docbg from "@/app/assets/doctorbg.png";
import Docbgsm from "@/app/assets/loginsmallbg.png";

import Login from "@/app/PasswordReset/page.jsx";

import "@/app/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export default function Home() {
  const useWindowSize = () => {
    const [size, setSize] = useState({
      width: 0,
      height: 0,
    });

    useEffect(() => {
      const updateSize = () => {
        setSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      updateSize(); // set initial size
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }, []);

    return size;
  };

  const { width, height } = useWindowSize();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  const [isOpen, setIsOpen] = useState(false);

  const handleLogin = async () => {
    if (typeof window !== "undefined") {
    try {
      const response = await axios.post("https://promapi.onrender.com/login", {
        identifier: identifier,
        password: password,
        role: "doctor", // 🔒 Fixed to "doctor"
      });

      console.log("Login successful:", response.data);

      // Store login data for access on /Landing page
      localStorage.setItem("userData", JSON.stringify(response.data));

      // Redirect to landing page
      router.push("/Landing");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials.");
    }
  }
  };

  return (
    <>
      {width > height && (
        <div
          className={`${poppins.className} w-screen h-screen bg-white flex md:flex-row`}
        >
          {/* Left Section - Takes Full Width in Portrait Mode */}
          <div
            className={`${
              height > width
                ? "w-full h-full flex items-center justify-center px-6"
                : "w-[55%] min-h-screen px-12"
            } flex flex-col gap-12 items-center justify-center`}
          >
            <div
              className={`w-full max-w-lg text-center  ${
                height > width ? "text-center" : "md:text-left"
              }`}
            >
              <p className="font-bold text-3xl md:text-5xl text-black">
                DOCTOR
              </p>
              <p className="font-semibold text-2xl md:text-4xl text-[#005585]">
                Login
              </p>
            </div>

            {/* Input Fields */}
            <div className="w-full max-w-lg flex flex-col gap-8">
              <div className="relative w-full">
                <label className="absolute left-4 -top-2 bg-white px-1 text-[#005585] text-sm">
                  Email / Phone / UHID
                </label>
                <input
                  type="text"
                  className="w-full text-black py-3 px-4 border-[1.6px] border-[#79747E] rounded-sm text-lg focus:border-[#005585] outline-none"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="relative w-full">
                <label className="absolute left-4 -top-2 bg-white px-1 text-[#005585] text-sm">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full text-black py-3 px-4 border-[1.6px] border-[#79747E] rounded-sm text-lg focus:border-[#005585] outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-wrap justify-center items-center text-sm">
                
                <p className="text-[#FF8682] cursor-pointer" onClick={()=>setIsOpen(true)}>
                  Forgot Password?
                </p>
              </div>

              <button
                className="w-full bg-[#005585] text-lg text-white py-2.5 rounded-lg cursor-pointer"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>

          {/* Right Section - Image*/}
          <div className="hidden md:flex w-[45%] min-h-screen relative rounded-l-[50px] overflow-hidden">
            <Image
              src={Docbg}
              alt="Coverbackground"
              className="absolute w-full h-full object-cover"
            />
            <Image
              src={Doc}
              alt="Cover"
              className="absolute w-[95%] h-[90%] left-1/2 bottom-0 transform -translate-x-1/2 object-cover"
            />
          </div>
        </div>
      )}

      {width <= height && (
        <div
          className={`${poppins.className} w-screen h-screen bg-white flex flex-col`}
        >
          {/* Left Section - Takes Full Width in Portrait Mode */}
          <div
            className={`${
              height > width
                ? "w-full h-full flex items-center justify-center px-6"
                : "w-[55%] min-h-screen px-12"
            } flex flex-col gap-12 items-center justify-center`}
          >
            <div
              className={`w-full max-w-lg text-center  ${
                height > width ? "text-center" : "md:text-left"
              }`}
            >
              <p className="font-bold text-3xl md:text-5xl text-black">
                DOCTOR
              </p>
              <p className="font-semibold text-2xl md:text-4xl text-[#005585]">
                Login
              </p>
            </div>

            {/* Input Fields */}
            <div className="w-full max-w-lg flex flex-col gap-8">
              <div className="relative w-full">
                <label className="absolute left-4 -top-2 bg-white px-1 text-[#005585] text-sm">
                  Email / Phone / UHID
                </label>
                <input
                  type="text"
                  className="w-full text-black py-3 px-4 border-[1.6px] border-[#79747E] rounded-sm text-lg focus:border-[#005585] outline-none"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>

              <div className="relative w-full">
                <label className="absolute left-4 -top-2 bg-white px-1 text-[#005585] text-sm">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full text-black py-3 px-4 border-[1.6px] border-[#79747E] rounded-sm text-lg focus:border-[#005585] outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-wrap justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="checkbox"
                    className="h-5 w-5 text-[#005585] border-gray-300 border-4 rounded focus:ring-[#005585]"
                  />
                  <label
                    htmlFor="checkbox"
                    className="text-[#313131] font-medium"
                  >
                    Remember Me
                  </label>
                </div>
                <p className="text-[#FF8682] cursor-pointer">
                  Forgot Password?
                </p>
              </div>

              <button
                className="w-full bg-[#005585] text-lg text-white py-2.5 rounded-lg cursor-pointer"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>

          {/* Right Section - Image*/}
          <div
            className={`relative overflow-hidden ${
              height / width <= 1.5 &&
              height / width >= 1.3 &&
              height - width >= 200
                ? "flex w-full h-full justify-center items-end p-0"
                : "hidden"
            } `}
          >
            <Image
              src={Docbgsm}
              alt="Coverbackground"
              className="absolute w-[50%] h-[70%] object-fit left-1/4 top-1.5"
            />
            <Image
              src={Doc}
              alt="Cover"
              className="absolute w-[80%] h-[100%] object-fit"
            />
          </div>
        </div>
      )}

      <Login isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
