import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import FacultyRecordSpecificClient from "./client";

const FacultyRecordSpecific = async () => {
  const faculties = await db.faculty.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch evaluations for each evaluator type
  const evaluations = {
    students: await db.evaluation.findFirst({
      where: {
        evaluatee:
          faculties?.lname + ", " + faculties?.fname + " " + faculties?.mname,
        evaluator: "Student",
      },
    }),
    peers: await db.evaluation.findFirst({
      where: {
        evaluatee:
          faculties?.lname + ", " + faculties?.fname + " " + faculties?.mname,
        evaluator: "Faculty",
      },
    }),
    self: await db.evaluation.findFirst({
      where: {
        evaluatee:
          faculties?.lname + ", " + faculties?.fname + " " + faculties?.mname,
        evaluator: "Self",
      },
    }),
    supervisor: await db.evaluation.findFirst({
      where: {
        evaluatee:
          faculties?.lname + ", " + faculties?.fname + " " + faculties?.mname,
        evaluator: "Supervisor",
      },
    }),
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading title="Human Resource Development" description="" />
      </div>
      <FacultyRecordSpecificClient data={faculties} evaluations={evaluations} />
    </div>
  );
};

export default FacultyRecordSpecific;
