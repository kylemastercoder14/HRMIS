import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CoordinatorNavbar from "./_components/navbar";
import db from "@/lib/db";

const CoordinatorLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const coordinator = await db.coordinator.findUnique({
    where: {
      clerkId: user?.id,
    },
  });
  if (!user || !coordinator) redirect("/");
  const fullName = `${coordinator.fname} ${coordinator.mname} ${coordinator.lname} ${coordinator.suffix}`;
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
