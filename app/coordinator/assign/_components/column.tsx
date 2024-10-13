
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
        {row.original.imageUrl ? (
          <Image
            src={row.original.imageUrl}
            alt="Image"
            width={40}
            height={40}
            className="object-cover rounded-md"
          />
        ) : (
          <Avatar className="w-10 h-10 object-cover rounded-md">
            <AvatarFallback className="rounded-md">
              {row.original.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col">
          <p className="font-semibold">{row.original.name}</p>
          <p className="text-muted-foreground text-sm">{row.original.email}</p>
        </div>
      </div>
    ),
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
    accessorKey: "yearLevel",
    header: "Year Level",
  },
  {
    accessorKey: "courses",
    header: "Course",
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
