"use client";

import { ColumnDef } from "@tanstack/react-table";
import RecommendationModal from "./recommendation-modal";
import Link from "next/link";

export type EvaluationColumn = {
  faculty: string;
  semester: string;
  schoolYear: string;
  facultyId: string;
  studentRateResult: any;
  peerRateResult: string;
  selfRateResult: string;
  supervisorRateResult: string;
  recommendation: string;
};

export type DepartmentColumn = {
  department: string;
  faculty: number;
};

export const columns: ColumnDef<EvaluationColumn>[] = [
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "schoolYear",
    header: "School Year",
  },
  {
    accessorKey: "faculty",
    header: "Faculty Name",
  },
  {
    accessorKey: "studentRateResult",
    header: "Student Rate Result",
  },
  {
    accessorKey: "peerRateResult",
    header: "Peer Rate Result",
  },
  {
    accessorKey: "selfRateResult",
    header: "Self Rate Result",
  },
  {
    accessorKey: "supervisorRateResult",
    header: "Supervisor Rate Result",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => <RecommendationModal data={row.original} />,
  },
];

export const columns1: ColumnDef<DepartmentColumn>[] = [
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <Link
        className="hover:underline"
        href={`/coordinator/qce-result/${row.original.department}`}
      >
        {row.original.department}
      </Link>
    ),
  },
  {
    accessorKey: "faculty",
    header: "Number of Faculty",
  },
];
