import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { format } from "date-fns";
import { StudentColumn } from "./_components/column";
import StudentRecordClient from "./_components/client";

const StudentRecord = async () => {
  const students = await db.student.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedAssign: StudentColumn[] = students.map((item) => ({
    id: item.id,
    name: item.fname + " " + item.lname,
    email: item.email,
    imageUrl: item.profile ?? "",
    course: item.course,
    yearLevelFilter: item.yearLevel.toString(),
    section: item.section,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Student Record`}
          description="View and manage student information, including academic details, personal data, and course enrollment."
        />
      </div>
      <StudentRecordClient data={formattedAssign} />
    </div>
  );
};

export default StudentRecord;
