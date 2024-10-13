import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { EvaluationColumn } from "./_components/column";
import EvaluationClient from "./_components/client";
import { auth } from "@clerk/nextjs/server";
import { formatDate } from "@/lib/utils";
import { record } from "zod";

// Function to generate a recommendation message based on QCE rating
const getRecommendationMessage = (qceRating: number) => {
  let title = "";
  let description = "";
  if (qceRating >= 4.5) {
    title = "OUTSTANDING FACULTY";
    description =
      "The teacher demonstrates a strong commitment to student success and academic excellence.";
  } else if (qceRating >= 3.5) {
    title = "VERY SATISFACTORY FACULTY";
    description =
      "The teacher is performing well, but there's still room for small improvements.";
  } else if (qceRating >= 2.5) {
    title = "SATISFACTORY FACULTY";
    description =
      "The teacher meets the minimum expectations but can enhance their effectiveness.";
  } else if (qceRating >= 1.5) {
    title = "FAIR FACULTY";
    description = "The teacher needs improvement to meet job requirements.";
  } else {
    title = "POOR FACULTY";
    description =
      "The teacher is failing to meet job requirements and requires immediate intervention.";
  }
  return { title, description };
};

const History = async () => {
  const { userId } = auth();
  const user = await db.faculty.findUnique({
    where: {
      clerkId: userId as string,
    },
  });

  const evaluations = await db.evaluation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      Categories: { include: { questions: true } },
    },
  });

  const evaluatee = `${user?.lname}, ${user?.fname} ${user?.mname}`.trim();

  const ratings = await db.answer.findMany({
    where: {
      evaluatee: evaluatee,
    },
  });

  // Group ratings by evaluator type
  const ratingsByType: { [key: string]: number[] } = {
    student: [],
    peer: [],
    self: [],
    supervisor: [],
  };

  ratings.forEach((rating) => {
    const evaluatorType = rating.evaluator.toLowerCase(); // Assuming evaluator contains the type
    if (ratingsByType[evaluatorType]) {
      ratingsByType[evaluatorType].push(rating.rating);
    }
  });

  // Define weights for each evaluator type
  const weights: { [key: string]: number } = {
    student: 0.3, // 30%
    supervisor: 0.3, // 30%
    peer: 0.2, // 20%
    self: 0.2, // 20%
  };

  // Calculate average ratings for each evaluator type and total QCE
  const averageRatings: {
    [key: string]: { averageRating: number; qce: string };
  } = Object.entries(ratingsByType).reduce<{
    [key: string]: { averageRating: number; qce: string };
  }>(
    (acc, [type, ratings]) => {
      const totalRatings = ratings.length;
      const sumRatings = ratings.reduce((sum, rating) => sum + rating, 0);

      // Correctly calculate the average rating on a scale of 100
      const averageRating =
        totalRatings > 0 ? ((sumRatings / totalRatings) * 100) / 5 : 0; // Convert to percentage
      const qce = (averageRating * weights[type]).toFixed(2); // 30% of average rating
      acc[type] = { averageRating, qce };
      return acc;
    },
    {} // Initial value of the accumulator
  );

  // Calculate overall QCE
  const totalQce = Object.entries(averageRatings).reduce(
    (sum, [type, { qce }]) => {
      return sum + Number(qce);
    },
    0
  );
  const totalCount = Object.values(averageRatings).length;
  const overallQce = totalCount > 0 ? totalQce.toFixed(2) : "0.00"; // Sum of QCEs
  const overallRecommendation = getRecommendationMessage(Number(overallQce));

  const { title: overallTitle, description: overallDescription } =
    overallRecommendation;

  // Calculate overall average rating
  const totalRating = ratings.reduce((sum, { rating }) => sum + rating, 0);
  const averageScore = (totalRating / (ratings.length * 5)) * 100;

  const formattedStartDate = formatDate(
    evaluations[0]?.startDateTime?.toISOString()
  );
  const formattedEndDate = formatDate(
    evaluations[0]?.endDateTime?.toISOString()
  );

  const ratingPeriod = `${formattedStartDate} - ${formattedEndDate}`;

  const formattedEvaluation: EvaluationColumn = {
    id: evaluatee,
    ratingPeriod: ratingPeriod, // Add logic for the rating period if needed
    faculty: evaluatee,
    studentRating: averageRatings.student.averageRating.toFixed(2) + "%",
    studentQce: averageRatings.student.qce || "N/A",
    peerRating: averageRatings.peer.averageRating
      ? averageRatings.peer.averageRating.toFixed(2) + "%"
      : "N/A",
    peerQce: averageRatings.peer.qce || "N/A",
    selfRating: averageRatings.self.averageRating
      ? averageRatings.self.averageRating.toFixed(2) + "%"
      : "N/A",
    selfQce: averageRatings.self.qce || "N/A",
    supervisorRating: averageRatings.supervisor.averageRating
      ? averageRatings.supervisor.averageRating.toFixed(2) + "%"
      : "N/A",
    supervisorQce: averageRatings.supervisor.qce || "N/A",
    recommendation: overallDescription,
    title: overallTitle,
    overAllQce: averageScore + "%",
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Evaluation History`}
          description="A detailed record of all evaluations completed by the student, including dates, scores, and feedback from faculty members."
        />
      </div>
      <EvaluationClient data={[formattedEvaluation]} />
    </div>
  );
};

export default History;
