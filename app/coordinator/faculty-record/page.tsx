import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { format } from "date-fns";
import { FacultyColumn } from "./_components/column";
import FacultyRecordClient from "./_components/client";
import { getAcronym } from "@/lib/utils";

const FacultyRecord = async () => {
  const faculties = await db.faculty.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedAssign: FacultyColumn[] = faculties.map((item) => ({
    id: item.id,
    name: item.fname + " " + item.mname + " " + item.lname + " " + item.suffix,
    email: item.email,
    imageUrl: item.profile ?? "",
    course: item.course.map((course) => getAcronym(course)).join(', '),
    yearLevel: item.yearLevel.map((yearLevel) => yearLevel).join(', '),
    section: item.section.map((section) => section).join(', '),
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Faculty Record`}
          description="View and manage faculty information, including academic details, personal data, and evaluation report."
        />
      </div>
      <FacultyRecordClient data={formattedAssign} />
    </div>
  );
};

export default FacultyRecord;
