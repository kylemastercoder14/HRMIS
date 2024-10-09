import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { MyEvaluationColumn } from "./_components/column";
import { format } from "date-fns";
import MyEvaluationClient from "./_components/client";
import { auth } from "@clerk/nextjs/server";

const EvaluationHistory = async () => {
  const { userId } = auth();
  const evaluations = await db.evaluation.findMany({
    where: {
      evaluatorId: userId as string,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedEvaluation: MyEvaluationColumn[] = evaluations.map((item) => ({
    id: item.id,
    name: item.evaluatee,
    academicRank: item.academicRank,
    ratingPeriod: item.ratingPeriod,
    createdAt: format(item.createdAt, "MMMM dd, yyyy"),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`My Evaluation History`}
          description="A summary of all your previous evaluations, including the dates, evaluators, and overall performance ratings. Review your past feedback and track your progress over time."
        />
      </div>
      <MyEvaluationClient data={formattedEvaluation} />
    </div>
  );
};

export default EvaluationHistory;
