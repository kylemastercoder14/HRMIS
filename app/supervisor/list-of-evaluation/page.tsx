import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { auth } from "@clerk/nextjs/server";
import ListEvaluationClient from "./_components/client";
import { ListEvaluationColumn } from "./_components/column";

// Define the interface for grouped evaluations
interface GroupedEvaluations {
  evaluatee: string;
  evaluations: {
    id: string;
    semester: string;
    academicRank: string;
    rating: number;
    comments: string | null; // Comments can be null
  }[];
}

const ListEvaluation = async () => {
  const { userId } = auth();
  const facultyId = userId;

  // Fetching evaluations for the evaluator
  const evaluations = await db.answer.findMany({
    where: {
      evaluatorId: facultyId as string,
      evaluator: "Supervisor"
    },
  });

  // Grouping evaluations by evaluatee
  const groupedEvaluations: { [key: string]: GroupedEvaluations } =
    evaluations.reduce((acc: { [key: string]: GroupedEvaluations }, item) => {
      // Check if the evaluatee group already exists
      if (!acc[item.evaluatee]) {
        acc[item.evaluatee] = {
          evaluatee: item.evaluatee,
          evaluations: [],
        };
      }
      // Push the evaluation into the respective evaluatee group
      acc[item.evaluatee].evaluations.push({
        id: item.id,
        semester: item.semester,
        academicRank: item.academicRank,
        rating: item.rating,
        comments: item.comments,
      });
      return acc;
    }, {});

  // Format the grouped evaluations for the ListEvaluationClient
  const formattedEvaluations: ListEvaluationColumn[] = Object.values(
    groupedEvaluations
  ).map((group) => {
    return {
      id: group.evaluations[0].id,
      semester: group.evaluations[0].semester,
      academicRank: group.evaluations[0].academicRank,
      evaluatee: group.evaluatee,
      evaluations: group.evaluations,
    };
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Evaluation Record`}
          description="Welcome to the Evaluation Record page, where you can access a comprehensive overview of your evaluations as a faculty member. This platform enables you to view, manage, and track evaluations provided to your peers, ensuring transparency and fostering a culture of continuous improvement."
        />
      </div>
      <ListEvaluationClient data={formattedEvaluations} />
    </div>
  );
};

export default ListEvaluation;
