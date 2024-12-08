"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";

export type AssignColumn = {
  id: string;
  name: string;
  status: string;
  imageUrl: string;
  email: string;
  courses: string;
  department: string;
  yearLevel: string;
  section: string;
  createdAt: string;
};

export const columns: ColumnDef<AssignColumn>[] = [
  {
    accessorKey: "name",
    header: "Faculty",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <Avatar>
          <AvatarImage src={row.original.imageUrl} alt="Image" />
          <AvatarFallback className="rounded-md">
            {row.original.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{row.original.name}</p>
          <p className="text-muted-foreground text-sm">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "courses",
    header: "Course",
  },
  {
    accessorKey: "yearLevel",
    header: "Year Level",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
