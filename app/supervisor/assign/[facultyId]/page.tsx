import React from "react";
import db from "@/lib/db";
import AssignForm from "../_components/assign-form";

const AssignFacultyPage = async ({ params }: { params: { facultyId: string } }) => {
  const faculty = await db.faculty.findUnique({
    where: {
      id: params.facultyId,
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <AssignForm initialData={faculty} />
    </div>
  );
};

export default AssignFacultyPage;
