import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { DepartmentColumn, EvaluationColumn } from "./_components/column";
import EvaluationClient from "./_components/client";

const QceResult = async () => {
  // Fetch all evaluations and answers
  const evaluations = await db.evaluation.findMany({
    orderBy: { createdAt: "desc" },
    include: { Categories: { include: { questions: true } } },
  });

  const ratings = await db.answer.findMany();
  const faculties = await db.faculty.findMany();
  const groupedFacultiesByDepartment = await db.faculty.groupBy({
    by: ["department"],
    orderBy: { department: "asc" },
  });

  // Format for the client:
  const departments = groupedFacultiesByDepartment
    .map((dept) => dept.department)
    .filter((department): department is string => department !== null);

  const formattedDepartment: DepartmentColumn[] = departments.map((department) => {
    return {
      department: department,
      faculty: department.length
    };
  });

  // Group ratings by evaluatee (faculty)
  const ratingsByEvaluatee: {
    [evaluatee: string]: {
      studentRatings: number[];
      peerRatings: number[];
      selfRatings: number[];
      supervisorRatings: number[];
      academicRank: string;
    };
  } = {};

  ratings.forEach((rating) => {
    const evaluateeName = rating.evaluatee; // Assuming evaluatee has a name field
    const academicRank = rating.academicRank; // Assuming this field exists
    const evaluatorType = rating.evaluator; // Assuming this field exists (e.g., 'student', 'peer')

    if (!ratingsByEvaluatee[evaluateeName]) {
      ratingsByEvaluatee[evaluateeName] = {
        studentRatings: [],
        peerRatings: [],
        selfRatings: [],
        supervisorRatings: [],
        academicRank,
      };
    }

    // Add rating to the appropriate evaluator type
    if (evaluatorType === "Student") {
      ratingsByEvaluatee[evaluateeName].studentRatings.push(rating.rating);
    } else if (evaluatorType === "Peer") {
      ratingsByEvaluatee[evaluateeName].peerRatings.push(rating.rating);
    } else if (evaluatorType === "Self") {
      ratingsByEvaluatee[evaluateeName].selfRatings.push(rating.rating);
    } else if (evaluatorType === "Supervisor") {
      ratingsByEvaluatee[evaluateeName].supervisorRatings.push(rating.rating);
    }
  });

  // Generate evaluation data for each faculty (evaluatee)
  const evaluationsData: EvaluationColumn[] = Object.entries(
    ratingsByEvaluatee
  ).map(
    ([
      facultyName,
      {
        studentRatings,
        peerRatings,
        selfRatings,
        supervisorRatings,
        academicRank,
      },
    ]) => {
      const calculateAverage = (ratings: number[]) =>
        ratings.length > 0
          ? ((ratings.reduce((sum, rating) => sum + rating, 0) /
              ratings.length) *
              100) /
            5
          : 0;

      // Find the faculty record to get the facultyId
      const facultyRecord = faculties.find(
        (faculty) =>
          `${faculty.lname}, ${faculty.fname} ${faculty.mname || ""}`.trim() ===
          facultyName
      );

      return {
        schoolYear: evaluations[0]?.schoolYear ?? "",
        faculty: facultyName,
        semester: evaluations[0]?.semester,
        studentRateResult: calculateAverage(studentRatings).toFixed(2),
        peerRateResult: calculateAverage(peerRatings).toFixed(2),
        selfRateResult: calculateAverage(selfRatings).toFixed(2),
        supervisorRateResult: calculateAverage(supervisorRatings).toFixed(2),
        facultyId: facultyRecord?.id ?? "",
        recommendation: ratings[0].comments ?? "",
      };
    }
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`QCE Result`}
          description="A detailed record of all evaluations completed, including total ratings and QCE rates per faculty."
        />
      </div>
      <EvaluationClient
        department={formattedDepartment}
        data={evaluationsData}
      />
    </div>
  );
};

export default QceResult;
