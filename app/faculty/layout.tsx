import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import FacultyNavbar from "./_components/navbar";
import db from "@/lib/db";

const FacultyLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const faculty = await db.faculty.findUnique({
    where: {
      clerkId: user?.id,
    },
  });
  if (!user || !faculty) redirect("/");
  const fullName = `${faculty.fname} ${faculty.mname} ${faculty.lname}`;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <FacultyNavbar
        image={faculty?.profile as string}
        email={faculty.email}
        name={fullName as string}
        fallback={faculty.fname?.charAt(0) as string}
      />
      {children}
    </div>
  );
};

export default FacultyLayout;
