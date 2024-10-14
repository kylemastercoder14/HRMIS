/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useState } from "react";
import RecommendationModal from "./recommendation-modal";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export type EvaluationColumn = {
  id: string;
  faculty: string;
  ratingPeriod: string;
  semester: string;
  studentRating: any;
  studentQce: any;
  peerRating: any;
  peerQce: any;
  selfRating: any;
  selfQce: any;
  supervisorRating: any;
  supervisorQce: any;
  recommendation: string;
  title: string;
  overAllQce: any;
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
    accessorKey: "studentRating",
    header: "Student Ratings",
  },
  {
    accessorKey: "studentQce",
    header: "Student QCE",
  },
  {
    accessorKey: "peerRating",
    header: "Peer Ratings",
  },
  {
    accessorKey: "peerQce",
    header: "Peer QCE",
  },
  {
    accessorKey: "selfRating",
    header: "Self Ratings",
  },
  {
    accessorKey: "selfQce",
    header: "Self QCE",
  },
  {
    accessorKey: "supervisorRating",
    header: "Supervisor Ratings",
  },
  {
    accessorKey: "supervisorQce",
    header: "Supervisor QCE",
  },
  {
    accessorKey: "recommendation",
    header: "Recommendation",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)} size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <RecommendationModal
          content={row.original.overAllQce}
            description={row.original.recommendation}
            title={row.original.title}
            isOpen={open}
            onClose={() => setOpen(false)}
          />
        </>
      );
    },
  },
];
