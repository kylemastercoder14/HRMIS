
"use client";

import { ColumnDef } from "@tanstack/react-table";

export type EvaluationColumn = {
  faculty: string;
  semester: string;
  ratingPeriod: string;
  academicRank: string;
  evaluator: string;
  ratings: any;
  qce: any;
};

export const columns: ColumnDef<EvaluationColumn>[] = [
  {
    accessorKey: "faculty",
    header: "Faculty",
  },
  {
    accessorKey: "ratingPeriod",
    header: "Rating Period",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "academicRank",
    header: "Academic Rank",
  },
  {
    accessorKey: "ratings",
    header: "Total Rate",
  },
  {
    accessorKey: "qce",
    header: "QCE",
  },
  {
    accessorKey: "evaluator",
    header: "Evaluator",
  },
];
