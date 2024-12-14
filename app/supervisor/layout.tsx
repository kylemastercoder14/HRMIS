import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import SupervisorNavbar from "./_components/navbar";
import db from "@/lib/db";
import { getSupervisorFromCookies } from "@/lib/hooks/use-supervisor";

const SupervisorLayout = async ({ children }: { children: React.ReactNode }) => {
  const {user} = await getSupervisorFromCookies();
  const supervisor = await db.supervisor.findUnique({
    where: {
      id: user?.id,
    },
  });
  if (!user || !supervisor) throw new Error("User not found");
  const fullName = `${supervisor.fname} ${supervisor.lname}`;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <SupervisorNavbar
        image={supervisor?.profile as string}
        email={supervisor.email}
        name={fullName as string}
        fallback={supervisor.fname?.charAt(0) as string}
      />
      {children}
    </div>
  );
};

export default SupervisorLayout;
