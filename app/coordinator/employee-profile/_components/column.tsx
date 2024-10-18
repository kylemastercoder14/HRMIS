
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";

export type EmployeeProfileColumn = {
  id: string;
  employeeId: string;
  name: string;
  status: string;
  imageUrl: string;
  position: string;
  email: string;
  dateHired: string;
  academicRank: string;
  department: string;
};

export type NonTeachingProfileColumn = {
  id: string;
  name: string;
  employeeId: string;
  office: string;
  imageUrl: string;
  email: string;
  position: string;
  dateHired: string;
};

export const columns: ColumnDef<EmployeeProfileColumn>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
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
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "academicRank",
    header: "Academic Rank",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "dateHired",
    header: "Date Hired",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const columns2: ColumnDef<NonTeachingProfileColumn>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
  {
    accessorKey: "name",
    header: "Non-Teaching",
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
    accessorKey: "office",
    header: "Office",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "dateHired",
    header: "Date Hired",
  },
];
