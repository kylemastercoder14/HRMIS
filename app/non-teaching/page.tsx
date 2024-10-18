"use client";

import { logout } from "@/actions/non-teaching";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const NonTeaching = () => {
  const handleLogout = async () => {
    await logout();
    window.location.assign("/");
  };
  return (
    <div className="flex items-center flex-col justify-center h-screen p-3">
      <div className="relative w-full h-[80vh]">
        <Image
          src="/images/notfound.png"
          fill
          className="w-full h-full"
          alt="Not found"
        />
      </div>
      <Button onClick={handleLogout} size="lg" className="w-full mt-5">
        Logout
      </Button>
    </div>
  );
};

export default NonTeaching;
