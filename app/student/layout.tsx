
import { redirect } from "next/navigation";
import React from "react";
import StudentNavbar from "./_components/navbar";
import { getStudentFromCookies } from "@/lib/hooks/use-student";

const StudentLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await getStudentFromCookies();
  const fullName = `${user?.fname} ${user?.lname}`;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <StudentNavbar
        image={user?.profile as string}
        email={user?.email as string}
        name={fullName as string}
        fallback={user?.fname?.charAt(0) as string}
      />
      {children}
    </div>
  );
};

export default StudentLayout;
