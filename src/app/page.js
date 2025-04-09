"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";

import { Poppins } from "next/font/google";

import Doc from "@/app/assets/logincover.png";
import Docbg from "@/app/assets/logincoverbg.png";
import Docbgsm from "@/app/assets/loginsmallbg.png";

import "@/app/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});


export default function Home() {
  const useWindowSize = () => {
    const [size, setSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
  };

  const { width, height } = useWindowSize();
  console.log("Screen Width:", width, "Screen Height:", height);
  const router = useRouter();
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
              <p className="font-bold text-3xl md:text-5xl text-black">DOCTOR</p>
              <p className="font-semibold text-2xl md:text-4xl text-[#005585]">
                Login
              </p>
            </div>

            {/* Input Fields */}
            <div className="w-full max-w-lg flex flex-col gap-8">
              <div className="relative w-full">
                <label className="absolute left-4 -top-2 bg-white px-1 text-[#005585] text-sm">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full text-black py-3 px-4 border-[1.6px] border-[#79747E] rounded-sm text-lg focus:border-[#005585] outline-none"
                />
              </div>

              <div className="relative w-full">
                <label className="absolute left-4 -top-2 bg-white px-1 text-[#005585] text-sm">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full text-black py-3 px-4 border-[1.6px] border-[#79747E] rounded-sm text-lg focus:border-[#005585] outline-none"
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

              <button className="w-full bg-[#005585] text-lg text-white py-2.5 rounded-lg cursor-pointer" onClick={() => router.push("/Landing")}>
                Login
              </button>
            </div>

            {/* Alternative Login */}
            <div className="w-full max-w-lg flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 w-full justify-center opacity-50 text-sm md:text-base whitespace-nowrap">
                <div className="w-1/3 h-[0.5px] bg-[#313131]"></div>
                <p className="text-[#313131] px-2">Or login with</p>
                <div className="w-1/3 h-[0.5px] bg-[#313131]"></div>
              </div>

              <div className="border-[#005585] border-[1.8px] p-2 rounded-lg cursor-pointer">
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.90368 4.11288H8.59089V4.09676H5.09605V5.65003H7.29062C6.97045 6.55422 6.11014 7.20329 5.09605 7.20329C3.80937 7.20329 2.76615 6.16008 2.76615 4.87339C2.76615 3.58671 3.80937 2.5435 5.09605 2.5435C5.68998 2.5435 6.23032 2.76756 6.64174 3.13354L7.74009 2.03519C7.04656 1.38884 6.11887 0.990234 5.09605 0.990234C2.95158 0.990234 1.21289 2.72892 1.21289 4.87339C1.21289 7.01787 2.95158 8.75655 5.09605 8.75655C7.24053 8.75655 8.97921 7.01787 8.97921 4.87339C8.97921 4.61303 8.95242 4.35888 8.90368 4.11288Z"
                    fill="#FFC107"
                  />
                </svg>
              </div>
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
              <p className="font-bold text-3xl md:text-5xl text-black">DOCTOR</p>
              <p className="font-semibold text-2xl md:text-4xl text-[#005585]">
                Login
              </p>
            </div>

            {/* Input Fields */}
            <div className="w-full max-w-lg flex flex-col gap-8">
              <div className="relative w-full">
                <label className="absolute left-4 -top-2 bg-white px-1 text-[#005585] text-sm">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full text-black py-3 px-4 border-[1.6px] border-[#79747E] rounded-sm text-lg focus:border-[#005585] outline-none"
                />
              </div>

              <div className="relative w-full">
                <label className="absolute left-4 -top-2 bg-white px-1 text-[#005585] text-sm">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full text-black py-3 px-4 border-[1.6px] border-[#79747E] rounded-sm text-lg focus:border-[#005585] outline-none"
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

              <button className="w-full bg-[#005585] text-lg text-white py-2.5 rounded-lg cursor-pointer">
                Login
              </button>
            </div>

            {/* Alternative Login */}
            <div className="w-full max-w-lg flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 w-full justify-center opacity-50 text-sm md:text-base whitespace-nowrap">
                <div className="w-1/3 h-[0.5px] bg-[#313131]"></div>
                <p className="text-[#313131] px-2">Or login with</p>
                <div className="w-1/3 h-[0.5px] bg-[#313131]"></div>
              </div>

              <div className="border-[#005585] border-[1.8px] p-2 rounded-lg cursor-pointer">
                <svg
                  width="35"
                  height="35"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.90368 4.11288H8.59089V4.09676H5.09605V5.65003H7.29062C6.97045 6.55422 6.11014 7.20329 5.09605 7.20329C3.80937 7.20329 2.76615 6.16008 2.76615 4.87339C2.76615 3.58671 3.80937 2.5435 5.09605 2.5435C5.68998 2.5435 6.23032 2.76756 6.64174 3.13354L7.74009 2.03519C7.04656 1.38884 6.11887 0.990234 5.09605 0.990234C2.95158 0.990234 1.21289 2.72892 1.21289 4.87339C1.21289 7.01787 2.95158 8.75655 5.09605 8.75655C7.24053 8.75655 8.97921 7.01787 8.97921 4.87339C8.97921 4.61303 8.95242 4.35888 8.90368 4.11288Z"
                    fill="#FFC107"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Section - Image*/}
          <div className={`relative overflow-hidden ${(height/width)<=1.5 && (height/width) >=1.3 && (height-width)>=200? "flex w-full h-full justify-center items-end p-0":"hidden"} `}>
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
    </>
  );
}
