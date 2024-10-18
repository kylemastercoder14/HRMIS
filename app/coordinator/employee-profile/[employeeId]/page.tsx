import db from "@/lib/db";
import React from "react";
import SummaryReport from "./summary-report";
import { Answer, Category } from "@prisma/client";

const ViewSummary = async ({ params }: { params: { employeeId: string } }) => {
  const faculty = await db.faculty.findUnique({
    where: {
      id: params.employeeId,
    },
  });

  const evaluatee = faculty
    ? `${faculty.lname}, ${faculty.fname}`.trim()
    : "Unknown Evaluatee";

  const evaluations = await db.evaluation.findFirst({
    where: {
      id: "cm27chmlb0000pmz2yesf7090",
    },
    include: {
      Categories: {
        include: {
          questions: {
            include: {
              Answer: { where: { evaluatee: evaluatee } },
            },
          },
        },
      },
    },
  });

  const ratingsSummary = evaluations?.Categories.reduce((acc, category) => {
    // Initialize category summary
    acc[category.id] = {
      title: category.title,
      totalScore: 0,
      totalRatings: 0,
      averageRating: 0,
      questionCount: category.questions.length,
    };

    // Process each question in the category
    category.questions.forEach((question) => {
      question.Answer.forEach((answer) => {
        if (answer.evaluatee === evaluatee) {
          const score = answer.rating; // assuming answer has a rating field
          acc[category.id].totalScore += score;
          acc[category.id].totalRatings += 1;
        }
      });
    });

    // Calculate average for the category
    if (acc[category.id].totalRatings > 0) {
      acc[category.id].averageRating =
        parseFloat((acc[category.id].totalScore / acc[category.id].totalRatings).toFixed(2));
    }

    return acc;
  }, {} as Record<string, { title: string; totalScore: number; totalRatings: number; averageRating: number; questionCount: number }>);

  console.log(ratingsSummary);

  return <SummaryReport faculty={faculty} />;
};

export default ViewSummary;
