"use client";
import Link from "next/link";
import { IoSettings } from "react-icons/io5";
import React from "react";
import { Button } from "./ui/button";
import { FaCircleUser } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  return (
    <>
      <header className="sticky top-0 z-50 h-16 w-full border-border/40">
        <div className="container z-50 flex h-full items-center justify-between">
          <Link
            href={"/"}
            className="flex items-center gap-2 font-sans text-2xl font-bold"
          >
            <span className="font-serif text-xl font-semibold tracking-wide">
              Duas Page
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <FaCircleUser className="size-7" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>Support Us</DropdownMenuLabel>
                  <DropdownMenuLabel>Download Dua App</DropdownMenuLabel>
                  <DropdownMenuLabel>Privacy Policy</DropdownMenuLabel>
                  <DropdownMenuLabel>Thanks & Credits</DropdownMenuLabel>
                  <DropdownMenuLabel>About Us</DropdownMenuLabel>
                  <DropdownMenuLabel>Copyright Warning</DropdownMenuLabel>
                  <DropdownMenuLabel>Our Other Projects</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
              <IoSettings className="text-green-700 text-3xl" />
            </>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
