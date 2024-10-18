
"use client";

import { ColumnDef } from "@tanstack/react-table";

export type EvaluationColumn = {
  faculty: string;
  ratingPeriod: string;
  academicRank: string;
  semester: string;
  qce: any;
  status: string;
  department: string;
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
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "qce",
    header: "QCE",
  },
];
