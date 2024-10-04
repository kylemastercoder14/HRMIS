import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { EvaluationColumn } from "./_components/column";
import EvaluationClient from "./_components/client";

// Helper function to calculate the average rating
const calculateAverageRating = (evaluation: any) => {
  const ratingFields = [
    evaluation.demonstrate,
    evaluation.integrate,
    evaluation.available,
    evaluation.regularly,
    evaluation.accurate,
    evaluation.mastery,
    evaluation.draws,
    evaluation.practical,
    evaluation.relevance,
    evaluation.awareness,
    evaluation.teaching,
    evaluation.enhance,
    evaluation.objectives,
    evaluation.independent,
    evaluation.encourage,
    evaluation.opportunity,
    evaluation.roles,
    evaluation.experience,
    evaluation.structures,
    evaluation.instructional,
  ];

  const total = ratingFields.reduce((sum, rating) => sum + parseInt(rating), 0);
  const average = total / ratingFields.length;
  return average;
};

// Function to compute the QCE rating as 100%
const computeQCERating = (averageRating: number) => {
  const percentageRating = (averageRating / 5) * 100; // Scale the 1-5 average to a 100% scale
  return percentageRating.toFixed(2);
};

const History = async () => {
  const evaluations = await db.evaluation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Group evaluations by faculty
  const groupedEvaluations: Record<string, any[]> = evaluations.reduce(
    (acc, curr) => {
      if (!acc[curr.evaluatee]) {
        acc[curr.evaluatee] = [];
      }
      acc[curr.evaluatee].push(curr);
      return acc;
    },
    {} as Record<string, any[]>
  );

  let counter = 1;

  // Format the evaluation data for each faculty
  const formattedEvaluation: EvaluationColumn[] = Object.keys(
    groupedEvaluations
  ).map((faculty) => {
    const facultyEvaluations = groupedEvaluations[faculty];

    // Calculate the total average rating for all evaluations of this faculty
    const totalAverageRating =
      facultyEvaluations.reduce((sum, evaluation) => {
        return sum + calculateAverageRating(evaluation);
      }, 0) / facultyEvaluations.length;

    // Compute the QCE rating based on the total average rating
    const qceRating = parseFloat(computeQCERating(totalAverageRating));

    return {
      id: facultyEvaluations[0].id, // Using the first evaluation id, as the group represents the same faculty
      no: counter++,
      faculty: faculty,
      ratings: totalAverageRating.toFixed(2), // Format the total average rating to 2 decimal places
      qce: qceRating.toFixed(2), // Format the QCE rating to 2 decimal places
    };
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Evaluation History`}
          description="A detailed record of all evaluations completed by the student, including dates, scores, and feedback from faculty members."
        />
      </div>
      <EvaluationClient data={formattedEvaluation} />
    </div>
  );
};

export default History;
