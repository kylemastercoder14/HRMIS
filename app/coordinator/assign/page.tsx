import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import AssignClient from "./_components/client";
import { format } from "date-fns";
import { AssignColumn } from "./_components/column";
import { getAcronym } from "@/lib/utils";

const Assign = async () => {
  const faculty = await db.faculty.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedAssign: AssignColumn[] = faculty.map((item) => ({
    id: item.id,
    name: item.fname + " " + item.mname + " " + item.lname + " " + item.suffix,
    email: item.email,
    imageUrl: item.profile ?? "",
    course: item.course.map((course) => getAcronym(course)).join(', '),
    yearLevel: item.yearLevel.map((yearLevel) => yearLevel).join(', '),
    section: item.section.map((section) => section).join(', '),
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
    status: item.status ?? "N/A",
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Assign Rater to Ratee`}
          description="Select and assign a rater who will evaluate the performance of a specific ratee. This process allows raters to assess their assigned individuals based on predefined criteria."
        />
      </div>
      <AssignClient data={formattedAssign} />
    </div>
  );
};

export default Assign;
