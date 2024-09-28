import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import StudentNavbar from "./_components/navbar";
import db from "@/lib/db";

const StudentLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();
  const student = await db.student.findUnique({
    where: {
      clerkId: user?.id,
    },
  });
  if (!user || !student) redirect("/");
  const fullName = `${student.fname} ${student.mname} ${student.lname}`;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <StudentNavbar
        image={student?.profile as string}
        email={student.email}
        name={fullName as string}
        fallback={student.fname?.charAt(0) as string}
      />
      {children}
    </div>
  );
};

export default StudentLayout;
