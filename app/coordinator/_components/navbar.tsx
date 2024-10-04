"use client";

import React from "react";
import Link from "next/link";
import { CircleUser, Menu, Package2, School, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const CoordinatorNavbar = ({
  image,
  name,
  fallback,
  email,
}: {
  image: string;
  name: string;
  fallback: string;
  email: string;
}) => {
  const { signOut } = useClerk();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 flex h-16 z-50 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/coordinator/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <School className="h-6 w-6" />
          <span>HRMIS - CBSUA</span>
        </Link>
        <Link
          href="/coordinator/dashboard"
          className={pathname === "/coordinator/dashboard" ? "text-black" : "text-muted-foreground hover:text-black"}
        >
          <span>Dashboard</span>
        </Link>
        <Link
          href="/coordinator/history"
          className={pathname === "/coordinator/history" ? "text-black" : "text-muted-foreground hover:text-black"}
        >
          <span>Evalution History</span>
        </Link>
        <Link
          href="/coordinator/faculty-record"
          className={pathname === "/coordinator/faculty-record" ? "text-black" : "text-muted-foreground hover:text-black"}
        >
          <span>Faculty Record</span>
        </Link>
        <Link
          href="/coordinator/student-record"
          className={pathname === "/coordinator/student-record" ? "text-black" : "text-muted-foreground hover:text-black"}
        >
          <span>Student Record</span>
        </Link>
      </nav>
      <div className="ml-auto flex-1 sm:flex-initial">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={image} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs text-muted-foreground leading-none">
                  {email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/coordinator/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut({ redirectUrl: "/" })}
                className="cursor-pointer"
                asChild
              >
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default CoordinatorNavbar;
