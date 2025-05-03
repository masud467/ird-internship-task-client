"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaDownload, FaShieldAlt, FaHeart } from "react-icons/fa";
import { MdOutlineCopyright, MdOutlineApps } from "react-icons/md";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Image from "next/image";
import profile from "../../public/image/profile.png";
import { BiSolidDonateHeart } from "react-icons/bi";
import { IoMdArrowDropdown } from "react-icons/io";
import Settings from "./Settings";

const ProfileDropdown = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center  gap-5">
        <div
          className="flex items-center space-x-1 cursor-pointer"
          onClick={toggleDropdown}
        >
          <Image
            src={profile}
            alt="Profile Icon"
            className=" rounded-full"
            width={50}
            height={50}
          />
          <div className="text-gray-600 ">
            <IoMdArrowDropdown />
          </div>
        </div>
        <Settings></Settings>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-10 right-0 w-64 bg-white shadow-lg rounded-lg p-4 z-10">
          <ul className="space-y-3">
            <li className="flex items-center space-x-2 text-gray-600 hover:text-green-600 cursor-pointer">
              <BiSolidDonateHeart className="text-green-600" />
              <span>Support Us</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-600 hover:text-green-600 cursor-pointer">
              <FaDownload className="text-green-600" />
              <span>Download Dua App</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-600 hover:text-green-600 cursor-pointer">
              <FaShieldAlt className="text-green-600" />
              <span>Privacy Policy</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-600 hover:text-green-600 cursor-pointer">
              <FaHeart className="text-green-600" />
              <span>Thanks & Credits</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-600 hover:text-green-600 cursor-pointer">
              <AiOutlineInfoCircle className="text-green-600" />
              <span>About Us</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-600 hover:text-green-600 cursor-pointer">
              <MdOutlineCopyright className="text-green-600" />
              <span>Copyright Warning</span>
            </li>
            <li className="flex items-center space-x-2 text-gray-600 hover:text-green-600 cursor-pointer">
              <MdOutlineApps className="text-green-600" />
              <span>Our Other Projects</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
