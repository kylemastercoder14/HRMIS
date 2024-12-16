"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type EvaluationColumn = {
  faculty: string;
  ratingPeriod: string;
  academicRank: string;
  semester: string;
  facultyId: string;
  schoolYear: string;
  qce: any;
  status: string;
  department: string;
};

export const columns: ColumnDef<EvaluationColumn>[] = [
  {
    accessorKey: "faculty",
    header: "Faculty",
    cell: ({ row }) => (
      <Link className="hover:underline" href={`/coordinator/employee-profile/${row.original.facultyId}`}>
        {row.original.faculty}
      </Link>
    ),
  },
  {
    accessorKey: "ratingPeriod",
    header: "Rating Period",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "semester",
    header: "Semester",
  },
  {
    accessorKey: "schoolYear",
    header: "School Year",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "qce",
    header: "QCE",
  },
  // {
  //   accessorKey: "action",
  //   header: "Action",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];
