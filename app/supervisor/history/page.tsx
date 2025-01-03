import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { EvaluationColumn } from "./_components/column";
import EvaluationClient from "./_components/client";
import { getSupervisorFromCookies } from "@/lib/hooks/use-supervisor";

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

const formatDatePeriod = (dateString: string | number | Date | undefined) => {
  if (!dateString) return "Invalid Date";
  const options = {
    year: "numeric" as const,
    month: "short" as const,
    day: "numeric" as const,
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
};

const History = async () => {
  const { userId } = await getSupervisorFromCookies();

  // Fetch all evaluations and answers
  const evaluations = await db.evaluation.findMany({
    orderBy: { createdAt: "desc" },
    include: { Categories: { include: { questions: true } } },
  });

  const ratings = await db.answer.findMany({
    where: {
      evaluator: "Supervisor",
    },
  });

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
    const qce = (averageRating * 0.3).toFixed(2); // 30% of average rating

    const overallRecommendation = getRecommendationMessage(Number(qce));
    const { title: overallTitle, description: overallDescription } =
      overallRecommendation;

    const formattedStartDate = formatDatePeriod(
      evaluations[0]?.startDateTime?.toISOString()
    );
    const formattedEndDate = formatDatePeriod(
      evaluations[0]?.endDateTime?.toISOString()
    );
    const ratingPeriod = `${formattedStartDate} - ${formattedEndDate}`;

    return {
      ratingPeriod,
      semester: evaluations[0]?.semester,
      faculty: facultyName,
      academicRank: academicRank, // Example rank, adjust based on your data
      evaluator: "Supervisor",
      ratings: averageRating.toFixed(2) + "%",
      qce: qce + "%",
      recommendation: overallDescription,
      title: overallTitle,
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
