import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { EvaluationColumn } from "./_components/column";
import EvaluationClient from "./_components/client";
import { Evaluation } from "@prisma/client";

const categoryWeights = {
  commitment: 0.2, // 20%
  knowledge: 0.2, // 20%
  teaching: 0.3, // 30%
  management: 0.3, // 30%
};

// Helper function to calculate the average rating
const calculateAverageRating = (evaluation: Evaluation) => {
  const commitmentScores = [
    parseInt(evaluation.demonstrate),
    parseInt(evaluation.integrate),
    parseInt(evaluation.available),
    parseInt(evaluation.regularly),
    parseInt(evaluation.accurate),
  ];

  const knowledgeScores = [
    parseInt(evaluation.mastery),
    parseInt(evaluation.draws),
    parseInt(evaluation.practical),
    parseInt(evaluation.relevance),
    parseInt(evaluation.awareness),
  ];

  const teachingScores = [
    parseInt(evaluation.teaching),
    parseInt(evaluation.enhance),
    parseInt(evaluation.objectives),
    parseInt(evaluation.independent),
    parseInt(evaluation.encourage),
  ];

  const managementScores = [
    parseInt(evaluation.opportunity),
    parseInt(evaluation.roles),
    parseInt(evaluation.experience),
    parseInt(evaluation.structures),
    parseInt(evaluation.instructional),
  ];

  const commitmentAverage =
    commitmentScores.reduce((a: number, b: number) => a + b, 0) /
    commitmentScores.length;
  const knowledgeAverage =
    knowledgeScores.reduce((a: number, b: number) => a + b, 0) /
    knowledgeScores.length;
  const teachingAverage =
    teachingScores.reduce((a: number, b: number) => a + b, 0) /
    teachingScores.length;
  const managementAverage =
    managementScores.reduce((a: number, b: number) => a + b, 0) /
    managementScores.length;

  const totalWeightedRating =
    commitmentAverage * categoryWeights.commitment +
    knowledgeAverage * categoryWeights.knowledge +
    teachingAverage * categoryWeights.teaching +
    managementAverage * categoryWeights.management;

  return totalWeightedRating;
};

// Function to compute the QCE rating as 100%
const computeQCERating = (averageRating: number): string => {
  const percentageRating = (averageRating / 5) * 100; // Scale the 1-5 average to a 100% scale
  return percentageRating.toFixed(2);
};

// Function to generate a recommendation message based on QCE rating
const getRecommendationMessage = (qceRating: number) => {
  let title = "";
  let description = "";

  if (qceRating === 5) {
    title = "Outstanding";
    description =
      "The teacher demonstrates a strong commitment to student success and academic excellence.";
  } else if (qceRating === 4) {
    title = "Very Satisfactory";
    description =
      "The teacher shows effective teaching skills and dedication, but there's room for improvement.";
  } else if (qceRating === 3) {
    title = "Satisfactory";
    description =
      "The teacher's performance is below expectations, requiring significant effort for better results.";
  } else if (qceRating === 2) {
    title = "Fair";
    description =
      "The teacher's performance is unsatisfactory and needs substantial improvement.";
  } else {
    title = "Poor";
    description =
      "The teacher's performance is unacceptable and requires immediate intervention.";
  }

  return { title, description }; // Return an object containing both title and description
};

const History = async () => {
  const evaluations = await db.evaluation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Group evaluations by faculty
  const groupedEvaluations = evaluations.reduce(
    (acc: { [key: string]: any }, curr: Evaluation) => {
      if (!acc[curr.evaluatee]) {
        acc[curr.evaluatee] = {
          totalRating: 0,
          count: 0,
          ratings: {
            student: [],
            peer: [],
            self: [],
            supervisor: [],
          },
          ratingPeriod: curr.ratingPeriod,
          schoolYear: curr.schoolYear,
        };
      }

      // Calculate average rating based on the evaluator type
      const averageRating = calculateAverageRating(curr);
      acc[curr.evaluatee].totalRating += averageRating;
      acc[curr.evaluatee].count += 1;

      // Push the rating into the appropriate evaluator type
      if (curr.evaluator === "Peer") {
        acc[curr.evaluatee].ratings.peer.push(averageRating);
      } else if (curr.evaluator === "Self") {
        acc[curr.evaluatee].ratings.self.push(averageRating);
      } else if (curr.evaluator === "Supervisor") {
        acc[curr.evaluatee].ratings.supervisor.push(averageRating);
      } else {
        acc[curr.evaluatee].ratings.student.push(averageRating);
      }

      return acc;
    },
    {}
  );

  // Format the evaluation data for each faculty
  const formattedEvaluation: EvaluationColumn[] = Object.keys(
    groupedEvaluations
  ).map((faculty) => {
    const { totalRating, count, ratings, ratingPeriod, schoolYear } =
      groupedEvaluations[faculty];

    // Calculate the average ratings for each evaluator
    const studentAverage = ratings.student.length
      ? ratings.student.reduce((a: number, b: number) => a + b, 0) /
        ratings.student.length
      : 0;

    const peerAverage = ratings.peer.length
      ? ratings.peer.reduce((a: number, b: number) => a + b, 0) /
        ratings.peer.length
      : 0;

    const selfAverage = ratings.self.length
      ? ratings.self.reduce((a: number, b: number) => a + b, 0) /
        ratings.self.length
      : 0;

    const supervisorAverage = ratings.supervisor.length
      ? ratings.supervisor.reduce((a: number, b: number) => a + b, 0) /
        ratings.supervisor.length
      : 0;

    // Compute the QCE ratings based on the averages
    const studentQce = parseFloat(computeQCERating(studentAverage));
    const peerQce = parseFloat(computeQCERating(peerAverage));
    const selfQce = parseFloat(computeQCERating(selfAverage));
    const supervisorQce = parseFloat(computeQCERating(supervisorAverage));
    // Get overall recommendation based on the overall average QCE rating

    const overallAverageQce = (studentQce + peerQce + selfQce + supervisorQce) / 4;
    const { title: overallTitle, description: overallDescription } = getRecommendationMessage(totalRating);

    return {
      id: faculty,
      ratingPeriod: ratingPeriod,
      schoolYear: schoolYear,
      faculty: faculty,
      studentRating: studentAverage.toFixed(2),
      studentQce: studentQce.toFixed(2),
      peerRating: peerAverage.toFixed(2),
      peerQce: peerQce.toFixed(2),
      selfRating: selfAverage.toFixed(2),
      selfQce: selfQce.toFixed(2),
      supervisorRating: supervisorAverage.toFixed(2),
      supervisorQce: supervisorQce.toFixed(2),
      recommendation: overallDescription,
      title: overallTitle,
      overAllQce: overallAverageQce.toFixed(2),
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
