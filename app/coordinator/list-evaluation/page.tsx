import React from "react";
import db from "@/lib/db";
import Heading from "@/components/heading";
import { EvaluationColumn } from "./_components/column";
import { formatDate } from "@/lib/utils";
import EvaluationListClient from "./_components/client";

const ListEvaluation = async () => {
  // Fetching evaluations with supervisors
  const evaluations = await db.evaluation.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedStartDate = formatDate(
    evaluations[0]?.startDateTime?.toISOString()
  );
  const formattedEndDate = formatDate(
    evaluations[0]?.endDateTime?.toISOString()
  );
  const ratingPeriod = `${formattedStartDate} - ${formattedEndDate}`;

  const formattedEvaluation: EvaluationColumn[] = evaluations.map((item) => {
    return {
      id: item.id,
      title: item.title,
      semester: item.semester,
      statuses: item.status,
      schoolYear: item.schoolYear || "N/A",
      ratingPeriod: ratingPeriod,
    };
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title={`Evaluation Record`}
          description="Welcome to the Invitation Record page, where you can manage and track invitations sent to faculty members for training programs."
        />
      </div>
      <EvaluationListClient data={formattedEvaluation} />
    </div>
  );
};

export default ListEvaluation;
