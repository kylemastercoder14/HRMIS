import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CoordinatorNavbar from "./_components/navbar";
import db from "@/lib/db";
import { getCoordinatorFromCookies } from "@/lib/hooks/use-coordinator";

const CoordinatorLayout = async ({ children }: { children: React.ReactNode }) => {
  const {user} = await getCoordinatorFromCookies();
  const coordinator = await db.coordinator.findUnique({
    where: {
      id: user?.id,
    },
  });
  if (!user || !coordinator) redirect("/");
  const fullName = `${coordinator.fname} ${coordinator.lname}`;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <CoordinatorNavbar
        image={coordinator?.profile as string}
        email={coordinator.email}
        name={fullName as string}
        fallback={coordinator.fname?.charAt(0) as string}
      />
      {children}
    </div>
  );
};

export default CoordinatorLayout;
