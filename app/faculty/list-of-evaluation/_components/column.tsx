
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";

export type ListEvaluationColumn = {
  id: string;
  evaluatee: string;
  semester: string;
  academicRank: string;
};

export const columns: ColumnDef<ListEvaluationColumn>[] = [
  {
    accessorKey: "evaluatee",
    header: "Faculty",
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
