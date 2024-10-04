
"use client";

import { ColumnDef } from "@tanstack/react-table";

export type EvaluationColumn = {
  id: string;
  faculty: string;
  no: any;
  ratings: any;
  qce: any;
};

export const columns: ColumnDef<EvaluationColumn>[] = [
  {
    accessorKey: "no",
    header: "No.",
  },
  {
    accessorKey: "faculty",
    header: "Faculty",
  },
  {
    accessorKey: "ratings",
    header: "Total Student Ratings",
  },
  {
    accessorKey: "qce",
    header: "QCE Ratings (30%)",
  },
];
