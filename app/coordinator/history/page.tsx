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
  return average; // Return the raw average
};

// Function to compute the QCE rating
const computeQCERating = (averageRating: number) => {
  return (averageRating * 0.3).toFixed(2); // Apply 30% weight
};

const History = async () => {
  const evaluations = await db.evaluation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  let counter = 1;

  // Format the evaluation data
  const formattedEvaluation: EvaluationColumn[] = evaluations.map((item) => {
    const averageRating = calculateAverageRating(item); // Compute the average rating
    const qceRating = computeQCERating(averageRating); // Compute the QCE rating

    return {
      id: item.id,
      no: counter++,
      faculty: item.evaluatee,
      ratings: averageRating,
      qce: qceRating,
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
