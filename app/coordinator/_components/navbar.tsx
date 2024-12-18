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
import { logout } from "@/actions/coordinator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
  const handleLogout = async () => {
    await logout();
    window.location.assign("/");
  };
  const pathname = usePathname();
  return (
    <header className="sticky no-print top-0 flex h-16 z-50 items-center gap-4 border-b bg-[#2E845F] px-4 md:px-6">
      <div className="block md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex-col gap-6 text-lg font-medium flex lg:gap-6">
              <Link
                href="/coordinator/dashboard"
                className="flex items-center text-black gap-2 text-lg font-semibold md:text-base"
              >
                <School className="h-6 w-6" />
                <span>HRMIS - CBSUA</span>
              </Link>
              <Link
                href="/coordinator/dashboard"
                className={
                  pathname === "/coordinator/dashboard"
                    ? "text-black font-bold"
                    : "text-muted-foreground hover:text-black font-semibold"
                }
              >
                <span>Dashboard</span>
              </Link>
              <Link
                href="/coordinator/list-evaluation"
                className={
                  pathname === "/coordinator/list-evaluation"
                    ? "text-black font-bold"
                    : "text-muted-foreground hover:text-black font-semibold"
                }
              >
                <span>Evaluation Record</span>
              </Link>
              <Link
                href="/coordinator/invitation"
                className={
                  pathname === "/coordinator/invitation"
                    ? "text-black font-bold"
                    : "text-muted-foreground hover:text-black font-semibold"
                }
              >
                <span>Training Invitation</span>
              </Link>
              <Link
                href="/coordinator/history"
                className={
                  pathname === "/coordinator/history"
                    ? "text-black font-bold"
                    : "text-muted-foreground hover:text-black font-semibold"
                }
              >
                <span>Evaluation History</span>
              </Link>
              <Link
                href="/coordinator/student-record"
                className={
                  pathname === "/coordinator/student-record"
                    ? "text-black font-bold"
                    : "text-muted-foreground hover:text-black font-semibold"
                }
              >
                <span>Student Profile</span>
              </Link>
              <Link
                href="/coordinator/employee-profile"
                className={
                  pathname === "/coordinator/employee-profile"
                    ? "text-black font-bold"
                    : "text-muted-foreground hover:text-black font-semibold"
                }
              >
                <span>Employee Profile</span>
              </Link>
              <Link
                href="/coordinator/assign"
                className={
                  pathname === "/coordinator/assign"
                    ? "text-black font-bold"
                    : "text-muted-foreground hover:text-black font-semibold"
                }
              >
                <span>Assign Rater to Ratee</span>
              </Link>
              <Link
                href="/coordinator/qce-result"
                className={
                  pathname === "/coordinator/qce-result"
                    ? "text-black font-bold"
                    : "text-muted-foreground hover:text-black font-semibold"
                }
              >
                <span>QCE Result</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/coordinator/dashboard"
          className="flex items-center text-white gap-2 text-lg font-semibold md:text-base"
        >
          <School className="h-6 w-6" />
          <span>HRMIS - CBSUA</span>
        </Link>
        <Link
          href="/coordinator/dashboard"
          className={
            pathname === "/coordinator/dashboard"
              ? "text-white font-bold"
              : "text-zinc-200 hover:text-white font-semibold"
          }
        >
          <span>Dashboard</span>
        </Link>
        <Link
          href="/coordinator/list-evaluation"
          className={
            pathname === "/coordinator/list-evaluation"
              ? "text-white font-bold"
              : "text-zinc-200 hover:text-white font-semibold"
          }
        >
          <span>Evaluation Record</span>
        </Link>
        <Link
          href="/coordinator/invitation"
          className={
            pathname === "/coordinator/invitation"
              ? "text-white font-bold"
              : "text-zinc-200 hover:text-white font-semibold"
          }
        >
          <span>Training Invitation</span>
        </Link>
        <Link
          href="/coordinator/history"
          className={
            pathname === "/coordinator/history"
              ? "text-white font-bold"
              : "text-zinc-200 hover:text-white font-semibold"
          }
        >
          <span>Evaluation History</span>
        </Link>
        <Link
          href="/coordinator/student-record"
          className={
            pathname === "/coordinator/student-record"
              ? "text-white font-bold"
              : "text-zinc-200 hover:text-white font-semibold"
          }
        >
          <span>Student Profile</span>
        </Link>
        <Link
          href="/coordinator/employee-profile"
          className={
            pathname === "/coordinator/employee-profile"
              ? "text-white font-bold"
              : "text-zinc-200 hover:text-white font-semibold"
          }
        >
          <span>Employee Profile</span>
        </Link>
        <Link
          href="/coordinator/assign"
          className={
            pathname === "/coordinator/assign"
              ? "text-white font-bold"
              : "text-zinc-200 hover:text-white font-semibold"
          }
        >
          <span>Assign Rater to Ratee</span>
        </Link>
        <Link
          href="/coordinator/qce-result"
          className={
            pathname === "/coordinator/qce-result"
              ? "text-white font-bold"
              : "text-zinc-200 hover:text-white font-semibold"
          }
        >
          <span>QCE Result</span>
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
                onClick={handleLogout}
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
