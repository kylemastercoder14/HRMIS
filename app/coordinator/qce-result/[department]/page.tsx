import db from "@/lib/db";
import React from "react";
import DepartmentSummary from "./department-summary";

const ViewDepartment = async ({
  params,
}: {
  params: { department: string };
}) => {
  const decodedDepartment = decodeURIComponent(params.department);
  const faculties = await db.faculty.findMany({
    where: {
      department: decodedDepartment,
    },
  });

  const evaluatee = faculties.map((faculty) => {
    return `${faculty.lname}, ${faculty.fname}`.trim();
  });

  const evaluations = await db.evaluation.findFirst({
    where: {
      id: "cm27chmlb0000pmz2yesf7090",
    },
    include: {
      Categories: {
        include: {
          questions: {
            include: {
              Answer: { where: { evaluatee: { in: evaluatee } } },
            },
          },
        },
      },
    },
  });

  const answers = await db.answer.findMany({
    where: {
      evaluatee: { in: evaluatee },
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
        if (evaluatee.includes(answer.evaluatee)) {
          const score = answer.rating;
          acc[category.id].totalScore += score;
          acc[category.id].totalRatings += 1;
        }
      });
    });

    // Calculate average for the category
    if (acc[category.id].totalRatings > 0) {
      acc[category.id].averageRating = parseFloat(
        (acc[category.id].totalScore / acc[category.id].totalRatings).toFixed(2)
      );
    }

    return acc;
  }, {} as Record<string, { title: string; totalScore: number; totalRatings: number; averageRating: number; questionCount: number }>);

  return (
    <DepartmentSummary faculty={faculties} />
  );
};

export default ViewDepartment;
