
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type MyEvaluationColumn = {
  id: string;
  name: string;
  ratingPeriod: string;
  academicRank: string;
  createdAt: string;
};

export const columns: ColumnDef<MyEvaluationColumn>[] = [
  {
    accessorKey: "name",
    header: "Evaluatee",
  },
  {
    accessorKey: "academicRank",
    header: "Academic Rank",
  },
  {
    accessorKey: "ratingPeriod",
    header: "Rating Period",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
