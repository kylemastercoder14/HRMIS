
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export type EvaluationColumn = {
  id: string;
  faculty: string;
  no: any;
  ratings: any;
  qce: any;
  recommendation: any;
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
  {
    accessorKey: "recommendation",
    header: "Recommendation/Feedback",
  },
];
