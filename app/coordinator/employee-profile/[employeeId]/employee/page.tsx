import db from "@/lib/db";
import React from "react";
import EmployeeForm from "./employee-form";

const SpecificEmployee = async ({
  params,
}: {
  params: { employeeId: string };
}) => {
  const faculty = await db.faculty.findUnique({
    where: {
      id: params.employeeId,
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <EmployeeForm initialData={faculty} />
    </div>
  );
};

export default SpecificEmployee;
