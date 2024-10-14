"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export type EvaluationColumn = {
  id: string;
  title: string;
  ratingPeriod: string;
  semester: string;
  statuses: string;
};

export const columns: ColumnDef<EvaluationColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
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
    accessorKey: "statuses",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.statuses === "Starting" ? "default" : "destructive"}>{row.original.statuses}</Badge>
    )
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
