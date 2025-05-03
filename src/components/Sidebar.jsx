import React from "react";
import {
  AiOutlineHome,
  AiOutlineAppstore,
  AiOutlineBulb,
} from "react-icons/ai";
import { BiBookmark, BiDonateHeart } from "react-icons/bi";
import { FaHands } from "react-icons/fa";
import { BsClipboardPlus } from "react-icons/bs";
import { TiMessages } from "react-icons/ti";
import { IoBookOutline } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div className="rounded-tl-3xl rounded-bl-3xl h-[90vh] w-24 bg-white flex flex-col justify-between items-center py-4">
      <button className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md">
        <FaHands className="text-2xl" />
      </button>
      <div className="flex flex-col items-center gap-4 ">
        {/* Top Button */}

        {/* Sidebar Icons */}
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-green-100 hover:text-green-500 transition">
          <AiOutlineHome size={20} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-green-100 hover:text-green-500 transition">
          <AiOutlineAppstore size={20} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-green-100 hover:text-green-500 transition">
          <AiOutlineBulb size={20} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-green-100 hover:text-green-500 transition">
          <BiBookmark size={20} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-green-100 hover:text-green-500 transition">
          <BsClipboardPlus size={20} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-green-100 hover:text-green-500 transition">
          <TiMessages size={20} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-green-100 hover:text-green-500 transition">
          <IoBookOutline size={20} />
        </button>
      </div>

      {/* Bottom Section */}
      <button className="w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded-full shadow-md">
        <BiDonateHeart size={20} />
      </button>
    </div>
  );
};

export default Sidebar;
