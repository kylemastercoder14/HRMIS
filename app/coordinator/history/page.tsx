import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { EvaluationColumn } from "./_components/column";
import EvaluationClient from "./_components/client";
import { formatDate } from "@/lib/utils";

const History = async () => {
  // Fetch all evaluations and answers
  const evaluations = await db.evaluation.findMany({
    orderBy: { createdAt: "desc" },
    include: { Categories: { include: { questions: true } } },
  });

  const ratings = await db.answer.findMany();
  const faculties = await db.faculty.findMany();

  // Group ratings by evaluatee (faculty)
  const ratingsByEvaluatee: {
    [evaluatee: string]: { ratings: number[]; academicRank: string };
  } = {};

  ratings.forEach((rating) => {
    const evaluateeName = rating.evaluatee; // Assuming evaluatee has a name field
    const academicRank = rating.academicRank; // Assuming this field exists

    if (!ratingsByEvaluatee[evaluateeName]) {
      ratingsByEvaluatee[evaluateeName] = { ratings: [], academicRank };
    }
    ratingsByEvaluatee[evaluateeName].ratings.push(rating.rating);
  });

  // Generate evaluation data for each faculty (evaluatee)
  const evaluationsData: EvaluationColumn[] = Object.entries(
    ratingsByEvaluatee
  ).map(([facultyName, { ratings, academicRank }]) => {
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum, rating) => sum + rating, 0);

    // Calculate average rating and QCE
    const averageRating =
      totalRatings > 0 ? ((sumRatings / totalRatings) * 100) / 5 : 0;
    const qce = (averageRating).toFixed(2); // 30% of average rating

    const formattedStartDate = formatDate(
      evaluations[0]?.startDateTime?.toISOString()
    );
    const formattedEndDate = formatDate(
      evaluations[0]?.endDateTime?.toISOString()
    );
    const ratingPeriod = `${formattedStartDate} - ${formattedEndDate}`;

    const facultyData = faculties.find(
      (faculty) =>
        `${faculty.lname}, ${faculty.fname} ${faculty.mname || ""}`.trim() ===
        facultyName
    );
    const status = facultyData?.status ?? "Unknown";
    const department = facultyData?.department ?? "Unknown";

    return {
      ratingPeriod,
      faculty: facultyName,
      semester: evaluations[0]?.semester,
      academicRank: academicRank, // Example rank, adjust based on your data
      qce: qce + "%",
      status: status,
      department: department,
    };
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Evaluation History`}
          description="A detailed record of all evaluations completed, including total ratings and QCE rates per faculty."
        />
      </div>
      <EvaluationClient data={evaluationsData} />{" "}
      {/* Pass the evaluation data */}
    </div>
  );
};

export default History;
